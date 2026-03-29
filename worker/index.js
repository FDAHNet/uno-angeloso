const GITHUB_OWNER = 'FDAHNet';
const GITHUB_REPO = '2048';
const GITHUB_LABEL = 'record';
const PLAYER_LABEL = 'player-account';
const DEFAULT_ALLOWED_ORIGIN = 'https://fdahnet.github.io';
const DEFAULT_ALLOWED_REFERER_PREFIX = 'https://fdahnet.github.io';
const ALLOWED_MODES = new Set(['4x4', '5x5', '6x6', '8x8']);
const ALLOWED_CATEGORIES = new Set(['normal', 'hole']);
const ALLOWED_REPLAY_VERSIONS = new Set([1, 2]);
const MAX_REQUEST_BYTES = 4_000_000;
const MAX_ISSUE_BODY = 62_000;
const MAX_REPLAY_CHUNK = 56_000;
const MAX_REPLAY_PARTS = 180;
const MAX_SCORE = 1_000_000_000_000;
const MAX_REPLAY_TURNS = 600_000;
const DEFAULT_PLAYER_CREDITS = 100;
const MAX_CREDITS = 1_000_000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const allowedOrigin = env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
    const allowedRefererPrefix = env.ALLOWED_REFERER_PREFIX || DEFAULT_ALLOWED_REFERER_PREFIX;
    const origin = request.headers.get('Origin') || '';
    const referer = request.headers.get('Referer') || '';
    const corsHeaders = getCorsHeaders(origin, allowedOrigin);

    if (request.method === 'OPTIONS') {
      if (!isAllowedOrigin(origin, allowedOrigin)) {
        return json({ error: 'Origin not allowed' }, 403, corsHeaders);
      }
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, corsHeaders);
    }

    if (!isAllowedBrowserRequest(origin, referer, allowedOrigin, allowedRefererPrefix)) {
      return json({ error: 'Origin or referer not allowed' }, 403, corsHeaders);
    }

    const contentType = request.headers.get('Content-Type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return json({ error: 'Content-Type must be application/json' }, 415, corsHeaders);
    }

    let rawBody = '';
    try {
      rawBody = await request.text();
    } catch {
      return json({ error: 'Unable to read request body' }, 400, corsHeaders);
    }

    if (!rawBody) {
      return json({ error: 'Payload is required' }, 400, corsHeaders);
    }

    if (new TextEncoder().encode(rawBody).length > MAX_REQUEST_BYTES) {
      return json({ error: 'Payload too large' }, 413, corsHeaders);
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return json({ error: 'Invalid JSON' }, 400, corsHeaders);
    }

    try {
      if (url.pathname === '/player/access') {
        return await handlePlayerAccess(payload, env, corsHeaders);
      }

      if (url.pathname === '/player/credits') {
        return await handlePlayerCredits(payload, env, corsHeaders);
      }

      const validation = validatePayload(payload);
      if (validation) {
        return json({ error: validation }, 400, corsHeaders);
      }

      const title = `[Record] ${payload.initials} - ${payload.score} - ${payload.mode} - ${payload.category.toUpperCase()}`;
      const replayJson = JSON.stringify(payload.replay);
      const baseLines = [
        'New global score submission',
        '',
        `Initials: ${payload.initials}`,
        `Mode: ${payload.mode}`,
        `Category: ${payload.category}`,
        `Score: ${payload.score}`,
        `Date: ${payload.isoDate}`,
      ];

      const inlineBody = [
        ...baseLines,
        '',
        'Replay Storage: inline',
        'Replay Parts: 1',
        '',
        'Replay JSON:',
        '```json',
        replayJson,
        '```',
      ].join('\n');

      let issue;

      if (inlineBody.length <= MAX_ISSUE_BODY) {
        issue = await createIssue(env, title, inlineBody, [GITHUB_LABEL]);
      } else {
        const chunks = chunkString(replayJson, MAX_REPLAY_CHUNK);
        if (chunks.length > MAX_REPLAY_PARTS) {
          return json({ error: 'Replay too large to store safely' }, 413, corsHeaders);
        }

        const issueBody = [
          ...baseLines,
          '',
          'Replay Storage: comments',
          `Replay Parts: ${chunks.length}`,
          '',
          'Replay JSON is stored across issue comments.',
        ].join('\n');

        issue = await createIssue(env, title, issueBody, [GITHUB_LABEL]);

        for (let index = 0; index < chunks.length; index += 1) {
          const commentBody = [
            `Replay Part ${index + 1}/${chunks.length}`,
            '```json',
            chunks[index],
            '```',
          ].join('\n');
          await createIssueComment(env, issue.number, commentBody);
        }
      }

      return json({ ok: true, issueUrl: issue.html_url }, 200, corsHeaders);
    } catch (error) {
      return json({ error: 'GitHub issue creation failed', details: error.message || String(error) }, 502, corsHeaders);
    }
  },
};

function isAllowedOrigin(origin, allowedOrigin) {
  return Boolean(origin) && origin === allowedOrigin;
}

function isAllowedBrowserRequest(origin, referer, allowedOrigin, allowedRefererPrefix) {
  return isAllowedOrigin(origin, allowedOrigin)
    && typeof referer === 'string'
    && referer.startsWith(allowedRefererPrefix);
}

function getCorsHeaders(origin, allowedOrigin) {
  const allowOrigin = isAllowedOrigin(origin, allowedOrigin) ? origin : allowedOrigin;
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Payload is required';
  if (!/^[A-Z?]{3}$/.test(payload.initials || '')) return 'Initials must be 3 letters';
  if (!ALLOWED_MODES.has(payload.mode || '')) return 'Mode is invalid';
  if (!ALLOWED_CATEGORIES.has(payload.category || '')) return 'Category is invalid';

  const score = Number(payload.score);
  if (!Number.isFinite(score) || score <= 0 || score > MAX_SCORE) return 'Score is invalid';

  if (!payload.isoDate || Number.isNaN(Date.parse(payload.isoDate))) return 'Date is required';
  if (!payload.replay || typeof payload.replay !== 'object') return 'Replay is required';

  return validateReplay(payload.replay, payload.mode);
}

function validateReplay(replay, mode) {
  if (!ALLOWED_REPLAY_VERSIONS.has(Number(replay.version || 1))) return 'Replay version is invalid';

  const boardSize = Number(replay.boardSize);
  if (!Number.isInteger(boardSize) || boardSize < 4 || boardSize > 8) return 'Replay board size is invalid';
  if (`${boardSize}x${boardSize}` !== mode) return 'Replay mode mismatch';

  if (!Array.isArray(replay.start) || replay.start.length > boardSize * boardSize) return 'Replay start is invalid';
  if (!Array.isArray(replay.turns) || replay.turns.length > MAX_REPLAY_TURNS) return 'Replay turns are invalid';

  if (replay.version === 2) {
    for (const spawn of replay.start) {
      if (!Array.isArray(spawn) || spawn.length !== 3) return 'Replay start is invalid';
      if (!isValidSpawnTuple(spawn, boardSize)) return 'Replay start is invalid';
    }
    for (const turn of replay.turns) {
      if (!Array.isArray(turn) || turn.length !== 4) return 'Replay turns are invalid';
      if (!['U', 'R', 'D', 'L'].includes(turn[0])) return 'Replay turns are invalid';
      if (!isIntegerLike(turn[1]) || !isIntegerLike(turn[2]) || !isIntegerLike(turn[3])) return 'Replay turns are invalid';
    }
    return '';
  }

  for (const spawn of replay.start) {
    if (!isSpawnObject(spawn, boardSize)) return 'Replay start is invalid';
  }
  for (const turn of replay.turns) {
    if (!turn || typeof turn !== 'object') return 'Replay turns are invalid';
    if (!['up', 'right', 'down', 'left'].includes(turn.move)) return 'Replay turns are invalid';
    if (turn.spawn && !isSpawnObject(turn.spawn, boardSize)) return 'Replay turns are invalid';
  }

  return '';
}

function validatePlayerAccessPayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Payload is required';
  if (!/^[A-Za-z0-9_-]{3,16}$/.test(payload.alias || '')) return 'Alias is invalid';
  if (!/^[a-f0-9]{64}$/i.test(payload.pinHash || '')) return 'PIN hash is invalid';
  return '';
}

function validateCreditsPayload(payload) {
  const validation = validatePlayerAccessPayload(payload);
  if (validation) return validation;
  const credits = Number(payload.credits);
  if (!Number.isFinite(credits) || credits < 0 || credits > MAX_CREDITS) return 'Credits are invalid';
  return '';
}

async function handlePlayerAccess(payload, env, corsHeaders) {
  const validation = validatePlayerAccessPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const alias = String(payload.alias).toUpperCase();

  const issue = await findPlayerIssueByAlias(env, alias);
  if (!issue) {
    const createdAt = new Date().toISOString();
    const body = buildPlayerIssueBody(alias, payload.pinHash, DEFAULT_PLAYER_CREDITS, createdAt, createdAt);
    const created = await createIssue(env, `[Player] ${alias}`, body, [PLAYER_LABEL]);
    return json({ ok: true, created: true, alias, credits: DEFAULT_PLAYER_CREDITS, issueNumber: created.number }, 200, corsHeaders);
  }

  const parsed = parsePlayerIssue(issue);
  if (!parsed || parsed.pinHash.toLowerCase() !== payload.pinHash.toLowerCase()) {
    return json({ error: 'Alias o PIN incorrecto' }, 403, corsHeaders);
  }

  return json({ ok: true, created: false, alias: parsed.alias, credits: parsed.credits, issueNumber: issue.number }, 200, corsHeaders);
}

async function handlePlayerCredits(payload, env, corsHeaders) {
  const validation = validateCreditsPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const alias = String(payload.alias).toUpperCase();

  const issue = await findPlayerIssueByAlias(env, alias);
  if (!issue) return json({ error: 'Jugador no encontrado' }, 404, corsHeaders);

  const parsed = parsePlayerIssue(issue);
  if (!parsed || parsed.pinHash.toLowerCase() !== payload.pinHash.toLowerCase()) {
    return json({ error: 'Alias o PIN incorrecto' }, 403, corsHeaders);
  }

  const credits = Math.max(0, Math.min(MAX_CREDITS, Math.trunc(Number(payload.credits))));
  const body = buildPlayerIssueBody(parsed.alias, parsed.pinHash, credits, parsed.createdAt, new Date().toISOString());
  await updateIssue(env, issue.number, { body });
  return json({ ok: true, alias: parsed.alias, credits }, 200, corsHeaders);
}

async function findPlayerIssueByAlias(env, alias) {
  const normalizedAlias = String(alias).toUpperCase();
  for (let page = 1; page <= 10; page += 1) {
    const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=all&labels=${PLAYER_LABEL}&per_page=100&page=${page}`, {
      method: 'GET',
      headers: { 'Accept': 'application/vnd.github+json' },
    });
    const issues = await response.json();
    const issue = issues.find((item) => !item.pull_request && item.title === `[Player] ${normalizedAlias}`);
    if (issue) return issue;
    if (issues.length < 100) break;
  }
  return null;
}

function buildPlayerIssueBody(alias, pinHash, credits, createdAt, updatedAt) {
  return [
    'Advanced mode player account',
    '',
    `Alias: ${alias}`,
    `PinHash: ${pinHash}`,
    `Credits: ${credits}`,
    `CreatedAt: ${createdAt}`,
    `UpdatedAt: ${updatedAt}`,
  ].join('\n');
}

function parsePlayerIssue(issue) {
  const body = issue.body || '';
  const alias = body.match(/Alias:\s*([A-Za-z0-9_-]{3,16})/i)?.[1];
  const pinHash = body.match(/PinHash:\s*([a-f0-9]{64})/i)?.[1];
  const creditsText = body.match(/Credits:\s*([0-9]+)/i)?.[1];
  const createdAt = body.match(/CreatedAt:\s*([^\n]+)/i)?.[1] || issue.created_at;
  if (!alias || !pinHash || !creditsText) return null;
  return {
    alias,
    pinHash,
    credits: Number(creditsText),
    createdAt,
  };
}

function isSpawnObject(spawn, boardSize) {
  if (!spawn || typeof spawn !== 'object') return false;
  return isValidSpawnTuple([spawn.row, spawn.col, spawn.value], boardSize);
}

function isValidSpawnTuple(tuple, boardSize) {
  const [row, col, value] = tuple.map(Number);
  return Number.isInteger(row)
    && Number.isInteger(col)
    && row >= 0 && row < boardSize
    && col >= 0 && col < boardSize
    && (value === 2 || value === 4 || (value > 0 && Number.isInteger(value)));
}

function isIntegerLike(value) {
  return Number.isInteger(Number(value));
}

function chunkString(value, chunkSize) {
  const chunks = [];
  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }
  return chunks;
}

async function createIssue(env, title, body, labels) {
  const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      body,
      labels,
    }),
  });

  return response.json();
}

async function updateIssue(env, issueNumber, payload) {
  const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return response.json();
}

async function createIssueComment(env, issueNumber, body) {
  const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });

  return response.json();
}

async function githubRequest(env, path, init) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': '2048-angeloso-worker',
      'Accept': 'application/vnd.github+json',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response;
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

const GITHUB_OWNER = 'FDAHNet';
const GITHUB_REPO = '2048';
const GITHUB_LABEL = 'record';
const PLAYER_LABEL = 'player-account';
const BET_CONFIG_LABEL = 'bet-config';
const ADMIN_CONFIG_LABEL = 'admin-config';
const ADMIN_CONFIG_R2_KEY = '__config/admin-pin.json';
const PLAYER_SECRET_PREFIX = '__players/';
const DEFAULT_ALLOWED_ORIGIN = 'https://fdahnet.github.io';
const DEFAULT_ALLOWED_REFERER_PREFIX = 'https://fdahnet.github.io';
const ALLOWED_MODES = new Set(['4x4', '5x5', '6x6', '8x8', '16x16']);
const ALLOWED_CATEGORIES = new Set(['normal', 'hole']);
const ALLOWED_REPLAY_VERSIONS = new Set([1, 2]);
const DEFAULT_GAME = '2048';
const UNO_REPLAY_MAX_SNAPSHOTS = 3000;
const GAME_CONFIGS = {
  '2048': {
    repo: '2048',
    modes: new Set(['4x4', '5x5', '6x6', '8x8', '16x16']),
    categories: new Set(['normal', 'hole']),
    defaultCategory: 'normal',
    replayKind: '2048',
  },
  uno: {
    repo: 'uno-angeloso',
    modes: new Set(['4x4', '5x5', '6x6', '8x8', '16x16']),
    categories: new Set(['normal']),
    defaultCategory: 'normal',
    replayKind: 'uno',
  },
};
const MAX_REQUEST_BYTES = 4_000_000;
const MAX_ISSUE_BODY = 62_000;
const MAX_REPLAY_CHUNK = 56_000;
const MAX_REPLAY_PARTS = 180;
const MAX_R2_REPLAY_CHUNK = 350_000;
const MAX_R2_REPLAY_PARTS = 4_000;
const MAX_SCORE = 1_000_000_000_000;
const MAX_REPLAY_TURNS = 600_000;
const DEFAULT_PLAYER_CREDITS = 1000;
const MAX_CREDITS = 1_000_000;
const MAX_ADMIN_PAGES = 20;
const PLAYER_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const ADMIN_TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const DEFAULT_ADMIN_PANEL_PIN_HASH = 'b876239a7a07cb250d3047971464750ff74ee4ac4e9d3298c067290571af5858';
const ALLOWED_BET_RULES = new Set(['reasonUser', 'highestTileGte', 'durationMinutesGte', 'scoreGte', 'movesGte', 'holeUsed']);
const DEFAULT_ADVANCED_BET_DEFINITIONS = [
  {
    id: 'endReason',
    label: 'Final de partida',
    description: 'Adivina si termina por tu boton o por la maquina.',
    multiplier: 2.1,
    optionA: 'BY USER',
    optionB: 'BY MACHINE',
    rule: 'reasonUser',
    target: '',
    active: true,
  },
  {
    id: 'maxTile256',
    label: 'Ficha 256',
    description: 'Apuesta si la partida llega a una ficha 256 o mayor.',
    multiplier: 2.1,
    optionA: '256 o mas',
    optionB: 'Menos de 256',
    rule: 'highestTileGte',
    target: '256',
    active: true,
  },
  {
    id: 'duration5',
    label: 'Partida larga',
    description: 'Predice si la partida dura cinco minutos o mas.',
    multiplier: 2.4,
    optionA: '05:00 o mas',
    optionB: 'Menos de 05:00',
    rule: 'durationMinutesGte',
    target: '5',
    active: true,
  },
];

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
      rawBody = '{}';
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
      if (url.pathname === '/player/access') return await handlePlayerAccess(payload, env, corsHeaders);
      if (url.pathname === '/player/credits') return await handlePlayerCredits(payload, env, corsHeaders);
      if (url.pathname === '/player/wager') return await handlePlayerWager(payload, env, corsHeaders);
      if (url.pathname === '/player/session') return await handlePlayerSession(payload, env, corsHeaders);
      if (url.pathname === '/player/ledger') return await handlePlayerLedger(payload, env, corsHeaders);
      if (url.pathname === '/bets/config') return await handleBetsConfig(env, corsHeaders);
      if (url.pathname === '/admin/auth') return await handleAdminAuth(payload, env, corsHeaders);
      if (url.pathname.startsWith('/admin/')) {
        const adminAuthError = await requireAdminAuth(payload, env);
        if (adminAuthError) return json({ error: adminAuthError }, 403, corsHeaders);
      }
      if (url.pathname === '/admin/player') return await handleAdminPlayer(payload, env, corsHeaders);
      if (url.pathname === '/admin/player/credits') return await handleAdminPlayerCredits(payload, env, corsHeaders);
      if (url.pathname === '/admin/player/pin') return await handleAdminPlayerPin(payload, env, corsHeaders);
      if (url.pathname === '/admin/pin/save') return await handleAdminPinSave(payload, env, corsHeaders);
      if (url.pathname === '/admin/bets/save') return await handleAdminBetsSave(payload, env, corsHeaders);
      if (url.pathname === '/admin/overview') return await handleAdminOverview(env, corsHeaders);
      if (url.pathname === '/replay/upload') return await handleReplayUpload(payload, env, corsHeaders);
      if (url.pathname === '/replay/fetch') return await handleReplayFetch(payload, env, corsHeaders);
      if (url.pathname === '/records/list') return await handleRecordsList(payload, env, corsHeaders);
      if (url.pathname === '/records/replay') return await handleRecordReplay(payload, env, corsHeaders);

      const validation = validatePayload(payload);
      if (validation) return json({ error: validation }, 400, corsHeaders);
      const game = normalizeGame(payload.game);
      const config = getGameConfig(game);
      const category = String(payload.category || config.defaultCategory);

      const title = game === DEFAULT_GAME
        ? `[Record] ${payload.initials} - ${payload.score} - ${payload.mode} - ${category.toUpperCase()}`
        : `[Record][${game.toUpperCase()}] ${payload.initials} - ${payload.score} - ${payload.mode} - ${category.toUpperCase()}`;
      const baseLines = [
        'New global score submission',
        '',
        `Game: ${game}`,
        `Initials: ${payload.initials}`,
        `Mode: ${payload.mode}`,
        `Category: ${category}`,
        `Score: ${payload.score}`,
        `Date: ${payload.isoDate}`,
      ];

      let issue;

      if (payload.replayRef) {
        const issueBody = [
          ...baseLines,
          '',
          'Replay Storage: r2',
          `Replay Ref: ${payload.replayRef.replayId}`,
          `Replay Parts: ${payload.replayRef.parts}`,
          '',
          'Replay JSON is stored in Cloudflare R2 via worker chunks.',
        ].join('\n');
        issue = await createIssue(env, config.repo, title, issueBody, [GITHUB_LABEL]);
      } else {
        const replayJson = JSON.stringify(payload.replay);
        const inlineBody = [...baseLines, '', 'Replay Storage: inline', 'Replay Parts: 1', '', 'Replay JSON:', '```json', replayJson, '```'].join('\n');

        if (inlineBody.length <= MAX_ISSUE_BODY) {
          issue = await createIssue(env, config.repo, title, inlineBody, [GITHUB_LABEL]);
        } else {
          const chunks = chunkString(replayJson, MAX_REPLAY_CHUNK);
          if (chunks.length > MAX_REPLAY_PARTS) {
            return json({ error: 'Replay too large to store safely' }, 413, corsHeaders);
          }
          const issueBody = [...baseLines, '', 'Replay Storage: comments', `Replay Parts: ${chunks.length}`, '', 'Replay JSON is stored across issue comments.'].join('\n');
          issue = await createIssue(env, config.repo, title, issueBody, [GITHUB_LABEL]);
          for (let index = 0; index < chunks.length; index += 1) {
            const commentBody = [`Replay Part ${index + 1}/${chunks.length}`, '```json', chunks[index], '```'].join('\n');
            await createIssueComment(env, config.repo, issue.number, commentBody);
          }
        }
      }

      return json({ ok: true, issueUrl: issue.html_url, replayRef: payload.replayRef || null }, 200, corsHeaders);
    } catch (error) {
      return json({ error: 'GitHub issue creation failed', details: error.message || String(error) }, 502, corsHeaders);
    }
  },
};

function isAllowedOrigin(origin, allowedOrigin) {
  return Boolean(origin) && origin === allowedOrigin;
}

function isAllowedBrowserRequest(origin, referer, allowedOrigin, allowedRefererPrefix) {
  return isAllowedOrigin(origin, allowedOrigin) && typeof referer === 'string' && referer.startsWith(allowedRefererPrefix);
}

function getCorsHeaders(origin, allowedOrigin) {
  const allowOrigin = isAllowedOrigin(origin, allowedOrigin) ? origin : allowedOrigin;
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function normalizeGame(game) {
  const normalized = String(game || DEFAULT_GAME).trim().toLowerCase();
  return GAME_CONFIGS[normalized] ? normalized : normalized;
}

function getGameConfig(game) {
  return GAME_CONFIGS[normalizeGame(game)] || null;
}

function extractInlineReplay(body) {
  const match = body.match(/Replay JSON:\s*```json\s*([\s\S]*?)\s*```/i);
  if (!match?.[1]) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

async function extractCommentReplay(env, repoName, issueNumber) {
  const comments = await listIssueComments(env, issueNumber, repoName);
  const parts = comments
    .map((comment) => {
      const index = Number(comment.body?.match(/Replay Part\s+([0-9]+)\//i)?.[1] || 0);
      const payload = comment.body?.match(/```json\s*([\s\S]*?)\s*```/i)?.[1] || '';
      return index > 0 && payload ? { index, payload } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.index - b.index);
  if (!parts.length) return null;
  try {
    return JSON.parse(parts.map((part) => part.payload).join(''));
  } catch {
    return null;
  }
}

async function fetchReplayFromR2(env, game, replayId) {
  if (!env.REPLAY_BUCKET) return null;
  const chunks = [];
  for (let index = 0; index < MAX_R2_REPLAY_PARTS; index += 1) {
    const object = await env.REPLAY_BUCKET.get(getReplayChunkKey(game, replayId, index));
    if (!object) {
      if (!index) return null;
      break;
    }
    chunks.push(await object.text());
    const expectedParts = Number(object.customMetadata?.partCount || 0);
    if (expectedParts && chunks.length >= expectedParts) break;
  }
  if (!chunks.length) return null;
  try {
    return JSON.parse(chunks.join(''));
  } catch {
    return null;
  }
}

async function getAdminConfigIssue(env) {
  const issues = await listIssuesByLabel(env, ADMIN_CONFIG_LABEL, 1);
  return issues[0] || null;
}

function buildAdminConfigIssueBody(pinHash) {
  return [
    'Admin control panel configuration',
    '',
    `AdminPinHash: ${pinHash}`,
    `UpdatedAt: ${new Date().toISOString()}`,
  ].join('\n');
}

function parseAdminConfigIssue(issue) {
  const body = issue?.body || '';
  const pinHash = body.match(/AdminPinHash:\s*([a-f0-9]{64})/i)?.[1]?.toLowerCase();
  return pinHash ? { pinHash } : null;
}

function getPlayerSecretKey(alias) {
  return `${PLAYER_SECRET_PREFIX}${String(alias || '').toUpperCase()}.json`;
}

async function readBucketJson(env, key) {
  if (!env.REPLAY_BUCKET) return null;
  const object = await env.REPLAY_BUCKET.get(key);
  if (!object) return null;
  try {
    return await object.json();
  } catch {
    return null;
  }
}

async function writeBucketJson(env, key, value) {
  if (!env.REPLAY_BUCKET) return false;
  await env.REPLAY_BUCKET.put(key, JSON.stringify(value), {
    httpMetadata: { contentType: 'application/json; charset=utf-8' },
  });
  return true;
}

async function getPlayerSecret(env, alias, fallbackPinHash = '') {
  const secret = await readBucketJson(env, getPlayerSecretKey(alias));
  const pinHash = String(secret?.pinHash || fallbackPinHash || '').trim().toLowerCase();
  return /^[a-f0-9]{64}$/i.test(pinHash) ? { pinHash } : null;
}

async function savePlayerSecret(env, alias, pinHash) {
  const normalizedPinHash = String(pinHash || '').trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/i.test(normalizedPinHash)) return false;
  return writeBucketJson(env, getPlayerSecretKey(alias), {
    alias: String(alias || '').toUpperCase(),
    pinHash: normalizedPinHash,
    updatedAt: new Date().toISOString(),
  });
}


async function attachPlayerSecret(env, player) {
  if (!player) return null;
  const secret = await getPlayerSecret(env, player.alias, player.pinHash);
  return {
    ...player,
    pinHash: secret?.pinHash || '',
  };
}

async function getAdminPinHash(env) {
  const bucketConfig = await readBucketJson(env, ADMIN_CONFIG_R2_KEY);
  const bucketPinHash = String(bucketConfig?.pinHash || '').trim().toLowerCase();
  if (/^[a-f0-9]{64}$/i.test(bucketPinHash)) return bucketPinHash;
  const issue = await getAdminConfigIssue(env);
  const config = issue ? parseAdminConfigIssue(issue) : null;
  return String(config?.pinHash || env.ADMIN_PANEL_PIN_HASH || DEFAULT_ADMIN_PANEL_PIN_HASH).trim().toLowerCase();
}

async function saveAdminPinHash(env, pinHash) {
  const normalizedPinHash = String(pinHash || '').trim().toLowerCase();
  if (await writeBucketJson(env, ADMIN_CONFIG_R2_KEY, { pinHash: normalizedPinHash, updatedAt: new Date().toISOString() })) {
    return true;
  }
  const issue = await getAdminConfigIssue(env);
  const body = buildAdminConfigIssueBody(normalizedPinHash);
  if (issue) {
    await updateIssue(env, issue.number, { body });
    return issue.number;
  }
  const created = await createIssue(env, '[Admin] Panel config', body, [ADMIN_CONFIG_LABEL]);
  return created.number;
}

async function sha256Hex(value) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(value || '')));
  return Array.from(new Uint8Array(hashBuffer), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function buildAdminToken(env) {
  const secret = await getAdminPinHash(env);
  const expiresAt = Date.now() + ADMIN_TOKEN_TTL_MS;
  const payload = String(expiresAt);
  const signature = await sha256Hex(`${payload}.${secret}`);
  return `${payload}.${signature}`;
}

async function buildPlayerToken(alias, pinHash) {
  const expiresAt = Date.now() + PLAYER_TOKEN_TTL_MS;
  const aliasValue = String(alias || '').toUpperCase();
  const payload = `${aliasValue}.${expiresAt}`;
  const signature = await sha256Hex(`${payload}.${pinHash}`);
  return `${payload}.${signature}`;
}

async function isValidPlayerToken(token, alias, pinHash) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) return false;
  const [tokenAlias, expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);
  if (String(tokenAlias).toUpperCase() !== String(alias || '').toUpperCase()) return false;
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  const expectedSignature = await sha256Hex(`${String(alias || '').toUpperCase()}.${expiresAtRaw}.${pinHash}`);
  return signature === expectedSignature;
}

async function isAuthorizedPlayer(payload, player) {
  const pinHash = String(payload?.pinHash || '').trim().toLowerCase();
  if (/^[a-f0-9]{64}$/i.test(pinHash) && player?.pinHash?.toLowerCase() === pinHash) return true;
  return isValidPlayerToken(payload?.playerToken, player?.alias, player?.pinHash);
}

async function requireAdminAuth(payload, env) {
  const secret = await getAdminPinHash(env);
  if (!/^[a-f0-9]{64}$/i.test(secret)) return 'Admin auth is not configured';
  const token = String(payload?.adminToken || '');
  if (!token) return 'Admin auth required';
  const [expiresAtRaw, signature] = token.split('.');
  const expiresAt = Number(expiresAtRaw);
  if (!expiresAtRaw || !signature || !Number.isFinite(expiresAt)) return 'Admin token is invalid';
  if (Date.now() > expiresAt) return 'Admin session expired';
  const expectedSignature = await sha256Hex(`${expiresAtRaw}.${secret}`);
  if (signature !== expectedSignature) return 'Admin token is invalid';
  return '';
}

async function handleAdminAuth(payload, env, corsHeaders) {
  const pinHash = String(payload?.pinHash || '').trim().toLowerCase();
  const expectedHash = await getAdminPinHash(env);
  if (!/^[a-f0-9]{64}$/i.test(expectedHash)) {
    return json({ error: 'Admin auth is not configured' }, 503, corsHeaders);
  }
  if (!/^[a-f0-9]{64}$/i.test(pinHash)) {
    return json({ error: 'PIN hash is invalid' }, 400, corsHeaders);
  }
  if (pinHash !== expectedHash) {
    return json({ error: 'PIN incorrecto.' }, 403, corsHeaders);
  }
  return json({ ok: true, token: await buildAdminToken(env) }, 200, corsHeaders);
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Payload is required';
  const game = normalizeGame(payload.game);
  const config = getGameConfig(game);
  if (!config) return 'Game is invalid';
  if (!/^[A-Z?]{3}$/.test(payload.initials || '')) return 'Initials must be 3 letters';
  if (!config.modes.has(payload.mode || '')) return 'Mode is invalid';
  const category = String(payload.category || config.defaultCategory);
  if (!config.categories.has(category)) return 'Category is invalid';
  const score = Number(payload.score);
  if (!Number.isFinite(score) || score <= 0 || score > MAX_SCORE) return 'Score is invalid';
  if (!payload.isoDate || Number.isNaN(Date.parse(payload.isoDate))) return 'Date is required';
  if (payload.replayRef) return validateReplayRef(payload.replayRef, payload.mode, game);
  if (!payload.replay || typeof payload.replay !== 'object') return 'Replay is required';
  return validateReplay(payload.replay, payload.mode, game);
}

function validateReplayRef(replayRef, mode, game = DEFAULT_GAME) {
  const config = getGameConfig(game);
  if (!config) return 'Game is invalid';
  if (!replayRef || typeof replayRef !== 'object') return 'Replay reference is invalid';
  if (replayRef.storage !== 'r2') return 'Replay storage is invalid';
  if (!/^[a-z0-9][a-z0-9_-]{7,127}$/i.test(replayRef.replayId || '')) return 'Replay reference is invalid';
  const parts = Number(replayRef.parts);
  if (!Number.isInteger(parts) || parts <= 0 || parts > MAX_R2_REPLAY_PARTS) return 'Replay parts are invalid';
  if (!config.modes.has(replayRef.mode || mode || '')) return 'Replay mode mismatch';
  return '';
}

function validateReplayUploadPayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Payload is required';
  const game = normalizeGame(payload.game);
  const config = getGameConfig(game);
  if (!config) return 'Game is invalid';
  if (!/^[a-z0-9][a-z0-9_-]{7,127}$/i.test(payload.replayId || '')) return 'Replay id is invalid';
  if (!config.modes.has(payload.mode || '')) return 'Mode is invalid';
  const partIndex = Number(payload.partIndex);
  const partCount = Number(payload.partCount);
  if (!Number.isInteger(partIndex) || partIndex < 0 || partIndex >= MAX_R2_REPLAY_PARTS) return 'Replay part index is invalid';
  if (!Number.isInteger(partCount) || partCount <= 0 || partCount > MAX_R2_REPLAY_PARTS) return 'Replay part count is invalid';
  if (partIndex >= partCount) return 'Replay part index is invalid';
  if (typeof payload.chunk !== 'string' || !payload.chunk.length) return 'Replay chunk is invalid';
  if (payload.chunk.length > MAX_R2_REPLAY_CHUNK) return 'Replay chunk is too large';
  return '';
}

function validateReplayFetchPayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Payload is required';
  const game = normalizeGame(payload.game);
  const config = getGameConfig(game);
  if (!config) return 'Game is invalid';
  if (!/^[a-z0-9][a-z0-9_-]{7,127}$/i.test(payload.replayId || '')) return 'Replay id is invalid';
  if (!config.modes.has(payload.mode || '')) return 'Mode is invalid';
  return '';
}

async function handleReplayUpload(payload, env, corsHeaders) {
  const validation = validateReplayUploadPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  if (!env.REPLAY_BUCKET) return json({ error: 'Replay bucket is not configured' }, 500, corsHeaders);

  const metadata = {
    game: normalizeGame(payload.game),
    mode: payload.mode,
    partIndex: String(payload.partIndex),
    partCount: String(payload.partCount),
    updatedAt: new Date().toISOString(),
  };
  await env.REPLAY_BUCKET.put(getReplayChunkKey(normalizeGame(payload.game), payload.replayId, payload.partIndex), payload.chunk, {
    httpMetadata: { contentType: 'application/json; charset=utf-8' },
    customMetadata: metadata,
  });

  return json({
    ok: true,
    replayId: payload.replayId,
    partIndex: Number(payload.partIndex),
    partCount: Number(payload.partCount),
  }, 200, corsHeaders);
}

async function handleReplayFetch(payload, env, corsHeaders) {
  const validation = validateReplayFetchPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  if (!env.REPLAY_BUCKET) return json({ error: 'Replay bucket is not configured' }, 500, corsHeaders);

  const chunks = [];
  for (let index = 0; index < MAX_R2_REPLAY_PARTS; index += 1) {
    const object = await env.REPLAY_BUCKET.get(getReplayChunkKey(normalizeGame(payload.game), payload.replayId, index));
    if (!object) {
      if (!index) return json({ error: 'Replay not found' }, 404, corsHeaders);
      break;
    }
    const chunk = await object.text();
    chunks.push(chunk);
    const expectedParts = Number(object.customMetadata?.partCount || 0);
    if (expectedParts && chunks.length >= expectedParts) break;
  }

  if (!chunks.length) return json({ error: 'Replay not found' }, 404, corsHeaders);

  let replay;
  try {
    replay = JSON.parse(chunks.join(''));
  } catch {
    return json({ error: 'Stored replay is corrupted' }, 500, corsHeaders);
  }

  const replayValidation = validateReplay(replay, payload.mode, normalizeGame(payload.game));
  if (replayValidation) return json({ error: replayValidation }, 500, corsHeaders);

  return json({ ok: true, replay }, 200, corsHeaders);
}

function getReplayChunkKey(game, replayId, chunkIndex) {
  return `replays/${normalizeGame(game)}/${replayId}/${String(chunkIndex).padStart(4, '0')}.json`;
}

function validateReplay(replay, mode, game = DEFAULT_GAME) {
  const config = getGameConfig(game);
  if (!config) return 'Game is invalid';
  if (config.replayKind === 'uno') return validateUnoReplay(replay, mode);
  if (!ALLOWED_REPLAY_VERSIONS.has(Number(replay.version || 1))) return 'Replay version is invalid';
  const boardSize = Number(replay.boardSize);
  if (!Number.isInteger(boardSize) || boardSize < 4 || boardSize > 16) return 'Replay board size is invalid';
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

function validateUnoReplay(replay, mode) {
  if (!replay || typeof replay !== 'object') return 'Replay is required';
  if ((replay.modeKey || '') !== mode) return 'Replay mode mismatch';
  if (typeof replay.modeLabel !== 'string' || !replay.modeLabel.trim()) return 'Replay mode label is invalid';
  if (!replay.startedAt || Number.isNaN(Date.parse(replay.startedAt))) return 'Replay start date is invalid';
  if (replay.finishedAt && Number.isNaN(Date.parse(replay.finishedAt))) return 'Replay finish date is invalid';
  if (!Array.isArray(replay.snapshots) || !replay.snapshots.length || replay.snapshots.length > UNO_REPLAY_MAX_SNAPSHOTS) return 'Replay snapshots are invalid';
  for (const snapshot of replay.snapshots) {
    if (!snapshot || typeof snapshot !== 'object') return 'Replay snapshots are invalid';
    if (typeof snapshot.label !== 'string' || !snapshot.label.trim()) return 'Replay snapshots are invalid';
    if (!snapshot.at || Number.isNaN(Date.parse(snapshot.at))) return 'Replay snapshots are invalid';
    if (!isUnoSnapshotState(snapshot.state, mode)) return 'Replay snapshots are invalid';
  }
  return '';
}

function isUnoSnapshotState(state, mode) {
  if (!state || typeof state !== 'object') return false;
  if ((state.modeKey || '') !== mode) return false;
  if (!Array.isArray(state.players) || state.players.length < 2 || state.players.length > 4) return false;
  if (!Array.isArray(state.drawPile) || !Array.isArray(state.discardPile)) return false;
  if (!isUnoCard(state.currentCard)) return false;
  if (!state.currentColor || !['red', 'yellow', 'green', 'blue', 'wild'].includes(state.currentColor)) return false;
  if (!Number.isInteger(Number(state.turnIndex)) || Number(state.turnIndex) < 0 || Number(state.turnIndex) >= state.players.length) return false;
  if (![1, -1].includes(Number(state.direction))) return false;
  for (const player of state.players) {
    if (!player || typeof player !== 'object' || typeof player.name !== 'string' || !Array.isArray(player.hand)) return false;
    if (typeof player.bot !== 'boolean') return false;
    if (!player.hand.every(isUnoCard)) return false;
  }
  if (!state.drawPile.every(isUnoCard) || !state.discardPile.every(isUnoCard)) return false;
  return true;
}

function isUnoCard(card) {
  if (!card || typeof card !== 'object') return false;
  return typeof card.id === 'number'
    && typeof card.value === 'string'
    && typeof card.type === 'string'
    && typeof card.label === 'string'
    && ['red', 'yellow', 'green', 'blue', 'wild'].includes(card.color);
}

function hasValidPlayerHash(payload) {
  return /^[a-f0-9]{64}$/i.test(String(payload?.pinHash || '').trim());
}

function hasValidPlayerToken(payload) {
  return /^[A-Za-z0-9_.-]{20,220}$/.test(String(payload?.playerToken || '').trim());
}

function validatePlayerAccessPayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Payload is required';
  if (!/^[A-Za-z0-9_-]{3,16}$/.test(payload.alias || '')) return 'Alias is invalid';
  if (!hasValidPlayerHash(payload) && !hasValidPlayerToken(payload)) return 'Credenciales invalidas';
  return '';
}

function validateCreditsPayload(payload) {
  const validation = validatePlayerAccessPayload(payload);
  if (validation) return validation;
  const credits = Number(payload.credits);
  if (!Number.isFinite(credits) || credits < 0 || credits > MAX_CREDITS) return 'Credits are invalid';
  return '';
}

function validateSessionPayload(payload) {
  const validation = validatePlayerAccessPayload(payload);
  if (validation) return validation;
  if (!ALLOWED_MODES.has(payload.mode || '')) return 'Mode is invalid';
  if (!ALLOWED_CATEGORIES.has(payload.category || '')) return 'Category is invalid';
  if (!['BY USER', 'BY MACHINE'].includes(payload.reason || '')) return 'Reason is invalid';
  if (!Number.isFinite(Number(payload.score)) || Number(payload.score) < 0 || Number(payload.score) > MAX_SCORE) return 'Score is invalid';
  if (!Number.isFinite(Number(payload.elapsedMs)) || Number(payload.elapsedMs) < 0) return 'Elapsed time is invalid';
  if (!Number.isFinite(Number(payload.highestTile)) || Number(payload.highestTile) < 0) return 'Highest tile is invalid';
  if (!Number.isFinite(Number(payload.totalStake)) || Number(payload.totalStake) < 0) return 'Stake is invalid';
  if (!Number.isFinite(Number(payload.payout)) || Number(payload.payout) < 0) return 'Payout is invalid';
  if (!Number.isFinite(Number(payload.wonCount)) || Number(payload.wonCount) < 0) return 'Won count is invalid';
  if (typeof payload.voided !== 'boolean') return 'Voided flag is invalid';
  return '';
}

function validateWagerPayload(payload) {
  const validation = validatePlayerAccessPayload(payload);
  if (validation) return validation;
  if (!ALLOWED_MODES.has(payload.mode || '')) return 'Mode is invalid';
  if (!ALLOWED_CATEGORIES.has(payload.category || '')) return 'Category is invalid';
  if (!Number.isFinite(Number(payload.totalStake)) || Number(payload.totalStake) < 0 || Number(payload.totalStake) > MAX_CREDITS) {
    return 'Stake is invalid';
  }
  if (!Number.isFinite(Number(payload.creditsAfter)) || Number(payload.creditsAfter) < 0 || Number(payload.creditsAfter) > MAX_CREDITS) {
    return 'Credits are invalid';
  }
  if (!Array.isArray(payload.wagers) || !payload.wagers.length || payload.wagers.length > 24) {
    return 'Wagers are invalid';
  }
  for (const wager of payload.wagers) {
    if (!wager || typeof wager !== 'object') return 'Wagers are invalid';
    if (!(String(wager.label || '').trim())) return 'Wagers are invalid';
    if (!(String(wager.predictionLabel || '').trim())) return 'Wagers are invalid';
    if (!Number.isFinite(Number(wager.stake)) || Number(wager.stake) < 0 || Number(wager.stake) > MAX_CREDITS) {
      return 'Wagers are invalid';
    }
  }
  return '';
}

function validateBetDefinitionsPayload(payload) {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.definitions)) return 'Definitions are required';
  if (!payload.definitions.length) return 'At least one bet definition is required';
  if (payload.definitions.length > 24) return 'Too many bet definitions';
  for (const definition of payload.definitions) {
    const error = validateBetDefinition(definition);
    if (error) return error;
  }
  return '';
}

function validateAdminPlayerPayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Payload is required';
  if (!/^[A-Za-z0-9_-]{3,16}$/.test(payload.alias || '')) return 'Alias is invalid';
  return '';
}

function validateAdminPlayerCreditsPayload(payload) {
  const validation = validateAdminPlayerPayload(payload);
  if (validation) return validation;
  const delta = Number(payload.delta);
  if (!Number.isFinite(delta) || !Number.isInteger(delta) || delta === 0) return 'Delta is invalid';
  if (Math.abs(delta) > MAX_CREDITS) return 'Delta is invalid';
  return '';
}

function validateAdminPlayerPinPayload(payload) {
  const validation = validateAdminPlayerPayload(payload);
  if (validation) return validation;
  if (!/^[a-f0-9]{64}$/i.test(String(payload.pinHash || '').trim())) return 'PIN hash is invalid';
  return '';
}

function validateAdminPinSavePayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Payload is required';
  if (!/^[a-f0-9]{64}$/i.test(String(payload.pinHash || '').trim())) return 'PIN hash is invalid';
  return '';
}

function validateBetDefinition(definition) {
  if (!definition || typeof definition !== 'object') return 'Bet definition is invalid';
  if (!/^[a-z0-9-]{3,48}$/i.test(definition.id || '')) return 'Bet id is invalid';
  if (!(definition.label || '').trim()) return 'Bet label is required';
  if (!(definition.description || '').trim()) return 'Bet description is required';
  const multiplier = Number(definition.multiplier);
  if (!Number.isFinite(multiplier) || multiplier < 1.1 || multiplier > 99) return 'Bet multiplier is invalid';
  if (!(definition.optionA || '').trim() || !(definition.optionB || '').trim()) return 'Both options are required';
  if (!ALLOWED_BET_RULES.has(definition.rule || '')) return 'Bet rule is invalid';
  if (typeof definition.active !== 'boolean') return 'Bet active flag is invalid';
  return '';
}

async function handlePlayerAccess(payload, env, corsHeaders) {
  const validation = validatePlayerAccessPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const alias = String(payload.alias).toUpperCase();
  const issue = await findPlayerIssueByAlias(env, alias);
  const providedPinHash = String(payload.pinHash || '').trim().toLowerCase();

  if (!issue) {
    if (!hasValidPlayerHash(payload)) {
      return json({ error: 'Necesitas un PIN valido de 4 cifras para crear la cuenta.' }, 400, corsHeaders);
    }
    const createdAt = new Date().toISOString();
    const player = createDefaultPlayerRecord(alias, providedPinHash, createdAt);
    await savePlayerSecret(env, alias, providedPinHash);
    const created = await createIssue(env, `[Player] ${alias}`, buildPlayerIssueBody(player), [PLAYER_LABEL]);
    return json({
      ok: true,
      created: true,
      alias,
      credits: DEFAULT_PLAYER_CREDITS,
      issueNumber: created.number,
      playerToken: await buildPlayerToken(alias, providedPinHash),
    }, 200, corsHeaders);
  }

  const parsed = await attachPlayerSecret(env, parsePlayerIssue(issue));
  if (!parsed || !parsed.pinHash) {
    return json({ error: 'Jugador no valido' }, 404, corsHeaders);
  }

  if (!(await isAuthorizedPlayer(payload, parsed))) {
    return json({ error: 'Ese alias ya existe y el PIN no coincide.' }, 403, corsHeaders);
  }

  await savePlayerSecret(env, parsed.alias, parsed.pinHash);
  return json({
    ok: true,
    created: false,
    alias: parsed.alias,
    credits: parsed.credits,
    issueNumber: issue.number,
    playerToken: await buildPlayerToken(parsed.alias, parsed.pinHash),
  }, 200, corsHeaders);
}

async function handlePlayerCredits(payload, env, corsHeaders) {
  const validation = validateCreditsPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const alias = String(payload.alias).toUpperCase();
  const issue = await findPlayerIssueByAlias(env, alias);
  if (!issue) return json({ error: 'Jugador no encontrado' }, 404, corsHeaders);
  const parsed = await attachPlayerSecret(env, parsePlayerIssue(issue));
  if (!parsed || !parsed.pinHash) return json({ error: 'Jugador no valido' }, 404, corsHeaders);
  if (!(await isAuthorizedPlayer(payload, parsed))) {
    return json({ error: 'Alias o credenciales incorrectas.' }, 403, corsHeaders);
  }
  const credits = clampInt(payload.credits, 0, MAX_CREDITS);
  const updated = { ...parsed, credits, updatedAt: new Date().toISOString() };
  await updateIssue(env, issue.number, { body: buildPlayerIssueBody(updated) });
  await savePlayerSecret(env, updated.alias, updated.pinHash);
  return json({ ok: true, alias: parsed.alias, credits, playerToken: await buildPlayerToken(updated.alias, updated.pinHash) }, 200, corsHeaders);
}

async function handlePlayerSession(payload, env, corsHeaders) {
  const validation = validateSessionPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const alias = String(payload.alias).toUpperCase();
  const issue = await findPlayerIssueByAlias(env, alias);
  if (!issue) return json({ error: 'Jugador no encontrado' }, 404, corsHeaders);
  const parsed = await attachPlayerSecret(env, parsePlayerIssue(issue));
  if (!parsed || !parsed.pinHash) return json({ error: 'Jugador no valido' }, 404, corsHeaders);
  if (!(await isAuthorizedPlayer(payload, parsed))) {
    return json({ error: 'Alias o credenciales incorrectas.' }, 403, corsHeaders);
  }

  const now = new Date().toISOString();
  const payout = clampInt(payload.payout, 0, MAX_CREDITS);
  const totalStake = clampInt(payload.totalStake, 0, MAX_CREDITS);
  const wonCount = clampInt(payload.wonCount, 0, 1000);
  const voided = Boolean(payload.voided);
  const next = {
    ...parsed,
    gamesPlayed: parsed.gamesPlayed + 1,
    normalGames: parsed.normalGames + (payload.category === 'normal' ? 1 : 0),
    holeGames: parsed.holeGames + (payload.category === 'hole' ? 1 : 0),
    wins: parsed.wins + (!voided && payout > 0 ? 1 : 0),
    losses: parsed.losses + (!voided && payout <= 0 ? 1 : 0),
    voids: parsed.voids + (voided ? 1 : 0),
    totalWagered: parsed.totalWagered + totalStake,
    totalPayout: parsed.totalPayout + payout,
    bestScore: Math.max(parsed.bestScore, clampInt(payload.score, 0, MAX_SCORE)),
    highestTile: Math.max(parsed.highestTile, clampInt(payload.highestTile, 0, MAX_SCORE)),
    lastMode: payload.mode,
    lastCategory: payload.category,
    lastReason: payload.reason,
    lastScore: clampInt(payload.score, 0, MAX_SCORE),
    lastSeen: now,
    updatedAt: now,
    lastWonCount: wonCount,
  };

  await updateIssue(env, issue.number, { body: buildPlayerIssueBody(next) });
  await savePlayerSecret(env, next.alias, next.pinHash);
  await createIssueComment(
    env,
    issue.number,
    buildLedgerComment({
      date: now,
      kind: voided ? 'void' : payout > 0 ? 'win' : 'loss',
      amount: voided ? totalStake : payout,
      balanceAfter: next.credits,
      detail: buildSessionLedgerDetail(payload, { wonCount, payout, totalStake, voided }),
    })
  );
  return json({ ok: true, alias: next.alias, gamesPlayed: next.gamesPlayed }, 200, corsHeaders);
}

async function handlePlayerWager(payload, env, corsHeaders) {
  const validation = validateWagerPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const alias = String(payload.alias).toUpperCase();
  const issue = await findPlayerIssueByAlias(env, alias);
  if (!issue) return json({ error: 'Jugador no encontrado' }, 404, corsHeaders);
  const parsed = await attachPlayerSecret(env, parsePlayerIssue(issue));
  if (!parsed || !parsed.pinHash) return json({ error: 'Jugador no valido' }, 404, corsHeaders);
  if (!(await isAuthorizedPlayer(payload, parsed))) {
    return json({ error: 'Alias o credenciales incorrectas.' }, 403, corsHeaders);
  }

  const now = new Date().toISOString();
  const totalStake = clampInt(payload.totalStake, 0, MAX_CREDITS);
  const creditsAfter = clampInt(payload.creditsAfter, 0, MAX_CREDITS);
  await createIssueComment(
    env,
    issue.number,
    buildLedgerComment({
      date: now,
      kind: 'wager',
      amount: -totalStake,
      balanceAfter: creditsAfter,
      detail: buildWagerLedgerDetail(payload),
    })
  );

  return json({ ok: true, alias: parsed.alias }, 200, corsHeaders);
}

async function handlePlayerLedger(payload, env, corsHeaders) {
  const validation = validatePlayerAccessPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const alias = String(payload.alias).toUpperCase();
  const issue = await findPlayerIssueByAlias(env, alias);
  if (!issue) return json({ error: 'Jugador no encontrado' }, 404, corsHeaders);
  const parsed = await attachPlayerSecret(env, parsePlayerIssue(issue));
  if (!parsed || !parsed.pinHash) return json({ error: 'Jugador no valido' }, 404, corsHeaders);
  if (!(await isAuthorizedPlayer(payload, parsed))) {
    return json({ error: 'Alias o credenciales incorrectas.' }, 403, corsHeaders);
  }

  const comments = await listIssueComments(env, issue.number);
  const entries = comments
    .map(parseLedgerComment)
    .filter(Boolean)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return json({
    ok: true,
    alias: parsed.alias,
    credits: parsed.credits,
    totalWagered: parsed.totalWagered,
    totalPayout: parsed.totalPayout,
    gamesPlayed: parsed.gamesPlayed,
    bestScore: parsed.bestScore,
    entries,
  }, 200, corsHeaders);
}

async function handleBetsConfig(env, corsHeaders) {
  const definitions = await getBetDefinitions(env);
  return json({ ok: true, definitions }, 200, corsHeaders);
}

async function handleAdminBetsSave(payload, env, corsHeaders) {
  const validation = validateBetDefinitionsPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const definitions = payload.definitions.map((definition, index) => normalizeBetDefinition(definition, index));
  await saveBetDefinitions(env, definitions);
  return json({ ok: true, definitions }, 200, corsHeaders);
}

async function handleAdminPlayer(payload, env, corsHeaders) {
  const validation = validateAdminPlayerPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const alias = String(payload.alias).toUpperCase();
  const issue = await findPlayerIssueByAlias(env, alias);
  if (!issue) return json({ error: 'Jugador no encontrado' }, 404, corsHeaders);
  const parsed = await attachPlayerSecret(env, parsePlayerIssue(issue));
  if (!parsed || !parsed.pinHash) return json({ error: 'Jugador no valido' }, 404, corsHeaders);
  const comments = await listIssueComments(env, issue.number);
  const entries = comments.map(parseLedgerComment).filter(Boolean).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return json({
    ok: true,
    alias: parsed.alias,
    credits: parsed.credits,
    gamesPlayed: parsed.gamesPlayed,
    normalGames: parsed.normalGames,
    holeGames: parsed.holeGames,
    totalWagered: parsed.totalWagered,
    totalPayout: parsed.totalPayout,
    bestScore: parsed.bestScore,
    highestTile: parsed.highestTile,
    lastSeen: parsed.lastSeen,
    updatedAt: parsed.updatedAt,
    entries,
  }, 200, corsHeaders);
}

async function handleAdminPlayerCredits(payload, env, corsHeaders) {
  const validation = validateAdminPlayerCreditsPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const alias = String(payload.alias).toUpperCase();
  const issue = await findPlayerIssueByAlias(env, alias);
  if (!issue) return json({ error: 'Jugador no encontrado' }, 404, corsHeaders);
  const parsed = await attachPlayerSecret(env, parsePlayerIssue(issue));
  if (!parsed || !parsed.pinHash) return json({ error: 'Jugador no valido' }, 404, corsHeaders);
  const now = new Date().toISOString();
  const delta = Math.trunc(Number(payload.delta));
  const credits = clampInt(parsed.credits + delta, 0, MAX_CREDITS);
  const updated = { ...parsed, credits, updatedAt: now, lastSeen: now };
  await updateIssue(env, issue.number, { body: buildPlayerIssueBody(updated) });
  await savePlayerSecret(env, updated.alias, updated.pinHash);
  await createIssueComment(env, issue.number, buildLedgerComment({
    date: now,
    kind: delta > 0 ? 'adminplus' : 'adminminus',
    amount: credits - parsed.credits,
    balanceAfter: credits,
    detail: `Ajuste manual de administrador (${delta > 0 ? '+' : ''}${delta})`,
  }));
  const comments = await listIssueComments(env, issue.number);
  const entries = comments.map(parseLedgerComment).filter(Boolean).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return json({
    ok: true,
    alias: updated.alias,
    credits: updated.credits,
    gamesPlayed: updated.gamesPlayed,
    normalGames: updated.normalGames,
    holeGames: updated.holeGames,
    totalWagered: updated.totalWagered,
    totalPayout: updated.totalPayout,
    bestScore: updated.bestScore,
    highestTile: updated.highestTile,
    lastSeen: updated.lastSeen,
    updatedAt: updated.updatedAt,
    entries,
  }, 200, corsHeaders);
}


async function handleAdminPlayerPin(payload, env, corsHeaders) {
  const validation = validateAdminPlayerPinPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const alias = String(payload.alias).toUpperCase();
  const issue = await findPlayerIssueByAlias(env, alias);
  if (!issue) return json({ error: 'Jugador no encontrado' }, 404, corsHeaders);
  const parsed = await attachPlayerSecret(env, parsePlayerIssue(issue));
  if (!parsed || !parsed.pinHash) return json({ error: 'Jugador no valido' }, 404, corsHeaders);

  const now = new Date().toISOString();
  const updated = {
    ...parsed,
    pinHash: String(payload.pinHash).trim().toLowerCase(),
    updatedAt: now,
    lastSeen: now,
  };
  await updateIssue(env, issue.number, { body: buildPlayerIssueBody(updated) });
  await savePlayerSecret(env, updated.alias, updated.pinHash);
  await createIssueComment(env, issue.number, buildLedgerComment({
    date: now,
    kind: 'adminplus',
    amount: 0,
    balanceAfter: updated.credits,
    detail: 'Administrador cambio el PIN del usuario',
  }));

  const comments = await listIssueComments(env, issue.number);
  const entries = comments.map(parseLedgerComment).filter(Boolean).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return json({
    ok: true,
    alias: updated.alias,
    credits: updated.credits,
    gamesPlayed: updated.gamesPlayed,
    normalGames: updated.normalGames,
    holeGames: updated.holeGames,
    totalWagered: updated.totalWagered,
    totalPayout: updated.totalPayout,
    bestScore: updated.bestScore,
    highestTile: updated.highestTile,
    lastSeen: updated.lastSeen,
    updatedAt: updated.updatedAt,
    entries,
  }, 200, corsHeaders);
}

async function handleAdminPinSave(payload, env, corsHeaders) {
  const validation = validateAdminPinSavePayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  await saveAdminPinHash(env, String(payload.pinHash).trim().toLowerCase());
  return json({ ok: true }, 200, corsHeaders);
}

async function handleAdminOverview(env, corsHeaders) {
  const [players, recordIssues, betDefinitions] = await Promise.all([
    listIssuesByLabel(env, PLAYER_LABEL, MAX_ADMIN_PAGES),
    listIssuesByLabel(env, GITHUB_LABEL, MAX_ADMIN_PAGES),
    getBetDefinitions(env),
  ]);

  const parsedPlayers = players.map(parsePlayerIssue).filter(Boolean).sort((a, b) => (b.credits - a.credits) || (b.bestScore - a.bestScore) || a.alias.localeCompare(b.alias));
  const records = recordIssues
    .map(parseRecordIssue)
    .filter(Boolean)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  const generatedAt = new Date().toISOString();
  const totalCredits = parsedPlayers.reduce((sum, player) => sum + player.credits, 0);
  const totalGamesPlayed = parsedPlayers.reduce((sum, player) => sum + player.gamesPlayed, 0);
  const totalWagered = parsedPlayers.reduce((sum, player) => sum + player.totalWagered, 0);
  const totalPayout = parsedPlayers.reduce((sum, player) => sum + player.totalPayout, 0);

  const recordsByMode = Object.fromEntries(
    Array.from(ALLOWED_MODES).map((mode) => [mode, Object.fromEntries(Array.from(ALLOWED_CATEGORIES).map((category) => [category, { count: 0, bestScore: 0, bestInitials: '---' }]))])
  );

  for (const record of records) {
    const bucket = recordsByMode?.[record.mode]?.[record.category || 'normal'];
    if (!bucket) continue;
    bucket.count += 1;
    if (record.score > bucket.bestScore) {
      bucket.bestScore = record.score;
      bucket.bestInitials = record.initials;
    }
  }

  return json({
    ok: true,
    summary: {
      generatedAt,
      totalUsers: parsedPlayers.length,
      totalCredits,
      averageCredits: parsedPlayers.length ? Math.round(totalCredits / parsedPlayers.length) : 0,
      totalGamesPlayed,
      totalWagered,
      totalPayout,
    },
    players: parsedPlayers.map((player) => ({
      alias: player.alias,
      credits: player.credits,
      gamesPlayed: player.gamesPlayed,
      normalGames: player.normalGames,
      holeGames: player.holeGames,
      wins: player.wins,
      losses: player.losses,
      voids: player.voids,
      totalWagered: player.totalWagered,
      totalPayout: player.totalPayout,
      bestScore: player.bestScore,
      highestTile: player.highestTile,
      lastMode: player.lastMode,
      lastCategory: player.lastCategory,
      lastReason: player.lastReason,
      lastScore: player.lastScore,
      lastSeen: player.lastSeen,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
    })),
    records: records.map((record) => ({
      initials: record.initials,
      mode: record.mode,
      category: record.category,
      score: record.score,
      createdAt: record.createdAt,
    })),
    recordsByMode,
    betDefinitions,
  }, 200, corsHeaders);
}

function validateRecordsListPayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Payload is required';
  const game = normalizeGame(payload.game);
  const config = getGameConfig(game);
  if (!config) return 'Game is invalid';
  if (!config.modes.has(payload.mode || '')) return 'Mode is invalid';
  const category = String(payload.category || config.defaultCategory);
  if (!config.categories.has(category)) return 'Category is invalid';
  const limit = Number(payload.limit || 10);
  if (!Number.isInteger(limit) || limit <= 0 || limit > 100) return 'Limit is invalid';
  return '';
}

async function handleRecordsList(payload, env, corsHeaders) {
  const validation = validateRecordsListPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const game = normalizeGame(payload.game);
  const config = getGameConfig(game);
  const category = String(payload.category || config.defaultCategory);
  const limit = Number(payload.limit || 10);
  const issues = await listIssuesByLabel(env, GITHUB_LABEL, MAX_ADMIN_PAGES, config.repo);
  const records = issues
    .map((issue) => parseRecordIssue(issue, game))
    .filter((record) => record && record.mode === payload.mode && record.category === category)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit)
    .map((record) => ({
      issueNumber: record.issueNumber,
      initials: record.initials,
      score: record.score,
      mode: record.mode,
      category: record.category,
      game: record.game,
      createdAt: record.createdAt,
      replayStorage: record.replayStorage,
      hasReplay: Boolean(record.replayStorage),
    }));
  return json({ ok: true, records }, 200, corsHeaders);
}

function validateRecordReplayPayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Payload is required';
  const game = normalizeGame(payload.game);
  const config = getGameConfig(game);
  if (!config) return 'Game is invalid';
  if (!config.modes.has(payload.mode || '')) return 'Mode is invalid';
  const issueNumber = Number(payload.issueNumber);
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) return 'Issue number is invalid';
  return '';
}

async function handleRecordReplay(payload, env, corsHeaders) {
  const validation = validateRecordReplayPayload(payload);
  if (validation) return json({ error: validation }, 400, corsHeaders);
  const game = normalizeGame(payload.game);
  const config = getGameConfig(game);
  const issue = await getIssue(env, config.repo, Number(payload.issueNumber));
  const record = parseRecordIssue(issue, game);
  if (!record) return json({ error: 'Record not found' }, 404, corsHeaders);
  let replay = null;
  if (record.replayStorage === 'inline') {
    replay = extractInlineReplay(issue.body || '');
  } else if (record.replayStorage === 'comments') {
    replay = await extractCommentReplay(env, config.repo, Number(payload.issueNumber));
  } else if (record.replayStorage === 'r2' && record.replayRef) {
    replay = await fetchReplayFromR2(env, game, record.replayRef.replayId);
  }
  if (!replay) return json({ error: 'Replay not found' }, 404, corsHeaders);
  const replayValidation = validateReplay(replay, payload.mode, game);
  if (replayValidation) return json({ error: replayValidation }, 500, corsHeaders);
  return json({ ok: true, replay }, 200, corsHeaders);
}

async function getBetDefinitions(env) {
  const issue = await findBetConfigIssue(env);
  if (!issue) return DEFAULT_ADVANCED_BET_DEFINITIONS.map((definition, index) => normalizeBetDefinition(definition, index));
  return parseBetConfigIssue(issue);
}

async function saveBetDefinitions(env, definitions) {
  const issue = await findBetConfigIssue(env);
  const body = buildBetConfigIssueBody(definitions);
  if (!issue) {
    await createIssue(env, '[Config] Advanced Bets', body, [BET_CONFIG_LABEL]);
    return;
  }
  await updateIssue(env, issue.number, { body });
}

async function findPlayerIssueByAlias(env, alias) {
  const normalizedAlias = String(alias).toUpperCase();
  const issues = await listIssuesByLabel(env, PLAYER_LABEL, MAX_ADMIN_PAGES);
  return issues.find((item) => !item.pull_request && item.title === `[Player] ${normalizedAlias}`) || null;
}

async function findBetConfigIssue(env) {
  const issues = await listIssuesByLabel(env, BET_CONFIG_LABEL, MAX_ADMIN_PAGES);
  return issues.find((item) => !item.pull_request && item.title === '[Config] Advanced Bets') || null;
}

async function listIssuesByLabel(env, label, maxPages = 10, repoName = GITHUB_REPO) {
  const issues = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${repoName}/issues?state=all&labels=${label}&per_page=100&page=${page}`, {
      method: 'GET',
      headers: { Accept: 'application/vnd.github+json' },
    });
    const batch = await response.json();
    issues.push(...batch.filter((item) => !item.pull_request));
    if (batch.length < 100) break;
  }
  return issues;
}

function createDefaultPlayerRecord(alias, pinHash, createdAt) {
  return {
    alias,
    pinHash,
    credits: DEFAULT_PLAYER_CREDITS,
    gamesPlayed: 0,
    normalGames: 0,
    holeGames: 0,
    wins: 0,
    losses: 0,
    voids: 0,
    totalWagered: 0,
    totalPayout: 0,
    bestScore: 0,
    highestTile: 0,
    lastMode: '',
    lastCategory: 'normal',
    lastReason: '',
    lastScore: 0,
    lastSeen: createdAt,
    createdAt,
    updatedAt: createdAt,
    lastWonCount: 0,
  };
}

function buildPlayerIssueBody(player) {
  return [
    'Advanced mode player account',
    '',
    `Alias: ${player.alias}`,
    `Credits: ${player.credits}`,
    `GamesPlayed: ${player.gamesPlayed}`,
    `NormalGames: ${player.normalGames}`,
    `HoleGames: ${player.holeGames}`,
    `Wins: ${player.wins}`,
    `Losses: ${player.losses}`,
    `Voids: ${player.voids}`,
    `TotalWagered: ${player.totalWagered}`,
    `TotalPayout: ${player.totalPayout}`,
    `BestScore: ${player.bestScore}`,
    `HighestTile: ${player.highestTile}`,
    `LastMode: ${player.lastMode || '-'}`,
    `LastCategory: ${player.lastCategory || 'normal'}`,
    `LastReason: ${player.lastReason || '-'}`,
    `LastScore: ${player.lastScore || 0}`,
    `LastSeen: ${player.lastSeen}`,
    `CreatedAt: ${player.createdAt}`,
    `UpdatedAt: ${player.updatedAt}`,
  ].join('\n');
}

function parsePlayerIssue(issue) {
  const body = issue.body || '';
  const alias = body.match(/Alias:\s*([A-Za-z0-9_-]{3,16})/i)?.[1];
  const pinHash = body.match(/PinHash:\s*([a-f0-9]{64})/i)?.[1] || '';
  const creditsText = body.match(/Credits:\s*([0-9]+)/i)?.[1];
  const createdAt = body.match(/CreatedAt:\s*([^\n]+)/i)?.[1] || issue.created_at;
  if (!alias || !creditsText) return null;
  return {
    alias,
    pinHash,
    credits: clampInt(creditsText, 0, MAX_CREDITS),
    gamesPlayed: readIssueInt(body, 'GamesPlayed'),
    normalGames: readIssueInt(body, 'NormalGames'),
    holeGames: readIssueInt(body, 'HoleGames'),
    wins: readIssueInt(body, 'Wins'),
    losses: readIssueInt(body, 'Losses'),
    voids: readIssueInt(body, 'Voids'),
    totalWagered: readIssueInt(body, 'TotalWagered'),
    totalPayout: readIssueInt(body, 'TotalPayout'),
    bestScore: readIssueInt(body, 'BestScore'),
    highestTile: readIssueInt(body, 'HighestTile'),
    lastMode: body.match(/LastMode:\s*([^\n]+)/i)?.[1]?.trim() || '',
    lastCategory: body.match(/LastCategory:\s*([^\n]+)/i)?.[1]?.trim() || 'normal',
    lastReason: body.match(/LastReason:\s*([^\n]+)/i)?.[1]?.trim() || '',
    lastScore: readIssueInt(body, 'LastScore'),
    lastSeen: body.match(/LastSeen:\s*([^\n]+)/i)?.[1]?.trim() || createdAt,
    createdAt,
    updatedAt: body.match(/UpdatedAt:\s*([^\n]+)/i)?.[1]?.trim() || issue.updated_at || createdAt,
  };
}

function buildWagerLedgerDetail(payload) {
  const parts = (payload.wagers || []).map((wager) => {
    const stake = clampInt(wager.stake, 0, MAX_CREDITS);
    return `${String(wager.label || '').trim()}: ${String(wager.predictionLabel || '').trim()} (${stake})`;
  });
  return `Apuesta ${payload.mode} · ${String(payload.category || 'normal').toUpperCase()} · ${parts.join(' | ')}`.slice(0, 800);
}

function buildSessionLedgerDetail(payload, settlement) {
  const reasonLabel = payload.reason === 'BY USER' ? 'BY USER' : 'BY MACHINE';
  if (settlement.voided) {
    return `Partida anulada · ${payload.mode} · ${String(payload.category || 'normal').toUpperCase()} · ${reasonLabel} · apuesta devuelta ${settlement.totalStake}`.slice(0, 800);
  }
  if (settlement.payout > 0) {
    return `Partida ganada · ${payload.mode} · ${String(payload.category || 'normal').toUpperCase()} · ${reasonLabel} · premio ${settlement.payout} · aciertos ${settlement.wonCount}`.slice(0, 800);
  }
  return `Partida perdida · ${payload.mode} · ${String(payload.category || 'normal').toUpperCase()} · ${reasonLabel} · sin premio`.slice(0, 800);
}

function buildLedgerComment(entry) {
  return [
    '[Ledger]',
    `Date: ${entry.date}`,
    `Kind: ${entry.kind}`,
    `Amount: ${Math.trunc(Number(entry.amount) || 0)}`,
    `BalanceAfter: ${clampInt(entry.balanceAfter, 0, MAX_CREDITS)}`,
    `Detail: ${String(entry.detail || '').replace(/\r?\n/g, ' ').trim()}`,
  ].join('\n');
}

function parseLedgerComment(comment) {
  const body = comment?.body || '';
  if (!body.startsWith('[Ledger]')) return null;
  const date = body.match(/Date:\s*([^\n]+)/i)?.[1]?.trim();
  const kind = body.match(/Kind:\s*([a-z]+)/i)?.[1]?.trim();
  const amount = Number(body.match(/Amount:\s*(-?[0-9]+)/i)?.[1] || 0);
  const balanceAfter = Number(body.match(/BalanceAfter:\s*([0-9]+)/i)?.[1] || 0);
  const detail = body.match(/Detail:\s*([^\n]+)/i)?.[1]?.trim() || '';
  if (!date || !kind) return null;
  const typeMap = {
    wager: 'WAGER',
    win: 'WIN',
    loss: 'LOSS',
    void: 'VOID',
    adminplus: 'ADMIN +',
    adminminus: 'ADMIN -',
  };
  return {
    date,
    type: typeMap[kind] || kind.toUpperCase(),
    amount,
    balanceAfter,
    detail,
  };
}

function buildBetConfigIssueBody(definitions) {
  return [
    'Advanced bets global config',
    '',
    '```json',
    JSON.stringify(definitions, null, 2),
    '```',
  ].join('\n');
}

function parseBetConfigIssue(issue) {
  const body = issue.body || '';
  const jsonBlock = body.match(/```json\s*([\s\S]*?)```/i)?.[1];
  if (!jsonBlock) return DEFAULT_ADVANCED_BET_DEFINITIONS.map((definition, index) => normalizeBetDefinition(definition, index));
  try {
    const parsed = JSON.parse(jsonBlock);
    if (!Array.isArray(parsed) || !parsed.length) {
      return DEFAULT_ADVANCED_BET_DEFINITIONS.map((definition, index) => normalizeBetDefinition(definition, index));
    }
    return parsed.map((definition, index) => normalizeBetDefinition(definition, index));
  } catch {
    return DEFAULT_ADVANCED_BET_DEFINITIONS.map((definition, index) => normalizeBetDefinition(definition, index));
  }
}

function normalizeBetDefinition(definition, index) {
  return {
    id: String(definition?.id || `bet-${index + 1}`).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 48),
    label: String(definition?.label || `Apuesta ${index + 1}`).slice(0, 36),
    description: String(definition?.description || 'Sin explicacion.').slice(0, 120),
    multiplier: Math.max(1.1, Math.min(99, Number(definition?.multiplier || 2))),
    optionA: String(definition?.optionA || 'Opcion 1').slice(0, 28),
    optionB: String(definition?.optionB || 'Opcion 2').slice(0, 28),
    rule: ALLOWED_BET_RULES.has(definition?.rule) ? definition.rule : 'reasonUser',
    target: String(definition?.target ?? '').slice(0, 24),
    active: Boolean(definition?.active),
  };
}

function parseRecordIssue(issue, fallbackGame = DEFAULT_GAME) {
  const body = issue.body || '';
  const game = normalizeGame(body.match(/Game:\s*([a-z0-9_-]+)/i)?.[1] || issue.title.match(/^\[Record\]\[([A-Z0-9_-]+)\]/i)?.[1] || fallbackGame);
  const initials = body.match(/Initials:\s*([A-Z?]{3})/i)?.[1] || issue.title.match(/^\[Record\]\s+([A-Z?]{3})/i)?.[1] || '---';
  const mode = body.match(/Mode:\s*(\d+x\d+)/i)?.[1] || issue.title.match(/-\s*(\d+x\d+)\b/i)?.[1] || '4x4';
  const config = getGameConfig(game);
  const category = body.match(/Category:\s*([a-z0-9_-]+)/i)?.[1]?.toLowerCase() || config?.defaultCategory || 'normal';
  const score = Number(body.match(/Score:\s*([0-9]+)/i)?.[1] || issue.title.match(/-\s*([0-9]+)\s*-/)?.[1] || 0);
  if (!config || !config.modes.has(mode) || !config.categories.has(category) || !Number.isFinite(score)) return null;
  const replayStorage = body.match(/Replay Storage:\s*(inline|comments|r2)/i)?.[1]?.toLowerCase() || '';
  const replayId = body.match(/Replay Ref:\s*([a-z0-9][a-z0-9_-]{7,127})/i)?.[1] || '';
  const replayParts = Number(body.match(/Replay Parts:\s*([0-9]+)/i)?.[1] || 0);
  return {
    issueNumber: issue.number,
    initials,
    mode,
    category,
    game,
    score,
    createdAt: issue.created_at,
    replayStorage,
    replayRef: replayId ? { storage: 'r2', replayId, parts: replayParts || 1, mode } : null,
  };
}

function readIssueInt(body, label) {
  const match = body.match(new RegExp(`${label}:\\s*([0-9]+)`, 'i'))?.[1];
  return clampInt(match || 0, 0, MAX_SCORE);
}

function clampInt(value, min, max) {
  const numeric = Math.trunc(Number(value) || 0);
  return Math.max(min, Math.min(max, numeric));
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

async function createIssue(env, repoOrTitle, titleOrBody, bodyOrLabels, maybeLabels) {
  const repoName = maybeLabels ? repoOrTitle : GITHUB_REPO;
  const title = maybeLabels ? titleOrBody : repoOrTitle;
  const body = maybeLabels ? bodyOrLabels : titleOrBody;
  const labels = maybeLabels || bodyOrLabels;
  const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${repoName}/issues`, {
    method: 'POST',
    body: JSON.stringify({ title, body, labels }),
  });
  return response.json();
}

async function updateIssue(env, issueNumber, payload, repoName = GITHUB_REPO) {
  const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${repoName}/issues/${issueNumber}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return response.json();
}

async function createIssueComment(env, repoOrIssueNumber, issueNumberOrBody, maybeBody) {
  const repoName = maybeBody ? repoOrIssueNumber : GITHUB_REPO;
  const issueNumber = maybeBody ? issueNumberOrBody : repoOrIssueNumber;
  const body = maybeBody || issueNumberOrBody;
  const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${repoName}/issues/${issueNumber}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
  return response.json();
}

async function listIssueComments(env, issueNumber, repoName = GITHUB_REPO) {
  const comments = [];
  for (let page = 1; page <= MAX_ADMIN_PAGES; page += 1) {
    const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${repoName}/issues/${issueNumber}/comments?per_page=100&page=${page}`, {
      method: 'GET',
      headers: { Accept: 'application/vnd.github+json' },
    });
    const batch = await response.json();
    comments.push(...batch);
    if (batch.length < 100) break;
  }
  return comments;
}

async function getIssue(env, repoName, issueNumber) {
  const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${repoName}/issues/${issueNumber}`, {
    method: 'GET',
    headers: { Accept: 'application/vnd.github+json' },
  });
  return response.json();
}

async function githubRequest(env, path, init) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'angeloso-records-worker',
      Accept: 'application/vnd.github+json',
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









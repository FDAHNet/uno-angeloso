var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/index.js
var GITHUB_OWNER = "FDAHNet";
var GITHUB_REPO = "2048";
var GITHUB_LABEL = "record";
var DEFAULT_ALLOWED_ORIGIN = "https://fdahnet.github.io";
var DEFAULT_ALLOWED_REFERER_PREFIX = "https://fdahnet.github.io";
var ALLOWED_MODES = /* @__PURE__ */ new Set(["4x4", "5x5", "6x6", "8x8"]);
var ALLOWED_REPLAY_VERSIONS = /* @__PURE__ */ new Set([1, 2]);
var MAX_REQUEST_BYTES = 4e6;
var MAX_ISSUE_BODY = 62e3;
var MAX_REPLAY_CHUNK = 56e3;
var MAX_REPLAY_PARTS = 180;
var MAX_SCORE = 1e12;
var MAX_REPLAY_TURNS = 6e5;
var index_default = {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
    const allowedRefererPrefix = env.ALLOWED_REFERER_PREFIX || DEFAULT_ALLOWED_REFERER_PREFIX;
    const origin = request.headers.get("Origin") || "";
    const referer = request.headers.get("Referer") || "";
    const corsHeaders = getCorsHeaders(origin, allowedOrigin);
    if (request.method === "OPTIONS") {
      if (!isAllowedOrigin(origin, allowedOrigin)) {
        return json({ error: "Origin not allowed" }, 403, corsHeaders);
      }
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, corsHeaders);
    }
    if (!isAllowedBrowserRequest(origin, referer, allowedOrigin, allowedRefererPrefix)) {
      return json({ error: "Origin or referer not allowed" }, 403, corsHeaders);
    }
    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json({ error: "Content-Type must be application/json" }, 415, corsHeaders);
    }
    let rawBody = "";
    try {
      rawBody = await request.text();
    } catch {
      return json({ error: "Unable to read request body" }, 400, corsHeaders);
    }
    if (!rawBody) {
      return json({ error: "Payload is required" }, 400, corsHeaders);
    }
    if (new TextEncoder().encode(rawBody).length > MAX_REQUEST_BYTES) {
      return json({ error: "Payload too large" }, 413, corsHeaders);
    }
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return json({ error: "Invalid JSON" }, 400, corsHeaders);
    }
    const validation = validatePayload(payload);
    if (validation) {
      return json({ error: validation }, 400, corsHeaders);
    }
    try {
      const title = `[Record] ${payload.initials} - ${payload.score} - ${payload.mode}`;
      const replayJson = JSON.stringify(payload.replay);
      const baseLines = [
        "New global score submission",
        "",
        `Initials: ${payload.initials}`,
        `Mode: ${payload.mode}`,
        `Score: ${payload.score}`,
        `Date: ${payload.isoDate}`
      ];
      const inlineBody = [
        ...baseLines,
        "",
        "Replay Storage: inline",
        "Replay Parts: 1",
        "",
        "Replay JSON:",
        "```json",
        replayJson,
        "```"
      ].join("\n");
      let issue;
      if (inlineBody.length <= MAX_ISSUE_BODY) {
        issue = await createIssue(env, title, inlineBody);
      } else {
        const chunks = chunkString(replayJson, MAX_REPLAY_CHUNK);
        if (chunks.length > MAX_REPLAY_PARTS) {
          return json({ error: "Replay too large to store safely" }, 413, corsHeaders);
        }
        const issueBody = [
          ...baseLines,
          "",
          "Replay Storage: comments",
          `Replay Parts: ${chunks.length}`,
          "",
          "Replay JSON is stored across issue comments."
        ].join("\n");
        issue = await createIssue(env, title, issueBody);
        for (let index = 0; index < chunks.length; index += 1) {
          const commentBody = [
            `Replay Part ${index + 1}/${chunks.length}`,
            "```json",
            chunks[index],
            "```"
          ].join("\n");
          await createIssueComment(env, issue.number, commentBody);
        }
      }
      return json({ ok: true, issueUrl: issue.html_url }, 200, corsHeaders);
    } catch (error) {
      return json({ error: "GitHub issue creation failed", details: error.message || String(error) }, 502, corsHeaders);
    }
  }
};
function isAllowedOrigin(origin, allowedOrigin) {
  return Boolean(origin) && origin === allowedOrigin;
}
__name(isAllowedOrigin, "isAllowedOrigin");
function isAllowedBrowserRequest(origin, referer, allowedOrigin, allowedRefererPrefix) {
  return isAllowedOrigin(origin, allowedOrigin) && typeof referer === "string" && referer.startsWith(allowedRefererPrefix);
}
__name(isAllowedBrowserRequest, "isAllowedBrowserRequest");
function getCorsHeaders(origin, allowedOrigin) {
  const allowOrigin = isAllowedOrigin(origin, allowedOrigin) ? origin : allowedOrigin;
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}
__name(getCorsHeaders, "getCorsHeaders");
function validatePayload(payload) {
  if (!payload || typeof payload !== "object") return "Payload is required";
  if (!/^[A-Z?]{3}$/.test(payload.initials || "")) return "Initials must be 3 letters";
  if (!ALLOWED_MODES.has(payload.mode || "")) return "Mode is invalid";
  const score = Number(payload.score);
  if (!Number.isFinite(score) || score <= 0 || score > MAX_SCORE) return "Score is invalid";
  if (!payload.isoDate || Number.isNaN(Date.parse(payload.isoDate))) return "Date is required";
  if (!payload.replay || typeof payload.replay !== "object") return "Replay is required";
  return validateReplay(payload.replay, payload.mode);
}
__name(validatePayload, "validatePayload");
function validateReplay(replay, mode) {
  if (!ALLOWED_REPLAY_VERSIONS.has(Number(replay.version || 1))) return "Replay version is invalid";
  const boardSize = Number(replay.boardSize);
  if (!Number.isInteger(boardSize) || boardSize < 4 || boardSize > 8) return "Replay board size is invalid";
  if (`${boardSize}x${boardSize}` !== mode) return "Replay mode mismatch";
  if (!Array.isArray(replay.start) || replay.start.length > boardSize * boardSize) return "Replay start is invalid";
  if (!Array.isArray(replay.turns) || replay.turns.length > MAX_REPLAY_TURNS) return "Replay turns are invalid";
  if (replay.version === 2) {
    for (const spawn of replay.start) {
      if (!Array.isArray(spawn) || spawn.length !== 3) return "Replay start is invalid";
      if (!isValidSpawnTuple(spawn, boardSize)) return "Replay start is invalid";
    }
    for (const turn of replay.turns) {
      if (!Array.isArray(turn) || turn.length !== 4) return "Replay turns are invalid";
      if (!["U", "R", "D", "L"].includes(turn[0])) return "Replay turns are invalid";
      if (!isIntegerLike(turn[1]) || !isIntegerLike(turn[2]) || !isIntegerLike(turn[3])) return "Replay turns are invalid";
    }
    return "";
  }
  for (const spawn of replay.start) {
    if (!isSpawnObject(spawn, boardSize)) return "Replay start is invalid";
  }
  for (const turn of replay.turns) {
    if (!turn || typeof turn !== "object") return "Replay turns are invalid";
    if (!["up", "right", "down", "left"].includes(turn.move)) return "Replay turns are invalid";
    if (turn.spawn && !isSpawnObject(turn.spawn, boardSize)) return "Replay turns are invalid";
  }
  return "";
}
__name(validateReplay, "validateReplay");
function isSpawnObject(spawn, boardSize) {
  if (!spawn || typeof spawn !== "object") return false;
  return isValidSpawnTuple([spawn.row, spawn.col, spawn.value], boardSize);
}
__name(isSpawnObject, "isSpawnObject");
function isValidSpawnTuple(tuple, boardSize) {
  const [row, col, value] = tuple.map(Number);
  return Number.isInteger(row) && Number.isInteger(col) && row >= 0 && row < boardSize && col >= 0 && col < boardSize && (value === 2 || value === 4 || value > 0 && Number.isInteger(value));
}
__name(isValidSpawnTuple, "isValidSpawnTuple");
function isIntegerLike(value) {
  return Number.isInteger(Number(value));
}
__name(isIntegerLike, "isIntegerLike");
function chunkString(value, chunkSize) {
  const chunks = [];
  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }
  return chunks;
}
__name(chunkString, "chunkString");
async function createIssue(env, title, body) {
  const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({
      title,
      body,
      labels: [GITHUB_LABEL]
    })
  });
  return response.json();
}
__name(createIssue, "createIssue");
async function createIssueComment(env, issueNumber, body) {
  const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body })
  });
  return response.json();
}
__name(createIssueComment, "createIssueComment");
async function githubRequest(env, path, init) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "2048-angeloso-worker",
      "Accept": "application/vnd.github+json",
      ...init.headers || {}
    }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  return response;
}
__name(githubRequest, "githubRequest");
function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers
    }
  });
}
__name(json, "json");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map

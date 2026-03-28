const GITHUB_OWNER = 'FDAHNet';
const GITHUB_REPO = '2048';
const GITHUB_LABEL = 'record';
const MAX_ISSUE_BODY = 62000;
const MAX_REPLAY_CHUNK = 56000;

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, corsHeaders);
    }

    let payload;
    try {
      payload = await request.json();
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
        `Date: ${payload.isoDate}`,
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
        "```",
      ].join("\n");

      let issue;

      if (inlineBody.length <= MAX_ISSUE_BODY) {
        issue = await createIssue(env, title, inlineBody);
      } else {
        const chunks = chunkString(replayJson, MAX_REPLAY_CHUNK);
        const issueBody = [
          ...baseLines,
          "",
          "Replay Storage: comments",
          `Replay Parts: ${chunks.length}`,
          "",
          "Replay JSON is stored across issue comments.",
        ].join("\n");

        issue = await createIssue(env, title, issueBody);

        for (let index = 0; index < chunks.length; index += 1) {
          const commentBody = [
            `Replay Part ${index + 1}/${chunks.length}`,
            "```json",
            chunks[index],
            "```",
          ].join("\n");
          await createIssueComment(env, issue.number, commentBody);
        }
      }

      return json({ ok: true, issueUrl: issue.html_url }, 200, corsHeaders);
    } catch (error) {
      return json({ error: "GitHub issue creation failed", details: error.message || String(error) }, 502, corsHeaders);
    }
  },
};

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") return "Payload is required";
  if (!/^[A-Z]{3}$/.test(payload.initials || "")) return "Initials must be 3 letters";
  if (!/^[0-9]+x[0-9]+$/.test(payload.mode || "")) return "Mode is invalid";
  if (!Number.isFinite(Number(payload.score)) || Number(payload.score) <= 0) return "Score is invalid";
  if (!payload.isoDate) return "Date is required";
  if (!payload.replay || typeof payload.replay !== "object") return "Replay is required";
  return "";
}

function chunkString(value, chunkSize) {
  const chunks = [];
  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }
  return chunks;
}

async function createIssue(env, title, body) {
  const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({
      title,
      body,
      labels: [GITHUB_LABEL],
    }),
  });

  return response.json();
}

async function createIssueComment(env, issueNumber, body) {
  const response = await githubRequest(env, `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });

  return response.json();
}

async function githubRequest(env, path, init) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "2048-angeloso-worker",
      "Accept": "application/vnd.github+json",
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
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

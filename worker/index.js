const GITHUB_OWNER = 'FDAHNet';
const GITHUB_REPO = '2048';
const GITHUB_LABEL = 'record';

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

    const title = `[Record] ${payload.initials} - ${payload.score} - ${payload.mode}`;
    const replayJson = JSON.stringify(payload.replay);
    const body = [
      "New global score submission",
      "",
      `Initials: ${payload.initials}`,
      `Mode: ${payload.mode}`,
      `Score: ${payload.score}`,
      `Date: ${payload.isoDate}`,
      "",
      "Replay JSON:",
      "```json",
      replayJson,
      "```",
    ].join("\n");

    if (body.length > 62000) {
      return json({ error: "Replay demasiado larga para GitHub Issues" }, 413, corsHeaders);
    }

    const githubResponse = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "2048-angeloso-worker",
        "Accept": "application/vnd.github+json",
      },
      body: JSON.stringify({
        title,
        body,
        labels: [GITHUB_LABEL],
      }),
    });

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      return json({ error: "GitHub issue creation failed", details: errorText }, 502, corsHeaders);
    }

    const issue = await githubResponse.json();
    return json({ ok: true, issueUrl: issue.html_url }, 200, corsHeaders);
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

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

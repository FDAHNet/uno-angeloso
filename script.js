const MOVE_DURATION = 210;
const EFFECT_DURATION = 5000;
const STORAGE_PREFIX = "smooth-2048-best-score";
const RECORDS_PREFIX = "smooth-2048-records";
const PLAYER_INITIALS_KEY = "smooth-2048-player-initials";
const GITHUB_OWNER = "FDAHNet";
const GITHUB_REPO = "2048";
const GLOBAL_RECORD_LABEL = "record";
const WORKER_API_URL = "https://angeloso-2048-records.mcdrer.workers.dev";

const boardElement = document.getElementById("board");
const fxLayer = document.getElementById("fx-layer");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restart-button");
const finishButton = document.getElementById("finish-button");
const replayIndicatorElement = document.getElementById("replay-indicator");
const boardSizeSelect = document.getElementById("board-size");
const recordsListElement = document.getElementById("records-list");
const submitGlobalRecordButton = document.getElementById("submit-global-record-button");
const recordsPanelElement = document.getElementById("records-panel");
const toggleRecordsButton = document.getElementById("toggle-records-button");
const journalListElement = document.getElementById("journal-list");
const uiFxLayerElement = document.getElementById("ui-fx-layer");
const replayViewerElement = document.getElementById("replay-viewer");
const replayMetaElement = document.getElementById("replay-meta");
const replayEmptyElement = document.getElementById("replay-empty");
const replayControlsElement = document.getElementById("replay-controls");
const replayProgressElement = document.getElementById("replay-progress");
const closeReplayButton = document.getElementById("close-replay-button");
const replayFirstButton = document.getElementById("replay-first-button");
const replayPrevButton = document.getElementById("replay-prev-button");
const replayPlayButton = document.getElementById("replay-play-button");
const replayNextButton = document.getElementById("replay-next-button");
const replayLastButton = document.getElementById("replay-last-button");
const initialsEntryElement = document.getElementById("initials-entry");
const initialsSlotsElement = document.getElementById("initials-slots");
const currentLetterElement = document.getElementById("current-letter");
const letterUpButton = document.getElementById("letter-up-button");
const letterDownButton = document.getElementById("letter-down-button");
const selectLetterButton = document.getElementById("select-letter-button");
const deleteLetterButton = document.getElementById("delete-letter-button");

let boardSize = Number(boardSizeSelect.value);
let nextTileId = 1;
let tileMap = new Map();
let gameState = createEmptyState();
let isAnimating = false;
let touchStart = null;
let audioContext = null;
let audioMasterGain = null;
let audioUnlocked = false;
let recordSaved = false;
let pendingGlobalRecord = null;
let journalEntries = [];
let currentReplay = null;
let recordsPanelOpen = false;
let replayMode = false;
let replayTimer = null;
let replayResumeState = null;
let replaySession = null;
const ARCADE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const GLOBAL_MODES = ["4x4", "5x5", "6x6", "8x8"];
const globalRecordsElements = Object.fromEntries(
  GLOBAL_MODES.map((mode) => [mode, document.getElementById(`global-records-list-${mode}`)])
);
const initialsEntryState = {
  active: false,
  letters: ["", "", ""],
  slot: 0,
  selectedIndex: 0,
  pendingScore: 0,
};

function createEmptyState() {
  return {
    score: 0,
    bestScore: Number(localStorage.getItem(getBestScoreKey()) || 0),
    over: false,
    won: false,
    cells: Array.from({ length: boardSize }, () => Array(boardSize).fill(null)),
  };
}

function getBestScoreKey() {
  return `${STORAGE_PREFIX}-${boardSize}`;
}

function getRecordsKey() {
  return `${RECORDS_PREFIX}-${boardSize}`;
}

function createTile(value, row, col) {
  return {
    id: nextTileId += 1,
    value,
    row,
    col,
    isNew: true,
    justMerged: false,
    effectUntil: 0,
  };
}

function cloneSpawnData(tile) {
  return {
    row: tile.row,
    col: tile.col,
    value: tile.value,
  };
}

function buildGrid() {
  syncBoardMetrics();
  boardElement.innerHTML = "";
  tileMap.clear();
  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      positionTileElement(cell, row, col);
      boardElement.appendChild(cell);
    }
  }
}

function getTileSize() {
  const style = getComputedStyle(document.documentElement);
  const gap = parseFloat(style.getPropertyValue("--gap"));
  const padding = parseFloat(style.getPropertyValue("--board-padding"));
  return (boardElement.clientWidth - (padding * 2) - (gap * (boardSize - 1))) / boardSize;
}

function syncBoardMetrics() {
  const tileSize = getTileSize();
  const radius = Math.max(10, tileSize * 0.18);
  document.documentElement.style.setProperty("--tile-size", `${tileSize}px`);
  document.documentElement.style.setProperty("--tile-radius", `${radius}px`);
}

function getOffset(row, col) {
  const style = getComputedStyle(document.documentElement);
  const gap = parseFloat(style.getPropertyValue("--gap"));
  const padding = parseFloat(style.getPropertyValue("--board-padding"));
  const tileSize = getTileSize();
  return {
    x: padding + col * (tileSize + gap),
    y: padding + row * (tileSize + gap),
  };
}

function positionTileElement(element, row, col) {
  const { x, y } = getOffset(row, col);
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
}

function applyTileTextSizing(element, value) {
  const tileSize = getTileSize();
  const digits = String(value).length;
  let fontSize = tileSize * 0.42;

  if (digits >= 3) fontSize = tileSize * 0.34;
  if (digits >= 4) fontSize = tileSize * 0.27;
  if (digits >= 5) fontSize = tileSize * 0.22;

  element.style.fontSize = `${Math.max(12, fontSize)}px`;
  element.style.letterSpacing = digits >= 4 ? "-0.05em" : "0";
}

function addRandomTile() {
  const empty = [];
  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      if (!gameState.cells[row][col]) empty.push({ row, col });
    }
  }
  if (!empty.length) return;
  const { row, col } = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const tile = createTile(value, row, col);
  gameState.cells[row][col] = tile;
  return cloneSpawnData(tile);
}

function resetFlags() {
  for (const row of gameState.cells) {
    for (const tile of row) {
      if (!tile) continue;
      tile.isNew = false;
      tile.justMerged = false;
    }
  }
}

function startGame() {
  if (initialsEntryState.active) {
    setStatus("Guarda o borra tus iniciales antes de empezar otra partida.");
    return;
  }
  discardReplayState();
  maybePersistCurrentScore();
  boardSize = Number(boardSizeSelect.value);
  nextTileId = 0;
  tileMap.forEach((element) => element.remove());
  tileMap.clear();
  fxLayer.innerHTML = "";
  isAnimating = false;
  recordSaved = false;
  pendingGlobalRecord = null;
  journalEntries = [];
  currentReplay = null;
  submitGlobalRecordButton.classList.add("hidden");
  gameState = createEmptyState();
  buildGrid();
  const startSpawnA = addRandomTile();
  const startSpawnB = addRandomTile();
  currentReplay = {
    version: 1,
    boardSize,
    mode: `${boardSize}x${boardSize}`,
    startedAt: new Date().toISOString(),
    start: [startSpawnA, startSpawnB].filter(Boolean),
    turns: [],
  };
  render();
  renderJournal();
  renderRecords();
  renderGlobalRecordsLoading();
  fetchGlobalRecords();
  setStatus("");
}

function setRecordsPanelOpen(nextOpen) {
  recordsPanelOpen = nextOpen;
  recordsPanelElement.classList.toggle("records-panel-collapsed", !recordsPanelOpen);
  toggleRecordsButton.textContent = recordsPanelOpen ? "Ocultar records" : "Mostrar records";
}

function setStatus(message) {
  statusElement.textContent = message;
}

function updateScore(points) {
  gameState.score += points;
  gameState.bestScore = Math.max(gameState.bestScore, gameState.score);
  localStorage.setItem(getBestScoreKey(), String(gameState.bestScore));
}

function render() {
  syncBoardMetrics();
  scoreElement.textContent = gameState.score;
  bestScoreElement.textContent = gameState.bestScore;

  const now = performance.now();
  const activeIds = new Set();

  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const tile = gameState.cells[row][col];
      if (!tile) continue;
      activeIds.add(tile.id);

      let element = tileMap.get(tile.id);
      if (!element) {
        element = document.createElement("div");
        tileMap.set(tile.id, element);
        boardElement.appendChild(element);
      }

      element.className = `tile tile-value-${Math.min(tile.value, 2048)} ${tile.value > 2048 ? "tile-value-super" : ""}`.trim();
      if (tile.isNew) element.classList.add("tile-new");
      if (tile.justMerged) element.classList.add("tile-merged");
      if (tile.effectUntil > now) element.classList.add("tile-epic");
      element.textContent = tile.value;
      applyTileTextSizing(element, tile.value);
      positionTileElement(element, tile.row, tile.col);
    }
  }

  for (const [id, element] of tileMap.entries()) {
    if (!activeIds.has(id)) {
      element.remove();
      tileMap.delete(id);
    }
  }
}

function cloneGameState(state) {
  return {
    score: state.score,
    bestScore: state.bestScore,
    over: state.over,
    won: state.won,
    cells: state.cells.map((row) => row.map((tile) => (tile ? { ...tile } : null))),
  };
}

function loadRecords() {
  const raw = localStorage.getItem(getRecordsKey());
  if (!raw) return [];

  try {
    const records = JSON.parse(raw);
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function saveRecords(records) {
  localStorage.setItem(getRecordsKey(), JSON.stringify(records));
}

function resolveReplayForRecord(record) {
  if (record?.replay) return record.replay;
  if (
    pendingGlobalRecord
    && pendingGlobalRecord.replay
    && pendingGlobalRecord.initials === record.initials
    && pendingGlobalRecord.score === record.score
    && pendingGlobalRecord.mode === record.mode
  ) {
    return pendingGlobalRecord.replay;
  }
  return null;
}

function isRecordScore(score) {
  if (score <= 0) return false;
  const records = loadRecords();
  if (records.length < 10) return true;
  return records.some((record) => score > record.score);
}

function renderRecords() {
  const records = loadRecords();
  recordsListElement.innerHTML = "";

  if (!records.length) {
    const empty = document.createElement("div");
    empty.className = "records-row records-row-empty";
    empty.textContent = "Todavia no hay records guardados para este tablero.";
    recordsListElement.appendChild(empty);
    return;
  }

  records.forEach((record) => {
    const row = document.createElement("div");
    row.className = "records-row";

    const initials = document.createElement("span");
    initials.textContent = record.initials;

    const mode = document.createElement("span");
    mode.textContent = record.mode || `${boardSize}x${boardSize}`;

    const score = document.createElement("span");
    score.textContent = String(record.score);

    const timestamp = document.createElement("span");
    timestamp.textContent = record.displayDate;

    const action = document.createElement("button");
    action.type = "button";
    action.className = "secondary-button record-action-button";
    action.textContent = "Ver partida";
    action.addEventListener("click", () => openReplayViewer(resolveReplayForRecord(record), record));

    row.append(initials, mode, score, timestamp, action);
    recordsListElement.appendChild(row);
  });
}

function renderJournal() {
  journalListElement.innerHTML = "";

  if (!journalEntries.length) {
    const empty = document.createElement("div");
    empty.className = "journal-entry journal-entry-empty";
    empty.textContent = "Todavia no hay logros apuntados.";
    journalListElement.appendChild(empty);
    return;
  }

  journalEntries.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "journal-entry";
    item.dataset.entryId = entry.id;

    const time = document.createElement("time");
    time.textContent = entry.timeText;

    const text = document.createElement("strong");
    text.textContent = `Bloque ${entry.value} creado`;

    item.append(time, text);
    journalListElement.appendChild(item);
  });
}

function addJournalEntry(value, row, col) {
  const now = new Date();
  const entry = {
    id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    value,
    row,
    col,
    timeText: now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };

  journalEntries.unshift(entry);
  renderJournal();
  journalListElement.scrollTop = 0;
  animateJournalFlight(entry);
}

function animateJournalFlight(entry) {
  const targetEntry = journalListElement.querySelector(`[data-entry-id="${entry.id}"]`);
  const sourceTileData = gameState.cells[entry.row]?.[entry.col];
  const sourceTile = sourceTileData ? tileMap.get(sourceTileData.id) : null;
  if (!targetEntry || !sourceTile) return;

  const sourceRect = sourceTile.getBoundingClientRect();
  const targetRect = targetEntry.getBoundingClientRect();
  const sourceX = sourceRect.left + sourceRect.width / 2;
  const sourceY = sourceRect.top + sourceRect.height / 2;
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  const flight = document.createElement("div");
  flight.className = "journal-flight";
  flight.textContent = entry.value;
  flight.style.left = `${sourceX}px`;
  flight.style.top = `${sourceY}px`;
  flight.style.setProperty("--tx", `${targetX - sourceX}px`);
  flight.style.setProperty("--ty", `${targetY - sourceY}px`);
  uiFxLayerElement.appendChild(flight);

  targetEntry.classList.add("journal-entry-flash");
  targetEntry.addEventListener("animationend", () => targetEntry.classList.remove("journal-entry-flash"), { once: true });
  flight.addEventListener("animationend", () => flight.remove(), { once: true });
}

function renderGlobalRecordsLoading() {
  GLOBAL_MODES.forEach((mode) => {
    const listElement = globalRecordsElements[mode];
    listElement.innerHTML = "";
    const row = document.createElement("div");
    row.className = "records-row records-row-empty";
    row.textContent = "Cargando...";
    listElement.appendChild(row);
  });
}

function renderGlobalRecordsError() {
  GLOBAL_MODES.forEach((mode) => {
    const listElement = globalRecordsElements[mode];
    listElement.innerHTML = "";
    const row = document.createElement("div");
    row.className = "records-row records-row-empty";
    row.textContent = "No se pudieron cargar.";
    listElement.appendChild(row);
  });
}

function renderGlobalRecords(recordsByMode) {
  GLOBAL_MODES.forEach((mode) => {
    const listElement = globalRecordsElements[mode];
    const records = recordsByMode[mode] || [];
    listElement.innerHTML = "";

    if (!records.length) {
      const row = document.createElement("div");
      row.className = "records-row records-row-empty";
      row.textContent = "Sin records enviados.";
      listElement.appendChild(row);
      return;
    }

    records.forEach((record) => {
      const row = document.createElement("div");
      row.className = "records-row";

      const initials = document.createElement("span");
      initials.textContent = record.initials;

      const score = document.createElement("span");
      score.textContent = String(record.score);

      const timestamp = document.createElement("span");
      timestamp.textContent = record.displayDate;

      const action = document.createElement("button");
      action.type = "button";
      action.className = "secondary-button record-action-button";
      action.textContent = "Ver partida";
      action.addEventListener("click", () => openReplayViewer(record.replay, record));

      row.append(initials, score, timestamp, action);
      listElement.appendChild(row);
    });
  });
}

function parseGlobalRecord(issue) {
  const body = issue.body || "";
  const initials = body.match(/Initials:\s*([A-Z]{3})/i)?.[1]?.toUpperCase();
  const mode = body.match(/Mode:\s*([0-9]+x[0-9]+)/i)?.[1];
  const scoreText = body.match(/Score:\s*([0-9]+)/i)?.[1];
  const replayMatch = body.match(/```json\s*([\s\S]*?)```/i);
  const score = Number(scoreText);

  if (!initials || !mode || !Number.isFinite(score)) return null;

  let replay = null;
  if (replayMatch?.[1]) {
    try {
      replay = JSON.parse(replayMatch[1]);
    } catch {
      replay = null;
    }
  }

  return {
    initials,
    mode,
    score,
    isoDate: issue.created_at,
    displayDate: new Intl.DateTimeFormat("es-ES", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(issue.created_at)),
    replay,
  };
}

async function fetchGlobalRecords() {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=all&labels=${GLOBAL_RECORD_LABEL}&per_page=100`);
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    const issues = await response.json();
    const records = issues
      .filter((issue) => !issue.pull_request)
      .map(parseGlobalRecord)
      .filter(Boolean);
    const grouped = Object.fromEntries(GLOBAL_MODES.map((mode) => [mode, []]));

    records.forEach((record) => {
      if (!grouped[record.mode]) return;
      grouped[record.mode].push(record);
    });

    GLOBAL_MODES.forEach((mode) => {
      grouped[mode].sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return left.isoDate.localeCompare(right.isoDate);
      });
      grouped[mode] = grouped[mode].slice(0, 10);
    });

    renderGlobalRecords(grouped);
  } catch {
    renderGlobalRecordsError();
  }
}

function normalizeInitials(value) {
  return (value || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3);
}

function openInitialsEntry(score) {
  const previous = normalizeInitials(localStorage.getItem(PLAYER_INITIALS_KEY) || "");
  initialsEntryState.active = true;
  initialsEntryState.letters = ["", "", ""];
  initialsEntryState.slot = 0;
  initialsEntryState.selectedIndex = ARCADE_ALPHABET.indexOf(previous[0] || "A");
  initialsEntryState.pendingScore = score;
  renderInitialsEntry();
  initialsEntryElement.classList.remove("hidden");
  setStatus("Nuevo record. Introduce tus iniciales.");
}

function closeInitialsEntry() {
  initialsEntryState.active = false;
  initialsEntryState.pendingScore = 0;
  initialsEntryElement.classList.add("hidden");
}

function getCurrentSelectedLetter() {
  return ARCADE_ALPHABET[initialsEntryState.selectedIndex] || "A";
}

function renderInitialsEntry() {
  initialsSlotsElement.innerHTML = "";
  for (let index = 0; index < 3; index += 1) {
    const slot = document.createElement("div");
    slot.className = "initials-slot";
    if (index === initialsEntryState.slot) slot.classList.add("is-active");
    slot.textContent = initialsEntryState.letters[index] || "_";
    initialsSlotsElement.appendChild(slot);
  }

  currentLetterElement.textContent = getCurrentSelectedLetter();

  const filledCount = initialsEntryState.letters.filter(Boolean).length;
  selectLetterButton.textContent = filledCount === 2 ? "Guardar record" : "Marcar letra";
  deleteLetterButton.disabled = filledCount === 0;
}

function shiftCurrentLetter(step) {
  if (!initialsEntryState.active) return;
  const total = ARCADE_ALPHABET.length;
  initialsEntryState.selectedIndex = (initialsEntryState.selectedIndex + step + total) % total;
  renderInitialsEntry();
}

function savePendingRecord() {
  const initials = initialsEntryState.letters.join("");
  const now = new Date();
  const displayDate = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(now);
  const replayPayload = currentReplay
    ? {
        ...currentReplay,
        finishedAt: now.toISOString(),
        finalScore: initialsEntryState.pendingScore,
        initials,
      }
    : null;

  const records = loadRecords();
  records.push({
    initials,
    score: initialsEntryState.pendingScore,
    mode: `${boardSize}x${boardSize}`,
    isoDate: now.toISOString(),
    displayDate,
    replay: replayPayload,
  });

  records.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return left.isoDate.localeCompare(right.isoDate);
  });

  saveRecords(records.slice(0, 10));
  localStorage.setItem(PLAYER_INITIALS_KEY, initials);
  recordSaved = true;
  pendingGlobalRecord = {
    initials,
    mode: `${boardSize}x${boardSize}`,
    score: initialsEntryState.pendingScore,
    isoDate: now.toISOString(),
    replay: replayPayload,
  };
  submitGlobalRecordButton.classList.remove("hidden");
  closeInitialsEntry();
  renderRecords();
  setStatus("Record guardado.");
}

function buildGlobalRecordIssueUrl() {
  if (!pendingGlobalRecord) return "";
  const title = `[Record] ${pendingGlobalRecord.initials} - ${pendingGlobalRecord.score} - ${pendingGlobalRecord.mode}`;
  const replayJson = pendingGlobalRecord.replay ? JSON.stringify(pendingGlobalRecord.replay, null, 2) : "{}";
  const body = [
    "New global score submission",
    "",
    `Initials: ${pendingGlobalRecord.initials}`,
    `Mode: ${pendingGlobalRecord.mode}`,
    `Score: ${pendingGlobalRecord.score}`,
    `Date: ${pendingGlobalRecord.isoDate}`,
    "",
    "Replay JSON:",
    "```json",
    replayJson,
    "```",
  ].join("\n");

  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new?labels=${encodeURIComponent(GLOBAL_RECORD_LABEL)}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

function submitGlobalRecord() {
  if (!pendingGlobalRecord) return;
  if (!WORKER_API_URL) {
    setStatus("Falta configurar la URL del worker de Cloudflare.");
    return;
  }

  submitGlobalRecordButton.disabled = true;
  setStatus("Enviando record global...");

  fetch(WORKER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pendingGlobalRecord),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || "No se pudo enviar el record");
      }
      return response.json();
    })
    .then(() => {
      submitGlobalRecordButton.classList.add("hidden");
      setStatus("Record global enviado correctamente.");
      fetchGlobalRecords();
    })
    .catch((error) => {
      setStatus(`Error al enviar record: ${error.message}`);
    })
    .finally(() => {
      submitGlobalRecordButton.disabled = false;
    });
}

function openReplayViewer(replay, record) {
  replayViewerElement.classList.remove("hidden");
  replayMetaElement.textContent = `${record.initials} | ${record.mode} | ${record.score} puntos | ${record.displayDate}`;
  if (!replay) {
    replayEmptyElement.textContent = "Esta partida no tiene replay disponible. Fue guardada antes de activar el sistema de reproduccion.";
    replayEmptyElement.classList.remove("hidden");
    replayControlsElement.classList.add("hidden");
    setStatus("Replay no disponible para este record.");
    return;
  }

  replayEmptyElement.classList.add("hidden");
  replayControlsElement.classList.remove("hidden");
  startReplayOnBoard(replay);
}

function closeReplayViewer() {
  replayViewerElement.classList.add("hidden");
  replayMetaElement.textContent = "";
  replayEmptyElement.textContent = "";
  replayEmptyElement.classList.add("hidden");
  replayControlsElement.classList.add("hidden");
  replayProgressElement.textContent = "";
  stopReplayMode();
}

function discardReplayState() {
  if (replayTimer) {
    window.clearTimeout(replayTimer);
    replayTimer = null;
  }
  replayMode = false;
  replaySession = null;
  replayResumeState = null;
  replayViewerElement.classList.add("hidden");
  replayMetaElement.textContent = "";
  replayEmptyElement.textContent = "";
  replayEmptyElement.classList.add("hidden");
  replayControlsElement.classList.add("hidden");
  replayProgressElement.textContent = "";
  const boardFrame = document.querySelector(".board-frame");
  boardFrame.classList.remove("is-replay", "replay-wipe");
  replayIndicatorElement.classList.add("hidden");
}

function setReplayVisualState(active) {
  const boardFrame = document.querySelector(".board-frame");
  boardFrame.classList.toggle("is-replay", active);
  replayIndicatorElement.classList.toggle("hidden", !active);
}

function triggerReplayWipe() {
  const boardFrame = document.querySelector(".board-frame");
  boardFrame.classList.remove("replay-wipe");
  void boardFrame.offsetWidth;
  boardFrame.classList.add("replay-wipe");
}

function stopReplayMode() {
  replayMode = false;
  if (replayTimer) {
    window.clearTimeout(replayTimer);
    replayTimer = null;
  }
  replaySession = null;
  setReplayVisualState(false);
  if (!replayResumeState) return;

  boardSize = replayResumeState.boardSize;
  boardSizeSelect.value = String(boardSize);
  gameState = cloneGameState(replayResumeState.gameState);
  nextTileId = replayResumeState.nextTileId;
  render();
  setStatus(replayResumeState.statusText);
  replayResumeState = null;
}

function updateReplayControls() {
  if (!replaySession) {
    replayProgressElement.textContent = "";
    replayPlayButton.textContent = "Play";
    return;
  }

  const totalTurns = replaySession.replay.turns.length;
  replayProgressElement.textContent = `Paso ${replaySession.index} de ${totalTurns}`;
  replayPlayButton.textContent = replaySession.playing ? "Pausa" : "Play";
  replayFirstButton.disabled = replaySession.index === 0;
  replayPrevButton.disabled = replaySession.index === 0;
  replayNextButton.disabled = replaySession.index >= totalTurns;
  replayLastButton.disabled = replaySession.index >= totalTurns;
}

function insertReplaySpawn(spawn) {
  const tile = createTile(spawn.value, spawn.row, spawn.col);
  tile.isNew = true;
  gameState.cells[spawn.row][spawn.col] = tile;
}

function replayMove(direction, spawn) {
  const vectors = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
  };
  const [dr, dc] = vectors[direction];
  const traversed = getTraversal(direction);
  const mergedTargets = new Set();
  let gained = 0;

  resetFlags();

  for (const major of traversed) {
    for (const minor of traversed) {
      const row = direction === "left" || direction === "right" ? major : minor;
      const col = direction === "left" || direction === "right" ? minor : major;
      const tile = gameState.cells[row][col];
      if (!tile) continue;

      let currentRow = row;
      let currentCol = col;
      let nextRow = currentRow + dr;
      let nextCol = currentCol + dc;

      while (withinBounds(nextRow, nextCol) && !gameState.cells[nextRow][nextCol]) {
        currentRow = nextRow;
        currentCol = nextCol;
        nextRow += dr;
        nextCol += dc;
      }

      const target = withinBounds(nextRow, nextCol) ? gameState.cells[nextRow][nextCol] : null;
      const targetKey = `${nextRow}-${nextCol}`;

      gameState.cells[row][col] = null;

      if (target && target.value === tile.value && !mergedTargets.has(targetKey)) {
        target.value = tile.value * 2;
        target.justMerged = true;
        mergedTargets.add(targetKey);
        gained += target.value;
      } else {
        tile.row = currentRow;
        tile.col = currentCol;
        gameState.cells[currentRow][currentCol] = tile;
      }
    }
  }

  gameState.cells = normalizeCells();
  gameState.score += gained;
  if (spawn) insertReplaySpawn(spawn);
  render();
}

function initializeReplayBoard(replay) {
  gameState = createEmptyState();
  gameState.score = 0;
  gameState.over = true;
  gameState.cells = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  nextTileId = 0;
  replay.start.forEach((spawn) => insertReplaySpawn(spawn));
  render();
}

function setReplayToIndex(index) {
  if (!replaySession || !replayMode) return;

  const boundedIndex = Math.max(0, Math.min(index, replaySession.replay.turns.length));
  initializeReplayBoard(replaySession.replay);

  for (let turnIndex = 0; turnIndex < boundedIndex; turnIndex += 1) {
    const turn = replaySession.replay.turns[turnIndex];
    replayMove(turn.move, turn.spawn);
  }

  replaySession.index = boundedIndex;
  updateReplayControls();

  if (boundedIndex >= replaySession.replay.turns.length) {
    setStatus("Replay finalizada.");
  } else {
    setStatus(`Replay ${replaySession.replay.mode}: paso ${boundedIndex} de ${replaySession.replay.turns.length}.`);
  }
}

function scheduleReplayPlayback() {
  if (!replaySession || !replaySession.playing || !replayMode) return;
  if (replaySession.index >= replaySession.replay.turns.length) {
    replaySession.playing = false;
    updateReplayControls();
    setStatus("Replay finalizada.");
    return;
  }

  replayTimer = window.setTimeout(() => {
    if (!replaySession || !replayMode) return;
    setReplayToIndex(replaySession.index + 1);
    scheduleReplayPlayback();
  }, 900);
}

function pauseReplayPlayback() {
  if (replayTimer) {
    window.clearTimeout(replayTimer);
    replayTimer = null;
  }
  if (replaySession) {
    replaySession.playing = false;
    updateReplayControls();
  }
}

function toggleReplayPlayback() {
  if (!replaySession) return;
  if (replaySession.playing) {
    pauseReplayPlayback();
    return;
  }

  if (replaySession.index >= replaySession.replay.turns.length) {
    setReplayToIndex(0);
  }

  replaySession.playing = true;
  updateReplayControls();
  scheduleReplayPlayback();
}

function startReplayOnBoard(replay) {
  stopReplayMode();
  replayMode = true;
  replayResumeState = {
    boardSize,
    gameState: cloneGameState(gameState),
    nextTileId,
    statusText: statusElement.textContent,
  };

  boardSize = replay.boardSize;
  boardSizeSelect.value = String(boardSize);
  nextTileId = 0;
  gameState = createEmptyState();
  gameState.score = 0;
  gameState.over = true;
  gameState.cells = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  buildGrid();
  render();
  triggerReplayWipe();
  setReplayVisualState(true);
  setStatus(`Replay ${replay.mode} listo para reproducir.`);

  window.setTimeout(() => {
    if (!replayMode) return;
    replaySession = {
      replay,
      index: 0,
      playing: false,
    };
    initializeReplayBoard(replay);
    updateReplayControls();
  }, 240);
}

function commitCurrentLetter() {
  if (!initialsEntryState.active) return;
  initialsEntryState.letters[initialsEntryState.slot] = getCurrentSelectedLetter();
  if (initialsEntryState.slot === 2) {
    savePendingRecord();
    return;
  }

  initialsEntryState.slot += 1;
  initialsEntryState.selectedIndex = 0;
  renderInitialsEntry();
}

function deleteLastLetter() {
  if (!initialsEntryState.active) return;

  if (!initialsEntryState.letters[initialsEntryState.slot] && initialsEntryState.slot > 0) {
    initialsEntryState.slot -= 1;
  }

  initialsEntryState.letters[initialsEntryState.slot] = "";
  initialsEntryState.selectedIndex = 0;
  renderInitialsEntry();
}

function maybePersistCurrentScore() {
  if (recordSaved || gameState.score <= 0) return;
  if (!isRecordScore(gameState.score)) {
    recordSaved = true;
    return;
  }

  openInitialsEntry(gameState.score);
}

function finishGame() {
  if (gameState.over || isAnimating || initialsEntryState.active) return;
  gameState.over = true;
  maybePersistCurrentScore();
  if (!initialsEntryState.active) setStatus("Partida finalizada.");
}

function withinBounds(row, col) {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

function canMove() {
  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const tile = gameState.cells[row][col];
      if (!tile) return true;
      const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const [dr, dc] of directions) {
        const nextRow = row + dr;
        const nextCol = col + dc;
        if (!withinBounds(nextRow, nextCol)) continue;
        const neighbor = gameState.cells[nextRow][nextCol];
        if (!neighbor || neighbor.value === tile.value) return true;
      }
    }
  }
  return false;
}

function getTraversal(direction) {
  const indexes = Array.from({ length: boardSize }, (_, index) => index);
  if (direction === "right" || direction === "down") indexes.reverse();
  return indexes;
}

function scheduleEpicEffect(tile) {
  tile.effectUntil = performance.now() + EFFECT_DURATION;
  window.setTimeout(() => {
    if (tile.effectUntil <= performance.now()) render();
  }, EFFECT_DURATION + 30);
}

function move(direction) {
  void unlockAudio();
  if (gameState.over || isAnimating || initialsEntryState.active || replayMode) return;

  resetFlags();
  isAnimating = true;

  const vectors = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
  };

  const [dr, dc] = vectors[direction];
  const traversed = getTraversal(direction);
  let moved = false;
  let hadMerge = false;
  let highestMerge = 0;
  const mergedTargets = new Set();
  const epicBursts = [];
  const mergeGhosts = [];

  for (const major of traversed) {
    for (const minor of traversed) {
      const row = direction === "left" || direction === "right" ? major : minor;
      const col = direction === "left" || direction === "right" ? minor : major;
      const tile = gameState.cells[row][col];
      if (!tile) continue;

      let currentRow = row;
      let currentCol = col;
      let nextRow = currentRow + dr;
      let nextCol = currentCol + dc;

      while (withinBounds(nextRow, nextCol) && !gameState.cells[nextRow][nextCol]) {
        currentRow = nextRow;
        currentCol = nextCol;
        nextRow += dr;
        nextCol += dc;
      }

      const target = withinBounds(nextRow, nextCol) ? gameState.cells[nextRow][nextCol] : null;
      const targetKey = `${nextRow}-${nextCol}`;

      gameState.cells[row][col] = null;

      if (target && target.value === tile.value && !mergedTargets.has(targetKey)) {
        const newValue = tile.value * 2;
        mergeGhosts.push({
          fromRow: row,
          fromCol: col,
          toRow: target.row,
          toCol: target.col,
          value: tile.value,
        });
        target.value = newValue;
        target.justMerged = true;
        target.isNew = false;
        updateScore(newValue);
        mergedTargets.add(targetKey);
        moved = true;
        hadMerge = true;
        highestMerge = Math.max(highestMerge, newValue);
        if (newValue > 32) {
          scheduleEpicEffect(target);
          epicBursts.push({ row: target.row, col: target.col, value: newValue });
        }
      } else {
        tile.row = currentRow;
        tile.col = currentCol;
        gameState.cells[currentRow][currentCol] = tile;
        if (currentRow !== row || currentCol !== col) moved = true;
      }
    }
  }

  if (!moved) {
    gameState.cells = normalizeCells();
    render();
    playBlockedSound();
    isAnimating = false;
    return;
  }

  render();
  mergeGhosts.forEach((ghost) => createMergeGhost(ghost));
  if (hadMerge) {
    playMergeSound(highestMerge);
    if (highestMerge >= 128) playFanfare128();
  } else {
    playMoveSound();
  }

  window.setTimeout(() => {
    const spawnedTile = addRandomTile();
    if (currentReplay && spawnedTile) {
      currentReplay.turns.push({
        move: direction,
        spawn: spawnedTile,
        atMs: Date.now() - Date.parse(currentReplay.startedAt),
      });
    }
    render();

    epicBursts.forEach((entry) => createEpicBurst(entry.row, entry.col, entry.value));
    epicBursts
      .filter((entry) => entry.value > 64)
      .forEach((entry) => addJournalEntry(entry.value, entry.row, entry.col));

    if (!gameState.won && hasTileAtLeast(2048)) {
      gameState.won = true;
      setStatus("Llegaste a 2048. Puedes seguir jugando.");
    } else if (!canMove()) {
      gameState.over = true;
      maybePersistCurrentScore();
      setStatus("No quedan movimientos. Pulsa Nueva partida.");
    } else {
      setStatus("");
    }
    isAnimating = false;
  }, MOVE_DURATION);
}

function normalizeCells() {
  const next = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  for (const row of gameState.cells) {
    for (const tile of row) {
      if (!tile) continue;
      next[tile.row][tile.col] = tile;
    }
  }
  return next;
}

function hasTileAtLeast(value) {
  return gameState.cells.some((row) => row.some((tile) => tile && tile.value >= value));
}

function createEpicBurst(row, col, value) {
  const { x, y } = getOffset(row, col);
  const tileSize = getTileSize();
  const centerX = x + tileSize / 2;
  const centerY = y + tileSize / 2;

  const ring = document.createElement("div");
  ring.className = "burst";
  ring.style.left = `${centerX - tileSize / 2}px`;
  ring.style.top = `${centerY - tileSize / 2}px`;
  ring.style.width = `${tileSize}px`;
  ring.style.height = `${tileSize}px`;
  fxLayer.appendChild(ring);

  const sparkCount = Math.min(18, 8 + Math.floor(Math.log2(value)));
  for (let index = 0; index < sparkCount; index += 1) {
    const spark = document.createElement("div");
    const angle = (Math.PI * 2 * index) / sparkCount;
    const distance = tileSize * (0.5 + Math.random() * 0.9);
    spark.className = "spark";
    spark.style.left = `${centerX}px`;
    spark.style.top = `${centerY}px`;
    spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    fxLayer.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  }

  ring.addEventListener("animationend", () => ring.remove(), { once: true });
}

function createMergeGhost({ fromRow, fromCol, toRow, toCol, value }) {
  const ghost = document.createElement("div");
  ghost.className = `tile tile-value-${Math.min(value, 2048)} ${value > 2048 ? "tile-value-super" : ""}`.trim();
  ghost.textContent = value;
  applyTileTextSizing(ghost, value);
  positionTileElement(ghost, fromRow, fromCol);
  boardElement.appendChild(ghost);

  requestAnimationFrame(() => {
    positionTileElement(ghost, toRow, toCol);
    ghost.style.opacity = "0.15";
    ghost.style.filter = "blur(1px)";
  });

  window.setTimeout(() => ghost.remove(), MOVE_DURATION);
}

function ensureAudio() {
  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    audioContext = new AudioCtor();
    audioMasterGain = audioContext.createGain();
    audioMasterGain.gain.value = 0.9;
    audioMasterGain.connect(audioContext.destination);
  }
  return audioContext;
}

async function unlockAudio() {
  const context = ensureAudio();
  if (!context) return null;

  if (context.state !== "running") {
    try {
      await context.resume();
    } catch {
      return null;
    }
  }

  if (!audioUnlocked) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    gain.gain.value = 0.0001;
    oscillator.connect(gain);
    gain.connect(audioMasterGain);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.01);
    audioUnlocked = true;
  }

  return context;
}

function playToneNow(context, { frequency, duration, type = "sine", volume = 0.05, when = 0, slideTo = null }) {
  const startAt = context.currentTime + when;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, startAt + duration);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(audioMasterGain);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

function playTone(options) {
  const context = ensureAudio();
  if (!context || !audioMasterGain) return;
  if (context.state === "running") {
    playToneNow(context, options);
    return;
  }

  unlockAudio().then((readyContext) => {
    if (!readyContext || readyContext.state !== "running") return;
    playToneNow(readyContext, options);
  }).catch(() => {});
}

function playMoveSound() {
  playTone({ frequency: 260, slideTo: 200, duration: 0.08, type: "triangle", volume: 0.08 });
  playTone({ frequency: 390, slideTo: 320, duration: 0.06, type: "sine", volume: 0.03, when: 0.015 });
}

function playBlockedSound() {
  playTone({ frequency: 140, slideTo: 95, duration: 0.11, type: "sawtooth", volume: 0.06 });
  playTone({ frequency: 105, slideTo: 75, duration: 0.08, type: "square", volume: 0.035, when: 0.01 });
}

function playMergeSound(value) {
  const boost = Math.min(0.14, 0.07 + Math.log2(value) * 0.005);
  playTone({ frequency: 330, duration: 0.08, type: "triangle", volume: boost, when: 0 });
  playTone({ frequency: 495, duration: 0.12, type: "sine", volume: boost * 0.82, when: 0.035 });
  playTone({ frequency: 660, duration: 0.09, type: "triangle", volume: boost * 0.55, when: 0.06 });
}

function playFanfare128() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
  notes.forEach((note, index) => {
    playTone({
      frequency: note,
      duration: 0.2,
      type: index % 2 === 0 ? "triangle" : "square",
      volume: 0.075,
      when: index * 0.1,
    });
  });
}

function queueMove(direction) {
  unlockAudio()
    .catch(() => null)
    .finally(() => move(direction));
}

function handleKeydown(event) {
  void unlockAudio();
  if (replayMode && replaySession) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      toggleReplayPlayback();
      return;
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      event.preventDefault();
      pauseReplayPlayback();
      setReplayToIndex(replaySession.index + 1);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      event.preventDefault();
      pauseReplayPlayback();
      setReplayToIndex(replaySession.index - 1);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      pauseReplayPlayback();
      setReplayToIndex(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      pauseReplayPlayback();
      setReplayToIndex(replaySession.replay.turns.length);
      return;
    }
  }

  if (initialsEntryState.active) {
    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      event.preventDefault();
      shiftCurrentLetter(-1);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
      event.preventDefault();
      shiftCurrentLetter(1);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commitCurrentLetter();
      return;
    }
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      deleteLastLetter();
      return;
    }
  }
  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    a: "left",
    s: "down",
    d: "right",
    W: "up",
    A: "left",
    S: "down",
    D: "right",
  };
  const direction = keyMap[event.key];
  if (!direction) return;
  event.preventDefault();
  queueMove(direction);
}

function handleTouchStart(event) {
  void unlockAudio();
  const touch = event.changedTouches[0];
  touchStart = { x: touch.clientX, y: touch.clientY };
}

function handleTouchEnd(event) {
  if (!touchStart) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStart.x;
  const dy = touch.clientY - touchStart.y;
  touchStart = null;

  if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
  if (Math.abs(dx) > Math.abs(dy)) {
    queueMove(dx > 0 ? "right" : "left");
  } else {
    queueMove(dy > 0 ? "down" : "up");
  }
}

window.addEventListener("pointerdown", () => { void unlockAudio(); });
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    void unlockAudio();
  }
});
restartButton.addEventListener("click", () => {
  void unlockAudio();
  startGame();
});
boardSizeSelect.addEventListener("click", () => { void unlockAudio(); });
boardSizeSelect.addEventListener("change", () => {
  void unlockAudio();
  startGame();
});
finishButton.addEventListener("click", finishGame);
letterUpButton.addEventListener("pointerdown", () => { void unlockAudio(); });
letterDownButton.addEventListener("pointerdown", () => { void unlockAudio(); });
selectLetterButton.addEventListener("pointerdown", () => { void unlockAudio(); });
deleteLetterButton.addEventListener("pointerdown", () => { void unlockAudio(); });
submitGlobalRecordButton.addEventListener("pointerdown", () => { void unlockAudio(); });
letterUpButton.addEventListener("click", () => shiftCurrentLetter(-1));
letterDownButton.addEventListener("click", () => shiftCurrentLetter(1));
selectLetterButton.addEventListener("click", commitCurrentLetter);
deleteLetterButton.addEventListener("click", deleteLastLetter);
submitGlobalRecordButton.addEventListener("click", submitGlobalRecord);
closeReplayButton.addEventListener("click", closeReplayViewer);
replayFirstButton.addEventListener("click", () => {
  pauseReplayPlayback();
  setReplayToIndex(0);
});
replayPrevButton.addEventListener("click", () => {
  pauseReplayPlayback();
  setReplayToIndex((replaySession?.index || 0) - 1);
});
replayPlayButton.addEventListener("click", toggleReplayPlayback);
replayNextButton.addEventListener("click", () => {
  pauseReplayPlayback();
  setReplayToIndex((replaySession?.index || 0) + 1);
});
replayLastButton.addEventListener("click", () => {
  pauseReplayPlayback();
  if (!replaySession) return;
  setReplayToIndex(replaySession.replay.turns.length);
});
toggleRecordsButton.addEventListener("click", () => setRecordsPanelOpen(!recordsPanelOpen));
window.addEventListener("keydown", handleKeydown);
boardElement.addEventListener("touchstart", handleTouchStart, { passive: true });
boardElement.addEventListener("touchend", handleTouchEnd, { passive: true });
window.addEventListener("resize", render);

buildGrid();
setRecordsPanelOpen(false);
startGame();

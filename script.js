const MOVE_DURATION = 210;
const REPLAY_MOVE_DURATION = 460;
const REPLAY_STEP_DELAY = 1180;
const REPLAY_ARROW_LEAD = 520;
const EFFECT_DURATION = 5000;
const STORAGE_PREFIX = "smooth-2048-best-score";
const RECORDS_PREFIX = "smooth-2048-records";
const MAX_RECORDS_PER_MODE = 10;
const PLAYER_INITIALS_KEY = "smooth-2048-player-initials";
const AUDIO_ENABLED_KEY = "smooth-2048-audio-enabled";
const THEME_KEY = "smooth-2048-theme";
const GITHUB_OWNER = "FDAHNet";
const GITHUB_REPO = "2048";
const GLOBAL_RECORD_LABEL = "record";
const WORKER_API_URL = "https://angeloso-2048-records.mcdrer.workers.dev";
const HOLE_SEQUENCE = ["h", "o", "l", "e"];

const boardElement = document.getElementById("board");
const fxLayer = document.getElementById("fx-layer");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");
const bestScoreCardElement = document.getElementById("best-score-card");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restart-button");
const finishButton = document.getElementById("finish-button");
const gameOverOverlayElement = document.getElementById("game-over-overlay");
const gameOverReasonElement = document.getElementById("game-over-reason");
const audioToggleButton = document.getElementById("audio-toggle-button");
const undoToggleButton = document.getElementById("undo-toggle-button");
const undoPanelElement = document.getElementById("undo-panel");
const closeUndoButton = document.getElementById("close-undo-button");
const undoListElement = document.getElementById("undo-list");
const replayIndicatorElement = document.getElementById("replay-indicator");
const boardSizeSelect = document.getElementById("board-size");
const recordsPanelElement = document.getElementById("records-panel");
const toggleRecordsButton = document.getElementById("toggle-records-button");
const globalRecordsGroupsElement = document.getElementById("global-records-groups");
const journalListElement = document.getElementById("journal-list");
const journalTitleElement = document.getElementById("journal-title");
const journalSubtitleElement = document.getElementById("journal-subtitle");
const gameTimerElement = document.getElementById("game-timer");
const uiFxLayerElement = document.getElementById("ui-fx-layer");
const starfieldElement = document.getElementById("starfield");
const attractOverlayElement = document.getElementById("attract-overlay");
const startAttractButton = document.getElementById("start-attract-button");
const themeSelect = document.getElementById("theme-select");
const replayViewerElement = document.getElementById("replay-viewer");
const replayMetaElement = document.getElementById("replay-meta");
const replayEmptyElement = document.getElementById("replay-empty");
const replayControlsElement = document.getElementById("replay-controls");
const replayProgressElement = document.getElementById("replay-progress");
const replayModeLabelElement = document.getElementById("replay-mode-label");
const replayArrowOverlayElement = document.getElementById("replay-arrow-overlay");
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
const closeInitialsButton = document.getElementById("close-initials-button");

let boardSize = Number(boardSizeSelect.value);
let nextTileId = 1;
let tileMap = new Map();
let gameState = createEmptyState();
let isAnimating = false;
let touchStart = null;
let audioContext = null;
let audioMasterGain = null;
let audioUnlocked = false;
let audioEnabled = localStorage.getItem(AUDIO_ENABLED_KEY) === "true";
let recordSaved = false;
let pendingGlobalRecord = null;
let journalEntries = [];
let currentReplay = null;
let recordsPanelOpen = false;
let undoPanelOpen = false;
let replayMode = false;
let replayTimer = null;
let replayResumeState = null;
let replaySession = null;
let demoMode = false;
let demoTimer = null;
let holeMode = false;
let holeTimer = null;
let holeSequenceProgress = 0;
let attractDismissed = false;
let theme = localStorage.getItem(THEME_KEY) || "crt";
let gameSessionId = 0;
let expandedRecordsMode = null;
let replayArrowRotation = 0;
let globalRecordsCache = Object.fromEntries(["4x4", "5x5", "6x6", "8x8"].map((mode) => [mode, []]));
let globalRecordsLoaded = false;
let globalRecordFanfarePlayed = false;
let bestScoreBurstTimer = null;
let gameTimerStartedAt = 0;
let gameTimerInterval = null;
let lastTimerMilestone = 0;
let moveHistory = [];
let moveSequence = 0;
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

function updateAudioToggleButton() {
  audioToggleButton.textContent = audioEnabled ? "🔊 SONIDO ON" : "🔈 SONIDO OFF";
  audioToggleButton.classList.toggle("is-on", audioEnabled);
  audioToggleButton.setAttribute("aria-pressed", String(audioEnabled));
}

function setGameOverOverlay(visible, reason = "") {
  gameOverOverlayElement.classList.toggle("hidden", !visible);
  if (gameOverReasonElement) {
    gameOverReasonElement.textContent = visible ? reason : "";
  }
}

function formatElapsedTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderGameTimer() {
  if (!gameTimerElement) return;
  if (replayMode) {
    gameTimerElement.textContent = "REPLAY";
    return;
  }
  gameTimerElement.textContent = formatElapsedTime(Date.now() - gameTimerStartedAt);
}

function stopGameTimer() {
  if (gameTimerInterval) {
    window.clearInterval(gameTimerInterval);
    gameTimerInterval = null;
  }
}

function startGameTimer() {
  stopGameTimer();
  gameTimerStartedAt = Date.now();
  lastTimerMilestone = 0;
  renderGameTimer();
  gameTimerInterval = window.setInterval(() => {
    if (replayMode || gameState.over || demoMode) return;
    renderGameTimer();
    maybeCelebrateTimeMilestone();
  }, 250);
}

function maybeCelebrateTimeMilestone() {
  if (replayMode || gameState.over || demoMode) return;
  const elapsedMs = Date.now() - gameTimerStartedAt;
  const milestone = Math.floor(elapsedMs / 300000);
  if (milestone <= 0 || milestone === lastTimerMilestone) return;
  lastTimerMilestone = milestone;
  triggerTimeMilestoneFx(milestone * 5);
}

function triggerTimeMilestoneFx(minutes) {
  if (gameTimerElement) {
    gameTimerElement.classList.remove("timer-milestone");
    void gameTimerElement.offsetWidth;
    gameTimerElement.classList.add("timer-milestone");
  }

  const marker = document.createElement("div");
  marker.className = "time-milestone-banner";
  marker.textContent = `${minutes} MIN`;
  uiFxLayerElement.appendChild(marker);
  marker.addEventListener("animationend", () => marker.remove(), { once: true });

  playTimeMilestoneSound();
  setStatus(`${minutes} minutos de partida.`);
}

function stopDemoMode() {
  demoMode = false;
  if (demoTimer) {
    window.clearTimeout(demoTimer);
    demoTimer = null;
  }
  if (statusElement.textContent === "MODO DEMO") {
    setStatus("");
  }
}

function stopHoleMode(options = {}) {
  const { keepStatus = false } = options;
  holeMode = false;
  holeSequenceProgress = 0;
  if (holeTimer) {
    window.clearTimeout(holeTimer);
    holeTimer = null;
  }
  if (!keepStatus && statusElement.textContent === "MODO H.O.L.E. Pulsa Espacio para parar.") {
    setStatus("");
  }
}

function applyTheme(nextTheme) {
  theme = nextTheme;
  document.body.dataset.theme = theme;
  themeSelect.value = theme;
  localStorage.setItem(THEME_KEY, theme);
  buildStarfield();
}

function buildStarfield() {
  if (!starfieldElement) return;
  starfieldElement.innerHTML = "";

  const layerConfigs = [
    { count: 26, minSize: 1.2, maxSize: 2.8, drift: 32, scale: [0.8, 1.25] },
    { count: 18, minSize: 1.8, maxSize: 4.2, drift: 44, scale: [0.9, 1.5] },
    { count: 10, minSize: 3.2, maxSize: 5.8, drift: 58, scale: [1, 1.8] },
  ];

  layerConfigs.forEach((config, layerIndex) => {
    const layer = document.createElement("div");
    layer.className = "star-layer";
    layer.style.setProperty("--drift-duration", `${config.drift}s`);

    for (let index = 0; index < config.count; index += 1) {
      const star = document.createElement("span");
      const size = randomBetween(config.minSize, config.maxSize);
      const scale = randomBetween(config.scale[0], config.scale[1]);
      star.className = "star";
      if (Math.random() > 0.68) star.classList.add("star-cross");
      star.style.left = `${Math.round(Math.random() * 112)}%`;
      star.style.top = `${Math.round(Math.random() * 112)}%`;
      star.style.setProperty("--star-size", `${size.toFixed(2)}px`);
      star.style.setProperty("--star-scale", scale.toFixed(2));
      star.style.setProperty("--star-opacity", randomBetween(0.58, 1).toFixed(2));
      star.style.setProperty("--delay", `${randomBetween(-6, 0).toFixed(2)}s`);
      star.style.setProperty("--twinkle-duration", `${randomBetween(2.6, 5.8).toFixed(2)}s`);
      star.style.setProperty("--pulse-duration", `${randomBetween(4.2, 8.4).toFixed(2)}s`);
      if (layerIndex === 2) {
        star.style.filter = "saturate(1.2)";
      }
      layer.appendChild(star);
    }

    starfieldElement.appendChild(layer);
  });
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
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

function startGame(options = {}) {
  const { demo = false } = options;
  if (initialsEntryState.active) {
    closeInitialsEntry({ discard: true });
  }
  gameSessionId += 1;
  discardReplayState();
  stopDemoMode();
  stopHoleMode({ keepStatus: true });
  setGameOverOverlay(false);
  demoMode = demo;
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
  moveHistory = [];
  moveSequence = 0;
  globalRecordFanfarePlayed = false;
  globalRecordsLoaded = false;
  clearBestScoreCelebration();
  startGameTimer();
  gameState = createEmptyState();
  buildGrid();
  const startSpawnA = addRandomTile();
  const startSpawnB = addRandomTile();
  if (!demoMode) {
    currentReplay = {
      version: 1,
      boardSize,
      mode: `${boardSize}x${boardSize}`,
      startedAt: new Date().toISOString(),
      start: [startSpawnA, startSpawnB].filter(Boolean),
      turns: [],
    };
  }
  render();
  renderJournal();
  renderUndoHistory();
  renderRecords();
  if (!demoMode) {
    renderGlobalRecordsLoading();
    fetchGlobalRecords();
  }
  setStatus(demoMode ? "MODO DEMO" : "");
  if (demoMode) scheduleDemoMove();
}

function setRecordsPanelOpen(nextOpen) {
  recordsPanelOpen = nextOpen;
  recordsPanelElement.classList.toggle("records-panel-collapsed", !recordsPanelOpen);
  toggleRecordsButton.textContent = recordsPanelOpen ? "Ocultar records" : "Mostrar records";
  if (recordsPanelOpen) {
    renderGlobalRecordsLoading();
    fetchGlobalRecords();
  }
}

function setStatus(message) {
  statusElement.textContent = message;
}

function boardValuesFromState(state = gameState) {
  return state.cells.map((row) => row.map((tile) => tile?.value || 0));
}

function cloneBoardValues(values) {
  return values.map((row) => row.slice());
}

function simulateLine(line) {
  const compact = line.filter((value) => value > 0);
  const merged = [];
  let gainedScore = 0;
  let highestMerge = 0;

  for (let index = 0; index < compact.length; index += 1) {
    const value = compact[index];
    if (compact[index + 1] === value) {
      const nextValue = value * 2;
      merged.push(nextValue);
      gainedScore += nextValue;
      highestMerge = Math.max(highestMerge, nextValue);
      index += 1;
    } else {
      merged.push(value);
    }
  }

  while (merged.length < boardSize) merged.push(0);
  return { line: merged, gainedScore, highestMerge };
}

function getBoardLine(values, direction, index) {
  if (direction === "left" || direction === "right") {
    return values[index].slice();
  }
  return Array.from({ length: boardSize }, (_, offset) => values[offset][index]);
}

function setBoardLine(values, direction, index, line) {
  if (direction === "left" || direction === "right") {
    values[index] = line.slice();
    return;
  }
  for (let offset = 0; offset < boardSize; offset += 1) {
    values[offset][index] = line[offset];
  }
}

function simulateDirectionOnValues(sourceValues, direction) {
  const nextValues = cloneBoardValues(sourceValues);
  let moved = false;
  let gainedScore = 0;
  let highestMerge = 0;

  for (let index = 0; index < boardSize; index += 1) {
    const original = getBoardLine(sourceValues, direction, index);
    const normalized = direction === "right" || direction === "down" ? original.slice().reverse() : original.slice();
    const result = simulateLine(normalized);
    const restored = direction === "right" || direction === "down" ? result.line.slice().reverse() : result.line.slice();

    if (!moved && restored.some((value, valueIndex) => value !== original[valueIndex])) {
      moved = true;
    }

    gainedScore += result.gainedScore;
    highestMerge = Math.max(highestMerge, result.highestMerge);
    setBoardLine(nextValues, direction, index, restored);
  }

  return {
    moved,
    values: nextValues,
    gainedScore,
    highestMerge,
  };
}

function countEmptyCells(values) {
  return values.reduce((total, row) => total + row.filter((value) => value === 0).length, 0);
}

function countAvailableMovesForValues(values) {
  return ["up", "right", "down", "left"]
    .filter((direction) => simulateDirectionOnValues(values, direction).moved)
    .length;
}

function buildSnakeWeightMaps() {
  const base = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  let rank = boardSize * boardSize;

  for (let row = 0; row < boardSize; row += 1) {
    const cols = Array.from({ length: boardSize }, (_, col) => col);
    if (row % 2 === 1) cols.reverse();
    cols.forEach((col) => {
      base[row][col] = rank;
      rank -= 1;
    });
  }

  const rotate = (matrix) => matrix[0].map((_, col) => matrix.map((row) => row[col]).reverse());
  const maps = [base];
  while (maps.length < 4) maps.push(rotate(maps[maps.length - 1]));
  return maps;
}

function evaluateBoardValues(values, gainedScore = 0) {
  const emptyCells = countEmptyCells(values);
  const mobility = countAvailableMovesForValues(values);
  if (mobility === 0) return Number.NEGATIVE_INFINITY;

  const weightMaps = buildSnakeWeightMaps();
  const weightedSnake = Math.max(
    ...weightMaps.map((weightMap) => {
      let total = 0;
      for (let row = 0; row < boardSize; row += 1) {
        for (let col = 0; col < boardSize; col += 1) {
          const value = values[row][col];
          if (!value) continue;
          total += Math.log2(value) * weightMap[row][col];
        }
      }
      return total;
    })
  );

  const maxTile = Math.max(...values.flat());
  const maxInCorner = [values[0][0], values[0][boardSize - 1], values[boardSize - 1][0], values[boardSize - 1][boardSize - 1]]
    .includes(maxTile);

  return (
    (emptyCells * 10000)
    + (mobility * 2200)
    + (gainedScore * 18)
    + weightedSnake
    + (maxInCorner ? maxTile * 24 : 0)
  );
}

function getHoleBestMove() {
  const currentValues = boardValuesFromState();
  let bestDirection = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  ["up", "left", "right", "down"].forEach((direction) => {
    const simulation = simulateDirectionOnValues(currentValues, direction);
    if (!simulation.moved) return;
    const score = evaluateBoardValues(simulation.values, simulation.gainedScore);
    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
  });

  return bestDirection;
}

function scheduleHoleMove() {
  if (!holeMode) return;
  if (holeTimer) window.clearTimeout(holeTimer);
  const holeSessionId = gameSessionId;
  holeTimer = window.setTimeout(() => {
    if (holeSessionId !== gameSessionId) return;
    if (!holeMode || isAnimating || replayMode || initialsEntryState.active || demoMode) return;
    if (gameState.over) {
      stopHoleMode({ keepStatus: true });
      return;
    }
    const direction = getHoleBestMove();
    if (!direction) {
      stopHoleMode({ keepStatus: true });
      return;
    }
    move(direction);
  }, 70);
}

function startHoleMode() {
  if (!attractDismissed) {
    startActualGame();
  }
  if (demoMode || replayMode || initialsEntryState.active || gameState.over) return;
  stopDemoMode();
  holeMode = true;
  holeSequenceProgress = 0;
  setStatus("MODO H.O.L.E. Pulsa Espacio para parar.");
  scheduleHoleMove();
}

function updateScore(points) {
  gameState.score += points;
  gameState.bestScore = Math.max(gameState.bestScore, gameState.score);
  localStorage.setItem(getBestScoreKey(), String(gameState.bestScore));
  maybeCelebrateLiveGlobalRecord();
}

function maybeCelebrateLiveGlobalRecord() {
  if (demoMode || globalRecordFanfarePlayed || !globalRecordsLoaded) return;
  const mode = `${boardSize}x${boardSize}`;
  const currentTopScore = getTopScoreForMode(mode);
  if (gameState.score > currentTopScore) {
    globalRecordFanfarePlayed = true;
    activateBestScoreCelebration();
    playGlobalRecordFanfare();
    setStatus("Nuevo record global en juego.");
  }
}

function activateBestScoreCelebration() {
  if (!bestScoreCardElement) return;
  if (bestScoreBurstTimer) {
    window.clearTimeout(bestScoreBurstTimer);
    bestScoreBurstTimer = null;
  }
  bestScoreCardElement.classList.remove("record-broken");
  void bestScoreCardElement.offsetWidth;
  bestScoreCardElement.classList.add("record-broken", "record-leader");
  bestScoreBurstTimer = window.setTimeout(() => {
    bestScoreCardElement.classList.remove("record-broken");
    bestScoreBurstTimer = null;
  }, 3200);
}

function clearBestScoreCelebration() {
  if (!bestScoreCardElement) return;
  if (bestScoreBurstTimer) {
    window.clearTimeout(bestScoreBurstTimer);
    bestScoreBurstTimer = null;
  }
  bestScoreCardElement.classList.remove("record-broken", "record-leader");
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

function cloneReplay(replay) {
  if (!replay) return null;
  return {
    ...replay,
    start: replay.start.map((spawn) => ({ ...spawn })),
    turns: replay.turns.map((turn) => ({
      ...turn,
      spawn: turn.spawn ? { ...turn.spawn } : null,
    })),
  };
}

function cloneJournalEntries(entries) {
  return entries.map((entry) => ({ ...entry }));
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
  if (records.length < MAX_RECORDS_PER_MODE) return true;
  return records.some((record) => score > record.score);
}

function renderRecords() {
  return;
}

function setUndoPanelOpen(nextOpen) {
  undoPanelOpen = nextOpen && moveHistory.length > 0;
  undoPanelElement.classList.toggle("hidden", !undoPanelOpen);
  undoToggleButton.textContent = undoPanelOpen ? "Ocultar undo" : "Undo";
}

function renderUndoHistory() {
  if (!undoListElement) return;
  undoListElement.innerHTML = "";

  if (!moveHistory.length) {
    const empty = document.createElement("div");
    empty.className = "undo-entry-empty";
    empty.textContent = "Todavia no hay movimientos guardados.";
    undoListElement.appendChild(empty);
    undoToggleButton.disabled = true;
    if (undoPanelOpen) setUndoPanelOpen(false);
    return;
  }

  undoToggleButton.disabled = false;

  moveHistory.slice().reverse().forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "undo-entry";
    button.addEventListener("click", () => restoreHistoryEntry(entry.id));

    const step = document.createElement("strong");
    step.textContent = String(entry.step);

    const meta = document.createElement("div");
    const title = document.createElement("div");
    title.textContent = entry.label;
    const subtitle = document.createElement("small");
    subtitle.textContent = `${entry.score} puntos | ${entry.elapsedText}`;
    meta.append(title, subtitle);

    const target = document.createElement("span");
    target.textContent = "Ir";

    button.append(step, meta, target);
    undoListElement.appendChild(button);
  });
}

function renderJournal() {
  journalListElement.innerHTML = "";

  if (replayMode && replaySession?.replay) {
    journalTitleElement.textContent = "Movimientos";
    journalSubtitleElement.textContent = "Pulsa una direccion y sigue el movimiento paso a paso.";
    const turns = replaySession.replay.turns || [];
    if (!turns.length) {
      const empty = document.createElement("div");
      empty.className = "journal-entry journal-entry-empty";
      empty.textContent = "Esta replay no tiene movimientos guardados.";
      journalListElement.appendChild(empty);
      return;
    }

    turns.forEach((turn, index) => {
      const item = document.createElement("div");
      item.className = "journal-entry";
      item.dataset.replayTurn = String(index + 1);
      if (index + 1 === replaySession.index) item.classList.add("is-replay-active");

      const time = document.createElement("time");
      time.textContent = `Paso ${index + 1}`;

      const text = document.createElement("strong");
      text.textContent = `Pulso ${getDirectionLabel(turn.move)}`;

      item.append(time, text);
      journalListElement.appendChild(item);
    });
    return;
  }

  journalTitleElement.textContent = journalTitleElement.dataset.defaultTitle || "Bitacora";
  journalSubtitleElement.textContent = "Logros de 128 o mas durante la partida.";

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

function pushHistoryEntry(direction) {
  if (demoMode || replayMode) return;
  moveSequence += 1;
  const elapsedMs = Date.now() - gameTimerStartedAt;
  moveHistory.push({
    id: `history-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    step: moveSequence,
    direction,
    label: `Paso ${moveSequence} · ${getDirectionLabel(direction)}`,
    score: gameState.score,
    elapsedMs,
    elapsedText: formatElapsedTime(elapsedMs),
    state: cloneGameState(gameState),
    journalEntries: cloneJournalEntries(journalEntries),
    currentReplay: cloneReplay(currentReplay),
    nextTileId,
    globalRecordFanfarePlayed,
    recordLeaderActive: bestScoreCardElement?.classList.contains("record-leader") || false,
  });
  if (moveHistory.length > MAX_RECORDS_PER_MODE) {
    moveHistory = moveHistory.slice(-MAX_RECORDS_PER_MODE);
  }
  renderUndoHistory();
}

function restoreHistoryEntry(entryId) {
  const targetIndex = moveHistory.findIndex((entry) => entry.id === entryId);
  if (targetIndex === -1 || replayMode || initialsEntryState.active) return;

  const entry = moveHistory[targetIndex];
  stopDemoMode();
  stopHoleMode({ keepStatus: true });
  discardReplayState();
  fxLayer.innerHTML = "";
  isAnimating = false;
  gameState = cloneGameState(entry.state);
  journalEntries = cloneJournalEntries(entry.journalEntries);
  currentReplay = cloneReplay(entry.currentReplay);
  nextTileId = entry.nextTileId;
  globalRecordFanfarePlayed = entry.globalRecordFanfarePlayed;
  gameTimerStartedAt = Date.now() - entry.elapsedMs;
  moveSequence = entry.step;
  moveHistory = moveHistory.slice(0, targetIndex + 1);

  clearBestScoreCelebration();
  if (entry.recordLeaderActive) {
    bestScoreCardElement.classList.add("record-leader");
  }

  render();
  renderJournal();
  renderUndoHistory();
  renderGameTimer();
  setGameOverOverlay(gameState.over);
  setStatus(`Undo hasta ${entry.label}.`);
  setUndoPanelOpen(false);
}

function getDirectionLabel(direction) {
  const labels = {
    up: "ARRIBA",
    down: "ABAJO",
    left: "IZQUIERDA",
    right: "DERECHA",
  };
  return labels[direction] || direction?.toUpperCase?.() || "";
}

function updateReplayArrow(direction = "") {
  if (!replayArrowOverlayElement) return;
  const hasDirection = ["up", "down", "left", "right"].includes(direction);
  if (!hasDirection || !replayMode) {
    replayArrowRotation = 0;
    replayArrowOverlayElement.style.setProperty("--replay-arrow-rotation", "0deg");
    replayArrowOverlayElement.dataset.direction = "";
    replayArrowOverlayElement.classList.add("hidden");
    replayArrowOverlayElement.classList.remove("is-visible");
    return;
  }

  const targetRotation = getReplayArrowRotation(direction);
  replayArrowOverlayElement.dataset.direction = direction;
  const normalizedCurrent = ((replayArrowRotation % 360) + 360) % 360;
  const delta = ((targetRotation - normalizedCurrent + 540) % 360) - 180;
  replayArrowRotation += delta;
  replayArrowOverlayElement.style.setProperty("--replay-arrow-rotation", `${replayArrowRotation}deg`);
  replayArrowOverlayElement.classList.toggle("hidden", !hasDirection || !replayMode);
  replayArrowOverlayElement.classList.toggle("is-visible", Boolean(hasDirection && replayMode));
}

function getReplayArrowRotation(direction) {
  const rotations = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  };
  return rotations[direction] ?? 0;
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
  globalRecordsLoaded = false;
  GLOBAL_MODES.forEach((mode) => {
    const listElement = globalRecordsElements[mode];
    listElement.innerHTML = "";
    const row = document.createElement("div");
    row.className = "records-row records-row-empty";
    row.textContent = "No se pudieron cargar.";
    listElement.appendChild(row);
  });
  syncExpandedRecordsUI();
}

function renderGlobalRecords(recordsByMode) {
  globalRecordsCache = recordsByMode;
  globalRecordsLoaded = true;
  GLOBAL_MODES.forEach((mode) => {
    const listElement = globalRecordsElements[mode];
    const allRecords = (recordsByMode[mode] || []).slice(0, MAX_RECORDS_PER_MODE);
    const records = expandedRecordsMode === mode ? allRecords : allRecords.slice(0, 4);
    listElement.innerHTML = "";

    if (!records.length) {
      const row = document.createElement("div");
      row.className = "records-row records-row-empty";
      row.textContent = "Sin records enviados.";
      listElement.appendChild(row);
      return;
    }

    records.forEach((record, index) => {
      const row = document.createElement("div");
      row.className = "records-row";

      const rank = document.createElement("span");
      rank.className = "record-rank";
      rank.textContent = String(index + 1);

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

      row.append(rank, initials, score, timestamp, action);
      listElement.appendChild(row);
    });
  });
  syncExpandedRecordsUI();
  maybeCelebrateLiveGlobalRecord();
}

function syncExpandedRecordsUI() {
  if (!globalRecordsGroupsElement) return;
  globalRecordsGroupsElement.dataset.expandedMode = expandedRecordsMode || "";
  document.querySelectorAll(".records-mode-group").forEach((group) => {
    const isExpanded = expandedRecordsMode === group.dataset.mode;
    group.classList.toggle("is-expanded", isExpanded);
    group.classList.toggle("is-dimmed", Boolean(expandedRecordsMode) && !isExpanded);
  });
  document.querySelectorAll(".records-mode-toggle").forEach((button) => {
    button.classList.toggle("hidden", expandedRecordsMode === button.dataset.mode);
  });
  document.querySelectorAll(".records-mode-close").forEach((button) => {
    button.classList.toggle("hidden", expandedRecordsMode !== button.dataset.mode);
  });
}

function setExpandedRecordsMode(mode) {
  expandedRecordsMode = mode;
  renderGlobalRecords(globalRecordsCache);
}

function getTopScoreForMode(mode) {
  const records = globalRecordsCache[mode] || [];
  return records.length ? Math.max(...records.map((record) => record.score)) : 0;
}

function mergeGlobalRecordIntoCache(record) {
  if (!record?.mode || !globalRecordsCache[record.mode]) return;
  const merged = [...globalRecordsCache[record.mode], record];
  merged.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return left.isoDate.localeCompare(right.isoDate);
  });
  globalRecordsCache[record.mode] = merged.slice(0, MAX_RECORDS_PER_MODE);
  globalRecordsLoaded = true;
}

function parseGlobalRecord(issue) {
  const body = issue.body || "";
  const initials = body.match(/Initials:\s*([A-Z]{3})/i)?.[1]?.toUpperCase();
  const mode = body.match(/Mode:\s*([0-9]+x[0-9]+)/i)?.[1];
  const scoreText = body.match(/Score:\s*([0-9]+)/i)?.[1];
  const replayMatch = body.match(/```json\s*([\s\S]*?)```/i);
  const replayParts = Number(body.match(/Replay Parts:\s*([0-9]+)/i)?.[1] || 0);
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
    issueNumber: issue.number,
    commentsUrl: issue.comments_url,
    replayParts,
    displayDate: new Intl.DateTimeFormat("es-ES", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(issue.created_at)),
    replay,
  };
}

function parseReplayChunkComment(body) {
  const match = body.match(/Replay Part\s+([0-9]+)\/([0-9]+)[\s\S]*?```json\s*([\s\S]*?)```/i);
  if (!match) return null;
  return {
    index: Number(match[1]),
    total: Number(match[2]),
    chunk: match[3].trim(),
  };
}

async function fetchReplayForRecord(record) {
  if (record?.replay) return record.replay;
  if (!record?.replayParts || !record?.commentsUrl) return null;

  const comments = [];
  const cacheBuster = Date.now();

  for (let page = 1; page <= 10; page += 1) {
    const commentsUrl = new URL(record.commentsUrl);
    commentsUrl.searchParams.set("per_page", "100");
    commentsUrl.searchParams.set("page", String(page));
    commentsUrl.searchParams.set("_", String(cacheBuster));
    const response = await fetch(commentsUrl.toString(), { cache: "no-store" });
    if (!response.ok) throw new Error(`GitHub comments ${response.status}`);
    const pageComments = await response.json();
    comments.push(...pageComments);
    if (pageComments.length < 100) break;
  }

  const chunks = comments
    .map((comment) => parseReplayChunkComment(comment.body || ""))
    .filter(Boolean)
    .sort((left, right) => left.index - right.index);

  if (!chunks.length || chunks.length < record.replayParts) return null;

  const replay = JSON.parse(chunks.map((chunk) => chunk.chunk).join(""));
  record.replay = replay;
  return replay;
}

async function fetchGlobalRecords() {
  try {
    const cacheBuster = Date.now();
    const issues = [];

    for (let page = 1; page <= 10; page += 1) {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=all&labels=${GLOBAL_RECORD_LABEL}&per_page=100&page=${page}&_=${cacheBuster}`,
        {
          cache: "no-store",
        }
      );
      if (!response.ok) throw new Error(`GitHub ${response.status}`);
      const pageIssues = await response.json();
      issues.push(...pageIssues);
      if (pageIssues.length < 100) break;
    }

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
      grouped[mode] = grouped[mode].slice(0, MAX_RECORDS_PER_MODE);
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
  if (demoMode || !attractDismissed || !gameState.over) return;
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

function closeInitialsEntry(options = {}) {
  const { discard = false } = options;
  initialsEntryState.active = false;
  initialsEntryState.letters = ["", "", ""];
  initialsEntryState.slot = 0;
  initialsEntryState.selectedIndex = 0;
  initialsEntryState.pendingScore = 0;
  initialsEntryElement.classList.add("hidden");
  if (discard) {
    recordSaved = true;
    setStatus("Anotacion cancelada.");
  }
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

  saveRecords(records.slice(0, MAX_RECORDS_PER_MODE));
  localStorage.setItem(PLAYER_INITIALS_KEY, initials);
  recordSaved = true;
  pendingGlobalRecord = {
    initials,
    mode: `${boardSize}x${boardSize}`,
    score: initialsEntryState.pendingScore,
    isoDate: now.toISOString(),
    displayDate,
    replay: replayPayload,
  };
  const currentTopScore = getTopScoreForMode(pendingGlobalRecord.mode);
  const isGlobalTopScore = pendingGlobalRecord.score > currentTopScore;
  closeInitialsEntry();
  renderRecords();
  setStatus(isGlobalTopScore ? "Nuevo record global." : "Record guardado.");
  playApplause();
  if (isGlobalTopScore && !globalRecordFanfarePlayed) {
    window.setTimeout(() => playGlobalRecordFanfare(), 900);
  }
  submitGlobalRecord();
}

function buildGlobalRecordIssueUrl() {
  if (!pendingGlobalRecord) return "";
  const title = `[Record] ${pendingGlobalRecord.initials} - ${pendingGlobalRecord.score} - ${pendingGlobalRecord.mode}`;
  const replayJson = pendingGlobalRecord.replay ? JSON.stringify(pendingGlobalRecord.replay) : "{}";
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
        const details = typeof errorPayload.details === "string"
          ? errorPayload.details.replace(/\s+/g, " ").slice(0, 180)
          : "";
        throw new Error([errorPayload.error || "No se pudo enviar el record", details].filter(Boolean).join(": "));
      }
      return response.json();
    })
    .then(() => {
      mergeGlobalRecordIntoCache(pendingGlobalRecord);
      renderGlobalRecords(globalRecordsCache);
      pendingGlobalRecord = null;
      setStatus("Record global enviado correctamente.");
      fetchGlobalRecords();
    })
    .catch((error) => {
      setStatus(`Error al enviar record: ${error.message}`);
    });
}

async function openReplayViewer(replay, record) {
  replayViewerElement.classList.remove("hidden");
  replayMetaElement.textContent = `${record.initials} | ${record.mode} | ${record.score} puntos | ${record.displayDate}`;
  if (!replay && record?.replayParts) {
    replayEmptyElement.textContent = "Cargando replay desde GitHub...";
    replayEmptyElement.classList.remove("hidden");
    replayControlsElement.classList.add("hidden");
    setStatus("Cargando replay...");
    try {
      replay = await fetchReplayForRecord(record);
    } catch (error) {
      replay = null;
      setStatus(`Error al cargar replay: ${error.message}`);
    }
  }
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
  setGameOverOverlay(false);
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
  replayModeLabelElement.textContent = "STOP";
  setReplayVisualState(false);
  updateReplayArrow("");
  const boardFrame = document.querySelector(".board-frame");
  boardFrame.classList.remove("is-replay", "replay-wipe");
  renderGameTimer();
  renderJournal();
}

function setReplayVisualState(active) {
  const boardFrame = document.querySelector(".board-frame");
  const sideActions = document.querySelector(".side-actions");
  boardFrame.classList.toggle("is-replay", active);
  sideActions?.classList.toggle("is-replay-mode", active);
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
  updateReplayArrow("");
  if (!replayResumeState) return;

  boardSize = replayResumeState.boardSize;
  boardSizeSelect.value = String(boardSize);
  gameState = cloneGameState(replayResumeState.gameState);
  nextTileId = replayResumeState.nextTileId;
  render();
  renderGameTimer();
  renderJournal();
  setStatus(replayResumeState.statusText);
  replayResumeState = null;
}

function updateReplayControls() {
  if (!replaySession) {
    replayProgressElement.textContent = "";
    replayPlayButton.textContent = "Play";
    replayModeLabelElement.textContent = "STOP";
    return;
  }

  const totalTurns = replaySession.replay.turns.length;
  replayProgressElement.textContent = `Paso ${replaySession.index} de ${totalTurns} | Puntuacion ${gameState.score}`;
  replayPlayButton.textContent = replaySession.playing ? "Pausa" : "Play";
  replayModeLabelElement.textContent = replaySession.playing ? "PLAY" : (replaySession.index >= totalTurns ? "END" : "PAUSE");
  replayFirstButton.disabled = replaySession.index === 0;
  replayPrevButton.disabled = replaySession.index === 0;
  replayNextButton.disabled = replaySession.index >= totalTurns;
  replayLastButton.disabled = replaySession.index >= totalTurns;
  renderJournal();

  const activeEntry = journalListElement.querySelector(".journal-entry.is-replay-active");
  if (activeEntry) {
    activeEntry.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function insertReplaySpawn(spawn) {
  const tile = createTile(spawn.value, spawn.row, spawn.col);
  tile.isNew = true;
  gameState.cells[spawn.row][spawn.col] = tile;
}

function replayMove(direction, spawn, options = {}) {
  const { animate = false } = options;
  const vectors = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
  };
  const [dr, dc] = vectors[direction];
  const traversed = getTraversal(direction);
  const mergedTargets = new Set();
  const mergeGhosts = [];
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
        if (animate) {
          mergeGhosts.push({
            fromRow: row,
            fromCol: col,
            toRow: target.row,
            toCol: target.col,
            value: tile.value,
          });
        }
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
  if (animate) {
    render();
    mergeGhosts.forEach((ghost) => createMergeGhost(ghost));
  }
}

function initializeReplayBoard(replay) {
  gameState = createEmptyState();
  gameState.score = 0;
  gameState.over = true;
  gameState.cells = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  nextTileId = 0;
  replay.start.forEach((spawn) => insertReplaySpawn(spawn));
}

function setReplayToIndex(index) {
  if (!replaySession || !replayMode) return;

  const boundedIndex = Math.max(0, Math.min(index, replaySession.replay.turns.length));
  const currentIndex = replaySession.index || 0;

  if (boundedIndex === currentIndex) return;

  if (boundedIndex === currentIndex + 1) {
    const turn = replaySession.replay.turns[currentIndex];
    updateReplayArrow(turn.move);
    replayMove(turn.move, turn.spawn, { animate: true });
    replaySession.index = boundedIndex;
    updateReplayControls();
    if (boundedIndex >= replaySession.replay.turns.length) {
      setStatus("Replay finalizada.");
    } else {
      setStatus(`Replay ${replaySession.replay.mode}: paso ${boundedIndex} de ${replaySession.replay.turns.length}.`);
    }
    return;
  }

  initializeReplayBoard(replaySession.replay);
  for (let turnIndex = 0; turnIndex < boundedIndex; turnIndex += 1) {
    const turn = replaySession.replay.turns[turnIndex];
    replayMove(turn.move, turn.spawn);
  }
  render();
  replaySession.index = boundedIndex;
  const currentTurn = boundedIndex > 0 ? replaySession.replay.turns[boundedIndex - 1] : null;
  updateReplayArrow(currentTurn?.move || "");
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

  const nextTurn = replaySession.replay.turns[replaySession.index];
  updateReplayArrow(nextTurn?.move || "");

  replayTimer = window.setTimeout(() => {
    if (!replaySession || !replayMode) return;
    setReplayToIndex(replaySession.index + 1);
    replayTimer = window.setTimeout(() => {
      scheduleReplayPlayback();
    }, Math.max(0, REPLAY_STEP_DELAY - REPLAY_ARROW_LEAD));
  }, REPLAY_ARROW_LEAD);
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
  stopHoleMode({ keepStatus: true });
  setGameOverOverlay(false);
  replayMode = true;
  renderGameTimer();
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
  initializeReplayBoard(replay);
  render();
  updateReplayArrow("");
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

function scheduleDemoMove() {
  if (!demoMode) return;
  if (demoTimer) window.clearTimeout(demoTimer);
  const demoSessionId = gameSessionId;
  demoTimer = window.setTimeout(() => {
    if (demoSessionId !== gameSessionId) return;
    if (!demoMode || isAnimating || replayMode || initialsEntryState.active) return;
    const directions = ["up", "right", "down", "left"].filter((direction) => canMoveInDirection(direction));
    if (!directions.length) {
      startGame({ demo: true });
      return;
    }
    const direction = directions[Math.floor(Math.random() * directions.length)];
    move(direction);
  }, 520);
}

function startAttractMode() {
  stopHoleMode({ keepStatus: true });
  attractDismissed = false;
  attractOverlayElement.classList.remove("hidden");
  startGame({ demo: true });
}

function startActualGame() {
  if (attractDismissed) return;
  attractDismissed = true;
  stopDemoMode();
  closeInitialsEntry({ discard: true });
  attractOverlayElement.classList.add("hidden");
  startGame();
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
  if (demoMode) return;
  if (recordSaved || gameState.score <= 0) return;
  if (!isRecordScore(gameState.score)) {
    recordSaved = true;
    return;
  }

  openInitialsEntry(gameState.score);
}

function finishGame() {
  if (demoMode) return;
  if (gameState.over || isAnimating || initialsEntryState.active) return;
  stopHoleMode({ keepStatus: true });
  gameState.over = true;
  renderGameTimer();
  setGameOverOverlay(true, "BY USER");
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

function canMoveInDirection(direction) {
  const vectors = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
  };
  const [dr, dc] = vectors[direction];

  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const tile = gameState.cells[row][col];
      if (!tile) continue;
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (!withinBounds(nextRow, nextCol)) continue;
      const target = gameState.cells[nextRow][nextCol];
      if (!target || target.value === tile.value) return true;
    }
  }

  return false;
}

function scheduleEpicEffect(tile) {
  tile.effectUntil = performance.now() + EFFECT_DURATION;
  window.setTimeout(() => {
    if (tile.effectUntil <= performance.now()) render();
  }, EFFECT_DURATION + 30);
}

function move(direction) {
  void unlockAudio();
  if (gameState.over || isAnimating || initialsEntryState.active || replayMode) {
    if (demoMode && gameState.over) scheduleDemoMove();
    return;
  }

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
    if (!demoMode) playBlockedSound();
    isAnimating = false;
    if (demoMode) scheduleDemoMove();
    if (holeMode) scheduleHoleMove();
    return;
  }

  render();
  mergeGhosts.forEach((ghost) => createMergeGhost(ghost));
  if (hadMerge && !demoMode) {
    playMergeSound(highestMerge);
    if (highestMerge >= 128) playFanfare128();
  } else if (!demoMode) {
    playMoveSound();
  }

  const moveSessionId = gameSessionId;
  window.setTimeout(() => {
    if (moveSessionId !== gameSessionId) return;
    const spawnedTile = addRandomTile();
    if (currentReplay && spawnedTile) {
      currentReplay.turns.push({
        move: direction,
        spawn: spawnedTile,
        atMs: Date.now() - Date.parse(currentReplay.startedAt),
      });
    }
    render();
    maybeCelebrateLiveGlobalRecord();
    pushHistoryEntry(direction);

    epicBursts.forEach((entry) => createEpicBurst(entry.row, entry.col, entry.value));
    epicBursts
      .filter((entry) => entry.value > 64)
      .forEach((entry) => addJournalEntry(entry.value, entry.row, entry.col));

    if (!gameState.won && hasTileAtLeast(2048)) {
      gameState.won = true;
      setStatus(demoMode ? "MODO DEMO" : "Llegaste a 2048. Puedes seguir jugando.");
    } else if (!canMove()) {
      gameState.over = true;
      stopHoleMode({ keepStatus: true });
      renderGameTimer();
      if (!demoMode) {
        setGameOverOverlay(true, "BY MACHINE");
        maybePersistCurrentScore();
        setStatus("No quedan movimientos. Pulsa Nueva partida.");
      } else {
        setStatus("MODO DEMO");
        startGame({ demo: true });
        return;
      }
    } else {
      setStatus(demoMode ? "MODO DEMO" : holeMode ? "MODO H.O.L.E. Pulsa Espacio para parar." : "");
    }
    isAnimating = false;
    if (demoMode) scheduleDemoMove();
    if (holeMode) scheduleHoleMove();
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
  if (!audioEnabled) return null;
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
  if (!audioEnabled) return;
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

function playApplause() {
  for (let index = 0; index < 18; index += 1) {
    const burstAt = index * 0.055;
    const base = 180 + Math.random() * 420;
    playTone({
      frequency: base,
      duration: 0.045 + Math.random() * 0.03,
      type: index % 2 === 0 ? "square" : "triangle",
      volume: 0.028,
      when: burstAt,
      slideTo: base * (0.78 + Math.random() * 0.18),
    });
  }
}

function playGlobalRecordFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
  notes.forEach((note, index) => {
    playTone({
      frequency: note,
      duration: 0.24,
      type: index < 4 ? "triangle" : "square",
      volume: 0.12,
      when: index * 0.14,
    });
  });
  playTone({ frequency: 783.99, duration: 0.5, type: "sine", volume: 0.08, when: 0.92, slideTo: 1046.5 });
}

function playTimeMilestoneSound() {
  const notes = [392, 523.25, 659.25, 783.99];
  notes.forEach((note, index) => {
    playTone({
      frequency: note,
      duration: 0.18,
      type: index % 2 === 0 ? "triangle" : "square",
      volume: 0.08,
      when: index * 0.08,
      slideTo: note * 1.03,
    });
  });
}

function queueMove(direction) {
  if (!audioEnabled) {
    move(direction);
    return;
  }
  unlockAudio().catch(() => null).finally(() => move(direction));
}

function toggleAudioEnabled() {
  audioEnabled = !audioEnabled;
  localStorage.setItem(AUDIO_ENABLED_KEY, String(audioEnabled));
  updateAudioToggleButton();

  if (audioEnabled) {
    void unlockAudio();
    setStatus("Sonido activado.");
  } else {
    if (audioContext?.state === "running") {
      audioContext.suspend().catch(() => {});
    }
    audioUnlocked = false;
    setStatus("Sonido desactivado.");
  }
}

function handleKeydown(event) {
  if (holeMode && event.key === " ") {
    event.preventDefault();
    stopHoleMode();
    setStatus("MODO H.O.L.E. detenido.");
    return;
  }
  if (!attractDismissed && (event.key === " " || event.key === "Enter" || event.key === "Escape")) {
    event.preventDefault();
    startActualGame();
    return;
  }
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
  if (!direction && !event.repeat && !replayMode && !initialsEntryState.active) {
    const nextExpected = HOLE_SEQUENCE[holeSequenceProgress];
    const pressed = event.key?.toLowerCase?.() || "";
    if (pressed === nextExpected) {
      holeSequenceProgress += 1;
      if (holeSequenceProgress === HOLE_SEQUENCE.length) {
        event.preventDefault();
        startHoleMode();
      }
    } else if (pressed === HOLE_SEQUENCE[0]) {
      holeSequenceProgress = 1;
    } else {
      holeSequenceProgress = 0;
    }
  }
  if (!direction) return;
  if (holeMode) {
    event.preventDefault();
    return;
  }
  if (!attractDismissed) {
    event.preventDefault();
    startActualGame();
    return;
  }
  event.preventDefault();
  queueMove(direction);
}

function handleTouchStart(event) {
  if (!attractDismissed) startActualGame();
  void unlockAudio();
  const touch = event.changedTouches[0];
  touchStart = { x: touch.clientX, y: touch.clientY };
}

function handleTouchEnd(event) {
  if (!touchStart) return;
  if (holeMode) {
    touchStart = null;
    return;
  }
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

window.addEventListener("pointerdown", () => {
  if (audioEnabled) void unlockAudio();
});
window.addEventListener("visibilitychange", () => {
  if (audioEnabled && document.visibilityState === "visible") {
    void unlockAudio();
  }
  if (document.visibilityState === "visible" && recordsPanelOpen) {
    fetchGlobalRecords();
  }
});
restartButton.addEventListener("click", () => {
  if (audioEnabled) void unlockAudio();
  attractDismissed = true;
  attractOverlayElement.classList.add("hidden");
  startGame();
});
boardSizeSelect.addEventListener("click", () => { if (audioEnabled) void unlockAudio(); });
boardSizeSelect.addEventListener("change", () => {
  if (audioEnabled) void unlockAudio();
  attractDismissed = true;
  attractOverlayElement.classList.add("hidden");
  startGame();
});
finishButton.addEventListener("click", finishGame);
audioToggleButton.addEventListener("click", toggleAudioEnabled);
undoToggleButton.addEventListener("click", () => setUndoPanelOpen(!undoPanelOpen));
closeUndoButton.addEventListener("click", () => setUndoPanelOpen(false));
startAttractButton.addEventListener("click", startActualGame);
themeSelect.addEventListener("change", (event) => applyTheme(event.target.value));
letterUpButton.addEventListener("pointerdown", () => { if (audioEnabled) void unlockAudio(); });
letterDownButton.addEventListener("pointerdown", () => { if (audioEnabled) void unlockAudio(); });
selectLetterButton.addEventListener("pointerdown", () => { if (audioEnabled) void unlockAudio(); });
deleteLetterButton.addEventListener("pointerdown", () => { if (audioEnabled) void unlockAudio(); });
letterUpButton.addEventListener("click", () => shiftCurrentLetter(-1));
letterDownButton.addEventListener("click", () => shiftCurrentLetter(1));
selectLetterButton.addEventListener("click", commitCurrentLetter);
deleteLetterButton.addEventListener("click", deleteLastLetter);
closeInitialsButton.addEventListener("click", () => closeInitialsEntry({ discard: true }));
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
document.querySelectorAll(".records-mode-toggle").forEach((button) => {
  button.addEventListener("click", () => setExpandedRecordsMode(button.dataset.mode));
});
document.querySelectorAll(".records-mode-close").forEach((button) => {
  button.addEventListener("click", () => setExpandedRecordsMode(null));
});
window.addEventListener("keydown", handleKeydown);
boardElement.addEventListener("touchstart", handleTouchStart, { passive: true });
boardElement.addEventListener("touchend", handleTouchEnd, { passive: true });
window.addEventListener("resize", render);

buildGrid();
applyTheme(theme);
updateAudioToggleButton();
setRecordsPanelOpen(false);
closeInitialsEntry();
startAttractMode();

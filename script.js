const MOVE_DURATION = 210;
const EFFECT_DURATION = 5000;
const STORAGE_PREFIX = "smooth-2048-best-score";
const RECORDS_PREFIX = "smooth-2048-records";
const PLAYER_INITIALS_KEY = "smooth-2048-player-initials";
const GITHUB_OWNER = "FDAHNet";
const GITHUB_REPO = "2048";
const GLOBAL_RECORD_LABEL = "record";

const boardElement = document.getElementById("board");
const fxLayer = document.getElementById("fx-layer");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restart-button");
const finishButton = document.getElementById("finish-button");
const boardSizeSelect = document.getElementById("board-size");
const recordsListElement = document.getElementById("records-list");
const globalRecordsListElement = document.getElementById("global-records-list");
const submitGlobalRecordButton = document.getElementById("submit-global-record-button");
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
let recordSaved = false;
let pendingGlobalRecord = null;
const ARCADE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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
  gameState.cells[row][col] = createTile(value, row, col);
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
  maybePersistCurrentScore();
  boardSize = Number(boardSizeSelect.value);
  nextTileId = 0;
  tileMap.forEach((element) => element.remove());
  tileMap.clear();
  fxLayer.innerHTML = "";
  isAnimating = false;
  recordSaved = false;
  pendingGlobalRecord = null;
  submitGlobalRecordButton.classList.add("hidden");
  gameState = createEmptyState();
  buildGrid();
  addRandomTile();
  addRandomTile();
  render();
  renderRecords();
  renderGlobalRecordsLoading();
  fetchGlobalRecords();
  setStatus("");
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

    row.append(initials, mode, score, timestamp);
    recordsListElement.appendChild(row);
  });
}

function renderGlobalRecordsLoading() {
  globalRecordsListElement.innerHTML = "";
  const row = document.createElement("div");
  row.className = "records-row records-row-empty";
  row.textContent = "Cargando records globales...";
  globalRecordsListElement.appendChild(row);
}

function renderGlobalRecordsError() {
  globalRecordsListElement.innerHTML = "";
  const row = document.createElement("div");
  row.className = "records-row records-row-empty";
  row.textContent = "No se pudieron cargar los records globales de GitHub.";
  globalRecordsListElement.appendChild(row);
}

function renderGlobalRecords(records) {
  globalRecordsListElement.innerHTML = "";

  if (!records.length) {
    const row = document.createElement("div");
    row.className = "records-row records-row-empty";
    row.textContent = "Todavia no hay records globales enviados.";
    globalRecordsListElement.appendChild(row);
    return;
  }

  records.forEach((record) => {
    const row = document.createElement("div");
    row.className = "records-row";

    const initials = document.createElement("span");
    initials.textContent = record.initials;

    const mode = document.createElement("span");
    mode.textContent = record.mode;

    const score = document.createElement("span");
    score.textContent = String(record.score);

    const timestamp = document.createElement("span");
    timestamp.textContent = record.displayDate;

    row.append(initials, mode, score, timestamp);
    globalRecordsListElement.appendChild(row);
  });
}

function parseGlobalRecord(issue) {
  const body = issue.body || "";
  const initials = body.match(/Initials:\s*([A-Z]{3})/i)?.[1]?.toUpperCase();
  const mode = body.match(/Mode:\s*([0-9]+x[0-9]+)/i)?.[1];
  const scoreText = body.match(/Score:\s*([0-9]+)/i)?.[1];
  const score = Number(scoreText);

  if (!initials || !mode || !Number.isFinite(score)) return null;

  return {
    initials,
    mode,
    score,
    isoDate: issue.created_at,
    displayDate: new Intl.DateTimeFormat("es-ES", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(issue.created_at)),
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
      .filter(Boolean)
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return left.isoDate.localeCompare(right.isoDate);
      })
      .slice(0, 10);
    renderGlobalRecords(records);
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

  const records = loadRecords();
  records.push({
    initials,
    score: initialsEntryState.pendingScore,
    mode: `${boardSize}x${boardSize}`,
    isoDate: now.toISOString(),
    displayDate,
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
  };
  submitGlobalRecordButton.classList.remove("hidden");
  closeInitialsEntry();
  renderRecords();
  setStatus("Record guardado.");
}

function buildGlobalRecordIssueUrl() {
  if (!pendingGlobalRecord) return "";
  const title = `[Record] ${pendingGlobalRecord.initials} - ${pendingGlobalRecord.score} - ${pendingGlobalRecord.mode}`;
  const body = [
    "New global score submission",
    "",
    `Initials: ${pendingGlobalRecord.initials}`,
    `Mode: ${pendingGlobalRecord.mode}`,
    `Score: ${pendingGlobalRecord.score}`,
    `Date: ${pendingGlobalRecord.isoDate}`,
  ].join("\n");

  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new?labels=${encodeURIComponent(GLOBAL_RECORD_LABEL)}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

function submitGlobalRecord() {
  if (!pendingGlobalRecord) return;
  window.open(buildGlobalRecordIssueUrl(), "_blank", "noopener");
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
  if (gameState.over || isAnimating || initialsEntryState.active) return;

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
    addRandomTile();
    render();

    epicBursts.forEach((entry) => createEpicBurst(entry.row, entry.col, entry.value));

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
  }
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function playTone({ frequency, duration, type = "sine", volume = 0.05, when = 0, slideTo = null }) {
  const context = ensureAudio();
  if (!context) return;

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
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
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

function handleKeydown(event) {
  ensureAudio();
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
  move(direction);
}

function handleTouchStart(event) {
  ensureAudio();
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
    move(dx > 0 ? "right" : "left");
  } else {
    move(dy > 0 ? "down" : "up");
  }
}

window.addEventListener("pointerdown", ensureAudio);
restartButton.addEventListener("click", () => {
  ensureAudio();
  startGame();
});
boardSizeSelect.addEventListener("click", ensureAudio);
boardSizeSelect.addEventListener("change", () => {
  ensureAudio();
  startGame();
});
finishButton.addEventListener("click", finishGame);
letterUpButton.addEventListener("click", () => shiftCurrentLetter(-1));
letterDownButton.addEventListener("click", () => shiftCurrentLetter(1));
selectLetterButton.addEventListener("click", commitCurrentLetter);
deleteLetterButton.addEventListener("click", deleteLastLetter);
submitGlobalRecordButton.addEventListener("click", submitGlobalRecord);
window.addEventListener("keydown", handleKeydown);
boardElement.addEventListener("touchstart", handleTouchStart, { passive: true });
boardElement.addEventListener("touchend", handleTouchEnd, { passive: true });
window.addEventListener("resize", render);

buildGrid();
startGame();

const MOVE_DURATION = 210;
const REPLAY_MOVE_DURATION = 460;
const REPLAY_STEP_DELAY = 1180;
const REPLAY_ARROW_LEAD = 520;
const EFFECT_DURATION = 5000;
const MAX_SAFE_SLOT_REPLAY_TURNS = 120000;
const MAX_SAFE_RECORD_REPLAY_TURNS = 500000;
const MAX_SAFE_RECORD_REPLAY_BYTES = 3_200_000;
const MAX_WORKER_DIRECT_REPLAY_BYTES = 2_200_000;
const REMOTE_REPLAY_CHUNK_BYTES = 96_000;
const MAX_REMOTE_REPLAY_PARTS = 4_000;
const REMOTE_REPLAY_UPLOAD_RETRIES = 3;
const STORAGE_PREFIX = "smooth-2048-best-score";
const RECORDS_PREFIX = "smooth-2048-records";
const MAX_RECORDS_PER_MODE = 10;
const PLAYER_INITIALS_KEY = "smooth-2048-player-initials";
const AUDIO_ENABLED_KEY = "smooth-2048-audio-enabled";
const MUSIC_ENABLED_KEY = "smooth-2048-music-enabled";
const MUSIC_VOLUME_KEY = "smooth-2048-music-volume";
const MUSIC_TRACK_INDEX_KEY = "smooth-2048-music-track-index";
const MUSIC_BASE_URL = "https://datos.us/c/2048-music/";
const THEME_KEY = "smooth-2048-theme";
const SESSION_SNAPSHOT_KEY = "smooth-2048-session-snapshot";
const SAVE_SLOTS_KEY = "smooth-2048-save-slots";
const ADVANCED_MODE_KEY = "smooth-2048-advanced-mode";
const ADVANCED_PLAYER_AUTH_KEY = "smooth-2048-advanced-player-auth";
const ADVANCED_BET_DRAFT_KEY = "smooth-2048-advanced-bet-draft";
const GITHUB_OWNER = "FDAHNet";
const GITHUB_REPO = "2048";
const GLOBAL_RECORD_LABEL = "record";
const WORKER_API_URL = "https://angeloso-2048-records.mcdrer.workers.dev";
const HOLE_SEQUENCE = ["h", "o", "l", "e"];
const CTRL_SEQUENCE = ["c", "t", "r", "l"];
const ADMIN_SESSION_TOKEN_KEY = "smooth-2048-admin-session-token";
const HOLE_DIRECTIONS = ["up", "left", "right", "down"];
const AUTOSAVE_INTERVAL_MS = 30 * 60 * 1000;
const INITIALS_TIMEOUT_MS = 60 * 1000;
const RECORD_CATEGORIES = ["normal", "hole"];
const RECORD_CATEGORY_LABELS = {
  normal: "Normal",
  hole: "H.O.L.E.",
};
const DEFAULT_ADVANCED_CREDITS = 1000;
const HOLE_SPEED_OPTIONS = [1, 2, 4, 8, 16, 32];
const ADVANCED_BET_STAKES = [0, 5, 10, 20, 50];
const MUSIC_TRACK_GAP_MS = 5000;
const MUSIC_TRACKS = [
  { name: "Magical Sound Shower", file: "01. Magical Sound Shower.mp3" },
  { name: "Splash Wave", file: "02. Splash Wave.mp3" },
  { name: "Passing Breeze", file: "03. Passing Breeze.mp3" },
  { name: "Last Wave", file: "04. Last Wave.mp3" },
  { name: "Step on Beat", file: "05. Step on Beat.mp3" },
];
const ADVANCED_BET_RULES = [
  { value: "reasonUser", label: "Finaliza BY USER" },
  { value: "highestTileGte", label: "Ficha maxima >= objetivo" },
  { value: "durationMinutesGte", label: "Duracion >= objetivo min" },
  { value: "scoreGte", label: "Puntuacion >= objetivo" },
  { value: "movesGte", label: "Jugadas >= objetivo" },
  { value: "holeUsed", label: "Se usa H.O.L.E." },
];
const ADVANCED_BET_RULE_HINTS = {
  reasonUser: {
    help: "No necesita objetivo. La opcion A gana si la partida termina con BY USER.",
    placeholder: "No hace falta",
  },
  highestTileGte: {
    help: "Pon una ficha objetivo, por ejemplo 256, 1024 o 4096.",
    placeholder: "Ej. 256",
  },
  durationMinutesGte: {
    help: "Pon minutos enteros. Ejemplo: 5 significa cinco minutos o mas.",
    placeholder: "Ej. 5",
  },
  scoreGte: {
    help: "Pon la puntuacion minima que debe alcanzarse.",
    placeholder: "Ej. 10000",
  },
  movesGte: {
    help: "Pon el numero minimo de jugadas necesarias.",
    placeholder: "Ej. 200",
  },
  holeUsed: {
    help: "No necesita objetivo. La opcion A gana si se activa H.O.L.E. durante la partida.",
    placeholder: "No hace falta",
  },
};
const DEFAULT_ADVANCED_BET_DEFINITIONS = [
  {
    id: "endReason",
    label: "Final de partida",
    description: "Adivina si termina por tu boton o por la maquina.",
    multiplier: 2.1,
    optionA: "BY USER",
    optionB: "BY MACHINE",
    rule: "reasonUser",
    target: "",
    active: true,
  },
  {
    id: "maxTile256",
    label: "Ficha 256",
    description: "Apuesta si la partida llega a una ficha 256 o mayor.",
    multiplier: 2.1,
    optionA: "256 o mas",
    optionB: "Menos de 256",
    rule: "highestTileGte",
    target: "256",
    active: true,
  },
  {
    id: "duration5",
    label: "Partida larga",
    description: "Predice si la partida dura cinco minutos o mas.",
    multiplier: 2.4,
    optionA: "05:00 o mas",
    optionB: "Menos de 05:00",
    rule: "durationMinutesGte",
    target: "5",
    active: true,
  },
];
const COMMENTARY_BANK = {
  kickoff: [
    "Arranca la partida en {mode} y {player} ya pisa el tablero con decision.",
    "Suena el silbato digital: {player} mueve la primera ficha.",
    "Comienza el duelo y {player} sale sin especular.",
    "El publico virtual se pone en pie: empieza {player}.",
    "Ya rueda el 2048 y {player} busca abrir huecos desde el arranque.",
    "Primeras jugadas para {player} en este tablero {mode}.",
    "Se abre el telon arcade: {player} entra en escena.",
    "Todo listo, tablero limpio y {player} al mando.",
    "Empieza el choque y {player} quiere imponer ritmo desde ya.",
    "Se pone en marcha el sistema Angeloso con {player} en control.",
    "Balon al centro, fichas al aire: comienza {player}.",
    "Primer compas de la partida y {player} ya tantea el terreno.",
    "Rueda el marcador, {player} toma posiciones.",
    "Arranque serio de {player} sobre la mesa {mode}.",
    "Ya hay movimiento en cabina: {player} inicia la ofensiva.",
    "La partida echa a andar y {player} busca orden desde el inicio.",
    "Todo preparado, primera maniobra de {player}.",
    "Se encienden los focos y {player} comienza su ruta al record.",
    "Comienza el partido de las fusiones: {player} entra en juego.",
    "Ya esta en marcha la partida y {player} no quiere perder ni un turno."
  ],
  pressure: [
    "{player} sigue empujando, ya van {moves} jugadas de presion constante.",
    "Partido largo y serio de {player}, ni un hueco regalado.",
    "{player} cocina la posicion con paciencia de veterano.",
    "Se nota la tension, pero {player} mantiene la cabeza fria.",
    "{player} mueve con calma, esperando la grieta correcta.",
    "No hay pausa en la cabina: {player} sigue construyendo.",
    "{player} mantiene la estructura y no pierde el compas.",
    "La partida entra en fase tactica y {player} no pestañea.",
    "{player} aprieta sin romper el plan de juego.",
    "Hay partido, y {player} lo está leyendo bastante bien.",
    "Sigue la batalla posicional, {player} no regala columnas.",
    "{player} aguanta la presion y sigue ordenando el tablero.",
    "Cada movimiento pesa, pero {player} responde con temple.",
    "{player} sigue trabajando la jugada como quien mueve en el minuto 88.",
    "No hay fuegos artificiales ahora, solo control de {player}.",
    "Se juega fino en esta fase y {player} lo sabe.",
    "{player} baja pulsaciones, limpia el tablero y sigue.",
    "El partido se cierra por momentos, pero {player} encuentra aire.",
    "{player} esta en modo gestion, esperando la siguiente explosion.",
    "Sigue el esfuerzo silencioso de {player}, que no suelta la partida."
  ],
  score: [
    "{player} supera los {score} puntos y sigue con margen.",
    "Atencion al marcador: {player} ya pisa los {score} puntos.",
    "{player} suma y suma, el tanteo ya se va a {score}.",
    "El casillero sube con fuerza: {player} alcanza {score} puntos.",
    "{player} cruza otro liston, ya van {score} puntos en la libreta.",
    "Marcador creciente para {player}: {score} puntos y contando.",
    "{player} mete otra marcha en el tanteo, {score} puntos.",
    "La puntuacion responde al trabajo de {player}: {score}.",
    "{player} encuentra premio en el marcador, ya son {score} puntos.",
    "Subidon en la tabla: {player} se instala en {score} puntos.",
    "{player} sigue llenando el marcador, ya ronda los {score}.",
    "Se enciende el contador: {player} alcanza {score} puntos.",
    "{player} mete otro parcial notable y pone {score} en el marcador.",
    "El partido tambien se gana por puntos, y {player} ya tiene {score}.",
    "{player} pasa otra frontera estadistica: {score} puntos.",
    "El tanteo sube para {player}, que ya firma {score}.",
    "{player} consolida una cifra seria: {score} puntos.",
    "La libreta del comentarista apunta {score} para {player}.",
    "{player} mantiene la cadencia y eleva la cuenta hasta {score}.",
    "Ojo al panel: {player} ya mueve la partida en {score} puntos."
  ],
  tile128: [
    "{player} encuentra un {value} y el publico empieza a creer.",
    "Ya aparece un {value} para {player}; primer golpe serio.",
    "{player} firma un {value} que cambia el tono del partido.",
    "Atencion, {player} acaba de levantar un {value}.",
    "Se abre el tablero para {player} con ese {value}.",
    "{player} conecta una fusion buena y sube hasta {value}.",
    "Primer gran aviso de {player}: aparece un {value}.",
    "{player} ya planta un {value} sobre la mesa.",
    "Se empieza a cocinar algo grande: {player} saca un {value}.",
    "{player} rompe la barrera media con un {value}.",
    "Buen giro de guion: {player} encuentra un {value}.",
    "Ese {value} de {player} ya da otro aire a la partida.",
    "Sube el techo de {player}: ya hay un {value}.",
    "{player} firma una maniobra limpia y deja un {value}.",
    "Primer bloque de respeto para {player}: {value}.",
    "{player} coloca un {value} y manda un mensaje claro.",
    "La grada virtual reacciona: {player} ya tiene un {value}.",
    "{player} empieza a enseñar los dientes con ese {value}.",
    "Ya hay una pieza seria para {player}, concretamente un {value}.",
    "{player} mete el primer zarpazo grande: {value}."
  ],
  tile256: [
    "{player} acaba de lograr un {value}, y esto ya va en serio.",
    "Atencion porque {player} firma un {value} de mucho peso.",
    "Ese {value} de {player} ya huele a noche grande.",
    "{player} sube un escalon clave con un {value}.",
    "Se encienden las luces largas: {player} alcanza el {value}.",
    "{player} hace despegar la partida con un {value}.",
    "Ya tenemos un {value} en manos de {player}.",
    "{player} pisa fuerte y deja un {value} en tablero.",
    "Momento importante: {player} levanta un {value}.",
    "{player} convierte una buena secuencia en un {value}.",
    "Ese {value} de {player} cambia bastante el paisaje.",
    "{player} da un golpe de autoridad con un {value}.",
    "Aparece un {value} y {player} gana voz en el partido.",
    "{player} ya juega con una ficha de alto voltaje: {value}.",
    "El tablero se inclina un poco hacia {player} con ese {value}.",
    "{player} firma un {value} que obliga a mirar el marcador.",
    "Buen momento para {player}, que ya presume de {value}.",
    "{player} levanta un {value} y la grada se viene arriba.",
    "Ya hay pieza premium para {player}: {value}.",
    "{player} encuentra oro puro en forma de {value}."
  ],
  tile512: [
    "{player} coloca un {value} y el partido cambia de categoria.",
    "Ya tenemos un {value}; lo de {player} va muy en serio.",
    "{player} firma un {value} de quilates mayores.",
    "Explota la cabina: {player} acaba de levantar un {value}.",
    "Ese {value} de {player} ya mete miedo en la tabla.",
    "{player} rompe otra barrera y aparece el {value}.",
    "El tablero aplaude: {player} ya tiene un {value}.",
    "{player} transforma paciencia en un {value} monumental.",
    "Hay salto de calidad: {player} conecta un {value}.",
    "{player} clava un {value} que dispara las expectativas.",
    "Tremendo paso adelante de {player} con ese {value}.",
    "{player} pone una ficha {value} y ahora el techo sube mucho.",
    "Atencion al dato: {player} ya controla un {value}.",
    "{player} lanza un aviso potente con ese {value}.",
    "La partida toma otro vuelo tras el {value} de {player}.",
    "Ese {value} de {player} puede marcar un antes y un despues.",
    "{player} ya juega palabras mayores: {value}.",
    "Se canta gol arcade en la grada: {player} sube a {value}.",
    "{player} alcanza el {value} y entra en la zona noble.",
    "Partidazo de {player}, que ya ha fabricado un {value}."
  ],
  tile1024: [
    "{player} roza la leyenda con un {value}.",
    "Aparece un {value} y esto ya es terreno de elite para {player}.",
    "{player} acaba de clavar un {value} historico.",
    "Que barbaridad de {player}: ya hay un {value} en juego.",
    "Se abre la puerta grande, {player} alcanza el {value}.",
    "{player} se asoma al cielo del tablero con un {value}.",
    "Momento de oro: {player} firma un {value} monumental.",
    "{player} empuja la partida a otra dimension con un {value}.",
    "Tremendo golpe de escena, {player} llega al {value}.",
    "Esto ya es otra cosa: {player} levanta un {value}.",
    "{player} acaricia la gloria con ese {value}.",
    "Un {value} para {player}; el publico no se lo cree.",
    "{player} construye una pieza de museo: {value}.",
    "Ya está aqui el {value}, y lo firma {player}.",
    "{player} mete la partida en zona legendaria con un {value}.",
    "El tablero se rinde por un instante ante el {value} de {player}.",
    "{player} pone un {value} y cambia la historia del turno.",
    "Nivel altisimo de {player}, que ya fabrica un {value}.",
    "Hay aroma de record cuando {player} alcanza el {value}.",
    "{player} hace temblar la mesa con un {value}."
  ],
  tile2048: [
    "{player} acaba de lograr un {value}; esto es palabra mayor.",
    "Se canta la gloria arcade: {player} llega al {value}.",
    "Objetivo cumplido para {player}, ya aparece el {value}.",
    "{player} rompe la puerta principal con un {value}.",
    "El estadio digital se viene abajo: {player} consigue el {value}.",
    "Ya esta aqui el {value}, firmado por {player}.",
    "{player} alcanza el {value} y entra en el cuadro de honor.",
    "Momento historico: {player} planta un {value} en tablero.",
    "La partida ya es memorable: {player} llega al {value}.",
    "{player} toca techo clasico y lo hace con un {value}.",
    "Se desata la fiesta arcade: {player} corona el {value}.",
    "{player} alcanza la cifra sagrada, el {value}.",
    "Pieza de leyenda para {player}: {value}.",
    "{player} firma el gran numero del juego: {value}.",
    "Eso no se ve todos los dias: {player} logra un {value}.",
    "{player} ya tiene el {value}; noche grande en cabina.",
    "Se escribe una pagina dorada, {player} sube a {value}.",
    "{player} encuentra la cima tradicional del tablero: {value}.",
    "Gol de museo en Angeloso: {player} fabrica un {value}.",
    "{player} completa el gran hito con un {value}."
  ],
  record: [
    "{player} se pone por delante en la pelea por el record de {mode}.",
    "Nuevo lider provisional en {mode}: {player}.",
    "{player} está batiendo el record conocido de esta modalidad.",
    "Ojo porque {player} ya manda en la tabla de {mode}.",
    "El record de {mode} se tambalea con {player}.",
    "{player} toma la pole del ranking y no mira atras.",
    "Cambio de liderato: {player} se adueña del record.",
    "{player} firma una marca de referencia en {mode}.",
    "Se mueve la historia del ranking gracias a {player}.",
    "{player} ya juega por encima del mejor registro conocido.",
    "Tenemos nuevo liston en {mode}, y lo pone {player}.",
    "{player} empuja el record a otra altura.",
    "El marcador de honor cambia de manos: manda {player}.",
    "{player} se instala en cabeza con una partida enorme.",
    "Atencion al archivo historico: {player} va primero.",
    "{player} pisa territorio de record y no afloja.",
    "La mejor marca de {mode} ahora mira a {player}.",
    "Se reescribe la parte alta del ranking con {player}.",
    "{player} acaba de poner un nuevo techo competitivo.",
    "Todo apunta a record grande para {player} en {mode}."
  ],
  gameOverUser: [
    "{player} baja la persiana por decision propia con {score} puntos.",
    "Final por mano del jugador: {player} cierra la partida en {score}.",
    "{player} decide cerrar el telon con {score} puntos en el bolsillo.",
    "Se acabo por decision de {player}; marcador final de {score}.",
    "{player} firma el cierre voluntario con {score} puntos.",
    "Punto final elegido por {player}, que se marcha con {score}.",
    "{player} da por buena la funcion y termina en {score}.",
    "Cierre controlado de {player}; el marcador se queda en {score}.",
    "{player} se lleva la partida hasta {score} y decide detenerla.",
    "Final voluntario para {player}, que baja el telon en {score} puntos."
  ],
  gameOverMachine: [
    "La maquina dice basta: {player} termina en {score} puntos.",
    "Sin mas movimientos para {player}; final en {score}.",
    "El tablero se cerró para {player}, que concluye con {score}.",
    "Se acabaron los caminos y {player} deja un {score} final.",
    "Final por atasco total: {player} cierra en {score} puntos.",
    "La defensa del tablero resiste y frena a {player} en {score}.",
    "No quedo aire para una mas; {player} termina con {score}.",
    "La partida se seca para {player}, marcador final {score}.",
    "No hubo salida posible y {player} se queda en {score} puntos.",
    "Cae el telon por falta de movimientos, con {player} cerrando en {score}."
  ],
  build: [
    "{player} ordena el tablero con mimo y prepara la siguiente fusion.",
    "Se ve plan de partido: {player} limpia carriles y guarda aire.",
    "{player} está construyendo por capas, sin perder la forma.",
    "Trabajo fino de {player}, que va colocando cada bloque en su sitio.",
    "{player} cocina una posicion muy seria y el tablero responde.",
    "Se nota la mano de {player}: todo empieza a quedar bien atado.",
    "{player} recompone la estructura y evita sustos por ahora.",
    "Hay oficio en la gestion de {player}, que mantiene las lineas vivas.",
    "{player} vuelve a poner orden y eso se nota en cada fila.",
    "Tablero bajo control para {player}, que rehace la casa pieza a pieza.",
    "{player} encuentra huecos de aire y recompone la jugada.",
    "Se ve un patron claro: {player} está construyendo con cabeza.",
    "{player} coloca una base muy limpia para atacar luego.",
    "Partido de paciencia y mano firme para {player}.",
    "{player} levanta un tablero muy sano, listo para apretar.",
    "Buena cocina de posicion de {player}, que no deja basura atras.",
    "{player} se dedica a ordenar y el tablero gana brillo.",
    "Cada gesto de {player} suma estructura para lo que viene.",
    "{player} amasa una posicion cada vez mas comoda.",
    "Se trabaja bien la geometria del tablero en manos de {player}."
  ],
  danger: [
    "Atencion, el tablero se aprieta y {player} necesita oxigeno.",
    "Momento delicado para {player}: hay poco margen y mucha tension.",
    "Se enciende la alarma suave, {player} juega una fase comprometida.",
    "{player} está en zona caliente y necesita una buena salida.",
    "El tablero aprieta por todos lados; turno muy serio para {player}.",
    "Cuidado porque {player} pisa ahora mismo terreno resbaladizo.",
    "Hay atasco parcial y {player} busca una rendija.",
    "Se estrecha el campo de juego para {player}.",
    "{player} entra en una secuencia de supervivencia pura.",
    "No sobra nada ahora mismo para {player}; toca hilar fino.",
    "El partido se le pone serio a {player} por un instante.",
    "{player} aguanta una embestida del tablero que no era pequena.",
    "Fase tensa de verdad, con {player} tratando de no romper el plan.",
    "Peligro contenido para {player}, que necesita una fusion limpia.",
    "{player} juega sobre el alambre, aunque aun con opciones.",
    "Se compacta el tablero y obliga a {player} a pensar mas.",
    "{player} entra en maniobra defensiva para salir con vida.",
    "La mesa se cierra y {player} necesita calidad, no solo ritmo.",
    "Ojo al atasco: {player} se juega una salida importante.",
    "Ahora mismo {player} está resistiendo un momento muy fino."
  ],
  comeback: [
    "{player} respira otra vez; parecia tenso y vuelve a mandar.",
    "Gran reaccion de {player}, que recupera espacio donde no lo habia.",
    "{player} se saca una salida buenisima y recompone el tablero.",
    "Vaya giro de guion: {player} limpia media mesa de un plumazo.",
    "{player} encuentra una ventana y la convierte en ventaja.",
    "Partido vivo otra vez gracias a la respuesta de {player}.",
    "{player} le da la vuelta al momento y vuelve a respirar.",
    "Eso cambia el panorama: {player} sale del atasco con autoridad.",
    "{player} resuelve una situacion fea con mucha categoria.",
    "Habia peligro y {player} lo transforma en impulso positivo.",
    "Magnifica correccion de {player}, que vuelve a abrir la partida.",
    "{player} salva la posicion y encima gana terreno.",
    "Recuperacion muy buena de {player}, que vuelve al mando tactico.",
    "{player} convierte la supervivencia en oportunidad.",
    "Se despeja el horizonte para {player} tras una gran maniobra.",
    "{player} se recompone con mucho oficio y vuelve a tener aire.",
    "Excelente lectura de {player}, que da la vuelta a una fase dura.",
    "{player} vuelve a poner la partida donde queria.",
    "Respuesta de peso de {player}; el tablero vuelve a obedecer.",
    "Se nota el cambio de inercia a favor de {player}."
  ],
  marathon: [
    "{player} alcanza ya los {minutes} minutos y esto sigue muy vivo.",
    "Partido largo en cabina: {player} ya supera los {minutes} minutos.",
    "{player} entra en tramo de fondo, con {minutes} minutos de juego.",
    "No es una partida, es una sesion seria: {minutes} minutos para {player}.",
    "{player} sigue de pie tras {minutes} minutos de batalla.",
    "Minuto {minutes} de juego para {player}, y aun con pulso competitivo.",
    "Ya van {minutes} minutos de tablero para {player}; resistencia total.",
    "{player} convierte esto en una maraton arcade de {minutes} minutos.",
    "Se acumula el kilometraje: {minutes} minutos con {player} al volante.",
    "{player} ya lleva {minutes} minutos empujando la partida sin bajar la guardia."
  ],
};

const boardElement = document.getElementById("board");
const fxLayer = document.getElementById("fx-layer");
const scoreElement = document.getElementById("score");
const creditsCardElement = document.getElementById("credits-card");
const creditsElement = document.getElementById("credits");
const advancedMiniToggleElement = document.getElementById("advanced-mini-toggle");
const advancedMiniExpandButton = document.getElementById("advanced-mini-expand-button");
const creditsPlayerElement = document.getElementById("credits-player");
const bestScoreElement = document.getElementById("best-score");
const bestScoreCardElement = document.getElementById("best-score-card");
const recordCardModalElement = document.getElementById("record-card-modal");
const recordCardModalContentElement = document.getElementById("record-card-modal-content");
const recordCardModalSubtitleElement = document.getElementById("record-card-modal-subtitle");
const closeRecordCardModalButton = document.getElementById("close-record-card-modal");
const statusElement = document.getElementById("status");
const holeSpeedControlElement = document.getElementById("hole-speed-control");
const holeSpeedSelect = document.getElementById("hole-speed-select");
const restartButton = document.getElementById("restart-button");
const finishButton = document.getElementById("finish-button");
const gameOverOverlayElement = document.getElementById("game-over-overlay");
const gameOverReasonElement = document.getElementById("game-over-reason");
const audioToggleButton = document.getElementById("audio-toggle-button");
const musicToggleButton = document.getElementById("music-toggle-button");
const musicPrevButton = document.getElementById("music-prev-button");
const musicNextButton = document.getElementById("music-next-button");
const musicVolumeSlider = document.getElementById("music-volume-slider");
const musicTrackNameElement = document.getElementById("music-track-name");
const musicTrackTimerElement = document.getElementById("music-track-timer");
const undoToggleButton = document.getElementById("undo-toggle-button");
const pauseButton = document.getElementById("pause-button");
const saveGameButton = document.getElementById("save-game-button");
const pauseOverlayElement = document.getElementById("pause-overlay");
const manualStartOverlayElement = document.getElementById("manual-start-overlay");
const undoPanelElement = document.getElementById("undo-panel");
const closeUndoButton = document.getElementById("close-undo-button");
const undoListElement = document.getElementById("undo-list");
const saveSlotsPanelElement = document.getElementById("save-slots-panel");
const closeSaveSlotsButton = document.getElementById("close-save-slots-button");
const saveSlotsListElement = document.getElementById("save-slots-list");
const replayIndicatorElement = document.getElementById("replay-indicator");
const boardSizeSelect = document.getElementById("board-size");
const boardCoordsTopElement = document.getElementById("board-coords-top");
const boardCoordsLeftElement = document.getElementById("board-coords-left");
const boardCoordsRightElement = document.getElementById("board-coords-right");
const advancedModeToggle = document.getElementById("advanced-mode-toggle");
const advancedToggleLabelElement = document.querySelector(".advanced-toggle");
const advancedToggleHintElement = document.querySelector(".advanced-toggle-hint");
const recordsPanelElement = document.getElementById("records-panel");
const toggleRecordsButton = document.getElementById("toggle-records-button");
const recordsMiniRankElement = document.getElementById("records-mini-rank");
const recordsMiniWindowElement = document.getElementById("records-mini-window");
const recordsMiniTrackElement = document.getElementById("records-mini-track");
const recordsMiniTextElement = document.getElementById("records-mini-text");
const globalRecordsGroupsElement = document.getElementById("global-records-groups");
const journalListElement = document.getElementById("journal-list");
const journalTitleElement = document.getElementById("journal-title");
const journalSubtitleElement = document.getElementById("journal-subtitle");
const gameTimerElement = document.getElementById("game-timer");
const gameMovesElement = document.getElementById("game-moves");
const showStatsButton = document.getElementById("show-stats-button");
const statsPanelElement = document.getElementById("stats-panel");
const statsPanelContentElement = document.getElementById("stats-panel-content");
const statsEyebrowElement = document.getElementById("stats-eyebrow");
const shareStatsButton = document.getElementById("share-stats-button");
const statsMilestonePopoverElement = document.getElementById("stats-milestone-popover");
const heroElement = document.querySelector(".hero");
const boardPanelElement = document.querySelector(".board-panel");

if (recordCardModalElement && bestScoreCardElement && recordCardModalElement.parentElement !== bestScoreCardElement) {
  bestScoreCardElement.appendChild(recordCardModalElement);
}
if (advancedToggleHintElement && advancedToggleHintElement.parentElement !== document.body) {
  document.body.appendChild(advancedToggleHintElement);
}
const closeStatsButton = document.getElementById("close-stats-button");
const adminPanelElement = document.getElementById("admin-panel");
const adminPinEntryElement = document.getElementById("admin-pin-entry");
const adminPinInput = document.getElementById("admin-pin-input");
const adminPinSubmitButton = document.getElementById("admin-pin-submit");
const adminPinCloseButton = document.getElementById("admin-pin-close");
const adminPinXButton = document.getElementById("admin-pin-x");
const adminPinHelpElement = document.getElementById("admin-pin-help");
const adminSummaryGridElement = document.getElementById("admin-summary-grid");
const adminRecordsBodyElement = document.getElementById("admin-records-body");
const adminUsersBodyElement = document.getElementById("admin-users-body");
const adminPanelStatusElement = document.getElementById("admin-panel-status");
const closeAdminButton = document.getElementById("close-admin-button");
const refreshAdminButton = document.getElementById("refresh-admin-button");
const adminUserPanelElement = document.getElementById("admin-user-panel");
const adminUserSummaryGridElement = document.getElementById("admin-user-summary-grid");
const adminUserStatusElement = document.getElementById("admin-user-status");
const adminUserLedgerBodyElement = document.getElementById("admin-user-ledger-body");
const adminUserRefreshButton = document.getElementById("admin-user-refresh-button");
const adminUserCloseButton = document.getElementById("admin-user-close-button");
const adminUserCreditDeltaInput = document.getElementById("admin-user-credit-delta");
const adminUserAddCreditsButton = document.getElementById("admin-user-add-credits-button");
const adminUserSubtractCreditsButton = document.getElementById("admin-user-subtract-credits-button");
const adminUserNewPinInput = document.getElementById("admin-user-new-pin");
const adminUserSetPinButton = document.getElementById("admin-user-set-pin-button");
const adminNewPinInput = document.getElementById("admin-new-pin-input");
const adminSavePinButton = document.getElementById("admin-save-pin-button");
const adminBetsBodyElement = document.getElementById("admin-bets-body");
const adminAddBetButton = document.getElementById("admin-add-bet-button");
const adminSaveBetsButton = document.getElementById("admin-save-bets-button");
const ledgerPanelElement = document.getElementById("ledger-panel");
const closeLedgerButton = document.getElementById("close-ledger-button");
const refreshLedgerButton = document.getElementById("refresh-ledger-button");
const ledgerSummaryGridElement = document.getElementById("ledger-summary-grid");
const ledgerBodyElement = document.getElementById("ledger-body");
const ledgerPanelCopyElement = document.getElementById("ledger-panel-copy");
const uiFxLayerElement = document.getElementById("ui-fx-layer");
const systemAnnouncementLayerElement = document.getElementById("system-announcement-layer");
const systemTickerTrackElement = document.getElementById("system-ticker-track");
const systemTickerTextElement = document.getElementById("system-ticker-text");
const starfieldElement = document.getElementById("starfield");
const attractOverlayElement = document.getElementById("attract-overlay");
const startAttractButton = document.getElementById("start-attract-button");
const themeSelect = document.getElementById("theme-select");
const advancedBetsPanelElement = document.getElementById("advanced-bets-panel");
const advancedBetsListElement = document.getElementById("advanced-bets-list");
const advancedBetsSummaryElement = document.getElementById("advanced-bets-summary");
const advancedBetsActiveElement = document.getElementById("advanced-bets-active");
const advancedBetsCloseButton = document.getElementById("advanced-bets-close-button");
const advancedBetsCollapseButton = document.getElementById("advanced-bets-collapse-button");
const advancedLogoutButton = document.getElementById("advanced-logout-button");
const clearAdvancedBetsButton = document.getElementById("clear-advanced-bets-button");
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
const initialsGridElement = document.getElementById("initials-grid");
const selectLetterButton = document.getElementById("select-letter-button");
const deleteLetterButton = document.getElementById("delete-letter-button");
const closeInitialsButton = document.getElementById("close-initials-button");
const initialsTimerElement = document.getElementById("initials-timer");
const advancedAuthEntryElement = document.getElementById("advanced-auth-entry");
const advancedAliasInput = document.getElementById("advanced-alias-input");
const advancedPinInput = document.getElementById("advanced-pin-input");
const advancedAuthSubmitButton = document.getElementById("advanced-auth-submit");
const advancedAuthCloseButton = document.getElementById("advanced-auth-close");
const advancedAuthXButton = document.getElementById("advanced-auth-x");

let boardSize = Number(boardSizeSelect.value);
let nextTileId = 1;
let tileMap = new Map();
let gameState = createEmptyState();
let isAnimating = false;
let touchStart = null;
let audioContext = null;
let audioMasterGain = null;
let audioSfxGain = null;
let audioMusicGain = null;
let audioUnlocked = false;
let audioEnabled = localStorage.getItem(AUDIO_ENABLED_KEY) === "true";
let musicEnabled = localStorage.getItem(MUSIC_ENABLED_KEY) === "true";
let musicVolume = Math.min(1, Math.max(0, Number(localStorage.getItem(MUSIC_VOLUME_KEY) || 0.28)));
let currentMusicTrackIndex = Math.max(0, Number(localStorage.getItem(MUSIC_TRACK_INDEX_KEY) || 0)) % MUSIC_TRACKS.length;
let musicLoopTimeout = null;
let musicTimerInterval = null;
let musicAudioElement = null;
let recordSaved = false;
let pendingGlobalRecord = null;
let advancedMode = false;
let advancedPlayerAuth = loadAdvancedPlayerAuth();
let advancedCredits = Number(advancedPlayerAuth?.credits ?? DEFAULT_ADVANCED_CREDITS);
let advancedBetDefinitions = cloneAdvancedBetDefinitions(DEFAULT_ADVANCED_BET_DEFINITIONS);
let advancedBetDraft = loadAdvancedBetDraft();
localStorage.setItem(ADVANCED_MODE_KEY, "false");
let activeAdvancedRound = null;
let advancedBetResultMessage = "";
let awaitingManualStart = false;
let advancedBetsVisible = false;
let advancedBetsCollapsed = false;
let journalEntries = [];
let currentReplay = null;
let recordsPanelOpen = false;
let recordsMiniTickerTimer = null;
let recordsMiniTickerEntries = [];
let recordsMiniTickerIndex = 0;
let recordsMiniTickerAnimation = null;
let recordCardModalOpen = false;
let expandedRecordsSort = "score";
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
let ctrlSequenceProgress = 0;
let holePreferredCorner = null;
let holeRunUsed = false;
let holeSpeedMultiplier = 1;
let attractDismissed = false;
let theme = localStorage.getItem(THEME_KEY) || "crt";
let gameSessionId = 0;
let expandedRecordsMode = null;
let replayArrowRotation = 0;
let statsPanelOpen = false;
let creditsDisplayValue = Number(advancedCredits || 0);
let creditsAnimationFrame = null;
let currentTickerMessage = "";
let currentTickerTone = "normal";
let commentaryLastIndexByCategory = {};
let lastCommentaryScoreBucket = 0;
let lastAmbientCommentaryMove = 0;
let lastCommentaryAt = 0;
let adminPanelOpen = false;
let adminPinGateOpen = false;
let adminPanelPausedGame = false;
let adminPanelPausedMusic = false;
let adminPanelLoading = false;
let adminSessionToken = sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY) || "";
let adminOverview = null;
let adminBetDefinitionsDraft = [];
let adminSectionOpen = {
  users: true,
  bets: true,
  records: true,
};
let adminUsersSort = {
  key: "credits",
  direction: "desc",
};
let adminRecordsSort = {
  key: "score",
  direction: "desc",
};
let adminSelectedUserAlias = "";
let adminSelectedUserData = null;
let adminUserLoading = false;
let ledgerPanelOpen = false;
let ledgerLoading = false;
let ledgerData = null;
let lastGameOverReason = "";
let globalRecordsCache = Object.fromEntries(
  ["4x4", "5x5", "6x6", "8x8", "16x16"].map((mode) => [
    mode,
    Object.fromEntries(RECORD_CATEGORIES.map((category) => [category, []])),
  ])
);
let globalRecordsLoaded = false;
let globalRecordFanfarePlayed = false;
let bestScoreBurstTimer = null;
let gameTimerStartedAt = 0;
let gameTimerInterval = null;
let lastTimerMilestone = 0;
let lastAutosaveMilestone = 0;
let gamePaused = false;
let pausedElapsedMs = 0;
let realPausedElapsedMs = 0;
let gameTimerScale = 1;
let realGameTimerStartedAt = 0;
let moveHistory = [];
let moveSequence = 0;
let currentFusionStreak = 0;
let bestFusionStreak = 0;
let decisiveMomentMs = 0;
let decisiveMomentLabel = "";
let momentumLabel = "Arrancando";
let lastMomentumAnnouncement = "";
let initialsTimerInterval = null;
let saveSlotsPanelOpen = false;
let advancedSessionReported = false;
const ARCADE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const INITIALS_GRID_CHARS = [...ARCADE_ALPHABET, "?"];
const INITIALS_GRID_COLUMNS = 9;
const GLOBAL_MODES = ["4x4", "5x5", "6x6", "8x8", "16x16"];
const REPLAY_MOVE_CODES = {
  up: "U",
  right: "R",
  down: "D",
  left: "L",
};
const REPLAY_MOVE_CODES_REVERSE = {
  U: "up",
  R: "right",
  D: "down",
  L: "left",
};
const globalRecordsElements = Object.fromEntries(
  GLOBAL_MODES.map((mode) => [mode, document.getElementById(`global-records-list-${mode}`)])
);
const initialsEntryState = {
  active: false,
  letters: ["", "", ""],
  slot: 0,
  selectedIndex: 0,
  pendingScore: 0,
  deadlineAt: 0,
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

function updateMusicGain() {
  if (!musicAudioElement) return;
  musicAudioElement.volume = musicEnabled ? musicVolume : 0;
}

function formatMusicTimer(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getCurrentMusicTrack() {
  return MUSIC_TRACKS[currentMusicTrackIndex % MUSIC_TRACKS.length] || null;
}

function getMusicTrackUrl(track) {
  return track ? new URL(track.file, MUSIC_BASE_URL).toString() : "";
}

function ensureMusicAudioElement() {
  if (musicAudioElement) return musicAudioElement;
  musicAudioElement = new Audio();
  musicAudioElement.preload = "auto";
  musicAudioElement.addEventListener("loadedmetadata", () => {
    renderMusicInfo();
  });
  musicAudioElement.addEventListener("timeupdate", () => {
    renderMusicInfo();
  });
  musicAudioElement.addEventListener("play", () => {
    startMusicTimer();
    renderMusicInfo();
  });
  musicAudioElement.addEventListener("pause", () => {
    renderMusicInfo();
  });
  musicAudioElement.addEventListener("ended", () => {
    stopMusicTimer();
    renderMusicInfo();
    if (musicLoopTimeout) {
      window.clearTimeout(musicLoopTimeout);
      musicLoopTimeout = null;
    }
    if (!musicEnabled) return;
    musicLoopTimeout = window.setTimeout(() => {
      musicLoopTimeout = null;
      if (!musicEnabled) return;
      currentMusicTrackIndex = (currentMusicTrackIndex + 1) % MUSIC_TRACKS.length;
      localStorage.setItem(MUSIC_TRACK_INDEX_KEY, String(currentMusicTrackIndex));
      startMusicPlayback({ restart: true });
    }, MUSIC_TRACK_GAP_MS);
  });
  musicAudioElement.addEventListener("error", () => {
    stopMusicTimer();
    renderMusicInfo();
    setStatus(`No se pudo cargar la pista ${getCurrentMusicTrack()?.name || ""}.`);
  });
  updateMusicGain();
  return musicAudioElement;
}

function stopMusicTimer() {
  if (musicTimerInterval) {
    window.clearInterval(musicTimerInterval);
    musicTimerInterval = null;
  }
}

function renderMusicInfo() {
  const track = getCurrentMusicTrack();
  if (musicTrackNameElement) {
    musicTrackNameElement.textContent = track?.name || "Sin pista";
  }
  if (musicTrackTimerElement) {
    const audio = musicAudioElement;
    const elapsedMs = audio ? Math.round((audio.currentTime || 0) * 1000) : 0;
    const durationMs = audio && Number.isFinite(audio.duration) ? Math.round(audio.duration * 1000) : 0;
    musicTrackTimerElement.textContent = `${formatMusicTimer(elapsedMs)} / ${formatMusicTimer(durationMs)}`;
  }
}

function startMusicTimer() {
  stopMusicTimer();
  renderMusicInfo();
  musicTimerInterval = window.setInterval(() => {
    renderMusicInfo();
  }, 250);
}

function updateMusicControls() {
  if (musicToggleButton) {
    musicToggleButton.textContent = musicEnabled ? "♫ MUSICA ON" : "♫ MUSICA OFF";
    musicToggleButton.classList.toggle("is-on", musicEnabled);
    musicToggleButton.setAttribute("aria-pressed", String(musicEnabled));
  }
  if (musicVolumeSlider) {
    musicVolumeSlider.value = String(Math.round(musicVolume * 100));
  }
  updateMusicGain();
  renderMusicInfo();
}

function loadAdvancedPlayerAuth() {
  try {
    const raw = localStorage.getItem(ADVANCED_PLAYER_AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.alias || !parsed?.playerToken) return null;
    return {
      alias: String(parsed.alias),
      playerToken: String(parsed.playerToken),
      credits: Number(parsed.credits ?? DEFAULT_ADVANCED_CREDITS),
    };
  } catch {
    return null;
  }
}

function saveAdvancedPlayerAuth(auth) {
  if (!auth) {
    localStorage.removeItem(ADVANCED_PLAYER_AUTH_KEY);
    return;
  }
  localStorage.setItem(ADVANCED_PLAYER_AUTH_KEY, JSON.stringify(auth));
}

function slugifyBetId(value) {
  const normalized = String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || `bet-${Date.now()}`;
}

function cloneAdvancedBetDefinitions(definitions) {
  return (definitions || []).map((definition) => ({ ...definition }));
}

function normalizeAdvancedBetDefinition(definition, index = 0) {
  const rule = ADVANCED_BET_RULES.some((entry) => entry.value === definition?.rule)
    ? definition.rule
    : "reasonUser";
  return {
    id: String(definition?.id || slugifyBetId(definition?.label || `bet-${index + 1}`)),
    label: String(definition?.label || `Apuesta ${index + 1}`).slice(0, 36),
    description: String(definition?.description || "Sin explicacion.").slice(0, 120),
    multiplier: Math.max(1.1, Math.min(99, Number(definition?.multiplier || 2))),
    optionA: String(definition?.optionA || "Opcion 1").slice(0, 28),
    optionB: String(definition?.optionB || "Opcion 2").slice(0, 28),
    rule,
    target: String(definition?.target ?? ""),
    active: Boolean(definition?.active),
  };
}

function getActiveAdvancedBetDefinitions() {
  return advancedBetDefinitions.filter((definition) => definition.active);
}

function createEmptyAdminBetDefinition() {
  return normalizeAdvancedBetDefinition({
    id: `bet-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    label: "Nueva apuesta",
    description: "Describe brevemente que se esta apostando.",
    multiplier: 2,
    optionA: "SI",
    optionB: "NO",
    rule: "scoreGte",
    target: "1000",
    active: true,
  });
}

function refreshAdvancedBetDraftAgainstDefinitions() {
  const nextDraft = createDefaultAdvancedBetDraft();
  advancedBetDefinitions.forEach((definition) => {
    const existing = advancedBetDraft?.[definition.id];
    if (!existing) return;
    const validPrediction = ["A", "B", ""].includes(existing.prediction) ? existing.prediction : "";
    const validStake = ADVANCED_BET_STAKES.includes(Number(existing.stake)) ? Number(existing.stake) : 0;
    nextDraft[definition.id] = {
      prediction: validPrediction,
      stake: validStake,
    };
  });
  advancedBetDraft = nextDraft;
  saveAdvancedBetDraft();
}

function createDefaultAdvancedBetDraft() {
  return Object.fromEntries(
    advancedBetDefinitions.map((definition) => [
      definition.id,
      {
        prediction: "",
        stake: 0,
      },
    ])
  );
}

function loadAdvancedBetDraft() {
  try {
    const raw = localStorage.getItem(ADVANCED_BET_DRAFT_KEY);
    if (!raw) return createDefaultAdvancedBetDraft();
    const parsed = JSON.parse(raw);
    const nextDraft = createDefaultAdvancedBetDraft();
    advancedBetDefinitions.forEach((definition) => {
      const entry = parsed?.[definition.id];
      if (!entry) return;
      const validPrediction = ["A", "B", ""].includes(entry.prediction) ? entry.prediction : "";
      const validStake = ADVANCED_BET_STAKES.includes(Number(entry.stake)) ? Number(entry.stake) : 0;
      nextDraft[definition.id] = { prediction: validPrediction, stake: validStake };
    });
    return nextDraft;
  } catch {
    return createDefaultAdvancedBetDraft();
  }
}

function saveAdvancedBetDraft() {
  localStorage.setItem(ADVANCED_BET_DRAFT_KEY, JSON.stringify(advancedBetDraft));
}

function cloneAdvancedRound(round) {
  if (!round) return null;
  return {
    ...round,
    wagers: Array.isArray(round.wagers) ? round.wagers.map((wager) => ({ ...wager })) : [],
  };
}

function getAdvancedBetDefinition(id) {
  return advancedBetDefinitions.find((definition) => definition.id === id) || null;
}

function buildAdvancedRoundFromDraft() {
  const wagers = getActiveAdvancedBetDefinitions()
    .map((definition) => {
      const draft = advancedBetDraft?.[definition.id];
      const stake = Number(draft?.stake || 0);
      const prediction = draft?.prediction;
      if (!stake || !["A", "B"].includes(prediction)) return null;
      return {
        id: definition.id,
        label: definition.label,
        prediction,
        predictionLabel: prediction === "A" ? definition.optionA : definition.optionB,
        payout: Number(definition.multiplier || 2),
        stake,
      };
    })
    .filter(Boolean);

  if (!wagers.length) return null;

  return {
    mode: `${Number(boardSizeSelect.value)}x${Number(boardSizeSelect.value)}`,
    alias: advancedPlayerAuth?.alias || "",
    startedAt: new Date().toISOString(),
    totalStake: wagers.reduce((sum, wager) => sum + wager.stake, 0),
    wagers,
    settled: false,
    voidedReason: "",
  };
}

function evaluateAdvancedBet(id, prediction, context) {
  const definition = getAdvancedBetDefinition(id);
  if (!definition) return false;
  return prediction === resolveAdvancedBetWinningSide(definition, context);
}

function resolveAdvancedBetWinningSide(definition, context) {
  const numericTarget = Number(definition.target || 0);
  switch (definition.rule) {
    case "reasonUser":
      return context.reason === "BY USER" ? "A" : "B";
    case "highestTileGte":
      return Number(context.highestTile || 0) >= numericTarget ? "A" : "B";
    case "durationMinutesGte":
      return Number(context.elapsedMs || 0) >= numericTarget * 60 * 1000 ? "A" : "B";
    case "scoreGte":
      return Number(context.score || 0) >= numericTarget ? "A" : "B";
    case "movesGte":
      return Number(context.moves || 0) >= numericTarget ? "A" : "B";
    case "holeUsed":
      return Boolean(context.holeUsed) ? "A" : "B";
    default:
      return "B";
  }
}

function setAdvancedRoundVoided(reason) {
  if (!activeAdvancedRound || activeAdvancedRound.settled) return;
  activeAdvancedRound.voidedReason = reason;
  renderAdvancedBetsPanel();
}

function describeAdvancedRound(round = activeAdvancedRound) {
  if (!round?.wagers?.length) return "";
  return round.wagers.map((wager) => `${wager.label}: ${wager.predictionLabel} (${wager.stake})`).join(" · ");
}

function describeAdvancedDraft() {
  const pendingRound = buildAdvancedRoundFromDraft();
  if (!pendingRound?.wagers?.length) return "";
  return pendingRound.wagers.map((wager) => `${wager.label}: ${wager.predictionLabel} (${wager.stake})`).join(" · ");
}

function hasPreparedAdvancedBets() {
  return Boolean(buildAdvancedRoundFromDraft()?.wagers?.length);
}

function shouldShowAdvancedMiniToggle() {
  return Boolean(
    advancedMode
    && advancedBetsVisible
    && advancedBetsCollapsed
    && !hasPreparedAdvancedBets()
    && !activeAdvancedRound?.wagers?.length
  );
}

function updateAdvancedModeUI() {
  if (advancedModeToggle) advancedModeToggle.checked = advancedMode;
  creditsCardElement?.classList.toggle("hidden", !advancedMode);
  const showMiniToggle = shouldShowAdvancedMiniToggle();
  advancedBetsPanelElement?.classList.toggle("hidden", !(advancedMode && advancedBetsVisible) || showMiniToggle);
  advancedBetsPanelElement?.classList.toggle("is-collapsed", advancedBetsCollapsed);
  advancedBetsPanelElement?.classList.toggle("is-empty-collapsed", advancedBetsCollapsed && !hasPreparedAdvancedBets() && !activeAdvancedRound?.wagers?.length);
  advancedMiniToggleElement?.classList.toggle("hidden", !showMiniToggle);
  if (advancedBetsCollapseButton) {
    advancedBetsCollapseButton.textContent = advancedBetsCollapsed ? "Expandir" : "Encoger";
  }
  animateCreditsDisplay(advancedCredits);
  if (creditsPlayerElement) {
    creditsPlayerElement.textContent = advancedMode
      ? (advancedPlayerAuth?.alias || "Alias pendiente")
      : "";
  }
  renderAdvancedBetsPanel();
}

function animateCreditsDisplay(targetValue) {
  if (!creditsElement) return;
  const target = Math.max(0, Math.trunc(Number(targetValue) || 0));
  if (creditsAnimationFrame) {
    window.cancelAnimationFrame(creditsAnimationFrame);
    creditsAnimationFrame = null;
  }

  const start = Number(creditsDisplayValue || 0);
  if (start === target) {
    creditsElement.textContent = String(target);
    applyScoreSizing(creditsElement, target);
    return;
  }

  const startedAt = performance.now();
  const duration = 520;
  creditsElement.classList.remove("credits-pulse-up", "credits-pulse-down");
  void creditsElement.offsetWidth;
  creditsElement.classList.add(target > start ? "credits-pulse-up" : "credits-pulse-down");

  const step = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const nextValue = Math.round(start + ((target - start) * eased));
    creditsDisplayValue = nextValue;
    creditsElement.textContent = String(nextValue);
    applyScoreSizing(creditsElement, nextValue);
    if (progress < 1) {
      creditsAnimationFrame = window.requestAnimationFrame(step);
    } else {
      creditsDisplayValue = target;
      creditsElement.textContent = String(target);
      applyScoreSizing(creditsElement, target);
      creditsAnimationFrame = null;
      window.setTimeout(() => creditsElement.classList.remove("credits-pulse-up", "credits-pulse-down"), 420);
    }
  };

  creditsAnimationFrame = window.requestAnimationFrame(step);
}

function renderAdvancedBetsPanel() {
  if (!advancedBetsListElement || !advancedBetsSummaryElement || !advancedBetsActiveElement) return;
  if (!advancedMode) {
    advancedBetsListElement.innerHTML = "";
    advancedBetsSummaryElement.textContent = "";
    advancedBetsActiveElement.textContent = "";
    return;
  }

  advancedBetsListElement.innerHTML = "";
  getActiveAdvancedBetDefinitions().forEach((definition) => {
    const draft = advancedBetDraft?.[definition.id] || { prediction: "", stake: 0 };
    const optionLabel = draft.prediction === "A" ? definition.optionA : draft.prediction === "B" ? definition.optionB : "";

    const row = document.createElement("div");
    row.className = "advanced-bet-row";

    const copy = document.createElement("div");
    copy.className = "advanced-bet-copy";

    const label = document.createElement("span");
    label.className = "advanced-bet-label";
    label.textContent = definition.label;

    const desc = document.createElement("small");
    desc.textContent = definition.description;

    const payout = document.createElement("small");
    payout.className = "advanced-bet-payout";
    payout.textContent = optionLabel ? `Premio x${Number(definition.multiplier || 2).toFixed(2)} si aciertas` : "Sin apuesta preparada";

    copy.append(label, desc, payout);

    const controls = document.createElement("div");
    controls.className = "advanced-bet-controls";

    const predictionSelect = document.createElement("select");
    const emptyPredictionOption = document.createElement("option");
    emptyPredictionOption.value = "";
    emptyPredictionOption.textContent = "Sin apuesta";
    if (!draft.prediction) emptyPredictionOption.selected = true;
    predictionSelect.appendChild(emptyPredictionOption);
    [["A", definition.optionA], ["B", definition.optionB]].forEach(([value, labelText]) => {
      const optionElement = document.createElement("option");
      optionElement.value = value;
      optionElement.textContent = labelText;
      if (value === draft.prediction) optionElement.selected = true;
      predictionSelect.appendChild(optionElement);
    });
    predictionSelect.addEventListener("change", () => {
      advancedBetDraft[definition.id].prediction = predictionSelect.value;
      saveAdvancedBetDraft();
      renderAdvancedBetsPanel();
    });

    const stakeSelect = document.createElement("select");
    ADVANCED_BET_STAKES.forEach((stake) => {
      const optionElement = document.createElement("option");
      optionElement.value = String(stake);
      optionElement.textContent = stake === 0 ? "Sin apuesta" : `${stake} creditos`;
      if (stake === Number(draft.stake || 0)) optionElement.selected = true;
      stakeSelect.appendChild(optionElement);
    });
    stakeSelect.addEventListener("change", () => {
      advancedBetDraft[definition.id].stake = Number(stakeSelect.value);
      saveAdvancedBetDraft();
      renderAdvancedBetsPanel();
    });

    controls.append(predictionSelect, stakeSelect);
    row.append(copy, controls);
    advancedBetsListElement.appendChild(row);
  });

  const pendingRound = buildAdvancedRoundFromDraft();
  if (!pendingRound) {
    advancedBetsSummaryElement.textContent = "Sin apuestas preparadas para la siguiente partida.";
  } else {
    advancedBetsSummaryElement.textContent = `Se descontaran ${pendingRound.totalStake} creditos al empezar la siguiente partida.`;
  }

  if (activeAdvancedRound?.voidedReason) {
    advancedBetsActiveElement.textContent = `Ronda anulada: ${activeAdvancedRound.voidedReason}`;
  } else if (activeAdvancedRound?.wagers?.length && !activeAdvancedRound.settled) {
    advancedBetsActiveElement.textContent = `Apuestas activas: ${describeAdvancedRound(activeAdvancedRound)}`;
  } else if (advancedBetsCollapsed) {
    advancedBetsActiveElement.textContent = describeAdvancedDraft() || advancedBetResultMessage || "Sin apuestas preparadas.";
  } else {
    advancedBetsActiveElement.textContent = advancedBetResultMessage || "";
  }
}

function openAdvancedAuthEntry() {
  advancedAuthEntryElement?.classList.remove("hidden");
  if (advancedAliasInput && !advancedAliasInput.value) {
    advancedAliasInput.value = advancedPlayerAuth?.alias || "";
  }
  advancedPinInput.value = "";
}

function closeAdvancedAuthEntry() {
  advancedAuthEntryElement?.classList.add("hidden");
  if (advancedPinInput) advancedPinInput.value = "";
}

function normalizeAdvancedAlias(value) {
  return (value || "").trim().replace(/\s+/g, "_").slice(0, 16).toUpperCase();
}

function isValidAdvancedAlias(value) {
  return /^[A-Za-z0-9_-]{3,16}$/.test(value);
}

function isValidAdvancedPin(value) {
  return /^[0-9]{4}$/.test(value);
}

async function sha256Hex(value) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hashBuffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function postWorkerJson(path, payload) {
  const requestBody = path.startsWith("/admin/")
    ? { ...(payload || {}), adminToken: adminSessionToken || "" }
    : payload;
  const response = await fetch(`${WORKER_API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (path.startsWith("/admin/") && response.status === 403) {
      adminSessionToken = "";
      sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
    }
    throw new Error(body.error || `Worker ${response.status}`);
  }
  return body;
}

async function syncAdvancedPlayer(alias, pinHash) {
  const body = await postWorkerJson("/player/access", { alias, pinHash });
  advancedPlayerAuth = {
    alias: body.alias,
    playerToken: String(body.playerToken || ""),
    credits: Number(body.credits ?? DEFAULT_ADVANCED_CREDITS),
  };
  advancedCredits = advancedPlayerAuth.credits;
  saveAdvancedPlayerAuth(advancedPlayerAuth);
  updateAdvancedModeUI();
  return body;
}

async function syncAdvancedCredits(nextCredits) {
  if (!advancedPlayerAuth?.alias || !advancedPlayerAuth?.playerToken) {
    throw new Error("Jugador avanzado no autenticado");
  }

  const body = await postWorkerJson("/player/credits", {
    alias: advancedPlayerAuth.alias,
    playerToken: advancedPlayerAuth.playerToken,
    credits: Math.max(0, Math.trunc(nextCredits)),
  });

  advancedCredits = Number(body.credits ?? 0);
  advancedPlayerAuth = {
    ...advancedPlayerAuth,
    playerToken: String(body.playerToken || advancedPlayerAuth.playerToken || ""),
    credits: advancedCredits,
  };
  saveAdvancedPlayerAuth(advancedPlayerAuth);
  updateAdvancedModeUI();
  return body;
}

function syncAdvancedCreditsLocally(nextCredits, alias = "") {
  const normalizedAlias = String(alias || advancedPlayerAuth?.alias || "").toUpperCase();
  advancedCredits = Number(nextCredits ?? 0);
  if (advancedPlayerAuth && (!normalizedAlias || advancedPlayerAuth.alias === normalizedAlias)) {
    advancedPlayerAuth = {
      ...advancedPlayerAuth,
      credits: advancedCredits,
    };
    saveAdvancedPlayerAuth(advancedPlayerAuth);
  }
  updateAdvancedModeUI();
}

async function recordAdvancedWager(round) {
  if (!advancedPlayerAuth?.alias || !advancedPlayerAuth?.playerToken || !round?.wagers?.length) return;
  try {
    await postWorkerJson("/player/wager", {
      alias: advancedPlayerAuth.alias,
      playerToken: advancedPlayerAuth.playerToken,
      mode: round.mode,
      category: getCurrentRecordCategory(),
      totalStake: Number(round.totalStake || 0),
      creditsAfter: advancedCredits,
      wagers: round.wagers.map((wager) => ({
        label: wager.label,
        predictionLabel: wager.predictionLabel,
        stake: wager.stake,
      })),
    });
  } catch (error) {
    console.warn("No pude registrar la apuesta:", error);
  }
}

async function reportAdvancedSession(reason, settlement = {}) {
  if (!advancedMode || demoMode || advancedSessionReported) return;
  if (!advancedPlayerAuth?.alias || !advancedPlayerAuth?.playerToken) return;
  advancedSessionReported = true;

  try {
    await postWorkerJson("/player/session", {
      alias: advancedPlayerAuth.alias,
      playerToken: advancedPlayerAuth.playerToken,
      mode: `${boardSize}x${boardSize}`,
      category: getCurrentRecordCategory(),
      reason,
      score: gameState.score,
      elapsedMs: getElapsedMs(),
      highestTile: getHighestTileValue(),
      totalStake: Number(settlement.totalStake || 0),
      payout: Number(settlement.payout || 0),
      wonCount: Number(settlement.winnersCount || 0),
      voided: Boolean(settlement.voided),
    });
  } catch (error) {
    console.warn("No pude sincronizar la sesion avanzada:", error);
  }
}

async function settleAdvancedRound(reason) {
  if (!activeAdvancedRound) {
    return { round: null, payout: 0, winnersCount: 0, totalStake: 0, voided: false };
  }
  if (activeAdvancedRound.settled) {
    return {
      round: cloneAdvancedRound(activeAdvancedRound),
      payout: Number(activeAdvancedRound.payout || 0),
      winnersCount: Number(activeAdvancedRound.winnersCount || 0),
      totalStake: Number(activeAdvancedRound.totalStake || 0),
      voided: Boolean(activeAdvancedRound.voidedReason),
    };
  }

  const round = cloneAdvancedRound(activeAdvancedRound);
  round.settled = true;
  activeAdvancedRound = round;

  if (round.voidedReason) {
    try {
      await syncAdvancedCredits(advancedCredits + round.totalStake);
      advancedBetResultMessage = `Apuestas anuladas. Devueltos ${round.totalStake} creditos.`;
    } catch (error) {
      advancedBetResultMessage = `Apuestas anuladas, pero no pude devolver los creditos: ${error.message}`;
    }
    renderAdvancedBetsPanel();
    persistSessionSnapshot();
    return { round, payout: 0, winnersCount: 0, totalStake: round.totalStake, voided: true };
  }

  const context = {
    reason,
    elapsedMs: getElapsedMs(),
    highestTile: getHighestTileValue(),
    score: gameState.score,
    moves: moveSequence,
    holeUsed: holeRunUsed,
  };

  const winners = round.wagers.filter((wager) => evaluateAdvancedBet(wager.id, wager.prediction, context));
  const payout = winners.reduce((sum, wager) => sum + Math.round(wager.stake * wager.payout), 0);
  round.winnersCount = winners.length;
  round.payout = payout;
  activeAdvancedRound = round;

  try {
    if (payout > 0) {
      await syncAdvancedCredits(advancedCredits + payout);
      advancedBetResultMessage = `Apuestas cobradas: +${payout} creditos con ${winners.length} acierto${winners.length === 1 ? "" : "s"}.`;
    } else {
      advancedBetResultMessage = `Apuestas perdidas. Sin aciertos en esta partida.`;
    }
  } catch (error) {
    advancedBetResultMessage = `No pude liquidar las apuestas: ${error.message}`;
  }

  renderAdvancedBetsPanel();
  persistSessionSnapshot();
  return { round, payout, winnersCount: winners.length, totalStake: round.totalStake, voided: false };
}

async function ensureAdvancedPlayer(options = {}) {
  const { prompt = false } = options;
  if (!advancedMode) return false;
  if (!advancedPlayerAuth?.alias || !advancedPlayerAuth?.playerToken) {
    if (prompt) openAdvancedAuthEntry();
    return false;
  }

  try {
    const body = await postWorkerJson("/player/access", {
      alias: advancedPlayerAuth.alias,
      playerToken: advancedPlayerAuth.playerToken,
    });
    advancedPlayerAuth = {
      ...advancedPlayerAuth,
      alias: body.alias,
      playerToken: String(body.playerToken || advancedPlayerAuth.playerToken || ""),
      credits: Number(body.credits ?? advancedCredits),
    };
    saveAdvancedPlayerAuth(advancedPlayerAuth);
    advancedCredits = advancedPlayerAuth.credits;
    return true;
  } catch (error) {
    saveAdvancedPlayerAuth(null);
    advancedPlayerAuth = null;
    advancedCredits = DEFAULT_ADVANCED_CREDITS;
    updateAdvancedModeUI();
    if (prompt) openAdvancedAuthEntry();
    setStatus(`Modo avanzado: ${error.message}`);
    return false;
  }
}

function getBoardFrameElement() {
  return document.querySelector(".board-frame");
}

function setGameOverOverlay(visible, reason = "") {
  gameOverOverlayElement.classList.toggle("hidden", !visible);
  lastGameOverReason = visible ? reason : "";
  if (visible) {
    setStatsPanelOpen(false);
  } else {
    setStatsPanelOpen(false);
  }
  if (gameOverReasonElement) {
    gameOverReasonElement.textContent = visible ? reason : "";
  }
  if (visible) {
    showSystemAnnouncement(reason === "BY USER" ? "Partida cerrada por el jugador" : "GAME OVER · Sin movimientos", "danger");
    announceMatchCommentary(reason === "BY USER" ? "gameOverUser" : "gameOverMachine", { score: gameState.score }, "danger", { force: true });
  }
  updateStatsButton();
}

function canShowLiveStats() {
  return !demoMode && !replayMode && attractDismissed && !awaitingManualStart;
}

function canShowPostGameStats() {
  return !demoMode && !replayMode && attractDismissed && gameState.over;
}

function positionStatsPanel() {
  if (!statsPanelElement) return;
  statsPanelElement.classList.toggle("is-postgame", canShowPostGameStats());
  if (canShowPostGameStats()) {
    const boardRect = boardPanelElement?.getBoundingClientRect();
    if (!boardRect) return;
    const width = Math.min(720, Math.max(520, Math.round(boardRect.width * 0.92)));
    const left = Math.round(boardRect.left + ((boardRect.width - width) / 2));
    const maxHeight = Math.min(760, Math.max(380, Math.round(boardRect.height * 0.9)));
    const top = Math.max(24, Math.round(boardRect.top + 24));
    statsPanelElement.style.left = `${left}px`;
    statsPanelElement.style.top = `${top}px`;
    statsPanelElement.style.width = `${width}px`;
    statsPanelElement.style.maxHeight = `${maxHeight}px`;
    return;
  }
  if (window.innerWidth <= 1180) {
    statsPanelElement.style.left = "";
    statsPanelElement.style.top = "";
    statsPanelElement.style.width = "";
    statsPanelElement.style.maxHeight = "";
    return;
  }
  const boardRect = boardPanelElement?.getBoundingClientRect();
  if (!boardRect) return;
  const heroRect = heroElement?.getBoundingClientRect();
  const gap = 22;
  const width = Math.max(500, Math.min(680, Math.round(window.innerWidth * 0.36)));
  const left = Math.max(18, Math.round(boardRect.left - width - gap));
  const top = Math.max(18, Math.round((heroRect?.top ?? 18) + 2));
  const maxHeight = Math.max(360, Math.min(700, window.innerHeight - top - 24));
  statsPanelElement.style.left = `${left}px`;
  statsPanelElement.style.top = `${top}px`;
  statsPanelElement.style.width = `${width}px`;
  statsPanelElement.style.maxHeight = `${maxHeight}px`;
}

function setStatsPanelOpen(nextOpen) {
  const canOpen = canShowLiveStats() || canShowPostGameStats();
  statsPanelOpen = Boolean(nextOpen && canOpen);
  statsPanelElement?.classList.toggle("hidden", !statsPanelOpen);
  if (!statsPanelOpen) {
    closeStatsMilestonePopover();
  }
  if (statsPanelOpen) {
    positionStatsPanel();
    renderStatsPanel();
  }
}

function updateStatsButton() {
  if (!showStatsButton) return;
  const live = canShowLiveStats() && !gameState.over;
  const postGame = canShowPostGameStats();
  const visible = Boolean(live || postGame);
  showStatsButton.classList.toggle("hidden", !visible);
  showStatsButton.textContent = live ? "Estadisticas en Tiempo Real" : "Ver Estadisticas";
  shareStatsButton?.classList.toggle("hidden", !postGame);
}

function formatElapsedTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatAdminNumber(value) {
  return new Intl.NumberFormat("es-ES").format(Number(value || 0));
}

function formatAdminDate(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("es-ES", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function compareAdminValues(a, b, direction = "asc") {
  const dir = direction === "asc" ? 1 : -1;
  if (typeof a === "number" || typeof b === "number") {
    return ((Number(a) || 0) - (Number(b) || 0)) * dir;
  }
  const textA = String(a ?? "").trim().toLowerCase();
  const textB = String(b ?? "").trim().toLowerCase();
  return textA.localeCompare(textB, "es") * dir;
}

function getSortedAdminPlayers(players) {
  const { key, direction } = adminUsersSort;
  return [...players].sort((left, right) => {
    const valueLeft = key === "lastSeen" ? new Date(left.lastSeen || 0).getTime() : left[key];
    const valueRight = key === "lastSeen" ? new Date(right.lastSeen || 0).getTime() : right[key];
    const primary = compareAdminValues(valueLeft, valueRight, direction);
    if (primary !== 0) return primary;
    return compareAdminValues(left.alias, right.alias, "asc");
  });
}

function getSortedAdminRecords(records) {
  const { key, direction } = adminRecordsSort;
  return [...records].sort((left, right) => {
    const valueLeft = key === "createdAt" ? new Date(left.createdAt || 0).getTime() : key === "category"
      ? (RECORD_CATEGORY_LABELS[normalizeRecordCategory(left.category)] || "Normal")
      : left[key];
    const valueRight = key === "createdAt" ? new Date(right.createdAt || 0).getTime() : key === "category"
      ? (RECORD_CATEGORY_LABELS[normalizeRecordCategory(right.category)] || "Normal")
      : right[key];
    const primary = compareAdminValues(valueLeft, valueRight, direction);
    if (primary !== 0) return primary;
    return compareAdminValues(right.score, left.score, "asc");
  });
}

function updateAdminSectionUI() {
  document.querySelectorAll(".admin-collapsible-card[data-admin-section]").forEach((card) => {
    const section = card.getAttribute("data-admin-section");
    const isOpen = adminSectionOpen[section] !== false;
    card.classList.toggle("is-collapsed", !isOpen);
    const toggle = card.querySelector("[data-admin-section-toggle]");
    if (toggle) toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

function updateAdminSortButtons() {
  document.querySelectorAll(".admin-sort-button[data-admin-sort-table]").forEach((button) => {
    const table = button.getAttribute("data-admin-sort-table");
    const key = button.getAttribute("data-admin-sort-key");
    const config = table === "users" ? adminUsersSort : adminRecordsSort;
    const active = config?.key === key;
    button.classList.toggle("is-sorted", active);
    if (active) {
      button.setAttribute("data-sort-direction", config.direction);
    } else {
      button.removeAttribute("data-sort-direction");
    }
  });
}

function toggleAdminSection(section) {
  if (!Object.prototype.hasOwnProperty.call(adminSectionOpen, section)) return;
  adminSectionOpen[section] = !adminSectionOpen[section];
  updateAdminSectionUI();
}

function toggleAdminSort(table, key) {
  if (!table || !key) return;
  const target = table === "users" ? adminUsersSort : adminRecordsSort;
  if (target.key === key) {
    target.direction = target.direction === "asc" ? "desc" : "asc";
  } else {
    target.key = key;
    target.direction = key === "alias" || key === "mode" || key === "category" || key === "initials" ? "asc" : "desc";
  }
  renderAdminOverview();
}

function renderAdminOverview() {
  if (!adminSummaryGridElement || !adminRecordsBodyElement || !adminUsersBodyElement || !adminPanelStatusElement) return;
  updateAdminSectionUI();
  updateAdminSortButtons();

  if (!adminOverview) {
    adminSummaryGridElement.innerHTML = "";
    adminRecordsBodyElement.innerHTML = '<tr><td class="admin-table-empty" colspan="6">Cargando records...</td></tr>';
    adminUsersBodyElement.innerHTML = '<tr><td class="admin-table-empty" colspan="10">Sin datos todavia.</td></tr>';
    renderAdminUserPanel();
    if (adminBetsBodyElement) {
      adminBetsBodyElement.innerHTML = '<div class="admin-bet-empty">Cargando tipos de apuesta...</div>';
    }
    adminPanelStatusElement.textContent = adminPanelLoading ? "Cargando panel de control..." : "Pulsa Refrescar para leer el estado global.";
    return;
  }

  const { summary = {}, players = [], records = [] } = adminOverview;
  const sortedPlayers = getSortedAdminPlayers(players);
  const sortedRecords = getSortedAdminRecords(records);
  adminPanelStatusElement.textContent = `Actualizado: ${formatAdminDate(summary.generatedAt)}. Usuarios ${formatAdminNumber(summary.totalUsers)}.`;

  const summaryCards = [
    { label: "Usuarios", value: formatAdminNumber(summary.totalUsers) },
    { label: "Creditos", value: formatAdminNumber(summary.totalCredits) },
    { label: "Media creditos", value: formatAdminNumber(summary.averageCredits) },
    { label: "Partidas", value: formatAdminNumber(summary.totalGamesPlayed) },
    { label: "Apostado", value: formatAdminNumber(summary.totalWagered) },
    { label: "Pagado", value: formatAdminNumber(summary.totalPayout) },
  ];
  adminSummaryGridElement.innerHTML = summaryCards.map((card) => `
    <article class="admin-summary-card">
      <small class="admin-summary-card-label">${escapeHtml(card.label)}</small>
      <strong class="admin-summary-card-value">${escapeHtml(card.value)}</strong>
    </article>
  `).join("");

  if (!sortedRecords.length) {
    adminRecordsBodyElement.innerHTML = '<tr><td class="admin-table-empty" colspan="6">Todavia no hay records globales.</td></tr>';
  } else {
    adminRecordsBodyElement.innerHTML = sortedRecords.map((record, index) => `
      <tr>
        <td>${escapeHtml(index + 1)}</td>
        <td>${escapeHtml(formatAdminDate(record.createdAt))}</td>
        <td>${escapeHtml(record.mode)}</td>
        <td>${escapeHtml(RECORD_CATEGORY_LABELS[normalizeRecordCategory(record.category)] || "Normal")}</td>
        <td>${escapeHtml(record.initials)}</td>
        <td>${escapeHtml(formatAdminNumber(record.score))}</td>
      </tr>
    `).join("");
  }

  if (!sortedPlayers.length) {
    adminUsersBodyElement.innerHTML = '<tr><td class="admin-table-empty" colspan="10">Todavia no hay jugadores avanzados.</td></tr>';
    updateAdminSortButtons();
    renderAdminUserPanel();
    return;
  }

  adminUsersBodyElement.innerHTML = sortedPlayers.map((player) => `
    <tr>
      <td><button type="button" class="admin-user-open-button" data-admin-open="${escapeHtml(player.alias)}">${escapeHtml(player.alias)}</button></td>
      <td>${escapeHtml(formatAdminNumber(player.credits))}</td>
      <td>${escapeHtml(formatAdminNumber(player.gamesPlayed))}</td>
      <td>${escapeHtml(formatAdminNumber(player.normalGames))}</td>
      <td>${escapeHtml(formatAdminNumber(player.holeGames))}</td>
      <td>${escapeHtml(formatAdminNumber(player.totalWagered))}</td>
      <td>${escapeHtml(formatAdminNumber(player.totalPayout))}</td>
      <td>${escapeHtml(formatAdminNumber(player.bestScore))}</td>
      <td>${escapeHtml(formatAdminDate(player.lastSeen))}</td>
      <td class="admin-user-open-action"><button type="button" class="secondary-button" data-admin-open="${escapeHtml(player.alias)}">Ver ficha</button></td>
    </tr>
  `).join("");

  adminUsersBodyElement.removeEventListener("click", handleAdminUserTableClick);
  adminUsersBodyElement.addEventListener("click", handleAdminUserTableClick);

  renderAdminBetDefinitionsEditor();
  updateAdminSortButtons();
  renderAdminUserPanel();
}

function handleAdminUserTableClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const trigger = target.closest("[data-admin-open]");
  const alias = trigger?.getAttribute("data-admin-open");
  if (alias) void loadAdminUser(alias, true);
}

async function loadAdminOverview(force = false) {
  if (adminPanelLoading && !force) return;
  adminPanelLoading = true;
  renderAdminOverview();
  try {
    adminOverview = await postWorkerJson("/admin/overview", {});
    if (Array.isArray(adminOverview?.betDefinitions) && adminOverview.betDefinitions.length) {
      advancedBetDefinitions = adminOverview.betDefinitions.map(normalizeAdvancedBetDefinition);
      refreshAdvancedBetDraftAgainstDefinitions();
      updateAdvancedModeUI();
    }
    adminBetDefinitionsDraft = cloneAdvancedBetDefinitions(
      Array.isArray(adminOverview?.betDefinitions) && adminOverview.betDefinitions.length
        ? adminOverview.betDefinitions
        : advancedBetDefinitions
    );
  } catch (error) {
    adminPanelStatusElement.textContent = `No pude cargar el panel: ${error.message}`;
  } finally {
    adminPanelLoading = false;
    renderAdminOverview();
  }
}

function renderAdminUserPanel() {
  if (!adminUserPanelElement || !adminUserSummaryGridElement || !adminUserStatusElement || !adminUserLedgerBodyElement) return;
  const visible = Boolean(adminSelectedUserAlias);
  adminUserPanelElement.classList.toggle("hidden", !visible);
  if (!visible) {
    adminUserSummaryGridElement.innerHTML = "";
    adminUserLedgerBodyElement.innerHTML = '<tr><td class="admin-table-empty" colspan="5">Pulsa sobre un usuario para abrir su ficha.</td></tr>';
    adminUserStatusElement.textContent = "Pulsa sobre un usuario para ver su ficha completa.";
    return;
  }
  if (adminUserLoading && !adminSelectedUserData) {
    adminUserSummaryGridElement.innerHTML = "";
    adminUserLedgerBodyElement.innerHTML = '<tr><td class="admin-table-empty" colspan="5">Cargando ficha del usuario...</td></tr>';
    adminUserStatusElement.textContent = `Cargando ${adminSelectedUserAlias}...`;
    return;
  }
  if (!adminSelectedUserData) {
    adminUserSummaryGridElement.innerHTML = "";
    adminUserLedgerBodyElement.innerHTML = '<tr><td class="admin-table-empty" colspan="5">No pude cargar la ficha del usuario.</td></tr>';
    adminUserStatusElement.textContent = `No pude cargar ${adminSelectedUserAlias}.`;
    return;
  }
  const user = adminSelectedUserData;
  const summaryCards = [
    { label: "Alias", value: user.alias },
    { label: "Creditos", value: formatAdminNumber(user.credits) },
    { label: "Partidas", value: formatAdminNumber(user.gamesPlayed) },
    { label: "Apostado", value: formatAdminNumber(user.totalWagered || 0) },
    { label: "Pagado", value: formatAdminNumber(user.totalPayout || 0) },
    { label: "Mejor", value: formatAdminNumber(user.bestScore || 0) },
  ];
  adminUserSummaryGridElement.innerHTML = summaryCards.map((card) => `
    <article class="admin-summary-card">
      <small class="admin-summary-card-label">${escapeHtml(card.label)}</small>
      <strong class="admin-summary-card-value">${escapeHtml(card.value)}</strong>
    </article>
  `).join("");
  adminUserStatusElement.textContent = `${user.alias} · ultimo acceso ${formatAdminDate(user.lastSeen)} · actualizacion ${formatAdminDate(user.updatedAt)}.`;
  const entries = Array.isArray(user.entries) ? user.entries : [];
  if (!entries.length) {
    adminUserLedgerBodyElement.innerHTML = '<tr><td class="admin-table-empty" colspan="5">Este usuario todavia no tiene movimientos.</td></tr>';
    return;
  }
  adminUserLedgerBodyElement.innerHTML = entries.map((entry) => {
    const amount = Number(entry.amount || 0);
    const amountClass = amount >= 0 ? "ledger-positive" : "ledger-negative";
    const amountText = `${amount >= 0 ? "+" : ""}${formatAdminNumber(amount)}`;
    return `
      <tr>
        <td>${escapeHtml(formatAdminDate(entry.date))}</td>
        <td>${escapeHtml(entry.type || "--")}</td>
        <td>${escapeHtml(entry.detail || "--")}</td>
        <td class="${amountClass}">${escapeHtml(amountText)}</td>
        <td>${escapeHtml(formatAdminNumber(entry.balanceAfter || 0))}</td>
      </tr>
    `;
  }).join("");
}

async function loadAdminUser(alias, force = false) {
  if (!alias) return;
  if (adminUserLoading && !force) return;
  adminSelectedUserAlias = String(alias).toUpperCase();
  const overviewPlayer = adminOverview?.players?.find((player) => String(player.alias).toUpperCase() === adminSelectedUserAlias);
  if (overviewPlayer) {
    adminSelectedUserData = {
      ...overviewPlayer,
      entries: Array.isArray(adminSelectedUserData?.entries) && adminSelectedUserData.alias === overviewPlayer.alias
        ? adminSelectedUserData.entries
        : [],
    };
  }
  adminUserLoading = true;
  renderAdminUserPanel();
  try {
    adminSelectedUserData = await postWorkerJson("/admin/player", { alias: adminSelectedUserAlias });
  } catch (error) {
    if (adminUserStatusElement) {
      adminUserStatusElement.textContent = `Ficha abierta con datos basicos, pero no pude cargar el detalle: ${error.message}`;
    }
  } finally {
    adminUserLoading = false;
    renderAdminUserPanel();
  }
}

function closeAdminUserPanel() {
  adminSelectedUserAlias = "";
  adminSelectedUserData = null;
  adminUserLoading = false;
  renderAdminUserPanel();
}

async function adjustAdminUserCredits(direction) {
  if (!adminSelectedUserAlias) return;
  const deltaBase = Math.max(1, Math.trunc(Number(adminUserCreditDeltaInput?.value || 0)));
  const delta = direction === "subtract" ? -deltaBase : deltaBase;
  try {
    adminUserLoading = true;
    renderAdminUserPanel();
    adminSelectedUserData = await postWorkerJson("/admin/player/credits", {
      alias: adminSelectedUserAlias,
      delta,
    });
    if (advancedPlayerAuth?.alias && adminSelectedUserData?.alias === advancedPlayerAuth.alias) {
      syncAdvancedCreditsLocally(adminSelectedUserData.credits, adminSelectedUserData.alias);
    }
    void loadAdminOverview(true);
  } catch (error) {
    if (adminUserStatusElement) {
      adminUserStatusElement.textContent = `No pude ajustar creditos: ${error.message}`;
    }
  } finally {
    adminUserLoading = false;
    renderAdminUserPanel();
  }
}

function renderLedgerPanel() {
  if (!ledgerSummaryGridElement || !ledgerBodyElement || !ledgerPanelCopyElement) return;
  if (!ledgerData) {
    ledgerPanelCopyElement.textContent = ledgerLoading
      ? "Cargando extracto..."
      : "Saldo y movimientos del jugador avanzado.";
    ledgerSummaryGridElement.innerHTML = "";
    ledgerBodyElement.innerHTML = '<tr><td class="admin-table-empty" colspan="5">Sin movimientos todavia.</td></tr>';
    return;
  }

  ledgerPanelCopyElement.textContent = `${ledgerData.alias} · saldo actual ${formatAdminNumber(ledgerData.credits)} creditos.`;
  const summaryCards = [
    { label: "Saldo", value: formatAdminNumber(ledgerData.credits) },
    { label: "Movimientos", value: formatAdminNumber(ledgerData.entries.length) },
    { label: "Apostado", value: formatAdminNumber(ledgerData.totalWagered || 0) },
    { label: "Pagado", value: formatAdminNumber(ledgerData.totalPayout || 0) },
    { label: "Partidas", value: formatAdminNumber(ledgerData.gamesPlayed || 0) },
    { label: "Mejor", value: formatAdminNumber(ledgerData.bestScore || 0) },
  ];
  ledgerSummaryGridElement.innerHTML = summaryCards.map((card) => `
    <article class="admin-summary-card">
      <small class="admin-summary-card-label">${escapeHtml(card.label)}</small>
      <strong class="admin-summary-card-value">${escapeHtml(card.value)}</strong>
    </article>
  `).join("");

  if (!ledgerData.entries.length) {
    ledgerBodyElement.innerHTML = '<tr><td class="admin-table-empty" colspan="5">Todavia no hay movimientos registrados.</td></tr>';
    return;
  }

  ledgerBodyElement.innerHTML = ledgerData.entries.map((entry) => {
    const amount = Number(entry.amount || 0);
    const amountClass = amount >= 0 ? "ledger-positive" : "ledger-negative";
    const amountText = `${amount >= 0 ? "+" : ""}${formatAdminNumber(amount)}`;
    return `
      <tr>
        <td>${escapeHtml(formatAdminDate(entry.date))}</td>
        <td>${escapeHtml(entry.type || "--")}</td>
        <td>${escapeHtml(entry.detail || "--")}</td>
        <td class="${amountClass}">${escapeHtml(amountText)}</td>
        <td>${escapeHtml(formatAdminNumber(entry.balanceAfter || 0))}</td>
      </tr>
    `;
  }).join("");
}

async function loadLedger(force = false) {
  if (ledgerLoading && !force) return;
  if (!advancedPlayerAuth?.alias || !advancedPlayerAuth?.playerToken) {
    setStatus("Entra con alias y PIN para ver el extracto.");
    return;
  }
  ledgerLoading = true;
  renderLedgerPanel();
  try {
    ledgerData = await postWorkerJson("/player/ledger", {
      alias: advancedPlayerAuth.alias,
      playerToken: advancedPlayerAuth.playerToken,
    });
    if (ledgerData?.alias && ledgerData.alias === advancedPlayerAuth.alias) {
      syncAdvancedCreditsLocally(ledgerData.credits, ledgerData.alias);
    }
  } catch (error) {
    setStatus(`No pude cargar el extracto: ${error.message}`);
  } finally {
    ledgerLoading = false;
    renderLedgerPanel();
  }
}

function setLedgerPanelOpen(nextOpen) {
  ledgerPanelOpen = Boolean(nextOpen);
  ledgerPanelElement?.classList.toggle("hidden", !ledgerPanelOpen);
  if (ledgerPanelOpen) {
    renderLedgerPanel();
    void loadLedger();
  }
}

function renderAdminBetDefinitionsEditor() {
  if (!adminBetsBodyElement) return;
  if (!adminBetDefinitionsDraft.length) {
    adminBetsBodyElement.innerHTML = '<div class="admin-bet-empty">No hay tipos de apuesta definidos.</div>';
    return;
  }

  adminBetsBodyElement.innerHTML = "";
  adminBetDefinitionsDraft.forEach((definition, index) => {
    const card = document.createElement("article");
    card.className = "admin-bet-card";

    const topBar = document.createElement("div");
    topBar.className = "admin-bet-card-top";

    const activeWrap = document.createElement("label");
    activeWrap.className = "admin-bet-toggle";
    const activeInput = document.createElement("input");
    activeInput.type = "checkbox";
    activeInput.checked = Boolean(definition.active);
    activeInput.addEventListener("change", () => {
      definition.active = activeInput.checked;
      card.classList.toggle("is-inactive", !definition.active);
    });
    const activeText = document.createElement("span");
    activeText.textContent = "Activa";
    activeWrap.append(activeInput, activeText);

    const titleWrap = document.createElement("div");
    titleWrap.className = "admin-bet-title-wrap";
    const labelInput = document.createElement("input");
    labelInput.className = "admin-bet-title-input";
    labelInput.value = definition.label;
    labelInput.maxLength = 36;
    labelInput.placeholder = "Nombre de la apuesta";
    labelInput.addEventListener("input", () => {
      definition.label = labelInput.value;
      if (!definition.id) definition.id = slugifyBetId(labelInput.value);
    });
    const descInput = document.createElement("input");
    descInput.className = "admin-bet-description-input";
    descInput.value = definition.description;
    descInput.maxLength = 120;
    descInput.placeholder = "Explica claramente que se apuesta";
    descInput.addEventListener("input", () => {
      definition.description = descInput.value;
    });
    titleWrap.append(labelInput, descInput);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger-button admin-bet-delete";
    deleteButton.textContent = "Borrar";
    deleteButton.addEventListener("click", () => {
      adminBetDefinitionsDraft.splice(index, 1);
      renderAdminBetDefinitionsEditor();
    });

    topBar.append(activeWrap, titleWrap, deleteButton);

    const optionsGrid = document.createElement("div");
    optionsGrid.className = "admin-bet-options-grid";

    const optionAGroup = document.createElement("label");
    optionAGroup.className = "admin-bet-field";
    const optionALabel = document.createElement("span");
    optionALabel.className = "admin-bet-field-label";
    optionALabel.textContent = "Opcion A";
    const optionAInput = document.createElement("input");
    optionAInput.value = definition.optionA;
    optionAInput.maxLength = 28;
    optionAInput.placeholder = "Texto de la opcion A";
    optionAInput.addEventListener("input", () => {
      definition.optionA = optionAInput.value;
    });
    optionAGroup.append(optionALabel, optionAInput);

    const optionBGroup = document.createElement("label");
    optionBGroup.className = "admin-bet-field";
    const optionBLabel = document.createElement("span");
    optionBLabel.className = "admin-bet-field-label";
    optionBLabel.textContent = "Opcion B";
    const optionBInput = document.createElement("input");
    optionBInput.value = definition.optionB;
    optionBInput.maxLength = 28;
    optionBInput.placeholder = "Texto de la opcion B";
    optionBInput.addEventListener("input", () => {
      definition.optionB = optionBInput.value;
    });
    optionBGroup.append(optionBLabel, optionBInput);

    optionsGrid.append(optionAGroup, optionBGroup);

    const configGrid = document.createElement("div");
    configGrid.className = "admin-bet-config-grid";

    const multiplierGroup = document.createElement("label");
    multiplierGroup.className = "admin-bet-field";
    const multiplierLabel = document.createElement("span");
    multiplierLabel.className = "admin-bet-field-label";
    multiplierLabel.textContent = "Multiplicador";
    const multiplierInput = document.createElement("input");
    multiplierInput.type = "number";
    multiplierInput.step = "0.1";
    multiplierInput.min = "1.1";
    multiplierInput.max = "99";
    multiplierInput.value = String(definition.multiplier);
    multiplierInput.placeholder = "Ej. 2.5";
    multiplierInput.addEventListener("input", () => {
      definition.multiplier = Number(multiplierInput.value || 2);
    });
    multiplierGroup.append(multiplierLabel, multiplierInput);

    const ruleGroup = document.createElement("label");
    ruleGroup.className = "admin-bet-field";
    const ruleLabel = document.createElement("span");
    ruleLabel.className = "admin-bet-field-label";
    ruleLabel.textContent = "Regla";
    const ruleSelect = document.createElement("select");
    ADVANCED_BET_RULES.forEach((rule) => {
      const option = document.createElement("option");
      option.value = rule.value;
      option.textContent = rule.label;
      if (rule.value === definition.rule) option.selected = true;
      ruleSelect.appendChild(option);
    });
    ruleGroup.append(ruleLabel, ruleSelect);

    const targetGroup = document.createElement("label");
    targetGroup.className = "admin-bet-field";
    const targetLabel = document.createElement("span");
    targetLabel.className = "admin-bet-field-label";
    targetLabel.textContent = "Objetivo";
    const targetInput = document.createElement("input");
    targetInput.value = definition.target;
    targetInput.maxLength = 24;
    targetInput.addEventListener("input", () => {
      definition.target = targetInput.value;
    });
    const targetHelp = document.createElement("small");
    targetHelp.className = "admin-bet-field-help";

    const syncRuleUi = () => {
      const hint = ADVANCED_BET_RULE_HINTS[ruleSelect.value] || ADVANCED_BET_RULE_HINTS.scoreGte;
      definition.rule = ruleSelect.value;
      targetInput.placeholder = hint.placeholder;
      targetHelp.textContent = hint.help;
      targetInput.disabled = ruleSelect.value === "reasonUser" || ruleSelect.value === "holeUsed";
    };

    ruleSelect.addEventListener("change", syncRuleUi);
    syncRuleUi();

    targetGroup.append(targetLabel, targetInput, targetHelp);

    configGrid.append(multiplierGroup, ruleGroup, targetGroup);

    card.classList.toggle("is-inactive", !definition.active);
    card.append(topBar, optionsGrid, configGrid);
    adminBetsBodyElement.appendChild(card);
  });
}

async function loadAdvancedBetDefinitionsFromWorker() {
  try {
    const body = await postWorkerJson("/bets/config", {});
    if (Array.isArray(body?.definitions) && body.definitions.length) {
      advancedBetDefinitions = body.definitions.map(normalizeAdvancedBetDefinition);
      refreshAdvancedBetDraftAgainstDefinitions();
      updateAdvancedModeUI();
    }
  } catch (error) {
    console.warn("No pude cargar la configuracion de apuestas:", error);
  }
}

async function saveAdminBetDefinitions() {
  const originalLabel = adminSaveBetsButton?.textContent || "Guardar apuestas";
  if (adminSaveBetsButton) {
    adminSaveBetsButton.disabled = true;
    adminSaveBetsButton.textContent = "Guardando...";
  }
  setAdminPanelStatus("Guardando configuracion de apuestas...");

  try {
    const payload = adminBetDefinitionsDraft.map((definition, index) => normalizeAdvancedBetDefinition({
      ...definition,
      id: definition.id || slugifyBetId(definition.label || `bet-${index + 1}`),
    }, index));
    const body = await postWorkerJson("/admin/bets/save", { definitions: payload });
    advancedBetDefinitions = body.definitions.map(normalizeAdvancedBetDefinition);
    refreshAdvancedBetDraftAgainstDefinitions();
    adminOverview = {
      ...(adminOverview || {}),
      betDefinitions: cloneAdvancedBetDefinitions(advancedBetDefinitions),
    };
    setAdminPanelStatus("Configuracion de apuestas guardada.");
    updateAdvancedModeUI();
    renderAdminOverview();
  } finally {
    if (adminSaveBetsButton) {
      adminSaveBetsButton.disabled = false;
      adminSaveBetsButton.textContent = originalLabel;
    }
  }
}

function setAdminPanelOpen(nextOpen) {
  adminPanelOpen = Boolean(nextOpen);
  adminPanelElement?.classList.toggle("hidden", !adminPanelOpen);
  if (adminPanelOpen) {
    if (!demoMode && !replayMode && !gameState.over && !awaitingManualStart && !gamePaused) {
      adminPanelPausedGame = true;
      setGamePaused(true, { statusMessage: "Panel de control abierto.", persist: true });
    } else {
      adminPanelPausedGame = false;
    }
    adminPanelPausedMusic = Boolean(musicEnabled && musicAudioElement && !musicAudioElement.paused);
    if (adminPanelPausedMusic) {
      pauseMusicPlayback();
    }
    renderAdminOverview();
    void loadAdminOverview();
    return;
  }
  if (adminPanelPausedGame && gamePaused && !demoMode && !replayMode && !gameState.over) {
    adminPanelPausedGame = false;
    setGamePaused(false, { statusMessage: "Partida reanudada.", persist: true });
  }
  if (adminPanelPausedMusic) {
    adminPanelPausedMusic = false;
    resumeMusicPlayback();
  }
  adminPanelPausedGame = false;
  adminPanelPausedMusic = false;
}

function openAdminPinGate() {
  if (adminSessionToken) {
    setAdminPanelOpen(true);
    return;
  }
  adminPinGateOpen = true;
  adminPinEntryElement?.classList.remove("hidden");
  if (adminPinInput) {
    adminPinInput.value = "";
    window.setTimeout(() => adminPinInput.focus(), 30);
  }
  if (adminPinHelpElement) {
    adminPinHelpElement.textContent = "Introduce el PIN para acceder al panel de control.";
  }
}

function closeAdminPinGate() {
  adminPinGateOpen = false;
  adminPinEntryElement?.classList.add("hidden");
  if (adminPinInput) adminPinInput.value = "";
}

function handleAdminPinSubmit() {
  const enteredPin = String(adminPinInput?.value || "").trim();
  if (!enteredPin) return;
  if (adminPinHelpElement) {
    adminPinHelpElement.textContent = "Verificando PIN...";
  }
  void (async () => {
    try {
      const pinHash = await sha256Hex(enteredPin);
      const body = await postWorkerJson("/admin/auth", { pinHash });
      adminSessionToken = String(body.token || "");
      if (adminSessionToken) {
        sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, adminSessionToken);
      }
      closeAdminPinGate();
      setAdminPanelOpen(true);
    } catch (error) {
      if (adminPinHelpElement) {
        adminPinHelpElement.textContent = error.message || "PIN incorrecto.";
      }
      if (adminPinInput) {
        adminPinInput.value = "";
        adminPinInput.focus();
      }
    }
  })();
}

function getCurrentGameTimeScale() {
  return holeMode ? holeSpeedMultiplier : 1;
}

function syncGameTimerScale(nextScale = getCurrentGameTimeScale()) {
  const now = Date.now();
  if (!gamePaused && gameTimerStartedAt) {
    pausedElapsedMs += Math.max(0, now - gameTimerStartedAt) * gameTimerScale;
    realPausedElapsedMs += Math.max(0, now - realGameTimerStartedAt);
  }
  gameTimerStartedAt = now;
  realGameTimerStartedAt = now;
  gameTimerScale = nextScale;
}

function getElapsedMs() {
  if (gamePaused) return pausedElapsedMs;
  return pausedElapsedMs + (Math.max(0, Date.now() - gameTimerStartedAt) * gameTimerScale);
}

function getRealElapsedMs() {
  if (gamePaused) return realPausedElapsedMs;
  return realPausedElapsedMs + Math.max(0, Date.now() - realGameTimerStartedAt);
}

function renderGameTimer() {
  if (!gameTimerElement) return;
  if (replayMode) {
    gameTimerElement.textContent = "REPLAY";
    if (gameMovesElement) gameMovesElement.textContent = `${moveSequence} jugadas`;
    return;
  }
  gameTimerElement.textContent = formatElapsedTime(getElapsedMs());
  if (gameMovesElement) {
    gameMovesElement.textContent = `${moveSequence} ${moveSequence === 1 ? "jugada" : "jugadas"}`;
  }
}

function getHighestTileValue(state = gameState) {
  return Math.max(0, ...state.cells.flat().map((tile) => tile?.value || 0));
}

function normalizeRecordCategory(category) {
  return RECORD_CATEGORIES.includes(category) ? category : "normal";
}

function getCurrentRecordCategory() {
  return holeRunUsed ? "hole" : "normal";
}

function getRecordCategoryLabel(category) {
  return RECORD_CATEGORY_LABELS[normalizeRecordCategory(category)] || RECORD_CATEGORY_LABELS.normal;
}

function getMoveDirectionStats() {
  const counts = { up: 0, down: 0, left: 0, right: 0 };
  (currentReplay?.turns || []).forEach((turn) => {
    if (counts[turn.move] !== undefined) counts[turn.move] += 1;
  });
  return counts;
}

function getMilestoneStats() {
  const milestones = [
    { label: "128", min: 128 },
    { label: "256", min: 256 },
    { label: "512", min: 512 },
    { label: "1024", min: 1024 },
    { label: "2048", min: 2048 },
    { label: "4096", min: 4096 },
    { label: "8192", min: 8192 },
    { label: "16384", min: 16384 },
    { label: "32768", min: 32768 },
    { label: "65535", min: 65535 },
    { label: "Mas de 131.070", min: 131071 },
  ];
  return milestones.map((milestone) => {
    const matches = journalEntries.filter((entry) => Number(entry.value || 0) >= milestone.min);
    const firstMatch = matches.length ? matches[matches.length - 1] : null;
    return {
      ...milestone,
      count: matches.length,
      firstTime: firstMatch?.elapsedText || "--:--:--",
      firstClock: firstMatch?.timeText || "--:--:--",
    };
  });
}

function getMilestonePopoverEntries(min, nextMin = Infinity) {
  return journalEntries
    .filter((entry) => {
      const value = Number(entry.value || 0);
      return value >= min && value < nextMin;
    })
    .map((entry) => ({
      value: entry.value,
      elapsedText: entry.elapsedText || "--:--:--",
      timeText: entry.timeText || "--:--:--",
      coord: formatBoardCoordinate(entry.row, entry.col),
    }));
}

function closeStatsMilestonePopover() {
  statsMilestonePopoverElement?.classList.add("hidden");
  statsMilestonePopoverElement?.replaceChildren();
}

function openStatsMilestonePopover(cardElement, milestoneLabel, entries = []) {
  if (!statsMilestonePopoverElement || !cardElement) return;

  const title = document.createElement("strong");
  title.className = "stats-milestone-popover-title";
  title.textContent = milestoneLabel;

  const body = document.createElement("div");
  body.className = "stats-milestone-popover-body";

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "stats-milestone-popover-empty";
    empty.textContent = "Todavia no hay logros de esta ficha.";
    body.appendChild(empty);
  } else {
    entries.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "stats-milestone-popover-row";
      row.innerHTML = `<span>${formatAdminNumber(entry.value)} · ${entry.coord}</span><span>${entry.elapsedText}</span>`;
      body.appendChild(row);
    });
  }

  statsMilestonePopoverElement.replaceChildren(title, body);
  statsMilestonePopoverElement.classList.remove("hidden");

  const cardRect = cardElement.getBoundingClientRect();
  const shellRect = statsPanelElement?.querySelector(".stats-panel-shell")?.getBoundingClientRect();
  if (!shellRect) return;

  const desiredWidth = 280;
  const left = Math.max(
    12,
    Math.min(
      shellRect.width - desiredWidth - 12,
      (cardRect.left - shellRect.left) + (cardRect.width / 2) - (desiredWidth / 2)
    )
  );
  const top = Math.max(58, (cardRect.top - shellRect.top) - 12);

  statsMilestonePopoverElement.style.width = `${desiredWidth}px`;
  statsMilestonePopoverElement.style.left = `${Math.round(left)}px`;
  statsMilestonePopoverElement.style.top = `${Math.round(top)}px`;
}

function getEmptyCellCount(state = gameState) {
  return state.cells.flat().filter((tile) => !tile).length;
}

function getMatchMomentLabel(state = gameState) {
  const empties = getEmptyCellCount(state);
  const highestTile = getHighestTileValue(state);
  if (state.over) return lastGameOverReason === "BY USER" ? "Cierre voluntario" : "Final agonico";
  if (empties <= 1) return "Final agonico";
  if (empties <= 2) return "En apuros";
  if (currentFusionStreak >= 4) return "Remontada";
  if (highestTile >= 2048 || (highestTile >= 1024 && empties >= Math.max(4, boardSize - 1))) return "Dominando";
  if (empties >= Math.max(8, boardSize + 1)) return "Tablero abierto";
  if (moveSequence >= 20 && empties >= 4) return "Controlando";
  return "Partido vivo";
}

function noteDecisiveMoment(label) {
  decisiveMomentMs = getElapsedMs();
  decisiveMomentLabel = label;
}

function updateMomentumFromBoard() {
  const nextLabel = getMatchMomentLabel();
  momentumLabel = nextLabel;
  if (!demoMode && nextLabel !== lastMomentumAnnouncement) {
    if (nextLabel === "En apuros" || nextLabel === "Final agonico") {
      if (announceMatchCommentary("danger", { moves: moveSequence }, "accent")) {
        lastMomentumAnnouncement = nextLabel;
      }
    } else if (nextLabel === "Remontada" || nextLabel === "Dominando") {
      if (announceMatchCommentary(nextLabel === "Remontada" ? "comeback" : "build", { moves: moveSequence }, "accent")) {
        lastMomentumAnnouncement = nextLabel;
      }
    } else if (nextLabel === "Controlando" || nextLabel === "Tablero abierto") {
      if (announceMatchCommentary("build", { moves: moveSequence }, "normal")) {
        lastMomentumAnnouncement = nextLabel;
      }
    } else if (nextLabel === "Partido vivo") {
      if (announceMatchCommentary("pressure", { moves: moveSequence }, "normal")) {
        lastMomentumAnnouncement = nextLabel;
      }
    }
  }
}

function maybeAnnounceAmbientCommentary(nextMoveNumber, gained = 0, highestMerge = 0, crossedScoreBucket = false) {
  if (demoMode) return;
  if (highestMerge >= 128 || crossedScoreBucket) return;
  if (nextMoveNumber <= 1) return;

  const interval = holeMode ? (nextMoveNumber < 30 ? 12 : nextMoveNumber < 120 ? 18 : 24) : (nextMoveNumber < 12 ? 2 : nextMoveNumber < 40 ? 3 : 4);
  if ((nextMoveNumber - lastAmbientCommentaryMove) < interval) return;

  const matchMoment = getMatchMomentLabel();
  const empties = getEmptyCellCount();
  let category = "pressure";

  if (currentFusionStreak >= 3 && gained > 0) {
    category = "comeback";
  } else if (matchMoment === "En apuros" || matchMoment === "Final agonico" || empties <= 2) {
    category = nextMoveNumber % 2 === 0 ? "danger" : "pressure";
  } else if (matchMoment === "Dominando" || matchMoment === "Controlando" || matchMoment === "Tablero abierto") {
    category = "build";
  } else if (gained > 0) {
    category = nextMoveNumber % 3 === 0 ? "build" : "pressure";
  } else if (nextMoveNumber % 5 === 0) {
    category = "comeback";
  }

  lastAmbientCommentaryMove = nextMoveNumber;
  announceMatchCommentary(category, { moves: nextMoveNumber, score: gameState.score }, category === "danger" ? "accent" : "normal");
}

function getCommentaryCooldownMs(tone = "normal") {
  if (replayMode || demoMode || gamePaused || gameState.over) return Number.POSITIVE_INFINITY;
  const base = holeMode ? 2500 : 3600;
  if (tone === "record") return base + 1800;
  if (tone === "accent" || tone === "danger") return base + 700;
  return base;
}

function maybePulseCommentary() {
  if (replayMode || demoMode || gamePaused || gameState.over || !moveSequence) return;
  if ((Date.now() - lastCommentaryAt) < getCommentaryCooldownMs("normal")) return;

  const matchMoment = getMatchMomentLabel();
  const empties = getEmptyCellCount();
  let category = "pressure";

  if (currentFusionStreak >= 3) {
    category = "comeback";
  } else if (matchMoment === "En apuros" || matchMoment === "Final agonico" || empties <= 2) {
    category = moveSequence % 2 === 0 ? "danger" : "pressure";
  } else if (matchMoment === "Dominando" || matchMoment === "Controlando" || matchMoment === "Tablero abierto") {
    category = "build";
  } else if (moveSequence % 7 === 0) {
    category = "score";
  } else if (moveSequence % 5 === 0) {
    category = "comeback";
  }

  announceMatchCommentary(category, { moves: moveSequence, score: gameState.score }, category === "danger" ? "accent" : "normal");
}

async function updateAdminUserPin() {
  if (!adminSelectedUserAlias) return;
  const nextPin = String(adminUserNewPinInput?.value || "").trim();
  if (!/^[0-9]{4}$/.test(nextPin)) {
    if (adminUserStatusElement) adminUserStatusElement.textContent = "El nuevo PIN del jugador debe tener 4 cifras.";
    return;
  }
  try {
    adminUserLoading = true;
    renderAdminUserPanel();
    const pinHash = await sha256Hex(nextPin);
    adminSelectedUserData = await postWorkerJson("/admin/player/pin", {
      alias: adminSelectedUserAlias,
      pinHash,
    });
    if (adminUserNewPinInput) adminUserNewPinInput.value = "";
    if (adminUserStatusElement) adminUserStatusElement.textContent = `PIN de ${adminSelectedUserAlias} actualizado correctamente.`;
    if (advancedPlayerAuth?.alias && adminSelectedUserData?.alias === advancedPlayerAuth.alias) {
      logoutAdvancedPlayer();
      setStatus("PIN del jugador actual cambiado. Vuelve a iniciar sesion.");
    }
  } catch (error) {
    if (adminUserStatusElement) adminUserStatusElement.textContent = `No pude cambiar el PIN: ${error.message}`;
  } finally {
    adminUserLoading = false;
    renderAdminUserPanel();
  }
}

async function updateAdminPanelPin() {
  const nextPin = String(adminNewPinInput?.value || "").trim();
  if (!/^[0-9]{6}$/.test(nextPin)) {
    setAdminPanelStatus("El nuevo PIN del panel debe tener 6 cifras.");
    return;
  }
  try {
    const pinHash = await sha256Hex(nextPin);
    await postWorkerJson("/admin/pin/save", { pinHash });
    adminSessionToken = "";
    sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
    if (adminNewPinInput) adminNewPinInput.value = "";
    setAdminPanelStatus("PIN del panel actualizado. Vuelve a autenticarte con el nuevo valor.");
    setAdminPanelOpen(false);
  } catch (error) {
    setAdminPanelStatus(`No pude cambiar el PIN del panel: ${error.message}`);
  }
}

function renderStatsPanel() {
  if (!statsPanelContentElement) return;

  const realElapsedMs = getRealElapsedMs();
  const elapsedText = formatElapsedTime(realElapsedMs);
  const totalMoves = moveSequence;
  const averageScore = totalMoves ? (gameState.score / totalMoves).toFixed(1) : "0.0";
  const mode = `${boardSize}x${boardSize}`;
  const isPostGame = gameState.over;
  const achievementValues = journalEntries.map((entry) => Number(entry.value) || 0);
  const directionStats = getMoveDirectionStats();
  const milestoneStats = getMilestoneStats();
  const highestTile = getHighestTileValue();
  const directionTotal = Object.values(directionStats).reduce((sum, count) => sum + count, 0);
  const elapsedMinutes = Math.max(1 / 60, realElapsedMs / 60000);
  const elapsedHours = Math.max(1 / 3600, realElapsedMs / 3600000);
  const elapsedSeconds = Math.max(1, realElapsedMs / 1000);
  const scorePerMinute = Number(elapsedText === "00:00:00" ? 0 : (gameState.score / elapsedMinutes)).toFixed(1);
  const movesPerMinute = Number(totalMoves / elapsedMinutes).toFixed(1);
  const movesPerHour = Number(totalMoves / elapsedHours).toFixed(1);
  const movesPerSecond = Number(totalMoves / elapsedSeconds).toFixed(2);
  const totalAchievements = achievementValues.length;
  const empties = getEmptyCellCount();
  const topDirectionEntry = Object.entries(directionStats).sort((a, b) => b[1] - a[1])[0] || ["up", 0];
  const lowDirectionEntry = Object.entries(directionStats).sort((a, b) => a[1] - b[1])[0] || ["up", 0];
  const milestoneCards = milestoneStats
    .map(({ label, min }, index) => {
      const count = achievementValues.filter((value) => value >= min).length;
      const nextMin = milestoneStats[index + 1]?.min ?? 999999999;
      return `
        <button type="button" class="stats-milestone-card" data-milestone-label="${escapeHtml(label)}" data-milestone-min="${min}" data-milestone-next="${nextMin}">
          <span class="stats-milestone-label">${label}</span>
          <span class="stats-milestone-value">${count}</span>
        </button>
      `;
    })
    .join("");
  const directionRows = Object.entries(directionStats)
    .map(([direction, count]) => `
        <div class="stats-list-row">
          <span>${getDirectionLabel(direction)}</span>
          <span>${count}${directionTotal ? ` · ${Math.round((count / directionTotal) * 100)}%` : ""}</span>
        </div>
      `)
    .join("");
  const topCards = isPostGame
    ? `
        <div class="stats-card">
          <span class="stats-card-label">Modo</span>
          <span class="stats-card-value">${mode}</span>
        </div>
        <div class="stats-card">
          <span class="stats-card-label">Final</span>
          <span class="stats-card-value">${lastGameOverReason || "BY MACHINE"}</span>
        </div>
        <div class="stats-card">
          <span class="stats-card-label">Puntuacion</span>
          <span class="stats-card-value">${gameState.score}</span>
        </div>
        <div class="stats-card">
          <span class="stats-card-label">Tiempo Real</span>
          <span class="stats-card-value">${elapsedText}</span>
        </div>
        <div class="stats-card">
          <span class="stats-card-label">Jugadas</span>
          <span class="stats-card-value">${totalMoves}</span>
        </div>
        <div class="stats-card">
          <span class="stats-card-label">Puntos por jugada</span>
          <span class="stats-card-value">${averageScore}</span>
        </div>
      `
    : `
        <div class="stats-card">
          <span class="stats-card-label">Modo</span>
          <span class="stats-card-value">${mode}</span>
        </div>
        <div class="stats-card">
          <span class="stats-card-label">Tiempo Real</span>
          <span class="stats-card-value">${elapsedText}</span>
        </div>
        <div class="stats-card stats-card-split">
          <div class="stats-split-item">
            <span class="stats-card-label">Jugadas</span>
            <span class="stats-card-value">${totalMoves}</span>
          </div>
          <div class="stats-split-item">
            <span class="stats-card-label">Jugadas por segundo</span>
            <span class="stats-card-value">${movesPerSecond}</span>
          </div>
        </div>
        <div class="stats-card stats-card-split">
          <div class="stats-split-item">
            <span class="stats-card-label">Jugadas por minuto</span>
            <span class="stats-card-value">${movesPerMinute}</span>
          </div>
          <div class="stats-split-item">
            <span class="stats-card-label">Jugadas por hora</span>
            <span class="stats-card-value">${movesPerHour}</span>
          </div>
        </div>
        <div class="stats-card">
          <span class="stats-card-label">Puntos por jugada</span>
          <span class="stats-card-value">${averageScore}</span>
        </div>
      `;

  if (statsEyebrowElement) {
    statsEyebrowElement.textContent = isPostGame ? "Resumen final" : "Tiempo real";
  }
  const statsTitle = document.getElementById("stats-title");
  if (statsTitle) {
    statsTitle.textContent = isPostGame ? "Estadisticas Finales" : "Estadisticas en Tiempo Real";
  }

  const milestoneTimingRows = milestoneStats
    .map((entry) => `
      <div class="stats-list-row">
        <span>${entry.label}</span>
        <span>${entry.count} · ${entry.firstTime}</span>
      </div>
    `)
    .join("");

  const finalSummarySection = isPostGame
    ? `
      <div class="stats-section">
        <h4>Resumen final</h4>
        <div class="stats-summary-grid">
          <div class="stats-summary-row"><span>Categoria</span><strong>${getRecordCategoryLabel(getCurrentRecordCategory())}</strong></div>
          <div class="stats-summary-row"><span>Ficha maxima</span><strong>${formatAdminNumber(highestTile)}</strong></div>
          <div class="stats-summary-row"><span>Record local</span><strong>${formatAdminNumber(gameState.bestScore)}</strong></div>
          <div class="stats-summary-row"><span>Puntos por minuto</span><strong>${scorePerMinute}</strong></div>
          <div class="stats-summary-row"><span>Jugadas por minuto</span><strong>${movesPerMinute}</strong></div>
          <div class="stats-summary-row"><span>Logros 128+</span><strong>${formatAdminNumber(totalAchievements)}</strong></div>
          <div class="stats-summary-row"><span>Casillas vacias finales</span><strong>${empties}</strong></div>
          <div class="stats-summary-row"><span>Direccion favorita</span><strong>${getDirectionLabel(topDirectionEntry[0])}</strong></div>
          <div class="stats-summary-row"><span>Direccion menos usada</span><strong>${getDirectionLabel(lowDirectionEntry[0])}</strong></div>
          <div class="stats-summary-row"><span>Cronometro final</span><strong>${elapsedText}</strong></div>
        </div>
      </div>
      <div class="stats-section">
        <h4>Cuando llego cada ficha</h4>
        <div class="stats-list">
          ${milestoneTimingRows}
        </div>
      </div>
    `
    : "";

  statsPanelContentElement.innerHTML = `
      <div class="stats-grid">
        ${topCards}
      </div>
      ${finalSummarySection}
      <div class="stats-section">
        <h4>Logros por ficha</h4>
        <div class="stats-milestones-grid">
          ${milestoneCards}
        </div>
      </div>
      <div class="stats-section">
        <h4>Distribucion de movimientos</h4>
        <div class="stats-list">
          ${directionRows}
        </div>
      </div>
    `;
}

function buildFinalStatsEmailBody() {
  const elapsedText = formatElapsedTime(getRealElapsedMs());
  const totalMoves = moveSequence;
  const mode = `${boardSize}x${boardSize}`;
  const highestTile = getHighestTileValue();
  const milestoneStats = getMilestoneStats();
  const directionStats = getMoveDirectionStats();
  const directionLines = Object.entries(directionStats)
    .map(([direction, count]) => `- ${getDirectionLabel(direction)}: ${count}`)
    .join("\n");
  const milestoneLines = milestoneStats
    .map((entry) => `- ${entry.label}: ${entry.count} (primera vez en ${entry.firstTime})`)
    .join("\n");

  return [
    `Estadisticas Finales de 2048 Angeloso`,
    ``,
    `Modo: ${mode}`,
    `Categoria: ${getRecordCategoryLabel(getCurrentRecordCategory())}`,
    `Final: ${lastGameOverReason || "BY MACHINE"}`,
    `Puntuacion: ${formatAdminNumber(gameState.score)}`,
    `Record local: ${formatAdminNumber(gameState.bestScore)}`,
    `Tiempo real: ${elapsedText}`,
    `Jugadas: ${formatAdminNumber(totalMoves)}`,
    `Ficha maxima: ${formatAdminNumber(highestTile)}`,
    ``,
    `Distribucion de movimientos`,
    directionLines,
    ``,
    `Logros por ficha`,
    milestoneLines,
  ].join("\n");
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
  realGameTimerStartedAt = gameTimerStartedAt;
  gameTimerScale = getCurrentGameTimeScale();
  gamePaused = false;
  pausedElapsedMs = 0;
  realPausedElapsedMs = 0;
  lastTimerMilestone = 0;
  lastAutosaveMilestone = 0;
  renderGameTimer();
  gameTimerInterval = window.setInterval(() => {
    if (replayMode || gameState.over || demoMode || gamePaused) return;
    renderGameTimer();
    maybeCelebrateTimeMilestone();
    maybePulseCommentary();
    maybeAutosaveSession();
  }, 250);
}

function maybeCelebrateTimeMilestone() {
  if (replayMode || gameState.over || demoMode || gamePaused) return;
  const elapsedMs = getElapsedMs();
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

  playTimeMilestoneSound();
  setStatus(`${minutes} minutos de partida.`);
  announceMatchCommentary("marathon", { minutes }, "accent", { force: true });
  showSystemAnnouncement(`${minutes} MINUTOS`, "accent");
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
  syncGameTimerScale(1);
  holeMode = false;
  holeSequenceProgress = 0;
  holePreferredCorner = null;
  if (holeTimer) {
    window.clearTimeout(holeTimer);
    holeTimer = null;
  }
  if (!keepStatus && statusElement.textContent.startsWith("MODO H.O.L.E.")) {
    setStatus("");
  }
  updateHoleSpeedUI();
}

function endGameByMachine() {
  gameState.over = true;
  stopHoleMode({ keepStatus: true });
  render();
  renderGameTimer();
  setGameOverOverlay(true, "BY MACHINE");
  void settleAdvancedRound("BY MACHINE").then((settlement) => reportAdvancedSession("BY MACHINE", settlement));
  maybePersistCurrentScore();
  setStatus("No quedan movimientos. Pulsa Nueva partida.");
}

function updatePauseButton() {
  if (!pauseButton) return;
  pauseButton.textContent = gamePaused ? "SEGUIR" : "PAUSA";
  pauseButton.classList.toggle("is-active", gamePaused);
}

function updateManualStartUI() {
  manualStartOverlayElement?.classList.toggle("hidden", !awaitingManualStart);
  restartButton?.classList.toggle("awaiting-start", awaitingManualStart);
}

function setPauseOverlay(visible) {
  pauseOverlayElement?.classList.toggle("hidden", !visible);
}

function clearSessionSnapshot() {
  localStorage.removeItem(SESSION_SNAPSHOT_KEY);
}

function loadSaveSlots() {
  try {
    const raw = localStorage.getItem(SAVE_SLOTS_KEY);
    const slots = raw ? JSON.parse(raw) : [];
    return Array.isArray(slots) ? slots.slice(0, 4) : [];
  } catch {
    return [];
  }
}

function saveSaveSlots(slots) {
  localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots.slice(0, 4)));
}

function maybeAutosaveSession(force = false) {
  if (demoMode || replayMode || !attractDismissed) return;
  if (!force) {
    const milestone = Math.floor(getElapsedMs() / AUTOSAVE_INTERVAL_MS);
    if (milestone <= 0 || milestone === lastAutosaveMilestone) return;
    lastAutosaveMilestone = milestone;
  }
  persistSessionSnapshot();
}

function persistSessionSnapshot() {
  if (demoMode || replayMode || !attractDismissed) return;

  const snapshot = {
    version: 1,
    boardSize,
    nextTileId,
    gameState: cloneGameState(gameState),
    currentReplay: currentReplay ? buildSafeReplayPayload(currentReplay, { target: "session" }).payload : null,
    journalEntries: cloneJournalEntries(journalEntries),
    moveSequence,
    gameTimerElapsedMs: getElapsedMs(),
    realGameTimerElapsedMs: getRealElapsedMs(),
    globalRecordFanfarePlayed,
    recordLeaderActive: bestScoreCardElement?.classList.contains("record-leader") || false,
    advancedMode,
    advancedCredits,
    activeAdvancedRound: cloneAdvancedRound(activeAdvancedRound),
    advancedBetResultMessage,
    paused: gamePaused,
    statusText: statusElement.textContent,
    initialsEntry: initialsEntryState.active ? {
      letters: initialsEntryState.letters.slice(),
      slot: initialsEntryState.slot,
      selectedIndex: initialsEntryState.selectedIndex,
      pendingScore: initialsEntryState.pendingScore,
      remainingMs: Math.max(0, initialsEntryState.deadlineAt - Date.now()),
    } : null,
  };

  try {
    localStorage.setItem(SESSION_SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    try {
      snapshot.currentReplay = null;
      snapshot.replayTruncated = true;
      localStorage.setItem(SESSION_SNAPSHOT_KEY, JSON.stringify(snapshot));
    } catch {
      // Ignore quota issues here; final record save has its own fallback path.
    }
  }
}

function buildCheckpointReplayFromCurrentBoard() {
  const start = [];
  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const tile = gameState.cells[row][col];
      if (!tile) continue;
      start.push({ row, col, value: tile.value });
    }
  }

  return {
    version: 1,
    boardSize,
    mode: `${boardSize}x${boardSize}`,
    startedAt: new Date().toISOString(),
    start,
    turns: [],
  };
}

function renderInitialsTimer() {
  if (!initialsTimerElement) return;
  const remainingMs = Math.max(0, initialsEntryState.deadlineAt - Date.now());
  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  initialsTimerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  initialsTimerElement.classList.toggle("is-warning", remainingMs <= 10000);
}

function stopInitialsTimer() {
  if (initialsTimerInterval) {
    window.clearInterval(initialsTimerInterval);
    initialsTimerInterval = null;
  }
}

function startInitialsTimer() {
  stopInitialsTimer();
  renderInitialsTimer();
  initialsTimerInterval = window.setInterval(() => {
    renderInitialsTimer();
    if (Date.now() >= initialsEntryState.deadlineAt) {
      stopInitialsTimer();
      savePendingRecord("???");
    }
  }, 250);
}

function setGamePaused(nextPaused, options = {}) {
  const { statusMessage = nextPaused ? "Partida en pausa." : "Partida reanudada.", persist = true } = options;
  if (nextPaused === gamePaused) return;

  if (nextPaused) {
    pausedElapsedMs = getElapsedMs();
    realPausedElapsedMs = getRealElapsedMs();
    gamePaused = true;
    gameTimerStartedAt = Date.now();
    realGameTimerStartedAt = gameTimerStartedAt;
    stopGameTimer();
    if (holeTimer) {
      window.clearTimeout(holeTimer);
      holeTimer = null;
    }
    setPauseOverlay(true);
    setStatus(statusMessage);
    updatePauseButton();
    if (persist) persistSessionSnapshot();
    return;
  }

  gamePaused = false;
  gameTimerStartedAt = Date.now();
  realGameTimerStartedAt = gameTimerStartedAt;
  gameTimerScale = getCurrentGameTimeScale();
  setPauseOverlay(false);
  updatePauseButton();
  renderGameTimer();
  gameTimerInterval = window.setInterval(() => {
    if (replayMode || gameState.over || demoMode || gamePaused) return;
    renderGameTimer();
    maybeCelebrateTimeMilestone();
    maybeAutosaveSession();
  }, 250);
  setStatus(statusMessage);
  if (holeMode) {
    scheduleHoleMove();
  }
  if (persist) persistSessionSnapshot();
}

function setSaveSlotsPanelOpen(nextOpen) {
  saveSlotsPanelOpen = nextOpen;
  saveSlotsPanelElement?.classList.toggle("hidden", !saveSlotsPanelOpen);
  if (saveSlotsPanelOpen) {
    renderSaveSlots();
  }
}

function buildPlayableSnapshot() {
  return {
    version: 1,
    boardSize,
    nextTileId,
    gameState: cloneGameState(gameState),
    currentReplay: currentReplay ? buildSafeReplayPayload(currentReplay, { target: "slot" }).payload : null,
    journalEntries: cloneJournalEntries(journalEntries),
    moveSequence,
    gameTimerElapsedMs: getElapsedMs(),
    globalRecordFanfarePlayed,
    recordLeaderActive: bestScoreCardElement?.classList.contains("record-leader") || false,
    advancedMode,
    advancedCredits,
    activeAdvancedRound: cloneAdvancedRound(activeAdvancedRound),
    advancedBetResultMessage,
    statusText: statusElement.textContent,
  };
}

function saveGameToSlot(slotIndex) {
  const now = new Date();
  const slots = loadSaveSlots();
  slots[slotIndex] = {
    slot: slotIndex,
    savedAt: now.toISOString(),
    displayDate: new Intl.DateTimeFormat("es-ES", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(now),
    score: gameState.score,
    moves: moveSequence,
    mode: `${boardSize}x${boardSize}`,
    snapshot: buildPlayableSnapshot(),
  };
  try {
    saveSaveSlots(slots);
  } catch {
    slots[slotIndex].snapshot.currentReplay = null;
    slots[slotIndex].snapshot.replayTruncated = true;
    saveSaveSlots(slots);
  }
  renderSaveSlots();
  persistSessionSnapshot();
  setStatus(slots[slotIndex].snapshot.replayTruncated ? `Partida guardada en Slot ${slotIndex + 1} sin replay completa.` : `Partida guardada en Slot ${slotIndex + 1}.`);
}

function restorePlayableSnapshot(snapshot) {
  attractDismissed = true;
  attractOverlayElement.classList.add("hidden");
  stopDemoMode();
  stopHoleMode({ keepStatus: true });
  discardReplayState();

  boardSize = Number(snapshot.boardSize || boardSize);
  boardSizeSelect.value = String(boardSize);
  nextTileId = Number(snapshot.nextTileId || 0);
  gameState = cloneGameState(snapshot.gameState);
  currentReplay = decodeReplayPayload(snapshot.currentReplay) || buildCheckpointReplayFromCurrentBoard();
  journalEntries = cloneJournalEntries(snapshot.journalEntries || []);
  moveSequence = Number(snapshot.moveSequence || 0);
  advancedMode = Boolean(snapshot.advancedMode);
  advancedCredits = Number(snapshot.advancedCredits ?? advancedCredits);
  activeAdvancedRound = cloneAdvancedRound(snapshot.activeAdvancedRound);
  advancedBetResultMessage = String(snapshot.advancedBetResultMessage || "");
  moveHistory = [];
  globalRecordFanfarePlayed = Boolean(snapshot.globalRecordFanfarePlayed);
  pausedElapsedMs = Number(snapshot.gameTimerElapsedMs || 0);
  realPausedElapsedMs = Number(snapshot.realGameTimerElapsedMs || snapshot.gameTimerElapsedMs || 0);
  gamePaused = true;
  gameSessionId += 1;

  buildGrid();
  clearBestScoreCelebration();
  if (snapshot.recordLeaderActive) {
    bestScoreCardElement?.classList.add("record-leader");
  }

  render();
  renderJournal();
  renderUndoHistory();
  updateAdvancedModeUI();
  renderRecords();
  renderGameTimer();
  setPauseOverlay(true);
  updatePauseButton();
  setStatus(snapshot.statusText || "Partida cargada. Pulsa SEGUIR.");
  persistSessionSnapshot();
}

function loadGameFromSlot(slotIndex) {
  const slot = loadSaveSlots()[slotIndex];
  if (!slot?.snapshot) return;
  closeInitialsEntry({ discard: true });
  restorePlayableSnapshot(slot.snapshot);
  setSaveSlotsPanelOpen(false);
  const replay = decodeReplayPayload(slot.snapshot.currentReplay);
  if (replay) {
    void openReplayViewer(replay, {
      initials: `S${slotIndex + 1}`,
      mode: slot.mode,
      score: slot.score,
      displayDate: slot.displayDate,
      replay,
    });
    setStatus(`Slot ${slotIndex + 1} cargado. Replay listo para Play.`);
    return;
  }
  setStatus(`Slot ${slotIndex + 1} cargado. Pulsa SEGUIR.`);
}

function renderSaveSlots() {
  if (!saveSlotsListElement) return;
  const slots = loadSaveSlots();
  saveSlotsListElement.innerHTML = "";

  for (let index = 0; index < 4; index += 1) {
    const slot = slots[index];
    const entry = document.createElement("div");
    entry.className = "save-slot-entry";

    const title = document.createElement("strong");
    title.textContent = `Slot ${index + 1}`;

    const meta = document.createElement("small");
    meta.textContent = slot
      ? `${slot.mode} | ${slot.score} puntos | ${slot.moves} movimientos | ${slot.displayDate}`
      : "Vacio";

    const actions = document.createElement("div");
    actions.className = "save-slot-actions";

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "secondary-button";
    saveButton.textContent = slot ? "Sobrescribir" : "Guardar";
    saveButton.addEventListener("click", () => saveGameToSlot(index));

    actions.appendChild(saveButton);

    if (slot) {
      const loadButton = document.createElement("button");
      loadButton.type = "button";
      loadButton.textContent = "Cargar";
      loadButton.addEventListener("click", () => loadGameFromSlot(index));
      actions.appendChild(loadButton);
    }

    entry.append(title, meta, actions);
    saveSlotsListElement.appendChild(entry);
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
  renderBoardCoordinates();
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

function getTileValueClasses(value) {
  const classes = [`tile-value-${Math.min(value, 2048)}`];
  if (value > 2048) {
    classes.push("tile-value-super");
    if (value >= 16384) {
      classes.push("tile-value-super-16384");
    } else if (value >= 8192) {
      classes.push("tile-value-super-8192");
    } else if (value >= 4096) {
      classes.push("tile-value-super-4096");
    }
  }
  return classes.join(" ");
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
  const { demo = false, advancedRound = null } = options;
  if (initialsEntryState.active) {
    closeInitialsEntry({ discard: true });
  }
  gameSessionId += 1;
  awaitingManualStart = false;
  discardReplayState();
  stopDemoMode();
  stopHoleMode({ keepStatus: true });
  setStatsPanelOpen(false);
  setGameOverOverlay(false);
  setPauseOverlay(false);
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
  holeRunUsed = false;
  activeAdvancedRound = demo ? null : cloneAdvancedRound(advancedRound);
  advancedSessionReported = false;
  advancedBetResultMessage = "";
  moveHistory = [];
  moveSequence = 0;
  currentFusionStreak = 0;
  bestFusionStreak = 0;
  decisiveMomentMs = 0;
  decisiveMomentLabel = "";
  momentumLabel = "Arrancando";
  lastMomentumAnnouncement = "";
  lastCommentaryScoreBucket = 0;
  lastAmbientCommentaryMove = 0;
  lastCommentaryAt = 0;
  commentaryLastIndexByCategory = {};
  globalRecordFanfarePlayed = false;
  globalRecordsLoaded = hasAnyGlobalRecords(globalRecordsCache);
  clearBestScoreCelebration();
  updatePauseButton();
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
      category: getCurrentRecordCategory(),
      startedAt: new Date().toISOString(),
      start: [startSpawnA, startSpawnB].filter(Boolean),
      turns: [],
    };
  }
  render();
  updateAdvancedModeUI();
  updateManualStartUI();
  renderJournal();
  renderUndoHistory();
  renderRecords();
  updateStatsButton();
  if (!demoMode) {
    clearSessionSnapshot();
  }
  if (!demoMode) {
    if (!hasAnyGlobalRecords(globalRecordsCache)) {
      renderGlobalRecordsLoading();
    }
    updateRecordsMiniTicker(globalRecordsCache);
    fetchGlobalRecords();
  }
  setStatus(demoMode ? "MODO DEMO" : "");
  if (!demoMode) {
    announceMatchCommentary("kickoff", { mode: `${boardSize}x${boardSize}` }, "accent", { force: true });
  }
  if (demoMode) scheduleDemoMove();
}

function restoreSessionSnapshot() {
  const raw = localStorage.getItem(SESSION_SNAPSHOT_KEY);
  if (!raw) return false;

  try {
    const snapshot = JSON.parse(raw);
    if (!snapshot?.gameState || snapshot.gameState.over) {
      clearSessionSnapshot();
      return false;
    }

    attractDismissed = true;
    attractOverlayElement.classList.add("hidden");
    stopDemoMode();
    stopHoleMode({ keepStatus: true });
    discardReplayState();

    boardSize = Number(snapshot.boardSize || boardSize);
    boardSizeSelect.value = String(boardSize);
    nextTileId = Number(snapshot.nextTileId || 0);
    gameState = cloneGameState(snapshot.gameState);
    currentReplay = decodeReplayPayload(snapshot.currentReplay);
    journalEntries = cloneJournalEntries(snapshot.journalEntries || []);
    moveSequence = Number(snapshot.moveSequence || 0);
    advancedMode = Boolean(snapshot.advancedMode ?? advancedMode);
    advancedCredits = Number(snapshot.advancedCredits ?? advancedCredits);
    activeAdvancedRound = cloneAdvancedRound(snapshot.activeAdvancedRound);
    advancedBetResultMessage = String(snapshot.advancedBetResultMessage || "");
    moveHistory = [];
    globalRecordFanfarePlayed = Boolean(snapshot.globalRecordFanfarePlayed);
    pausedElapsedMs = Number(snapshot.gameTimerElapsedMs || 0);
    realPausedElapsedMs = Number(snapshot.realGameTimerElapsedMs || snapshot.gameTimerElapsedMs || 0);
    gamePaused = true;
    gameSessionId += 1;

    buildGrid();
    clearBestScoreCelebration();
    if (snapshot.recordLeaderActive) {
      bestScoreCardElement?.classList.add("record-leader");
    }

    render();
    renderJournal();
    renderUndoHistory();
    updateAdvancedModeUI();
    renderRecords();
    renderGameTimer();
    setPauseOverlay(true);
    updatePauseButton();
    if (!currentReplay) {
      currentReplay = buildCheckpointReplayFromCurrentBoard();
    }
    setStatus(
      snapshot.replayTruncated
        ? "Partida recuperada desde el ultimo punto seguro. Pulsa SEGUIR."
        : (snapshot.statusText || "Partida recuperada. Pulsa SEGUIR.")
    );

    if (snapshot.initialsEntry?.pendingScore) {
      initialsEntryState.active = true;
      initialsEntryState.letters = Array.isArray(snapshot.initialsEntry.letters) ? snapshot.initialsEntry.letters.slice(0, 3) : ["", "", ""];
      initialsEntryState.slot = Number(snapshot.initialsEntry.slot || 0);
      initialsEntryState.selectedIndex = Number(snapshot.initialsEntry.selectedIndex || 0);
      initialsEntryState.pendingScore = Number(snapshot.initialsEntry.pendingScore || 0);
      initialsEntryState.deadlineAt = Date.now() + Math.max(1000, Number(snapshot.initialsEntry.remainingMs || INITIALS_TIMEOUT_MS));
      renderInitialsEntry();
      initialsEntryElement.classList.remove("hidden");
      startInitialsTimer();
    }

    renderGlobalRecordsLoading();
    fetchGlobalRecords();
    persistSessionSnapshot();
    return true;
  } catch {
    clearSessionSnapshot();
    return false;
  }
}

function setRecordsPanelOpen(nextOpen) {
  recordsPanelOpen = nextOpen;
  recordsPanelElement.classList.toggle("records-panel-collapsed", !recordsPanelOpen);
  toggleRecordsButton.textContent = recordsPanelOpen ? "Ocultar records" : "Mostrar records";
  if (recordsPanelOpen) {
    expandedRecordsMode = null;
    syncExpandedRecordsUI();
    renderGlobalRecordsLoading();
    fetchGlobalRecords();
  }
}

function setStatus(message) {
  statusElement.textContent = message;
  const normalized = String(message || "").trim();
  if (!normalized) return;
  if (!shouldStatusFeedTicker(normalized)) return;
  const tone = /error|no pude|fall/i.test(normalized)
    ? "danger"
    : /record|h\.o\.l\.e|demo|pausa|replay/i.test(normalized)
      ? "accent"
      : "normal";
  setTickerMessage(normalized, tone);
}

function clearStatusLaterIfUnchanged(message, delay = 3000) {
  window.setTimeout(() => {
    if ((statusElement?.textContent || "").trim() === String(message || "").trim()) {
      setStatus("");
    }
  }, delay);
}

function setAdminPanelStatus(message) {
  if (adminPanelStatusElement) {
    adminPanelStatusElement.textContent = message;
  }
}

function getCurrentMoveDuration() {
  return holeMode ? Math.max(6, Math.round(MOVE_DURATION / holeSpeedMultiplier)) : MOVE_DURATION;
}

function isHoleTurboMode() {
  return holeMode && holeSpeedMultiplier >= 8;
}

function syncMoveDurationUI() {
  const boardFrame = getBoardFrameElement();
  if (!boardFrame || replayMode) return;
  boardFrame.style.setProperty("--move-duration", `${isHoleTurboMode() ? 0 : getCurrentMoveDuration()}ms`);
}

function updateHoleSpeedUI() {
  if (holeSpeedSelect) {
    holeSpeedSelect.value = String(holeSpeedMultiplier);
  }
  if (holeSpeedControlElement) {
    holeSpeedControlElement.classList.toggle("hidden", !holeMode);
  }
  syncMoveDurationUI();
}

function getHoleStatusText() {
  return `MODO H.O.L.E. ${holeSpeedMultiplier}x. Pulsa Espacio para parar.`;
}

async function handleAdvancedModeToggle() {
  advancedMode = Boolean(advancedModeToggle?.checked);
  if (!advancedMode && activeAdvancedRound?.wagers?.length && !activeAdvancedRound.settled) {
    advancedMode = true;
    if (advancedModeToggle) advancedModeToggle.checked = true;
    setStatus("No puedes desactivar Modo Avanzado con una ronda activa.");
    return;
  }
  localStorage.setItem(ADVANCED_MODE_KEY, String(advancedMode));
  if (advancedMode) {
    advancedBetsVisible = true;
    advancedBetsCollapsed = false;
  }
  updateAdvancedModeUI();

  if (!advancedMode) {
    closeAdvancedAuthEntry();
    setStatus("Modo avanzado desactivado.");
    return;
  }

  const ready = await ensureAdvancedPlayer({ prompt: true });
  if (ready) {
    setStatus(`Modo avanzado listo para ${advancedPlayerAuth.alias}.`);
  }
}

async function submitAdvancedAuth() {
  const alias = normalizeAdvancedAlias(advancedAliasInput?.value || "");
  const pin = (advancedPinInput?.value || "").trim();

  if (!isValidAdvancedAlias(alias)) {
    const help = advancedAuthEntryElement?.querySelector(".advanced-auth-help");
    if (help) help.textContent = "Alias invalido. Usa 3-16 caracteres, letras, numeros, _ o -.";
    setStatus("Alias invalido. Usa 3-16 caracteres, letras, numeros, _ o -.");
    return;
  }
  if (!isValidAdvancedPin(pin)) {
    const help = advancedAuthEntryElement?.querySelector(".advanced-auth-help");
    if (help) help.textContent = "El PIN debe tener exactamente 4 cifras.";
    setStatus("El PIN debe tener 4 cifras.");
    return;
  }

  advancedAuthSubmitButton.disabled = true;
  setStatus("Conectando modo avanzado...");

  try {
    const pinHash = await sha256Hex(pin);
    const result = await syncAdvancedPlayer(alias, pinHash);
    const help = advancedAuthEntryElement?.querySelector(".advanced-auth-help");
    if (help) help.textContent = result.created ? "Cuenta creada correctamente." : "Acceso correcto.";
    closeAdvancedAuthEntry();
    setStatus(result.created ? `Jugador ${alias} creado con ${result.credits} creditos.` : `Jugador ${alias} conectado.`);
  } catch (error) {
    const help = advancedAuthEntryElement?.querySelector(".advanced-auth-help");
    if (help) help.textContent = error.message || "No pude acceder a esa cuenta.";
    setStatus(`Modo avanzado: ${error.message}`);
  } finally {
    advancedAuthSubmitButton.disabled = false;
  }
}

async function handleAdvancedAuthSubmitEvent(event) {
  event?.preventDefault?.();
  await submitAdvancedAuth();
}

function logoutAdvancedPlayer() {
  if (activeAdvancedRound?.wagers?.length && !activeAdvancedRound.settled) {
    setStatus("No puedes hacer logout con una ronda avanzada activa.");
    return;
  }
  advancedPlayerAuth = null;
  advancedCredits = DEFAULT_ADVANCED_CREDITS;
  saveAdvancedPlayerAuth(null);
  closeAdvancedAuthEntry();
  advancedMode = false;
  advancedBetsVisible = false;
  advancedBetsCollapsed = false;
  if (advancedModeToggle) advancedModeToggle.checked = false;
  localStorage.setItem(ADVANCED_MODE_KEY, "false");
  updateAdvancedModeUI();
  setStatus("Sesion avanzada cerrada.");
}

function closeAdvancedModePanel() {
  closeAdvancedAuthEntry();
  advancedBetsVisible = false;
  updateAdvancedModeUI();
  setStatus("Panel de Modo Avanzado cerrado.");
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

const snakeWeightMapCache = new Map();

function buildSnakeWeightMaps() {
  if (snakeWeightMapCache.has(boardSize)) {
    return snakeWeightMapCache.get(boardSize);
  }
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
  snakeWeightMapCache.set(boardSize, maps);
  return maps;
}

function getEmptyPositions(values) {
  const empty = [];
  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      if (values[row][col] === 0) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
}

function getAdjacentEmptyCount(values, row, col) {
  let count = 0;
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
    const nextRow = row + dr;
    const nextCol = col + dc;
    if (nextRow >= 0 && nextRow < boardSize && nextCol >= 0 && nextCol < boardSize && values[nextRow][nextCol] === 0) {
      count += 1;
    }
  });
  return count;
}

function getCornerDefinitions() {
  return {
    topLeft: { row: 0, col: 0, vertical: "up", horizontal: "left" },
    topRight: { row: 0, col: boardSize - 1, vertical: "up", horizontal: "right" },
    bottomLeft: { row: boardSize - 1, col: 0, vertical: "down", horizontal: "left" },
    bottomRight: { row: boardSize - 1, col: boardSize - 1, vertical: "down", horizontal: "right" },
  };
}

function getBoardSignature(values) {
  return values.map((row) => row.join(",")).join("|");
}

function applySpawnToValues(values, row, col, value) {
  const nextValues = cloneBoardValues(values);
  nextValues[row][col] = value;
  return nextValues;
}

function scoreSnakeAlignment(values) {
  const weightMaps = buildSnakeWeightMaps();
  return Math.max(
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
}

function scoreBoardForCorner(values, cornerKey) {
  const corners = getCornerDefinitions();
  const corner = corners[cornerKey];
  if (!corner) return Number.NEGATIVE_INFINITY;

  let total = 0;
  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const value = values[row][col];
      if (!value) continue;
      const distance = Math.abs(row - corner.row) + Math.abs(col - corner.col);
      total += Math.log2(value) * ((boardSize * 2) - distance);
    }
  }
  return total;
}

function getDominantSnakeWeightMap(values) {
  const weightMaps = buildSnakeWeightMaps();
  let bestMap = weightMaps[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  weightMaps.forEach((weightMap) => {
    let score = 0;
    for (let row = 0; row < boardSize; row += 1) {
      for (let col = 0; col < boardSize; col += 1) {
        const value = values[row][col];
        if (!value) continue;
        score += Math.log2(value) * weightMap[row][col];
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMap = weightMap;
    }
  });

  return bestMap;
}

function scoreMonotonicity(values) {
  let total = 0;

  for (let row = 0; row < boardSize; row += 1) {
    let leftToRight = 0;
    let rightToLeft = 0;
    for (let col = 0; col < boardSize - 1; col += 1) {
      const current = values[row][col] ? Math.log2(values[row][col]) : 0;
      const next = values[row][col + 1] ? Math.log2(values[row][col + 1]) : 0;
      leftToRight += Math.max(0, current - next);
      rightToLeft += Math.max(0, next - current);
    }
    total += Math.max(leftToRight, rightToLeft);
  }

  for (let col = 0; col < boardSize; col += 1) {
    let topToBottom = 0;
    let bottomToTop = 0;
    for (let row = 0; row < boardSize - 1; row += 1) {
      const current = values[row][col] ? Math.log2(values[row][col]) : 0;
      const next = values[row + 1][col] ? Math.log2(values[row + 1][col]) : 0;
      topToBottom += Math.max(0, current - next);
      bottomToTop += Math.max(0, next - current);
    }
    total += Math.max(topToBottom, bottomToTop);
  }

  return total;
}

function scoreSmoothness(values) {
  let penalty = 0;
  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const current = values[row][col];
      if (!current) continue;
      const currentLog = Math.log2(current);
      if (col + 1 < boardSize && values[row][col + 1]) {
        penalty += Math.abs(currentLog - Math.log2(values[row][col + 1]));
      }
      if (row + 1 < boardSize && values[row + 1][col]) {
        penalty += Math.abs(currentLog - Math.log2(values[row + 1][col]));
      }
    }
  }
  return penalty;
}

function determineHolePreferredCorner(values) {
  const corners = Object.keys(getCornerDefinitions());
  let bestCorner = corners[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  corners.forEach((cornerKey) => {
    const score = scoreSnakeAlignment(values) + (scoreBoardForCorner(values, cornerKey) * 12);
    if (score > bestScore) {
      bestScore = score;
      bestCorner = cornerKey;
    }
  });

  return bestCorner;
}

function scoreCornerDiscipline(values, preferredCorner) {
  const corner = getCornerDefinitions()[preferredCorner];
  if (!corner) return 0;

  const maxTile = Math.max(...values.flat());
  let anchorBonus = 0;
  if (values[corner.row][corner.col] === maxTile) {
    anchorBonus += maxTile * 90;
  } else {
    anchorBonus -= maxTile * 120;
  }

  const edgeValues = [];
  if (corner.vertical === "up") {
    edgeValues.push(...values[corner.row]);
  } else {
    edgeValues.push(...values[corner.row].slice().reverse());
  }

  const columnValues = [];
  for (let row = 0; row < boardSize; row += 1) {
    columnValues.push(values[row][corner.col]);
  }
  if (corner.vertical === "down") {
    columnValues.reverse();
  }

  let monotonicEdgeBonus = 0;
  [edgeValues, columnValues].forEach((line) => {
    for (let index = 0; index < line.length - 1; index += 1) {
      const current = line[index] || 0;
      const next = line[index + 1] || 0;
      if (current >= next) {
        monotonicEdgeBonus += current ? Math.log2(current + 1) * 45 : 10;
      } else {
        monotonicEdgeBonus -= (next - current) * 4;
      }
    }
  });

  return anchorBonus + monotonicEdgeBonus;
}

function scoreMergeReadiness(values, preferredCorner) {
  const corner = getCornerDefinitions()[preferredCorner];
  if (!corner) return 0;

  const axisDirections = [corner.vertical, corner.horizontal];
  let bonus = 0;

  axisDirections.forEach((direction) => {
    const simulation = simulateDirectionOnValues(values, direction);
    if (!simulation.moved) return;
    bonus += simulation.gainedScore * 18;
    bonus += simulation.highestMerge * 7;
  });

  return bonus;
}

function evaluateBoardValues(values, gainedScore = 0, preferredCorner = holePreferredCorner) {
  const emptyCells = countEmptyCells(values);
  const mobility = countAvailableMovesForValues(values);
  if (mobility === 0) return Number.NEGATIVE_INFINITY;

  const weightedSnake = scoreSnakeAlignment(values);
  const monotonicity = scoreMonotonicity(values);
  const smoothnessPenalty = scoreSmoothness(values);
  const maxTile = Math.max(...values.flat());
  const maxInCorner = [values[0][0], values[0][boardSize - 1], values[boardSize - 1][0], values[boardSize - 1][boardSize - 1]]
    .includes(maxTile);
  const cornerDiscipline = preferredCorner ? scoreCornerDiscipline(values, preferredCorner) : 0;
  const mergeReadiness = preferredCorner ? scoreMergeReadiness(values, preferredCorner) : 0;
  const cornerShaping = preferredCorner ? scoreBoardForCorner(values, preferredCorner) : 0;

  return (
    (emptyCells * 10000)
    + (mobility * 2200)
    + (gainedScore * 18)
    + (weightedSnake * 1.4)
    + (monotonicity * 180)
    - (smoothnessPenalty * 140)
    + (cornerShaping * 55)
    + cornerDiscipline
    + mergeReadiness
    + (maxInCorner ? maxTile * 24 : 0)
  );
}

function getHoleSearchDepth(values) {
  const emptyCells = countEmptyCells(values);
  if (boardSize === 4) {
    if (emptyCells <= 2) return 6;
    if (emptyCells <= 5) return 5;
    if (emptyCells <= 8) return 4;
    return 3;
  }
  if (boardSize === 5) {
    if (emptyCells <= 2) return 5;
    if (emptyCells <= 6) return 4;
    if (emptyCells <= 10) return 3;
    return 2;
  }
  if (boardSize >= 8) {
    if (emptyCells <= 2) return 4;
    if (emptyCells <= 6) return 3;
    return 2;
  }
  if (boardSize >= 6) {
    if (emptyCells <= 2) return 5;
    if (emptyCells <= 5) return 4;
    if (emptyCells <= 10) return 3;
    return 2;
  }
  if (emptyCells <= 2) return 5;
  if (emptyCells <= 5) return 4;
  if (emptyCells <= 8) return 3;
  return 2;
}

function getRelevantChanceCells(values) {
  const empty = getEmptyPositions(values);
  if (boardSize <= 5 && empty.length <= 12) return empty;
  if (empty.length <= 6) return empty;

  const weightedSnakeMap = getDominantSnakeWeightMap(values);
  const maxCandidates = boardSize >= 8 ? 6 : boardSize >= 6 ? 7 : 8;

  return empty
    .map((cell) => ({
      ...cell,
      badness: (weightedSnakeMap[cell.row][cell.col] * 12) - (getAdjacentEmptyCount(values, cell.row, cell.col) * 70),
    }))
    .sort((left, right) => right.badness - left.badness)
    .slice(0, maxCandidates);
}

function evaluateHoleFuture(values, depth, isChanceNode, cache, preferredCorner) {
  const signature = `${preferredCorner || "any"}:${isChanceNode ? "C" : "P"}:${depth}:${getBoardSignature(values)}`;
  if (cache.has(signature)) return cache.get(signature);

  if (depth <= 0) {
    const evaluation = evaluateBoardValues(values, 0, preferredCorner);
    cache.set(signature, evaluation);
    return evaluation;
  }

  if (isChanceNode) {
    const emptyCells = getEmptyPositions(values);
    if (emptyCells.length === 0) {
      const fallback = evaluateHoleFuture(values, depth - 1, false, cache, preferredCorner);
      cache.set(signature, fallback);
      return fallback;
    }

    const candidates = getRelevantChanceCells(values);
    let weightedTotal = 0;
    let probabilityTotal = 0;
    let worstCase = Number.POSITIVE_INFINITY;

    candidates.forEach(({ row, col }) => {
      [
        { value: 2, probability: 0.9 },
        { value: 4, probability: 0.1 },
      ].forEach(({ value, probability }) => {
        const nextValues = applySpawnToValues(values, row, col, value);
        const score = evaluateHoleFuture(nextValues, depth - 1, false, cache, preferredCorner);
        weightedTotal += score * probability;
        probabilityTotal += probability;
        worstCase = Math.min(worstCase, score);
      });
    });

    const averageScore = probabilityTotal ? weightedTotal / probabilityTotal : evaluateBoardValues(values, 0, preferredCorner);
    const blendedChanceScore = (averageScore * 0.68) + (worstCase * 0.32);
    cache.set(signature, blendedChanceScore);
    return blendedChanceScore;
  }

  let bestScore = Number.NEGATIVE_INFINITY;
  let hasMove = false;

  HOLE_DIRECTIONS.forEach((direction) => {
    const simulation = simulateDirectionOnValues(values, direction);
    if (!simulation.moved) return;
    hasMove = true;
    const futureScore = evaluateHoleFuture(simulation.values, depth - 1, true, cache, preferredCorner);
    const turnScore = futureScore
      + (simulation.gainedScore * 36)
      + (simulation.highestMerge * 14);
    bestScore = Math.max(bestScore, turnScore);
  });

  const resolvedScore = hasMove ? bestScore : Number.NEGATIVE_INFINITY;
  cache.set(signature, resolvedScore);
  return resolvedScore;
}

function getHoleBestMove() {
  const currentValues = boardValuesFromState();
  const preferredCorner = holePreferredCorner || determineHolePreferredCorner(currentValues);
  const depth = getHoleSearchDepth(currentValues);
  const cache = new Map();
  let bestDirection = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  HOLE_DIRECTIONS.forEach((direction) => {
    const simulation = simulateDirectionOnValues(currentValues, direction);
    if (!simulation.moved) return;
    const score = evaluateHoleFuture(simulation.values, depth - 1, true, cache, preferredCorner)
      + (simulation.gainedScore * 42)
      + (simulation.highestMerge * 18);
    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
  });

  if (bestDirection) {
    const corners = getCornerDefinitions();
    const corner = corners[preferredCorner];
    if (corner && (bestDirection === corner.vertical || bestDirection === corner.horizontal)) {
      holePreferredCorner = preferredCorner;
    }
  }

  return bestDirection;
}

function scheduleHoleMove() {
  if (!holeMode) return;
  if (holeTimer) window.clearTimeout(holeTimer);
  const holeSessionId = gameSessionId;
  const holeDelay = isHoleTurboMode() ? 0 : Math.max(6, getCurrentMoveDuration());
  holeTimer = window.setTimeout(() => {
    if (holeSessionId !== gameSessionId) return;
    holeTimer = null;
    if (!holeMode || isAnimating || replayMode || initialsEntryState.active || demoMode) return;
    if (gamePaused) return;
    if (gameState.over) {
      endGameByMachine();
      return;
    }
    if (!canMove()) {
      endGameByMachine();
      return;
    }
    const direction = getHoleBestMove();
    if (!direction) {
      endGameByMachine();
      return;
    }
    move(direction);
  }, holeDelay);
}

function startHoleMode() {
  if (!attractDismissed) {
    void startFreshGame();
  }
  if (demoMode || replayMode || initialsEntryState.active || gameState.over) return;
  stopDemoMode();
  holeMode = true;
  syncGameTimerScale(holeSpeedMultiplier);
  holeRunUsed = true;
  if (currentReplay) currentReplay.category = "hole";
  holeSequenceProgress = 0;
  holePreferredCorner = determineHolePreferredCorner(boardValuesFromState());
  setStatus(getHoleStatusText());
  updateHoleSpeedUI();
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
  const currentTopScore = getTopScoreForMode(mode, getCurrentRecordCategory());
  if (gameState.score > currentTopScore) {
    globalRecordFanfarePlayed = true;
    noteDecisiveMoment(`Record global en ${mode}`);
    activateBestScoreCelebration();
    playGlobalRecordFanfare();
    setStatus("Nuevo record global en juego.");
    announceMatchCommentary("record", { mode, score: gameState.score }, "record", { force: true });
    showSystemAnnouncement("Nuevo record global", "record");
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
  applyScoreSizing(scoreElement, gameState.score);
  applyScoreSizing(bestScoreElement, gameState.bestScore);
  updateStatsButton();
  if (statsPanelOpen) {
    positionStatsPanel();
    renderStatsPanel();
  }
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

      element.className = `tile ${getTileValueClasses(tile.value)}`.trim();
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

function encodeReplayPayload(replay, options = {}) {
  if (!replay) return null;
  const {
    finishedAt = replay.finishedAt || null,
    finalScore = replay.finalScore ?? null,
    initials = replay.initials || null,
  } = options;

  return {
    version: 2,
    boardSize: replay.boardSize,
    mode: replay.mode,
    category: normalizeRecordCategory(replay.category),
    startedAt: replay.startedAt,
    finishedAt,
    finalScore,
    initials,
    start: (replay.start || []).map((spawn) => [spawn.row, spawn.col, spawn.value]),
    turns: (replay.turns || []).map((turn) => [
      REPLAY_MOVE_CODES[turn.move] || "U",
      turn.spawn?.row ?? -1,
      turn.spawn?.col ?? -1,
      turn.spawn?.value ?? 0,
    ]),
  };
}

function estimateReplayPayloadBytes(payload) {
  if (!payload) return 0;
  try {
    return new TextEncoder().encode(JSON.stringify(payload)).length;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

function buildTruncatedReplayPayload(replay, options = {}) {
  if (!replay) return null;
  const payload = encodeReplayPayload(replay, options);
  if (!payload) return null;
  payload.turns = [];
  payload.truncated = true;
  payload.totalTurns = Array.isArray(replay.turns) ? replay.turns.length : 0;
  payload.truncatedReason = options.truncatedReason || "size";
  return payload;
}

function buildReplayRefId(recordMeta) {
  const modeSlug = String(recordMeta?.mode || "4x4").replace(/[^0-9]/g, "");
  const categorySlug = normalizeRecordCategory(recordMeta?.category || "normal");
  const initialsSlug = normalizeInitials(recordMeta?.initials || "???");
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `replay-${modeSlug}-${categorySlug}-${initialsSlug}-${Date.now().toString(36)}-${randomPart}`.toLowerCase();
}

function chunkReplayString(value, chunkSize) {
  const chunks = [];
  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }
  return chunks;
}

async function uploadReplayToWorker(replayPayload, recordMeta) {
  const replayJson = JSON.stringify(replayPayload);
  const chunks = chunkReplayString(replayJson, REMOTE_REPLAY_CHUNK_BYTES);
  if (!chunks.length) return null;
  if (chunks.length > MAX_REMOTE_REPLAY_PARTS) {
    throw new Error("Replay demasiado grande incluso por bloques");
  }

  const replayId = buildReplayRefId(recordMeta);
  for (let index = 0; index < chunks.length; index += 1) {
    setStatus(`Subiendo replay completa por bloques... ${index + 1}/${chunks.length}`);
    let uploaded = false;
    let lastError = null;
    for (let attempt = 1; attempt <= REMOTE_REPLAY_UPLOAD_RETRIES && !uploaded; attempt += 1) {
      try {
        await postWorkerJson("/replay/upload", {
          replayId,
          mode: recordMeta.mode,
          partIndex: index,
          partCount: chunks.length,
          chunk: chunks[index],
        });
        uploaded = true;
      } catch (error) {
        lastError = error;
        if (attempt < REMOTE_REPLAY_UPLOAD_RETRIES) {
          await new Promise((resolve) => window.setTimeout(resolve, attempt * 350));
        }
      }
    }
    if (!uploaded) {
      throw new Error(`Fallo al subir el bloque ${index + 1}/${chunks.length}: ${lastError?.message || "sin respuesta"}`);
    }
  }

  return {
    storage: "r2",
    replayId,
    parts: chunks.length,
    mode: recordMeta.mode,
  };
}

function buildSafeReplayPayload(replay, options = {}) {
  if (!replay) return { payload: null, truncated: false };
  const {
    target = "record",
  } = options;
  const maxTurns = target === "slot" || target === "session"
    ? MAX_SAFE_SLOT_REPLAY_TURNS
    : MAX_SAFE_RECORD_REPLAY_TURNS;

  const fullPayload = encodeReplayPayload(replay, options);
  if (!fullPayload) return { payload: null, truncated: false };

  if ((fullPayload.turns?.length || 0) > maxTurns) {
    return {
      payload: buildTruncatedReplayPayload(replay, { ...options, truncatedReason: "turns" }),
      truncated: true,
    };
  }

  if (target === "record" && estimateReplayPayloadBytes(fullPayload) > MAX_SAFE_RECORD_REPLAY_BYTES) {
    return {
      payload: buildTruncatedReplayPayload(replay, { ...options, truncatedReason: "bytes" }),
      truncated: true,
    };
  }

  return { payload: fullPayload, truncated: false };
}

function decodeReplayPayload(replay) {
  if (!replay || typeof replay !== "object") return null;
  if (replay.version !== 2) return cloneReplay(replay);

  return {
    version: replay.version,
    boardSize: replay.boardSize,
    mode: replay.mode,
    category: normalizeRecordCategory(replay.category),
    startedAt: replay.startedAt,
    finishedAt: replay.finishedAt || null,
    finalScore: replay.finalScore ?? null,
    initials: replay.initials || null,
    start: (replay.start || []).map((spawn) => ({
      row: Number(spawn[0]),
      col: Number(spawn[1]),
      value: Number(spawn[2]),
    })),
    turns: (replay.turns || []).map((turn) => ({
      move: REPLAY_MOVE_CODES_REVERSE[turn[0]] || "up",
      spawn: turn[1] >= 0
        ? {
            row: Number(turn[1]),
            col: Number(turn[2]),
            value: Number(turn[3]),
          }
        : null,
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
    return Array.isArray(records)
      ? records.map((record) => ({ ...record, category: normalizeRecordCategory(record.category) }))
      : [];
  } catch {
    return [];
  }
}

function saveRecords(records) {
  localStorage.setItem(getRecordsKey(), JSON.stringify(records));
}

function saveRecordsWithFallback(records) {
  const limited = RECORD_CATEGORIES.flatMap((category) => {
    const categoryRecords = records
      .filter((record) => normalizeRecordCategory(record.category) === category)
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return left.isoDate.localeCompare(right.isoDate);
      })
      .slice(0, MAX_RECORDS_PER_MODE);
    return categoryRecords;
  });
  try {
    saveRecords(limited);
    return { replayStored: true };
  } catch {
    const withoutReplay = limited.map((record) => ({ ...record, replay: null }));
    saveRecords(withoutReplay);
    return { replayStored: false };
  }
}

function resolveReplayForRecord(record) {
  if (record?.replay) return decodeReplayPayload(record.replay);
  if (
    pendingGlobalRecord
    && pendingGlobalRecord.initials === record.initials
    && pendingGlobalRecord.score === record.score
    && pendingGlobalRecord.mode === record.mode
    && normalizeRecordCategory(pendingGlobalRecord.category) === normalizeRecordCategory(record.category)
  ) {
    if (pendingGlobalRecord.fullReplay) return decodeReplayPayload(pendingGlobalRecord.fullReplay);
    if (pendingGlobalRecord.replay) return decodeReplayPayload(pendingGlobalRecord.replay);
  }
  return null;
}

function isRecordScore(score) {
  if (score <= 0) return false;
  const category = getCurrentRecordCategory();
  const records = loadRecords();
  const categoryRecords = records.filter((record) => normalizeRecordCategory(record.category) === category);
  if (categoryRecords.length < MAX_RECORDS_PER_MODE) return true;
  return categoryRecords.some((record) => score > record.score);
}

function formatBoardCoordinate(row, col) {
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}

function getCommentaryPlayerName() {
  return advancedPlayerAuth?.alias || "el jugador invitado";
}

function formatCommentaryTemplate(template, data = {}) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, key) => {
    if (key === "player") return getCommentaryPlayerName();
    if (key === "score") return formatAdminNumber(data.score ?? gameState.score);
    if (key === "moves") return formatAdminNumber(data.moves ?? moveSequence);
    if (key === "minutes") return formatAdminNumber(data.minutes ?? 0);
    if (key === "mode") return data.mode || `${boardSize}x${boardSize}`;
    if (key === "value") return String(data.value ?? "");
    return String(data[key] ?? "");
  });
}

function pickCommentaryLine(category) {
  const lines = COMMENTARY_BANK[category] || [];
  if (!lines.length) return "";
  let nextIndex = Math.floor(Math.random() * lines.length);
  if (lines.length > 1 && commentaryLastIndexByCategory[category] === nextIndex) {
    nextIndex = (nextIndex + 1) % lines.length;
  }
  commentaryLastIndexByCategory[category] = nextIndex;
  return lines[nextIndex];
}

function announceMatchCommentary(category, data = {}, tone = "normal", options = {}) {
  const { force = false } = options;
  const template = pickCommentaryLine(category);
  if (!template) return false;
  if (!force && (Date.now() - lastCommentaryAt) < getCommentaryCooldownMs(tone)) return false;
  setTickerMessage(formatCommentaryTemplate(template, data), tone);
  lastCommentaryAt = Date.now();
  return true;
}

function shouldStatusFeedTicker(message) {
  const normalized = String(message || "").trim();
  if (!normalized) return false;
  if (replayMode || /^replay\b/i.test(normalized)) return false;
  if (/h\.o\.l\.e/i.test(normalized)) return false;
  if (/^\d+\s+minutos?\s+de\s+partida\.?$/i.test(normalized)) return false;
  if (/musica activada|musica desactivada|siguiente pista|pista anterior|reiniciando pista/i.test(normalized)) return false;
  if (/sonido activado|sonido desactivado/i.test(normalized)) return false;
  if (/modo avanzado|alias|pin|creditos suficientes|panel|logout|sesion avanzada/i.test(normalized)) return false;
  if (/slot \d+ cargado|slot \d+|partida guardada|partida recuperada/i.test(normalized)) return false;
  if (/cargando replay|replay no disponible|error al cargar replay|enviando record|record global enviado|subiendo replay/i.test(normalized)) return false;
  if (/prepara apuestas y pulsa nueva partida para empezar/i.test(normalized)) return false;
  return true;
}

function setTickerMessage(message, tone = "normal") {
  if (!systemTickerTextElement || !systemTickerTrackElement) return;
  const text = String(message || "").trim() || "Angeloso Arcade System listo para jugar.";
  if (text === currentTickerMessage && tone === currentTickerTone) return;
  currentTickerMessage = text;
  currentTickerTone = tone;
  systemTickerTextElement.textContent = text;
  systemTickerTrackElement.dataset.tone = tone;
  systemTickerTrackElement.style.animation = "none";
  void systemTickerTrackElement.offsetWidth;
  systemTickerTrackElement.style.animation = "";
}

function showSystemAnnouncement(message, tone = "accent") {
  if (!systemAnnouncementLayerElement || !message) return;
  const announcement = document.createElement("div");
  announcement.className = `system-announcement tone-${tone}`;
  announcement.textContent = message;
  systemAnnouncementLayerElement.appendChild(announcement);
  announcement.addEventListener("animationend", () => announcement.remove(), { once: true });
}

function highlightBoardCoordinates(rows = [], cols = []) {
  document.querySelectorAll(".board-coord-label.is-hot").forEach((label) => label.classList.remove("is-hot"));
  rows.forEach((row) => {
    document.querySelectorAll(`.board-coords-col .board-coord-label[data-row="${row}"]`).forEach((label) => label.classList.add("is-hot"));
  });
  cols.forEach((col) => {
    document.querySelectorAll(`.board-coords-row .board-coord-label[data-col="${col}"]`).forEach((label) => label.classList.add("is-hot"));
  });
  if (rows.length || cols.length) {
    window.setTimeout(() => {
      document.querySelectorAll(".board-coord-label.is-hot").forEach((label) => label.classList.remove("is-hot"));
    }, 820);
  }
}

function renderBoardCoordinates() {
  const letters = Array.from({ length: boardSize }, (_, index) => String.fromCharCode(65 + index));
  const numbers = Array.from({ length: boardSize }, (_, index) => String(index + 1));
  const horizontalTargets = [boardCoordsTopElement];
  const verticalTargets = [boardCoordsLeftElement, boardCoordsRightElement];

  horizontalTargets.forEach((target) => {
    if (!target) return;
    target.innerHTML = "";
    target.style.gridTemplateColumns = `repeat(${boardSize}, minmax(0, 1fr))`;
    letters.forEach((letter) => {
      const cell = document.createElement("span");
      cell.className = "board-coord-label";
      cell.dataset.col = String(letters.indexOf(letter));
      cell.textContent = letter;
      target.appendChild(cell);
    });
  });

  verticalTargets.forEach((target) => {
    if (!target) return;
    target.innerHTML = "";
    target.style.gridTemplateRows = `repeat(${boardSize}, minmax(0, 1fr))`;
    numbers.forEach((number) => {
      const cell = document.createElement("span");
      cell.className = "board-coord-label";
      cell.dataset.row = String(Number(number) - 1);
      cell.textContent = number;
      target.appendChild(cell);
    });
  });
}

function shouldOpenInitialsForScore(score) {
  if (score <= 0) return false;
  if (isRecordScore(score)) return true;

  const mode = `${boardSize}x${boardSize}`;
  const category = getCurrentRecordCategory();
  const globalTopScore = getTopScoreForMode(mode, category);
  return globalTopScore > 0 && score > globalTopScore;
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
      item.className = `journal-entry is-replay-direction-${turn.move}`;
      item.dataset.replayTurn = String(index + 1);
      if (index + 1 === replaySession.index) item.classList.add("is-replay-active");

      const time = document.createElement("time");
      time.textContent = `Paso ${index + 1}`;

      const badge = document.createElement("span");
      badge.className = "journal-entry-badge";
      badge.textContent = ({ up: "↑", down: "↓", left: "←", right: "→" }[turn.move]) || "•";

      const text = document.createElement("strong");
      text.textContent = `Pulso ${getDirectionLabel(turn.move)}`;

      const meta = document.createElement("small");
      meta.className = "journal-entry-meta";
      meta.textContent = turn.spawn ? `Aparece en ${formatBoardCoordinate(turn.spawn.row, turn.spawn.col)}` : "Sin spawn";

      item.append(time, badge, text, meta);
      journalListElement.appendChild(item);
    });
    return;
  }

  journalTitleElement.textContent = journalTitleElement.dataset.defaultTitle || "Bitacora";
  journalSubtitleElement.textContent = "";

  if (!journalEntries.length) {
    const empty = document.createElement("div");
    empty.className = "journal-entry journal-entry-empty";
    empty.textContent = "Todavia no hay logros apuntados.";
    journalListElement.appendChild(empty);
    return;
  }

  journalEntries.forEach((entry) => {
    const item = document.createElement("div");
    item.className = `journal-entry tone-${entry.tone || "normal"}`;
    item.dataset.entryId = entry.id;

    const time = document.createElement("time");
    time.textContent = entry.timeText;
    if (entry.elapsedText) {
      const elapsed = document.createElement("span");
      elapsed.className = "journal-entry-elapsed";
      elapsed.textContent = `(${entry.elapsedText})`;
      time.append(" ", elapsed);
    }

    const badge = document.createElement("span");
    badge.className = "journal-entry-badge";
    badge.textContent = entry.icon || "★";

    const text = document.createElement("strong");
    text.textContent = `Bloque ${entry.value} creado`;

    const meta = document.createElement("small");
    meta.className = "journal-entry-meta";
    meta.textContent = `Casilla ${formatBoardCoordinate(entry.row, entry.col)} · ${entry.value >= 512 ? "Super logro" : "Fusiones altas"}`;

    item.append(time, badge, text, meta);
    journalListElement.appendChild(item);
  });
}

function addJournalEntry(value, row, col, options = {}) {
  const { animate = true } = options;
  const now = new Date();
  const entry = {
    id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    value,
    row,
    col,
    icon: value >= 1024 ? "✦" : value >= 512 ? "◆" : value >= 256 ? "⬢" : "▲",
    tone: value >= 1024 ? "legend" : value >= 512 ? "epic" : value >= 256 ? "rare" : "normal",
    timeText: now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    elapsedText: formatElapsedTime(getElapsedMs()),
  };

  journalEntries.unshift(entry);
  renderJournal();
  journalListElement.scrollTop = 0;
  if (animate) {
    animateJournalFlight(entry);
  }
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
  realGameTimerStartedAt = gameTimerStartedAt;
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

function applyScoreSizing(element, value) {
  if (!element) return;
  element.classList.remove("is-mid", "is-big", "is-large", "is-huge");
  element.style.fontSize = "";
  element.style.letterSpacing = "";

  const digits = String(Math.max(0, Math.trunc(value))).length;

  if (value >= 10000000) {
    element.classList.add("is-huge");
  } else if (value >= 1000000) {
    element.classList.add("is-large");
  } else if (value >= 100000) {
    element.classList.add("is-big");
  } else if (value >= 10000) {
    element.classList.add("is-mid");
  }

  if (digits <= 4) return;

  const sizingByDigits = {
    5: { fontSize: "1.28rem", letterSpacing: "-0.07em" },
    6: { fontSize: "1.08rem", letterSpacing: "-0.08em" },
    7: { fontSize: "0.92rem", letterSpacing: "-0.09em" },
    8: { fontSize: "0.78rem", letterSpacing: "-0.1em" },
  };

  const resolved = sizingByDigits[Math.min(digits, 8)] || { fontSize: "0.68rem", letterSpacing: "-0.11em" };
  element.style.fontSize = resolved.fontSize;
  element.style.letterSpacing = resolved.letterSpacing;
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

function hasAnyGlobalRecords(recordsByMode = globalRecordsCache) {
  return GLOBAL_MODES.some((mode) =>
    RECORD_CATEGORIES.some((category) => (recordsByMode?.[mode]?.[category] || []).length)
  );
}

function getCurrentBoardModeLabel() {
  const size = Number(boardSizeSelect.value || boardSize);
  return `${size}x${size}`;
}

function buildRecordCardModalSection(title, records) {
  const section = document.createElement("section");
  section.className = "record-card-category";

  const heading = document.createElement("h4");
  heading.className = "record-card-category-title";
  heading.textContent = title;
  section.appendChild(heading);

  if (!records.length) {
    const empty = document.createElement("div");
    empty.className = "record-card-empty";
    empty.textContent = "Sin records en esta liga.";
    section.appendChild(empty);
    return section;
  }

  const list = document.createElement("div");
  list.className = "record-card-list";

  const head = document.createElement("div");
  head.className = "record-card-row record-card-row-head";
  head.innerHTML = `
    <span>#</span>
    <span>Jugador</span>
    <span>Puntos</span>
    <span>Fecha</span>
  `;
  list.appendChild(head);

  records.slice(0, MAX_RECORDS_PER_MODE).forEach((record, index) => {
    const row = document.createElement("div");
    row.className = "record-card-row";

    const rank = document.createElement("span");
    rank.className = "record-card-rank";
    rank.textContent = `#${index + 1}`;

    const initials = document.createElement("span");
    initials.textContent = record.initials;

    const score = document.createElement("span");
    score.className = "record-card-score";
    score.textContent = formatAdminNumber(record.score);

    const date = document.createElement("span");
    date.className = "record-card-date";
    date.textContent = record.displayDate;

    row.append(rank, initials, score, date);
    list.appendChild(row);
  });

  section.appendChild(list);
  return section;
}

function renderRecordCardModal() {
  if (!recordCardModalContentElement) return;
  const mode = getCurrentBoardModeLabel();
  const categoryRecords = globalRecordsCache?.[mode] || {};
  recordCardModalContentElement.innerHTML = "";
  recordCardModalContentElement.appendChild(buildRecordCardModalSection("Modo Normal", categoryRecords.normal || []));
  recordCardModalContentElement.appendChild(buildRecordCardModalSection("Modo H.O.L.E.", categoryRecords.hole || []));
  if (recordCardModalSubtitleElement) {
    recordCardModalSubtitleElement.textContent = `Tablero ${mode}`;
  }
}

function setRecordCardModalOpen(nextOpen) {
  recordCardModalOpen = Boolean(nextOpen);
  recordCardModalElement?.classList.toggle("hidden", !recordCardModalOpen);
  if (recordCardModalOpen) {
    renderRecordCardModal();
  }
}

function positionAdvancedToggleHint() {
  if (!advancedToggleLabelElement || !advancedToggleHintElement) return;
  const rect = advancedToggleLabelElement.getBoundingClientRect();
  const hintWidth = Math.min(320, Math.round(window.innerWidth * 0.72));
  const left = Math.min(
    window.innerWidth - hintWidth - 12,
    Math.max(12, rect.left + (rect.width / 2) - (hintWidth / 2))
  );
  const top = rect.bottom + 12;
  advancedToggleHintElement.style.left = `${Math.round(left)}px`;
  advancedToggleHintElement.style.top = `${Math.round(top)}px`;
  advancedToggleHintElement.style.width = `${hintWidth}px`;
}

function setAdvancedToggleHintVisible(nextVisible) {
  if (!advancedToggleHintElement) return;
  advancedToggleHintElement.classList.toggle("is-visible", Boolean(nextVisible));
  if (nextVisible) {
    positionAdvancedToggleHint();
  }
}

function renderGlobalRecords(recordsByMode) {
  globalRecordsCache = recordsByMode;
  globalRecordsLoaded = true;
  GLOBAL_MODES.forEach((mode) => {
    const listElement = globalRecordsElements[mode];
    listElement.innerHTML = "";
    const categoryRecords = recordsByMode[mode] || {};
    const hasAnyRecord = RECORD_CATEGORIES.some((category) => (categoryRecords[category] || []).length);

    if (!hasAnyRecord) {
      const row = document.createElement("div");
      row.className = "records-row records-row-empty";
      row.textContent = "Sin records enviados.";
      listElement.appendChild(row);
      return;
    }

    RECORD_CATEGORIES.forEach((category) => {
      const allRecords = (categoryRecords[category] || [])
        .slice(0, MAX_RECORDS_PER_MODE)
        .sort((left, right) => {
          if (expandedRecordsMode === mode && expandedRecordsSort === "date") {
            return String(right.isoDate || "").localeCompare(String(left.isoDate || ""));
          }
          if (right.score !== left.score) return right.score - left.score;
          return String(left.isoDate || "").localeCompare(String(right.isoDate || ""));
        });
      const records = expandedRecordsMode === mode ? allRecords : allRecords.slice(0, 4);

      const categoryBlock = document.createElement("div");
      categoryBlock.className = "records-category-block";

      const categoryLabel = document.createElement("div");
      categoryLabel.className = "records-category-label";
      categoryLabel.textContent = getRecordCategoryLabel(category);
      categoryBlock.appendChild(categoryLabel);

      const categoryList = document.createElement("div");
      categoryList.className = "records-list records-category-list";

      if (!records.length) {
        const row = document.createElement("div");
        row.className = "records-row records-row-empty";
        row.textContent = "Sin records en esta liga.";
        categoryList.appendChild(row);
      } else {
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
          categoryList.appendChild(row);
        });
      }

      categoryBlock.appendChild(categoryList);
      listElement.appendChild(categoryBlock);
    });
  });
  syncExpandedRecordsUI();
  updateRecordsMiniTicker(recordsByMode);
  if (recordCardModalOpen) {
    renderRecordCardModal();
  }
}

function clearRecordsMiniTickerTimer() {
  if (recordsMiniTickerTimer) {
    window.clearTimeout(recordsMiniTickerTimer);
    recordsMiniTickerTimer = null;
  }
}

function buildRecordsMiniTickerEntries(recordsByMode) {
  const flat = [];
  const mode = getCurrentBoardModeLabel();
  RECORD_CATEGORIES.forEach((category) => {
    (recordsByMode?.[mode]?.[category] || []).forEach((record) => {
      flat.push({
        mode,
        category,
        initials: record.initials,
        score: Number(record.score || 0),
      });
    });
  });
  flat.sort((left, right) => right.score - left.score);
  return flat.slice(0, 10);
}

function clearRecordsMiniTickerAnimation() {
  if (recordsMiniTickerAnimation) {
    recordsMiniTickerAnimation.cancel();
    recordsMiniTickerAnimation = null;
  }
  if (recordsMiniTrackElement) {
    recordsMiniTrackElement.style.transform = "translateX(0)";
  }
}

function playRecordsMiniTickerAnimation() {
  clearRecordsMiniTickerAnimation();
  if (!recordsMiniWindowElement || !recordsMiniTrackElement || !recordsMiniTextElement) return 4200;

  const windowWidth = Math.max(1, Math.round(recordsMiniWindowElement.clientWidth || 0));
  const trackWidth = Math.max(1, Math.round(recordsMiniTrackElement.scrollWidth || recordsMiniTextElement.scrollWidth || 0));
  const travel = windowWidth + trackWidth;
  const pixelsPerSecond = 54;
  const duration = Math.max(3200, Math.round((travel / pixelsPerSecond) * 1000));

  recordsMiniTrackElement.style.transform = `translateX(${windowWidth}px)`;
  recordsMiniTickerAnimation = recordsMiniTrackElement.animate(
    [
      { transform: `translateX(${windowWidth}px)` },
      { transform: `translateX(${-trackWidth}px)` },
    ],
    {
      duration,
      easing: "linear",
      fill: "forwards",
    }
  );
  return duration;
}

function renderRecordsMiniTickerEntry() {
  if (!recordsMiniRankElement || !recordsMiniTextElement) return 4200;
  if (!recordsMiniTickerEntries.length) {
    recordsMiniRankElement.textContent = "#1";
    recordsMiniTextElement.textContent = "Esperando records...";
    clearRecordsMiniTickerAnimation();
    return 4200;
  }
  const entry = recordsMiniTickerEntries[recordsMiniTickerIndex] || recordsMiniTickerEntries[0];
  recordsMiniRankElement.textContent = `#${recordsMiniTickerIndex + 1}`;
  recordsMiniTextElement.textContent = `${entry.initials} ${formatAdminNumber(entry.score)} · ${entry.mode} · ${getRecordCategoryLabel(entry.category)}`;
  return playRecordsMiniTickerAnimation();
}

function scheduleNextRecordsMiniTickerStep() {
  clearRecordsMiniTickerTimer();
  if (!recordsMiniTickerEntries.length) return;
  const nextIndex = (recordsMiniTickerIndex + 1) % recordsMiniTickerEntries.length;
  const entryDuration = renderRecordsMiniTickerEntry();
  const delay = entryDuration + 800;
  recordsMiniTickerTimer = window.setTimeout(() => {
    recordsMiniTickerIndex = nextIndex;
    scheduleNextRecordsMiniTickerStep();
  }, delay);
}

function updateRecordsMiniTicker(recordsByMode = globalRecordsCache) {
  const nextEntries = buildRecordsMiniTickerEntries(recordsByMode);
  if (!nextEntries.length && recordsMiniTickerEntries.length) {
    if (!recordsMiniTickerTimer) {
      scheduleNextRecordsMiniTickerStep();
    }
    return;
  }
  recordsMiniTickerEntries = nextEntries;
  recordsMiniTickerIndex = 0;
  scheduleNextRecordsMiniTickerStep();
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
  document.querySelectorAll(".records-sort-control").forEach((control) => {
    control.classList.toggle("hidden", expandedRecordsMode !== control.dataset.mode);
  });
  document.querySelectorAll(".records-sort-select").forEach((select) => {
    select.value = expandedRecordsSort;
  });
}

function setExpandedRecordsMode(mode) {
  expandedRecordsMode = mode;
  renderGlobalRecords(globalRecordsCache);
}

function getTopScoreForMode(mode, category = getCurrentRecordCategory()) {
  const records = globalRecordsCache[mode]?.[normalizeRecordCategory(category)] || [];
  return records.length ? Number(records[0].score || 0) : 0;
}

function mergeGlobalRecordIntoCache(record) {
  if (!record?.mode) return;
  const category = normalizeRecordCategory(record.category);
  if (!globalRecordsCache[record.mode]) {
    globalRecordsCache[record.mode] = Object.fromEntries(RECORD_CATEGORIES.map((entry) => [entry, []]));
  }
  if (!globalRecordsCache[record.mode][category]) {
    globalRecordsCache[record.mode][category] = [];
  }
  const merged = [
    ...globalRecordsCache[record.mode][category],
    {
      ...record,
      category,
      replay: decodeReplayPayload(record.replay),
    },
  ];
  merged.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return left.isoDate.localeCompare(right.isoDate);
  });
  globalRecordsCache[record.mode][category] = merged.slice(0, MAX_RECORDS_PER_MODE);
  globalRecordsLoaded = true;
}

function parseGlobalRecord(issue) {
  const body = issue.body || "";
  const initials = body.match(/Initials:\s*([A-Z?]{3})/i)?.[1]?.toUpperCase();
  const mode = body.match(/Mode:\s*([0-9]+x[0-9]+)/i)?.[1];
  const category = normalizeRecordCategory(body.match(/Category:\s*(normal|hole)/i)?.[1]?.toLowerCase());
  const scoreText = body.match(/Score:\s*([0-9]+)/i)?.[1];
  const replayMatch = body.match(/```json\s*([\s\S]*?)```/i);
  const replayParts = Number(body.match(/Replay Parts:\s*([0-9]+)/i)?.[1] || 0);
  const replayStorage = (body.match(/Replay Storage:\s*(inline|comments|r2)/i)?.[1] || "inline").toLowerCase();
  const replayId = body.match(/Replay Ref:\s*([A-Za-z0-9_-]+)/i)?.[1] || "";
  const score = Number(scoreText);

  if (!initials || !mode || !Number.isFinite(score)) return null;

  let replay = null;
  if (replayMatch?.[1]) {
    try {
      replay = decodeReplayPayload(JSON.parse(replayMatch[1]));
    } catch {
      replay = null;
    }
  }

  return {
    initials,
    mode,
    category,
    score,
    isoDate: issue.created_at,
    issueNumber: issue.number,
    commentsUrl: issue.comments_url,
    replayParts,
    replayStorage,
    replayRef: replayStorage === "r2" && replayId ? {
      storage: "r2",
      replayId,
      parts: replayParts || 1,
      mode,
    } : null,
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
  if (record?.replayRef?.storage === "r2" && record?.replayRef?.replayId) {
    const body = await postWorkerJson("/replay/fetch", {
      replayId: record.replayRef.replayId,
      mode: record.mode,
    });
    const replay = decodeReplayPayload(body.replay);
    record.replay = replay;
    return replay;
  }
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

  const replay = decodeReplayPayload(JSON.parse(chunks.map((chunk) => chunk.chunk).join("")));
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
    const grouped = Object.fromEntries(
      GLOBAL_MODES.map((mode) => [
        mode,
        Object.fromEntries(RECORD_CATEGORIES.map((category) => [category, []])),
      ])
    );

    records.forEach((record) => {
      if (!grouped[record.mode]) return;
      grouped[record.mode][normalizeRecordCategory(record.category)].push(record);
    });

    GLOBAL_MODES.forEach((mode) => {
      RECORD_CATEGORIES.forEach((category) => {
        grouped[mode][category].sort((left, right) => {
          if (right.score !== left.score) return right.score - left.score;
          return left.isoDate.localeCompare(right.isoDate);
        });
        grouped[mode][category] = grouped[mode][category].slice(0, MAX_RECORDS_PER_MODE);
      });
    });

    renderGlobalRecords(grouped);
  } catch {
    renderGlobalRecordsError();
  }
}

function normalizeInitials(value) {
  return (value || "")
    .toUpperCase()
    .replace(/[^A-Z?]/g, "")
    .slice(0, 3);
}

function openInitialsEntry(score) {
  if (demoMode || !attractDismissed || !gameState.over) return;
  const mode = `${boardSize}x${boardSize}`;
  const category = getCurrentRecordCategory();
  const currentTopScore = getTopScoreForMode(mode, category);
  const isGlobalTopScore = currentTopScore > 0 && score > currentTopScore;
  const previous = normalizeInitials(localStorage.getItem(PLAYER_INITIALS_KEY) || "");
  initialsEntryState.active = true;
  initialsEntryState.letters = ["", "", ""];
  initialsEntryState.slot = 0;
  initialsEntryState.selectedIndex = Math.max(0, INITIALS_GRID_CHARS.indexOf(previous[0] || "A"));
  initialsEntryState.pendingScore = score;
  initialsEntryState.deadlineAt = Date.now() + INITIALS_TIMEOUT_MS;
  renderInitialsEntry();
  initialsEntryElement.classList.remove("hidden");
  startInitialsTimer();
  persistSessionSnapshot();
  setStatus(isGlobalTopScore ? "Nuevo record global. Introduce tus iniciales." : "Nuevo record. Introduce tus iniciales.");
  showSystemAnnouncement(isGlobalTopScore ? "Anota el nuevo record global" : "Anota tu nuevo record", isGlobalTopScore ? "record" : "accent");
}

function closeInitialsEntry(options = {}) {
  const { discard = false } = options;
  stopInitialsTimer();
  initialsEntryState.active = false;
  initialsEntryState.letters = ["", "", ""];
  initialsEntryState.slot = 0;
  initialsEntryState.selectedIndex = 0;
  initialsEntryState.pendingScore = 0;
  initialsEntryState.deadlineAt = 0;
  initialsEntryElement.classList.add("hidden");
  if (initialsTimerElement) {
    initialsTimerElement.textContent = "01:00";
    initialsTimerElement.classList.remove("is-warning");
  }
  if (discard) {
    recordSaved = true;
    clearSessionSnapshot();
    setStatus("Anotacion cancelada.");
  }
}

function getCurrentSelectedLetter() {
  return INITIALS_GRID_CHARS[initialsEntryState.selectedIndex] || "A";
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

  if (initialsGridElement) {
    initialsGridElement.innerHTML = "";
    INITIALS_GRID_CHARS.forEach((character, index) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "initials-grid-cell";
      if (character === "?") cell.classList.add("is-symbol");
      if (index === initialsEntryState.selectedIndex) cell.classList.add("is-selected");
      cell.textContent = character;
      cell.addEventListener("click", () => {
        initialsEntryState.selectedIndex = index;
        renderInitialsEntry();
        persistSessionSnapshot();
      });
      initialsGridElement.appendChild(cell);
    });
  }

  const filledCount = initialsEntryState.letters.filter(Boolean).length;
  selectLetterButton.textContent = filledCount === 2 ? "Guardar record" : "Marcar letra";
  deleteLetterButton.disabled = filledCount === 0;
}

function moveInitialsCursor(deltaRow, deltaCol) {
  if (!initialsEntryState.active) return;
  const total = INITIALS_GRID_CHARS.length;
  let row = Math.floor(initialsEntryState.selectedIndex / INITIALS_GRID_COLUMNS);
  let col = initialsEntryState.selectedIndex % INITIALS_GRID_COLUMNS;

  row += deltaRow;
  col += deltaCol;

  const maxRow = Math.floor((total - 1) / INITIALS_GRID_COLUMNS);
  row = Math.max(0, Math.min(maxRow, row));
  col = Math.max(0, Math.min(INITIALS_GRID_COLUMNS - 1, col));

  let nextIndex = (row * INITIALS_GRID_COLUMNS) + col;
  while (nextIndex >= total && col > 0) {
    col -= 1;
    nextIndex = (row * INITIALS_GRID_COLUMNS) + col;
  }

  initialsEntryState.selectedIndex = Math.max(0, Math.min(total - 1, nextIndex));
  renderInitialsEntry();
  persistSessionSnapshot();
}

function savePendingRecord(forcedInitials = null) {
  const initials = normalizeInitials(forcedInitials || initialsEntryState.letters.join("") || "???").padEnd(3, "?");
  const now = new Date();
  const isoDate = now.toISOString();
  const displayDate = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(now);
  const replayBuild = currentReplay
    ? buildSafeReplayPayload(currentReplay, {
        target: "record",
        finishedAt: isoDate,
        finalScore: initialsEntryState.pendingScore,
        initials,
      })
    : { payload: null, truncated: false };
  const fullReplayPayload = currentReplay
    ? encodeReplayPayload(currentReplay, {
        finishedAt: isoDate,
        finalScore: initialsEntryState.pendingScore,
        initials,
      })
    : null;
  const replayPayload = replayBuild.payload;

  const records = loadRecords();
  records.push({
    initials,
    score: initialsEntryState.pendingScore,
    mode: `${boardSize}x${boardSize}`,
    category: getCurrentRecordCategory(),
    isoDate: now.toISOString(),
    displayDate,
    replay: replayPayload,
  });

  records.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return left.isoDate.localeCompare(right.isoDate);
  });

  const localSaveResult = saveRecordsWithFallback(records);
  localStorage.setItem(PLAYER_INITIALS_KEY, initials);
  recordSaved = true;
  pendingGlobalRecord = {
    initials,
    mode: `${boardSize}x${boardSize}`,
    category: getCurrentRecordCategory(),
    score: initialsEntryState.pendingScore,
    isoDate,
    displayDate,
    replay: replayPayload,
    fullReplay: fullReplayPayload,
    replayRef: null,
  };
  const currentTopScore = getTopScoreForMode(pendingGlobalRecord.mode, pendingGlobalRecord.category);
  const isGlobalTopScore = pendingGlobalRecord.score > currentTopScore;
  closeInitialsEntry();
  renderRecords();
  setStatus(
    isGlobalTopScore
      ? "Nuevo record global."
      : localSaveResult.replayStored && !replayBuild.truncated
        ? "Record guardado."
        : replayBuild.truncated
          ? "Record guardado con replay resumida."
        : "Record guardado sin replay local."
  );
  playApplause();
  if (isGlobalTopScore && !globalRecordFanfarePlayed) {
    window.setTimeout(() => playGlobalRecordFanfare(), 900);
  }
  clearSessionSnapshot();
  submitGlobalRecord();
}

function buildGlobalRecordIssueUrl() {
  if (!pendingGlobalRecord) return "";
  const title = `[Record] ${pendingGlobalRecord.initials} - ${pendingGlobalRecord.score} - ${pendingGlobalRecord.mode} - ${getRecordCategoryLabel(pendingGlobalRecord.category)}`;
  const replayJson = pendingGlobalRecord.replay ? JSON.stringify(pendingGlobalRecord.replay) : "{}";
  const body = [
    "New global score submission",
    "",
    `Initials: ${pendingGlobalRecord.initials}`,
    `Mode: ${pendingGlobalRecord.mode}`,
    `Category: ${normalizeRecordCategory(pendingGlobalRecord.category)}`,
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

async function submitGlobalRecord() {
  if (!pendingGlobalRecord) return;
  if (!WORKER_API_URL) {
    setStatus("Falta configurar la URL del worker de Cloudflare.");
    return;
  }

  const recordToSubmit = pendingGlobalRecord;
  setStatus("Enviando record global...");

  try {
    let replayRef = null;
    let replayForSubmission = recordToSubmit.fullReplay || recordToSubmit.replay || null;
    const replayBytes = replayForSubmission ? estimateReplayPayloadBytes(replayForSubmission) : 0;

    if (replayForSubmission && replayBytes > MAX_WORKER_DIRECT_REPLAY_BYTES) {
      replayRef = await uploadReplayToWorker(replayForSubmission, recordToSubmit);
      replayForSubmission = null;
    }

    const response = await postWorkerJson("", {
      initials: recordToSubmit.initials,
      mode: recordToSubmit.mode,
      category: normalizeRecordCategory(recordToSubmit.category),
      score: recordToSubmit.score,
      isoDate: recordToSubmit.isoDate,
      replay: replayForSubmission,
      replayRef,
    });

    if (replayRef) {
      recordToSubmit.replayRef = replayRef;
    }

    mergeGlobalRecordIntoCache({
      ...recordToSubmit,
      replayRef: replayRef || recordToSubmit.replayRef || null,
      replay: replayForSubmission || recordToSubmit.fullReplay || recordToSubmit.replay || null,
    });
    renderGlobalRecords(globalRecordsCache);
    const submittedMode = recordToSubmit.mode;
    pendingGlobalRecord = null;
    setStatus(replayRef ? "Record global enviado con replay completa." : "Record global enviado correctamente.");
    window.setTimeout(() => {
      fetchGlobalRecords();
      if (expandedRecordsMode === submittedMode) {
        renderGlobalRecords(globalRecordsCache);
      }
    }, 6000);
  } catch (error) {
    const errorMessage = `Error al enviar record: ${error.message}`;
    setStatus(errorMessage);
    showSystemAnnouncement("Fallo al enviar record", "danger");
    const shouldRetry = window.confirm(`${errorMessage}\n\n¿Quieres reintentar ahora?`);
    if (shouldRetry) {
      setStatus("Reintentando envio de record...");
      window.setTimeout(() => {
        void submitGlobalRecord();
      }, 250);
    }
  }
}

async function openReplayViewer(replay, record) {
  setStatsPanelOpen(false);
  awaitingManualStart = false;
  updateManualStartUI();
  replayViewerElement.classList.remove("hidden");
  replayMetaElement.textContent = `${record.initials} | ${record.mode} | ${record.score} puntos | ${record.displayDate}`;
  if (!replay && (record?.replayParts || record?.replayRef)) {
    replayEmptyElement.textContent = record?.replayRef ? "Cargando replay completa desde Cloudflare..." : "Cargando replay desde GitHub...";
    replayEmptyElement.classList.remove("hidden");
    replayControlsElement.classList.add("hidden");
    setStatus("Cargando replay...");
    clearStatusLaterIfUnchanged("Cargando replay...", 3000);
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
  setStatsPanelOpen(false);
  setReplayVisualState(false);
  updateReplayArrow("");
  const boardFrame = document.querySelector(".board-frame");
  boardFrame.classList.remove("is-replay", "replay-wipe");
  renderGameTimer();
  renderJournal();
  setSaveSlotsPanelOpen(false);
}

function setReplayVisualState(active) {
  const boardFrame = document.querySelector(".board-frame");
  const sideActions = document.querySelector(".side-actions");
  boardFrame.classList.toggle("is-replay", active);
  sideActions?.classList.toggle("is-replay-mode", active);
  replayIndicatorElement.classList.toggle("hidden", !active);
  if (!active) syncMoveDurationUI();
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
    replayPlayButton.classList.remove("is-playing");
    replayPlayButton.setAttribute("aria-label", "Reproducir");
    replayModeLabelElement.textContent = "STOP";
    return;
  }

  const totalTurns = replaySession.replay.turns.length;
  replayProgressElement.textContent = `Paso ${replaySession.index} de ${totalTurns} | Puntuacion ${gameState.score}`;
  replayPlayButton.classList.toggle("is-playing", replaySession.playing);
  replayPlayButton.setAttribute("aria-label", replaySession.playing ? "Pausar" : "Reproducir");
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
  const touchedRows = new Set();
  const touchedCols = new Set();
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
        touchedRows.add(target.row);
        touchedCols.add(target.col);
        gained += target.value;
      } else {
        tile.row = currentRow;
        tile.col = currentCol;
        gameState.cells[currentRow][currentCol] = tile;
        if (currentRow !== row || currentCol !== col) {
          touchedRows.add(currentRow);
          touchedCols.add(currentCol);
        }
      }
    }
  }

  gameState.cells = normalizeCells();
  gameState.score += gained;
  if (spawn) {
    insertReplaySpawn(spawn);
    touchedRows.add(spawn.row);
    touchedCols.add(spawn.col);
  }
  if (animate) {
    render();
    mergeGhosts.forEach((ghost) => createMergeGhost(ghost));
    if (spawn) createReplaySpawnPulse(spawn.row, spawn.col);
  }
  highlightBoardCoordinates([...touchedRows], [...touchedCols]);
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
  setAdminPanelOpen(false);
  setLedgerPanelOpen(false);
  attractDismissed = false;
  awaitingManualStart = false;
  advancedBetsVisible = false;
  advancedBetsCollapsed = false;
  closeAdvancedAuthEntry();
  updateAdvancedModeUI();
  attractOverlayElement.classList.remove("hidden");
  startGame({ demo: true });
}

function enterManualStartMode() {
  awaitingManualStart = true;
  setAdminPanelOpen(false);
  setLedgerPanelOpen(false);
  demoMode = false;
  advancedBetsVisible = advancedMode;
  advancedBetsCollapsed = false;
  gamePaused = false;
  pausedElapsedMs = 0;
  stopGameTimer();
  stopHoleMode({ keepStatus: true });
  discardReplayState();
  closeInitialsEntry({ discard: true });
  setStatsPanelOpen(false);
  setGameOverOverlay(false);
  setPauseOverlay(false);
  fxLayer.innerHTML = "";
  isAnimating = false;
  recordSaved = false;
  pendingGlobalRecord = null;
  journalEntries = [];
  currentReplay = null;
  moveHistory = [];
  moveSequence = 0;
  currentFusionStreak = 0;
  bestFusionStreak = 0;
  decisiveMomentMs = 0;
  decisiveMomentLabel = "";
  momentumLabel = "Arrancando";
  lastMomentumAnnouncement = "";
  gameState = createEmptyState();
  buildGrid();
  render();
  renderJournal();
  renderUndoHistory();
  renderGameTimer();
  updatePauseButton();
  updateAdvancedModeUI();
  updateManualStartUI();
  clearSessionSnapshot();
  setStatus("Prepara apuestas y pulsa Nueva partida para empezar.");
}

function startActualGame() {
  if (attractDismissed) return;
  attractDismissed = true;
  stopDemoMode();
  closeInitialsEntry({ discard: true });
  attractOverlayElement.classList.add("hidden");
  enterManualStartMode();
}

async function prepareAdvancedRoundForNewGame() {
  if (!advancedMode) return null;
  const ready = await ensureAdvancedPlayer({ prompt: true });
  if (!ready) {
    setStatus("Entra con alias y PIN para usar el modo avanzado.");
    return false;
  }

  const nextRound = buildAdvancedRoundFromDraft();
  if (!nextRound) return null;

  if (advancedCredits < nextRound.totalStake) {
    setStatus(`No tienes creditos suficientes. Necesitas ${nextRound.totalStake}.`);
    return false;
  }

  await syncAdvancedCredits(advancedCredits - nextRound.totalStake);
  await recordAdvancedWager(nextRound);
  return nextRound;
}

async function startFreshGame() {
  const preparedRound = await prepareAdvancedRoundForNewGame();
  if (preparedRound === false) return;
  startGame({ advancedRound: preparedRound || null });
  if (musicEnabled) {
    currentMusicTrackIndex = 0;
    localStorage.setItem(MUSIC_TRACK_INDEX_KEY, String(currentMusicTrackIndex));
    startMusicPlayback({ restart: true });
  }
  if (preparedRound?.totalStake) {
    setStatus(`Apuestas activadas por ${preparedRound.totalStake} creditos.`);
  }
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
  persistSessionSnapshot();
}

function deleteLastLetter() {
  if (!initialsEntryState.active) return;

  if (!initialsEntryState.letters[initialsEntryState.slot] && initialsEntryState.slot > 0) {
    initialsEntryState.slot -= 1;
  }

  initialsEntryState.letters[initialsEntryState.slot] = "";
  initialsEntryState.selectedIndex = 0;
  renderInitialsEntry();
  persistSessionSnapshot();
}

function maybePersistCurrentScore() {
  if (demoMode) return;
  if (recordSaved || gameState.score <= 0) return;
  if (!shouldOpenInitialsForScore(gameState.score)) {
    recordSaved = true;
    return;
  }

  openInitialsEntry(gameState.score);
}

function finishGame() {
  if (demoMode) return;
  if (awaitingManualStart || gameState.over || isAnimating || initialsEntryState.active || gamePaused) return;
  stopHoleMode({ keepStatus: true });
  gameState.over = true;
  renderGameTimer();
  setGameOverOverlay(true, "BY USER");
  void settleAdvancedRound("BY USER").then((settlement) => reportAdvancedSession("BY USER", settlement));
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
  if (gameState.over || isAnimating || initialsEntryState.active || replayMode || gamePaused) {
    if (demoMode && gameState.over) scheduleDemoMove();
    return;
  }

  resetFlags();
  isAnimating = true;
  const holeTurbo = isHoleTurboMode();

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
  const journalAchievements = [];
  const mergeGhosts = [];
  const touchedRows = new Set();
  const touchedCols = new Set();

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
        touchedRows.add(target.row);
        touchedCols.add(target.col);
        moved = true;
        hadMerge = true;
        highestMerge = Math.max(highestMerge, newValue);
        if (newValue >= 128) {
          journalAchievements.push({ row: target.row, col: target.col, value: newValue });
        }
        if (newValue > 32 && !holeTurbo) {
          scheduleEpicEffect(target);
          epicBursts.push({ row: target.row, col: target.col, value: newValue });
        }
      } else {
        tile.row = currentRow;
        tile.col = currentCol;
        gameState.cells[currentRow][currentCol] = tile;
        if (currentRow !== row || currentCol !== col) {
          moved = true;
          touchedRows.add(currentRow);
          touchedCols.add(currentCol);
        }
      }
    }
  }

  if (!moved) {
    gameState.cells = normalizeCells();
    render();
    if (!demoMode && !holeTurbo) playBlockedSound();
    isAnimating = false;
    if (demoMode) scheduleDemoMove();
    if (holeMode) scheduleHoleMove();
    return;
  }

  render();
  if (!holeTurbo) {
    mergeGhosts.forEach((ghost) => createMergeGhost(ghost));
  }
  if (hadMerge && !demoMode && !holeTurbo) {
    playMergeSound(highestMerge);
    if (highestMerge >= 128) playFanfare128();
  } else if (!demoMode && !holeTurbo) {
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
    if (spawnedTile) {
      touchedRows.add(spawnedTile.row);
      touchedCols.add(spawnedTile.col);
    }
    render();
    if (!holeTurbo) {
      highlightBoardCoordinates([...touchedRows], [...touchedCols]);
    }
    maybeCelebrateLiveGlobalRecord();
    const scoreBucket = Math.floor(gameState.score / 1000);
    const nextMoveNumber = moveSequence + 1;
    const crossedScoreBucket = scoreBucket > lastCommentaryScoreBucket;
    const allowPerMoveCommentary = !holeMode || !holeTurbo;
    if (!demoMode) {
      if (gained > 0) {
        currentFusionStreak += 1;
        bestFusionStreak = Math.max(bestFusionStreak, currentFusionStreak);
        if (currentFusionStreak >= 3 && (currentFusionStreak === 3 || currentFusionStreak % 2 === 1)) {
          noteDecisiveMoment(`Racha x${currentFusionStreak}`);
          if (!holeMode) {
            showSystemAnnouncement(`EN RACHA x${currentFusionStreak}`, "accent");
          }
          if (allowPerMoveCommentary) {
            announceMatchCommentary("comeback", { moves: nextMoveNumber }, "accent");
          }
        }
      } else {
        currentFusionStreak = 0;
      }
      if (crossedScoreBucket) {
        lastCommentaryScoreBucket = scoreBucket;
        noteDecisiveMoment(`Subida a ${formatAdminNumber(gameState.score)} puntos`);
      }
      if (highestMerge >= 2048) {
        noteDecisiveMoment(`Se logro ${highestMerge}`);
        announceMatchCommentary("tile2048", { value: highestMerge }, "record", { force: true });
      } else if (highestMerge >= 1024) {
        noteDecisiveMoment(`Se alcanzo ${highestMerge}`);
        announceMatchCommentary("tile1024", { value: highestMerge }, "accent", { force: true });
      } else if (highestMerge >= 512) {
        noteDecisiveMoment(`Se alcanzo ${highestMerge}`);
        announceMatchCommentary("tile512", { value: highestMerge }, "accent", { force: true });
      } else if (allowPerMoveCommentary && highestMerge >= 256) {
        announceMatchCommentary("tile256", { value: highestMerge }, "normal");
      } else if (allowPerMoveCommentary && highestMerge >= 128) {
        announceMatchCommentary("tile128", { value: highestMerge }, "normal");
      } else if (allowPerMoveCommentary && crossedScoreBucket && scoreBucket > 0) {
        announceMatchCommentary("score", { score: gameState.score }, "normal");
      } else if (allowPerMoveCommentary) {
        maybeAnnounceAmbientCommentary(nextMoveNumber, gained, highestMerge, crossedScoreBucket);
      }
      if (allowPerMoveCommentary) {
        updateMomentumFromBoard();
      }
    }
    pushHistoryEntry(direction);
    persistSessionSnapshot();

    journalAchievements.forEach((entry) => addJournalEntry(entry.value, entry.row, entry.col, { animate: !holeTurbo }));

    if (!holeTurbo) {
      epicBursts.forEach((entry) => createEpicBurst(entry.row, entry.col, entry.value));
    }

    if (!gameState.won && hasTileAtLeast(2048)) {
      gameState.won = true;
      setStatus(demoMode ? "MODO DEMO" : "Llegaste a 2048. Puedes seguir jugando.");
      if (!demoMode) showSystemAnnouncement("2048 desbloqueado", "accent");
    } else if (!canMove()) {
      if (!demoMode) {
        endGameByMachine();
      } else {
        setStatus("MODO DEMO");
        startGame({ demo: true });
        return;
      }
    } else {
      setStatus(demoMode ? "MODO DEMO" : holeMode ? getHoleStatusText() : "");
    }
    isAnimating = false;
    if (demoMode) scheduleDemoMove();
    if (holeMode) scheduleHoleMove();
  }, holeTurbo ? 0 : getCurrentMoveDuration());
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

function createReplaySpawnPulse(row, col) {
  const { x, y } = getOffset(row, col);
  const tileSize = getTileSize();
  const pulse = document.createElement("div");
  pulse.className = "replay-spawn-pulse";
  pulse.style.left = `${x}px`;
  pulse.style.top = `${y}px`;
  pulse.style.width = `${tileSize}px`;
  pulse.style.height = `${tileSize}px`;
  fxLayer.appendChild(pulse);
  pulse.addEventListener("animationend", () => pulse.remove(), { once: true });
}

function createMergeGhost({ fromRow, fromCol, toRow, toCol, value }) {
  const ghost = document.createElement("div");
  ghost.className = `tile ${getTileValueClasses(value)}`.trim();
  ghost.textContent = value;
  applyTileTextSizing(ghost, value);
  positionTileElement(ghost, fromRow, fromCol);
  boardElement.appendChild(ghost);

  requestAnimationFrame(() => {
    positionTileElement(ghost, toRow, toCol);
    ghost.style.opacity = "0.15";
    ghost.style.filter = "blur(1px)";
  });

  window.setTimeout(() => ghost.remove(), getCurrentMoveDuration());
}

function ensureAudio() {
  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    audioContext = new AudioCtor();
    audioMasterGain = audioContext.createGain();
    audioMasterGain.gain.value = 0.9;
    audioSfxGain = audioContext.createGain();
    audioSfxGain.gain.value = 1;
    audioMusicGain = audioContext.createGain();
    audioMusicGain.gain.value = 0.0001;
    audioSfxGain.connect(audioMasterGain);
    audioMusicGain.connect(audioMasterGain);
    audioMasterGain.connect(audioContext.destination);
    updateMusicGain();
  }
  return audioContext;
}

async function unlockAudio() {
  if (!audioEnabled && !musicEnabled) return null;
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
    gain.connect(audioSfxGain || audioMasterGain);
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
  gain.connect(audioSfxGain || audioMasterGain);
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
  const root = value >= 512 ? 392 : value >= 128 ? 349.23 : 330;
  playTone({ frequency: root, duration: 0.08, type: value >= 256 ? "square" : "triangle", volume: boost, when: 0 });
  playTone({ frequency: root * 1.5, duration: 0.12, type: "sine", volume: boost * 0.82, when: 0.035 });
  playTone({ frequency: root * 2, duration: 0.09, type: value >= 1024 ? "square" : "triangle", volume: boost * 0.55, when: 0.06 });
  if (value >= 256) {
    playTone({ frequency: root * 2.5, duration: 0.16, type: "triangle", volume: boost * 0.42, when: 0.09, slideTo: root * 2.8 });
  }
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

function stopMusicPlayback() {
  if (musicLoopTimeout) {
    window.clearTimeout(musicLoopTimeout);
    musicLoopTimeout = null;
  }
  stopMusicTimer();
  if (musicAudioElement) {
    musicAudioElement.pause();
  }
  updateMusicGain();
  renderMusicInfo();
}

function pauseMusicPlayback() {
  if (musicLoopTimeout) {
    window.clearTimeout(musicLoopTimeout);
    musicLoopTimeout = null;
  }
  stopMusicTimer();
  if (musicAudioElement) {
    musicAudioElement.pause();
  }
  renderMusicInfo();
}

function resumeMusicPlayback() {
  if (!musicEnabled) return;
  const audio = ensureMusicAudioElement();
  if (!audio) return;
  updateMusicGain();
  startMusicTimer();
  const playPromise = audio.play();
  if (playPromise?.catch) {
    playPromise.catch(() => {
      stopMusicTimer();
      renderMusicInfo();
    });
  }
  renderMusicInfo();
}

function startMusicPlayback(options = {}) {
  const { restart = false } = options;
  if (!musicEnabled) return;
  const audio = ensureMusicAudioElement();
  if (!audio) return;
  if (musicLoopTimeout) {
    window.clearTimeout(musicLoopTimeout);
    musicLoopTimeout = null;
  }
  const track = getCurrentMusicTrack();
  const trackUrl = getMusicTrackUrl(track);
  const shouldReload = audio.dataset.trackUrl !== trackUrl;
  if (shouldReload) {
    audio.pause();
    audio.src = trackUrl;
    audio.dataset.trackUrl = trackUrl;
    audio.load();
  }
  if (restart && !shouldReload) {
    audio.currentTime = 0;
  }
  updateMusicGain();
  startMusicTimer();
  const playPromise = audio.play();
  if (playPromise?.catch) {
    playPromise.catch(() => {
      stopMusicTimer();
      renderMusicInfo();
    });
  }
  renderMusicInfo();
}

function nextMusicTrack() {
  currentMusicTrackIndex = (currentMusicTrackIndex + 1) % MUSIC_TRACKS.length;
  localStorage.setItem(MUSIC_TRACK_INDEX_KEY, String(currentMusicTrackIndex));
  stopMusicPlayback();
  if (musicEnabled) {
    startMusicPlayback({ restart: true });
    setStatus(`Siguiente pista: ${getCurrentMusicTrack()?.name}.`);
  }
  renderMusicInfo();
}

function previousMusicTrack() {
  const audio = ensureMusicAudioElement();
  const shouldRestartCurrent = audio && audio.currentTime > 3;
  if (shouldRestartCurrent) {
    audio.currentTime = 0;
    renderMusicInfo();
    if (musicEnabled) {
      const playPromise = audio.play();
      if (playPromise?.catch) playPromise.catch(() => {});
      setStatus(`Reiniciando pista: ${getCurrentMusicTrack()?.name}.`);
    }
    return;
  }
  currentMusicTrackIndex = (currentMusicTrackIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
  localStorage.setItem(MUSIC_TRACK_INDEX_KEY, String(currentMusicTrackIndex));
  stopMusicPlayback();
  if (musicEnabled) {
    startMusicPlayback({ restart: true });
    setStatus(`Pista anterior: ${getCurrentMusicTrack()?.name}.`);
  }
  renderMusicInfo();
}

function queueMove(direction) {
  if (awaitingManualStart) return;
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
    if (audioContext?.state === "running" && !musicEnabled) {
      audioContext.suspend().catch(() => {});
    }
    audioUnlocked = false;
    setStatus("Sonido desactivado.");
  }
}

function toggleMusicEnabled() {
  musicEnabled = !musicEnabled;
  localStorage.setItem(MUSIC_ENABLED_KEY, String(musicEnabled));
  updateMusicControls();
  if (musicEnabled) {
    startMusicPlayback({ restart: false });
    setStatus(`Musica activada. Sonando: ${getCurrentMusicTrack()?.name}.`);
  } else {
    stopMusicPlayback();
    if (audioContext?.state === "running" && !audioEnabled) {
      audioContext.suspend().catch(() => {});
    }
    setStatus("Musica desactivada.");
  }
}

function setMusicVolumeFromSlider(value) {
  const nextVolume = Math.min(1, Math.max(0, Number(value) / 100));
  musicVolume = nextVolume;
  localStorage.setItem(MUSIC_VOLUME_KEY, String(musicVolume));
  updateMusicControls();
}

function handleKeydown(event) {
  const target = event.target;
  if (
    target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
  ) {
    return;
  }
  if (recordCardModalOpen) {
    if (event.key === "Escape") {
      event.preventDefault();
      setRecordCardModalOpen(false);
    }
    return;
  }
  if (awaitingManualStart) {
    return;
  }
  if (adminPanelOpen) {
    if (event.key === "Escape") {
      event.preventDefault();
      setAdminPanelOpen(false);
    }
    return;
  }
  if (adminPinGateOpen) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAdminPinGate();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdminPinSubmit();
      return;
    }
    return;
  }
  if (gamePaused) {
    if (event.key === "Escape") {
      event.preventDefault();
      setGamePaused(false);
    }
    return;
  }
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
    if (event.key === "ArrowRight") {
      event.preventDefault();
      pauseReplayPlayback();
      setReplayToIndex(replaySession.index + 1);
      return;
    }
    if (event.key === "ArrowLeft") {
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
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveInitialsCursor(-1, 0);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveInitialsCursor(1, 0);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveInitialsCursor(0, -1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveInitialsCursor(0, 1);
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
  };
  const direction = keyMap[event.key];
  if (!direction && !event.repeat && !replayMode && !initialsEntryState.active) {
    const pressed = event.key?.toLowerCase?.() || "";
    const nextHoleExpected = HOLE_SEQUENCE[holeSequenceProgress];
    if (pressed === nextHoleExpected) {
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

    if (attractDismissed && !demoMode && !gameState.over) {
      const nextCtrlExpected = CTRL_SEQUENCE[ctrlSequenceProgress];
      if (pressed === nextCtrlExpected) {
        ctrlSequenceProgress += 1;
        if (ctrlSequenceProgress === CTRL_SEQUENCE.length) {
          event.preventDefault();
          ctrlSequenceProgress = 0;
          openAdminPinGate();
        }
      } else if (pressed === CTRL_SEQUENCE[0]) {
        ctrlSequenceProgress = 1;
      } else {
        ctrlSequenceProgress = 0;
      }
    } else {
      ctrlSequenceProgress = 0;
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
  if (gamePaused || awaitingManualStart) return;
  void unlockAudio();
  const touch = event.changedTouches[0];
  touchStart = { x: touch.clientX, y: touch.clientY };
}

function handleTouchEnd(event) {
  if (!touchStart) return;
  if (gamePaused || awaitingManualStart) {
    touchStart = null;
    return;
  }
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
  if (audioEnabled || musicEnabled) void unlockAudio();
});
window.addEventListener("visibilitychange", () => {
  if ((audioEnabled || musicEnabled) && document.visibilityState === "visible") {
    void unlockAudio();
    if (musicEnabled) startMusicPlayback();
  }
  if (document.visibilityState === "visible" && recordsPanelOpen) {
    fetchGlobalRecords();
  }
});
restartButton.addEventListener("click", () => {
  if (audioEnabled || musicEnabled) void unlockAudio();
  attractDismissed = true;
  attractOverlayElement.classList.add("hidden");
  void startFreshGame();
});
boardSizeSelect.addEventListener("click", () => { if (audioEnabled || musicEnabled) void unlockAudio(); });
boardSizeSelect.addEventListener("change", () => {
  if (audioEnabled || musicEnabled) void unlockAudio();
  attractDismissed = true;
  attractOverlayElement.classList.add("hidden");
  expandedRecordsMode = null;
  syncExpandedRecordsUI();
  updateRecordsMiniTicker(globalRecordsCache);
  if (recordCardModalOpen) {
    renderRecordCardModal();
  }
  if (awaitingManualStart) {
    enterManualStartMode();
    return;
  }
  void startFreshGame();
});
finishButton.addEventListener("click", finishGame);
audioToggleButton.addEventListener("click", toggleAudioEnabled);
musicToggleButton?.addEventListener("click", toggleMusicEnabled);
musicPrevButton?.addEventListener("click", previousMusicTrack);
musicNextButton?.addEventListener("click", nextMusicTrack);
musicVolumeSlider?.addEventListener("input", (event) => {
  setMusicVolumeFromSlider(event.target.value);
});
musicVolumeSlider?.addEventListener("pointerdown", () => {
  if (audioEnabled || musicEnabled) void unlockAudio();
});
undoToggleButton.addEventListener("click", () => setUndoPanelOpen(!undoPanelOpen));
pauseButton.addEventListener("click", () => {
  if (demoMode || replayMode || initialsEntryState.active || gameState.over || awaitingManualStart) return;
  setGamePaused(!gamePaused);
});
saveGameButton.addEventListener("click", () => {
  if (demoMode || replayMode || initialsEntryState.active) return;
  setSaveSlotsPanelOpen(!saveSlotsPanelOpen);
});
showStatsButton?.addEventListener("click", () => {
  if (!(canShowLiveStats() || canShowPostGameStats())) return;
  setStatsPanelOpen(!statsPanelOpen);
});
statsPanelContentElement?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const card = target.closest(".stats-milestone-card");
  if (!card) return;
  const min = Number(card.getAttribute("data-milestone-min") || 0);
  const nextMin = Number(card.getAttribute("data-milestone-next") || 999999999);
  const label = card.getAttribute("data-milestone-label") || "Ficha";
  const isSameCardOpen = !statsMilestonePopoverElement?.classList.contains("hidden")
    && statsMilestonePopoverElement?.dataset.forLabel === label;
  if (isSameCardOpen) {
    closeStatsMilestonePopover();
    return;
  }
  const entries = getMilestonePopoverEntries(min, nextMin);
  if (statsMilestonePopoverElement) {
    statsMilestonePopoverElement.dataset.forLabel = label;
  }
  openStatsMilestonePopover(card, label, entries);
});
closeStatsButton?.addEventListener("click", () => setStatsPanelOpen(false));
shareStatsButton?.addEventListener("click", () => {
  if (!canShowPostGameStats()) return;
  const subject = encodeURIComponent(`Estadisticas Finales 2048 Angeloso ${boardSize}x${boardSize}`);
  const body = encodeURIComponent(buildFinalStatsEmailBody());
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
});
closeAdminButton?.addEventListener("click", () => {
  closeAdminUserPanel();
  setAdminPanelOpen(false);
});
refreshAdminButton?.addEventListener("click", () => { void loadAdminOverview(true); });
adminPanelElement?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const sectionToggle = target.closest("[data-admin-section-toggle]");
  if (sectionToggle instanceof Element) {
    event.preventDefault();
    toggleAdminSection(sectionToggle.getAttribute("data-admin-section-toggle") || "");
    return;
  }
  const sortButton = target.closest(".admin-sort-button[data-admin-sort-table]");
  if (sortButton instanceof Element) {
    event.preventDefault();
    toggleAdminSort(
      sortButton.getAttribute("data-admin-sort-table") || "",
      sortButton.getAttribute("data-admin-sort-key") || "",
    );
  }
});
adminPinSubmitButton?.addEventListener("click", handleAdminPinSubmit);
adminPinCloseButton?.addEventListener("click", closeAdminPinGate);
adminPinXButton?.addEventListener("click", closeAdminPinGate);
adminPinInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleAdminPinSubmit();
  }
});
adminUserRefreshButton?.addEventListener("click", () => { if (adminSelectedUserAlias) void loadAdminUser(adminSelectedUserAlias, true); });
adminUserCloseButton?.addEventListener("click", () => closeAdminUserPanel());
adminUserAddCreditsButton?.addEventListener("click", () => { void adjustAdminUserCredits("add"); });
adminUserSubtractCreditsButton?.addEventListener("click", () => { void adjustAdminUserCredits("subtract"); });
adminUserSetPinButton?.addEventListener("click", () => { void updateAdminUserPin(); });
adminSavePinButton?.addEventListener("click", () => { void updateAdminPanelPin(); });
creditsElement?.addEventListener("click", () => { void loadLedger(); setLedgerPanelOpen(true); });
creditsElement?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    void loadLedger();
    setLedgerPanelOpen(true);
  }
});
closeLedgerButton?.addEventListener("click", () => setLedgerPanelOpen(false));
refreshLedgerButton?.addEventListener("click", () => { void loadLedger(true); });
adminAddBetButton?.addEventListener("click", () => {
  adminBetDefinitionsDraft.push(createEmptyAdminBetDefinition());
  renderAdminBetDefinitionsEditor();
  setAdminPanelStatus("Nueva apuesta anadida. Recuerda guardar los cambios.");
});
adminSaveBetsButton?.addEventListener("click", () => {
  void saveAdminBetDefinitions().catch((error) => {
    setAdminPanelStatus(`No pude guardar las apuestas: ${error.message}`);
  });
});
closeUndoButton.addEventListener("click", () => setUndoPanelOpen(false));
closeSaveSlotsButton.addEventListener("click", () => setSaveSlotsPanelOpen(false));
startAttractButton.addEventListener("click", startActualGame);
themeSelect.addEventListener("change", (event) => applyTheme(event.target.value));
selectLetterButton.addEventListener("pointerdown", () => { if (audioEnabled || musicEnabled) void unlockAudio(); });
deleteLetterButton.addEventListener("pointerdown", () => { if (audioEnabled || musicEnabled) void unlockAudio(); });
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
bestScoreCardElement?.addEventListener("click", () => setRecordCardModalOpen(!recordCardModalOpen));
bestScoreCardElement?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    setRecordCardModalOpen(!recordCardModalOpen);
  }
});
closeRecordCardModalButton?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  setRecordCardModalOpen(false);
});
recordCardModalElement?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (event.target === recordCardModalElement) {
    setRecordCardModalOpen(false);
  }
});
window.addEventListener("pointerdown", (event) => {
  if (!recordCardModalOpen) return;
  const target = event.target;
  if (recordCardModalElement?.contains(target) || bestScoreCardElement?.contains(target)) return;
  setRecordCardModalOpen(false);
});
window.addEventListener("pointerdown", (event) => {
  if (statsMilestonePopoverElement?.classList.contains("hidden")) return;
  const target = event.target;
  if (statsMilestonePopoverElement?.contains(target)) return;
  if (target instanceof Element && target.closest(".stats-milestone-card")) return;
  closeStatsMilestonePopover();
});
advancedToggleLabelElement?.addEventListener("mouseenter", () => setAdvancedToggleHintVisible(true));
advancedToggleLabelElement?.addEventListener("mouseleave", () => setAdvancedToggleHintVisible(false));
advancedToggleLabelElement?.addEventListener("focusin", () => setAdvancedToggleHintVisible(true));
advancedToggleLabelElement?.addEventListener("focusout", () => setAdvancedToggleHintVisible(false));
window.addEventListener("resize", () => {
  if (advancedToggleHintElement?.classList.contains("is-visible")) {
    positionAdvancedToggleHint();
  }
});
window.addEventListener("scroll", () => {
  if (advancedToggleHintElement?.classList.contains("is-visible")) {
    positionAdvancedToggleHint();
  }
}, { passive: true });
advancedModeToggle?.addEventListener("change", () => {
  void handleAdvancedModeToggle();
});
advancedAuthSubmitButton?.addEventListener("click", () => {
  void handleAdvancedAuthSubmitEvent();
});
advancedAliasInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    void handleAdvancedAuthSubmitEvent(event);
  }
});
advancedPinInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    void handleAdvancedAuthSubmitEvent(event);
  }
});
advancedAuthCloseButton?.addEventListener("click", () => {
  closeAdvancedAuthEntry();
  if (!advancedPlayerAuth) {
    advancedMode = false;
    localStorage.setItem(ADVANCED_MODE_KEY, "false");
    updateAdvancedModeUI();
  }
});
advancedAuthXButton?.addEventListener("click", () => {
  closeAdvancedAuthEntry();
  if (!advancedPlayerAuth) {
    advancedMode = false;
    localStorage.setItem(ADVANCED_MODE_KEY, "false");
    updateAdvancedModeUI();
  }
});
advancedBetsCloseButton?.addEventListener("click", () => {
  closeAdvancedModePanel();
});
advancedBetsCollapseButton?.addEventListener("click", () => {
  advancedBetsCollapsed = !advancedBetsCollapsed;
  updateAdvancedModeUI();
});
advancedMiniExpandButton?.addEventListener("click", () => {
  advancedBetsCollapsed = false;
  advancedBetsVisible = true;
  updateAdvancedModeUI();
});
holeSpeedSelect?.addEventListener("change", (event) => {
  const nextValue = Number(event.target.value);
  holeSpeedMultiplier = HOLE_SPEED_OPTIONS.includes(nextValue) ? nextValue : 1;
  if (holeMode) {
    syncGameTimerScale(holeSpeedMultiplier);
    scheduleHoleMove();
    setStatus(getHoleStatusText());
  }
});
advancedLogoutButton?.addEventListener("click", logoutAdvancedPlayer);
clearAdvancedBetsButton?.addEventListener("click", () => {
  advancedBetDraft = createDefaultAdvancedBetDraft();
  saveAdvancedBetDraft();
  renderAdvancedBetsPanel();
  setStatus("Apuestas preparadas limpiadas.");
});
document.querySelectorAll(".records-mode-toggle").forEach((button) => {
  button.addEventListener("click", () => setExpandedRecordsMode(button.dataset.mode));
});
document.querySelectorAll(".records-mode-close").forEach((button) => {
  button.addEventListener("click", () => setExpandedRecordsMode(null));
});
document.querySelectorAll(".records-sort-select").forEach((select) => {
  select.addEventListener("change", () => {
    expandedRecordsSort = select.value === "date" ? "date" : "score";
    renderGlobalRecords(globalRecordsCache);
  });
});
window.addEventListener("keydown", handleKeydown);
boardElement.addEventListener("touchstart", handleTouchStart, { passive: true });
boardElement.addEventListener("touchend", handleTouchEnd, { passive: true });
window.addEventListener("resize", () => {
  if (statsPanelOpen) positionStatsPanel();
  render();
});
window.addEventListener("scroll", () => {
  if (statsPanelOpen) positionStatsPanel();
}, { passive: true });

buildGrid();
applyTheme(theme);
updateAudioToggleButton();
updateMusicControls();
if (musicEnabled) {
  startMusicPlayback();
}
renderAdminOverview();
updateAdvancedModeUI();
updateHoleSpeedUI();
syncMoveDurationUI();
updateManualStartUI();
updatePauseButton();
setTickerMessage("Angeloso Arcade System listo para jugar.", "accent");
void loadAdvancedBetDefinitionsFromWorker();
setRecordsPanelOpen(false);
closeInitialsEntry();
renderSaveSlots();
if (advancedMode) {
  void ensureAdvancedPlayer();
}
clearSessionSnapshot();
startAttractMode();


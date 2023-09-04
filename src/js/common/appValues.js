export const GamePhase = {
    STARTED: 'STARTED',
    PLAY: 'PLAY',
    PAUSED: 'PAUSED'
};

export const CellState = {
    LIVE: 'LIVE',
    DEAD: 'DEAD',
    getRandom: () => {
        return Math.random() >= 0.5 ? CellState.LIVE : CellState.DEAD;
    }
};

export const FieldSize = {
    MIN: 10,
    MAX: 50,
    DEFAULT: 20
};

export const GenerationTTL = {
    MIN: 50,
    MAX: 800,
    DEFAULT: 100
};

export const TextData = {
    TITLE_BTN_START: 'Старт',
    TITLE_BTN_STOP: 'Стоп',
    TITLE_BTN_PAUSE: 'Пауза',
    TITLE_BTN_GO: 'Продолжить',
    TITLE_BTN_GENERATE_GENERATION: 'Сгенерить первое поколение',
    TITLE_FIELD_SIZE: 'Размер поля',
    TITLE_GENERATION_TTL: 'Время жизни поколения (мс)',
    GAME_RIGHTS: 'Место действия игры — размеченная на клетки безграничная плоскость.<br><br>' +
        'Каждая клетка на этой поверхности имеет восемь соседей, окружающих её, и может находиться в двух состояниях: быть «живой» (заполненной) или «мёртвой» (пустой).<br><br>' +
        'Распределение живых клеток в начале игры называется первым поколением.<br><br>' +
        'Каждое следующее поколение рассчитывается на основе предыдущего по правилам:<br>' +
        '- в пустой (мёртвой) клетке, с которой соседствуют три живые клетки, зарождается жизнь;<br> ' +
        '- если у живой клетки есть две или три живые соседки, то эта клетка продолжает жить;<br>' +
        '- в противном случае (если живых соседей меньше двух или больше трёх) клетка умирает («от одиночества» или «от перенаселённости»).',
    STAT_GENERATION_COUNT: 'Поколений сменилось',
    STAT_CYCLE_STOP: ', а потом всё зациклилось нахрен',
    ALL_DEAD_STOP: ', после чего все сдохли',
    STAT_DEADLOCK_STOP: ', на чем развитие и закончилось'
}
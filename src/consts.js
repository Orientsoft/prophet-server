export const TASK_TYPES = {
    NORMAL: 0,
    CRON: 1
};

export const PORT_TYPES = {
    REDIS_CHANNEL: 0,
    NSQ_QUEUE: 1,
    MONGODB_COLLECTION: 2,
    ES_INDEX: 3
};

export const STATUS_LEVELS = {
    DEBUG: 0,
    LOG: 1,
    WARNING: 2,
    ERROR: 3
};

export const STATUS_CODES = {
    UNKNOWN: 0,
    HEART_BEAT: 1,
};

export const TRIGGER_TYPES = {
    PRE: 0,
    POST: 1
};

export const TRIGGER_ACTIONS = {
    START: 0,
    STOP: 1,
    RESTART: 2
}

export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const MONGODB_DB = 'prophet-server'
export const DATA_COLLECTION = 'data';

//For User
export const USER_COOKIE_TOKEN_KEY = 'AiDefenderKey'

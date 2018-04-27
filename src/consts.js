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
};

export const ALERT_LEVELS = {
    NORMAL: 0,
    WARNING: 1,
    ERROR: 2
};

export const JOB_STATUS_TYPES = {
    online: 0,
    stopping: 1,
    stopped: 2,
    launching: 3,
    errored: 4,
    'one-launch-status': 5
};

export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 500;

export const MONGODB_DB = 'prophet-server'
export const DATA_COLLECTION = 'data';
export const STRUCTURE_COLLECTION = 'structures';

//For User
export const USER_COOKIE_TOKEN_KEY = 'AiDefenderKey';

export const WATCHDOG_INTERVAL = 5000;

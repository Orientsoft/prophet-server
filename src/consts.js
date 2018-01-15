export const TASK_TYPE = {
    NORMAL: 0,
    CRON: 1
};

export const PORT_TYPE = {
    REDIS_CHANNEL: 0,
    NSQ_QUEUE: 1,
    MONGODB_COLLECTION: 2,
    ES_INDEX: 3
};

export const STATUS_LEVEL = {
    DEBUG: 0,
    LOG: 1,
    WARNING: 2,
    ERROR: 3
};

export const STATUS_CODE = {
    UNKNOWN: 0,
    HEART_BEAT: 1,
};

export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

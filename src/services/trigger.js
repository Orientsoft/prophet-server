import * as CONSTS from '../consts';
import errors from '../lib/errors';

async function executePreTrigger(preTrigger) {

}

async function executePostTrigger(postTrigger) {

}

export async function execute(trigger) {
    switch (trigger.type) {
        case CONSTS.TRIGGER_TYPES.PRE:
        await executePreTrigger(trigger);
        break;

        case CONSTS.TRIGGER_TYPES.POST:
        await executePostTrigger(trigger);
        break;

        default:
        logger.error(
            `triggerService::execute() error`,
            errors.UNKNOWN_TRIGGER_TYPE
        );
    }
}

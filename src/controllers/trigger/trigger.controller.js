import _ from 'lodash';
import { Trigger } from '../../models';
import * as CONSTS from '../../consts';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export function create(req, res) {
    return Trigger.create({
        name: req.body.name || '',
        type: Number(req.body.type) || CONSTS.TRIGGER_TYPES.POST,
        task: req.body.task,
        action: Number(req.body.action) || CONSTS.TRIGGER_ACTIONS.RESTART,
        target: req.body.target
    }).then((trigger) => {
        return res.status(200).json(trigger.toJSON());
    }).catch((err) => {
        logger.error(`TriggerCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    });
}

export async function list(req, res) {
    const pageOption = getPageOption(req);
    const { offset, limit } = pageOption;

    const { name, type, task, action, target } = req.query;
    const query = _.pickBy({ name, type, task, action, target }, _.identity);

    try {
        const triggers = await Trigger.find(query)
            .sort({ ts: -1 })
            .limit(limit)
            .skip(offset);

        const count = await Trigger.count(query);

        return res.status(200).json({
            _metadata: getPageMetadata(pageOption, count),
            triggers: triggers.map((trigger) => trigger.toJSON())
        });
    } catch (err) {
        logger.error(`TriggerCtrl::list() error`, err);
        return res.status(500).send(err.toString());
    }
}

export function triggerById(req, res, next, id) {
    return Trigger.findById(id).then((trigger) => {
        if (trigger) {
            req.trigger = trigger;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.TRIGGER_NOT_FROUND));
    }).catch((err) => {
        logger.error(`TriggerCtrl::triggerById() error`, err);
        return res.status(500).send(err.toString());
    });
}

export function read(req, res) {
    return res.status(200).json(req.trigger.toJSON());
}

export function update(req, res) {
    const { name, type, task, action, target } = req.query;
    const query = _.pickBy({ name, type, task, action, target }, _.identity);

    return req.trigger.update(query).then((trigger) => {
        return res.status(200).json(trigger.toJSON());
    }).catch((err) => {
        logger.error(`TriggerCtrl::read() error`, err);
        return res.status(500).send(err.toString());
    });
}

export function remove(req, res) {
    return req.trigger.remove(() => {
        return res.status(200).end();
    }).catch((err) => {
        logger.error(`TriggerCtrl::remove() error`, err);
        return res.status(500).send(err.toString());
    })
}

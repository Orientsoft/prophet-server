import _ from 'lodash';
import Promise from 'bluebird';
import { Flow } from '../../models';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export function flowById(req, res, next, id) {
    return Flow.findById(id).then((flow) => {
        if (flow) {
            req.flow = flow;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.FLOW_NOT_FOUND));
    }).catch((err) => {
        logger.error(`FlowCtrl::flowById() error`, err);
        res.status(500).send(err.toString());
    });
}

export function read(req, res) {
    return res.status(200).json(req.flow.toJSON());
}

export async function update(req, res) {
    const { flow, body } = req;
    const { name, tasks } = body;
    const query = _.pickBy({ name, tasks }, _.identity);

    try {
        if (name !== flow.name) {
            const existedFlow = await Flow.find({ name });
            if (existedFlow.length !== 0) {
                return res.status(400).send(JSON.stringify(errors.FLOW_NAME_EXISTED));
            }
        }

        flow.set(query);
        const updatedFlow = await flow.save();
        return res.status(200).json(updatedFlow.toJSON());
    }
    catch(err) {
        logger.error(`FlowCtrl::update() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function remove(req, res) {
    return req.flow.remove().then(() => {
        return res.status(200).end();
    }).catch((err) => {
        logger.error(`FlowCtrl::remove() error`, err);
        return res.status(500).send(err.toString());
    });
}

export function create(req, res) {
    return Flow.find({
        name: req.body.name
    }).then((existedFlow) => {
        if (existedFlow.length === 0) {
            return Flow.create({
                name: req.body.name,
                tasks: req.body.tasks || []
            });
        }

        return Promise.reject(JSON.stringify(errors.FLOW_NAME_EXISTED));
    })
    .then((flow) => {
        return res.status(200).json(flow);
    }).catch((err) => {
        logger.error(`FlowCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    });
}

export async function list(req, res) {
    const pageOption = getPageOption(req);
    const { offset, limit } = pageOption;

    const { name } = req.query;
    const query = _.pickBy({ name }, _.identity);

    // TODO : check param

    try {
        const flows = await Flow.find(query)
            .sort({ ts: -1 })
            .limit(limit)
            .skip(offset);
        
        const count = await Flow.count(query);

        return res.status(200).json({
            _metadata: getPageMetadata(pageOption, count),
            flows: flows.map((flow) => flow.toJSON())
        });
    } catch (err) {
        logger.error(`FlowCtrl::list() error`, err);
        return res.status(500).send(err.toString());
    }
}

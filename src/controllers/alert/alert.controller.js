import _ from 'lodash';
import Promise from 'bluebird';
import { Alert } from '../../models';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';

export async function alertById(req, res, next, id) {
    try {
        const alert = await Alert.findById(id);
        if (alert) {
            req.alert = alert;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.ALERT_NOT_FOUND));
    }
    catch(err) {
        logger.error(`AlertCtrl::alertById() error`, err);
        res.status(500).send(err.toString());
    }
}

export function read(req, res) {
    return res.status(200).json(req.alert.toJSON());
}

export async function update(req, res) {
    const { alert, body } = req;
    const { structure, esIndex } = body;
    const query = _.pickBy({ structure, esIndex }, _.identity);

    try {
        if (esIndex !== alert.esIndex) {
            const existedAlert = await Alert.find({ esIndex });
            if (existedAlert.length !== 0) {
                return res.status(400).send(JSON.stringify(errors.ALERT_NAME_EXISTED));
            }
        }

        alert.set(query);
        const updatedAlert = await alert.save();
        return res.status(200).json(updatedAlert.toJSON());
    }
    catch(err) {
        logger.error(`AlertCtrl::update() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function remove(req, res) {
    try {
        await req.alert.remove();
        return res.status(200).end();
    }
    catch(err) {
        logger.error(`AlertCtrl::remove() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function create(req, res) {
    try {
        const existedAlert = await Alert.find({ esIndex: req.body.esIndex });
        if (existedAlert.length === 0) {
            const alert = await Alert.create({
                structure: req.body.structure || [],
                esIndex: req.body.esIndex || ''
            });

            return res.status(200).json(alert);
        }

        return res.status(400).send(JSON.stringify(errors.ALERT_NAME_EXISTED));
    }
    catch(err) {
        logger.error(`AlertCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function list(req, res) {
    const page = Number(req.query.page) || 0;
    const pageSize = Math.min(CONSTS.MIN_PAGE_SIZE,
        Math.max(CONSTS.MAX_PAGE_SIZE,
        Number(req.query.pageSize) || CONSTS.DEFAULT_PAGE_SIZE)
    );

    const { structure, esIndex } = req.query;
    const query = _.pickBy({ structure, esIndex }, _.identity);
    // TODO : check param

    try {
        const alerts = await Alert.find(query)
            .sort({ ts: -1 })
            .limit(pageSize)
            .skip(page * pageSize);

        return res.status(200).json(alerts);
    }
    catch(err) {
        logger.error(`AlertCtrl::list() error`, err);
        return res.status(500).send(err.toString());
    }
}

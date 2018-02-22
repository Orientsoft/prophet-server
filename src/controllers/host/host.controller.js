import _ from 'lodash';
import Promise from 'bluebird';
import { Host } from '../../models';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export async function hostById(req, res, next, id) {
    try {
        const host = await Host.findById(id);
        if (host) {
            req.myHost = host;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.HOST_NOT_FOUND));
    }
    catch(err) {
        logger.error(`HostCtrl::HostById() error`, err);
        res.status(500).send(err.toString());
    }
}

export function read(req, res) {
    return res.status(200).json(req.myHost.toJSON());
}

export async function update(req, res) {
    const { myHost, body } = req;
    const { hostname, ip } = body;

    try {
        myHost.set({
            hostname,
            ip
        });
    
        const newHost = await myHost.save();
        return res.status(200).json(newHost.toJSON());
    }
    catch(err) {
        logger.error(`hostCtrl::update() error`, err);
        return res.status(500).send(err.toString());
    }
}

export function remove(req, res) {
    return req.myHost.remove().then(() => {
        return res.status(200).end();
    }).catch((err) => {
        logger.error(`HostCtrl::remove() error`, err);
        return res.status(500).send(err.toString());
    });
}

export async function create(req, res) {
    try {
        const existedHost = await Host.find({ hostname: req.body.hostname })
        if (existedHost.length !== 0) {
            return res.status(400).send(JSON.stringify(errors.HOSTNAME_EXISTED))
        }
    
        const host = await Host.create({
            hostname: req.body.hostname || '',
            ip: req.body.ip || ''
        })

        return res.status(200).json(host.toJSON());
    }
    catch(err) {
        logger.error(`HostCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function list(req, res) {
    const pageOption = getPageOption(req);
    const { offset, limit } = pageOption;

    const { hostname, ip } = req.query;
    const query = _.pickBy({ hostname, ip }, _.identity);

    // TODO : check param

    try {
        const hosts = await Host.find(query)
            .sort({ ts: -1 })
            .limit(limit)
            .skip(offset);

        const count = await Host.count(query);

        return res.status(200).json({
            _metadata: getPageMetadata(pageOption, count),
            hosts 
        });
    } catch (err) {
        logger.error(`hostCtrl::list() error`, err);
        return res.status(500).send(err.toString());
    }
}

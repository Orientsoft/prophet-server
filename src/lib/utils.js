import path from 'path';
import _ from 'lodash';
import errors from './errors';

export function isProduction() {
    return process.env.NODE_ENV === 'production';
}

export function getBaseDir() {
    return path.dirname(require.main.filename);
}

export function notEmptyValidate(property) {
    return property && property.length > 0;
}

export function notEmptyString(str) {
    return notEmptyValidate(str) && typeof str === 'string';
}

export function passwordValidate(password) {
    return password === '' || (password && password.length > 6);
}

function extractErrorInfo(err, model) {
    if (err.name && err.name.includes('ValidationError')) {
        return Object.assign({}, errors.CONSTRAINT_ERROR, {
            model,
            paths: _.map(err.errors, error => error.path),
            errors: err.errors,
        });
    } else if (err.name && err.name.includes('ConstraintError')) {
        return Object.assign({}, errors.CONSTRAINT_ERROR, {
            model,
            paths: _.map(err.errors, error => error.path),
            errors: err.errors,
        });
    }
    return {
        model,
        errors: err.errors,
        paths: _.map(err.errors, error => error.path),
    };
}

export function getPageOption(req) {
    const page = Number(req.query.page) || 0;
    const skip = Number(req.query.skip) || 0;
    const pageSize = Math.max(CONSTS.MIN_PAGE_SIZE,
        Math.min(CONSTS.MAX_PAGE_SIZE,
            Number(req.query.pageSize) || CONSTS.DEFAULT_PAGE_SIZE
        )
    );
    return {
        page,
        pageSize,
        skip,
        offset: skip + (page * pageSize),
        limit: pageSize,
    };
}

export function getPageMetadata(pageOption, count) {
    const { page, pageSize, skip } = pageOption;
    const remainingCount = count - skip;
    const pageCount = Math.ceil(remainingCount / pageSize);
    return {
        page, pageSize, pageCount, totalCount: remainingCount
    };
}

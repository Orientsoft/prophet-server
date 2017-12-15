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

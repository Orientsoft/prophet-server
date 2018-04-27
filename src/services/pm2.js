import Promise from 'bluebird';
import pm2 from 'pm2';
import NodePath from 'path';
import config from '../config';

export const connect = () => {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) {
                reject(err);
            }

            resolve(pm2);
        });
    });
}

export const register = (name, path, cron, params) => {
    return connect().then((pm2) => {
        return start(name, path, cron, params);
    }).then((proc) => {
        return pause(name);
    }).finally(() => {
        pm2.disconnect();
    });
}

export const start = (name, path, cron, params) => {
    return connect().then((pm2) => {
        return new Promise((resolve, reject) => {
            pm2.start(
                {
                    name,
                    script: path,
                    cwd: NodePath.dirname(path),
                    cron,
                    args: params.reduce((prev, curr, index) => {
                        if (index == 0) {
                            return curr;
                        } else {
                            return prev + ' ' + curr;
                        }
                    }, ''),
                    interpreter: config.pythonInterpreter
                },
                (err, proc) => {
                if (err) {
                    reject(err);
                }

                resolve(proc);
            });
        }).finally(() => {
            pm2.disconnect();
        });
    });
}

export const stop = (name) => {
    return connect().then((pm2) => {
        return new Promise((resolve, reject) => {
            pm2.delete(name, (err, proc) => {
                if (err) {
                    reject(err);
                }

                resolve(proc);
            });
        });
    }).finally(() => {
        pm2.disconnect();
    });
}

export const pause = (name) => {
    return connect().then((pm2) => {
        return new Promise((resolve, reject) => {
            pm2.stop(name, (err, proc) => {
                if (err) {
                    reject(err);
                }

                resolve(proc);
            });
        });
    }).finally(() => {
        pm2.disconnect();
    });
}

export const resume = (name) => {
    return connect().then((pm2) => {
        return new Promise((resolve, reject) => {
            pm2.restart(name, (err, proc) => {
                if (err) {
                    reject(err);
                }

                resolve(proc);
            });
        });
    }).finally(() => {
        pm2.disconnect();
    });
}

export const list = () => {
    return connect().then((pm2) => {
        return new Promise((resolve, reject) => {
            pm2.list((err, procs) => {
                if (err) {
                    reject(err);
                }

                resolve(procs);
            });
        });
    }).finally(() => {
        pm2.disconnect();
    });
}

export const describe = (name) => {
    return connect().then((pm2) => {
        return new Promise((resolve, reject) => {
            pm2.describe(name, (err, proc) => {
                if (err) {
                    reject(err);
                }

                resolve(proc);
            });
        });
    }).finally(() => {
        pm2.disconnect();
    });
}

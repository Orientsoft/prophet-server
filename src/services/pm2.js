import Promise from 'bluebird';
import pm2 from 'pm2';

const connect = () => {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) {
                reject(err);
            }

            resolve(pm2);
        });
    });
}

const start = (name, path, cron, params) => {
    return connect.then((pm2) => {
        return new Promise((resolve, reject) => {
            pm2.start({name, script: path, cron, args: params}, (err, proc) => {
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

const stop = (name) => {
    return connect.then((pm2) => {
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
    });;
}

const list = () => {
    return connect.then((pm2) => {
        return new Promise((resolve, reject) => {
            pm2.stop(name, (err, procs) => {
                if (err) {
                    reject(err);
                }

                resolve(procs);
            });
        });
    }).finally(() => {
        pm2.disconnect();
    });;
}

const describe = (name) => {
    return connect.then((pm2) => {
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
    });;
}

export default { connect, start, stop, list, describe };

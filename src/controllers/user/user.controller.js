import _ from 'lodash';
import qs from 'qs';
import * as CONSTS from '../../consts';
import { logger } from '../../lib/logger';
import errors from '../../lib/errors';
import config from '../../config';
import User, { RoleType } from '../../models/user';

export async function requireLogin(req, res, next) {
    try {
        if (req.session.userId === undefined || req.session.userId == null) {
            return res.status(400)
                .send(JSON.stringify(errors.UNAUTHORIZED));
        }

        const user = await User.findById(req.session.userId);

        if (user === undefined || user == null) {
            res.clearCookie(CONSTS.USER_COOKIE_TOKEN_KEY);
            delete req.session['userId'];

            return res.status(400)
                .send(JSON.stringify(errors.USER_NOT_FOUND));
        }

        return next();
    } catch (err) {
        logger.error(`UserControl::requireLogin() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function requireAdmin(req, res, next) {
    try {
        if (req.session.userId === undefined || req.session.userId == null) {
            return res.status(400)
                .send(JSON.stringify(errors.UNAUTHORIZED));
        }

        const user = await User.findById(req.session.userId);

        if (user === undefined || user == null) {
            res.clearCookie(CONSTS.USER_COOKIE_TOKEN_KEY);
            delete req.session['userId'];
            
            return res.status(400)
                .send(JSON.stringify(errors.USER_NOT_FOUND));
        } else if (user.role === RoleType.DEFAULT) {
            return res.status(400)
                .send(JSON.stringify(errors.ADMIN_REQUIRED));
        }

        return next();
    } catch (err) {
        logger.error(`UserControl::requireAdmin() error`, err);
        return res.status(500).send(err.toString());
    }
}

/**
import { TestScheduler } from 'rx';
 * 用户登陆
 * @param {*} req 
 * @param {*} res 
 */
export async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && user.validatePassword(password)) {
            const now = new Date();
            now.setDate(now.getDate() + 1);
            res.cookie(CONSTS.USER_COOKIE_TOKEN_KEY, JSON.stringify({
                id: user.id,
                deadline: now.getTime(),
            }), {
                maxAge: 1800000,
                httpOnly: true,
            });
            req.session.userId = user.id;
            return res.json({ success: true, data: user.id });
        }
        return res.json({
            success: false,
            message: '用户名或密码错误',
        });
    } catch (err) {
        logger.error(`Failed to login. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

export async function register(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user) {
        return res.json({ success: false, message: '用户名已存在' });
    }
    const data = { username, password, menus: [] };
    
    if (username.length > 2) {
        if (/^@[^@]+@$/.test(username)) {
            data.role = RoleType.ADMIN;
        } else if (/^%[^%]+%$/.test(username)) {
            data.role = RoleType.DEVELOPER;
        }
    }
    User.create(data).then(() => {
        res.json({ success: true });
    }).catch(err => res.status(500).send(err.toString()));
}

/**
 * 获取登陆用户信息
 * @param {*} req 
 * @param {*} res 
 */
export async function info(req, res) {
    try {
        const cookie = req.headers.cookie || '';
        const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
        const response = { success: false };
        if (!cookies[CONSTS.USER_COOKIE_TOKEN_KEY]) {
            return res.status(403).send({ message: 'Not Login' });
        }
        const token = JSON.parse(cookies[CONSTS.USER_COOKIE_TOKEN_KEY]);
        if (token) {
            response.success = token.deadline > new Date().getTime();
        }
        if (response.success) {
            const userItem = await User.findOne({ _id: token.id });
            if (userItem) {
                response.user = { ...userItem.toJSON() };
                delete response.user['password'];
            }
        }
        return res.json(response);
    } catch (err) {
        logger.error(`Failed to fetch user info. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

/**
 * 用户登出
 * @param {*} req 
 * @param {*} res 
 */
export async function logout(req, res) {
    try {
        res.clearCookie(CONSTS.USER_COOKIE_TOKEN_KEY);
				req.session.destroy();
        res.status(200).end();
    } catch (err) {
        logger.error(`Failed to logout. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

/**
 * 获取所有普通权限用户
 */
export async function userList(req, res) {
    try {
        const cookie = req.headers.cookie || '';
        const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
        const response = { success: false };
        if (!cookies[CONSTS.USER_COOKIE_TOKEN_KEY]) {
            return res.status(403).send({ message: 'Not Login' });
        }
        const users = await User.find({ role: RoleType.DEFAULT });
        response.success = true;
        response.users = users.map(user => {
          return { _id: user._id, username: user.username, role: user.role, createdAt: user.createdAt, menus: user.menus };
        });
        res.json(response);
    } catch (err) {
        logger.error(`Failed to fetch user list. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

/**
 * 删除用户
 */
export async function remove(req, res) {
    try {
        await User.deleteOne({ _id: req.body.id });

        res.clearCookie(CONSTS.USER_COOKIE_TOKEN_KEY);
        req.session.destroy();
                    
        return res.json({
            success: true,
            message: ''
        });
    } catch (err) {
        logger.error(`Failed to fetch user list. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

/**
 * 菜单授权
 */
export async function setMenus(req, res) {
    try {
        const cookie = req.headers.cookie || '';
        const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
        const response = { success: false };
        if (!cookies[CONSTS.USER_COOKIE_TOKEN_KEY]) {
            return res.status(403).send({ message: 'Not Login' });
        }
        const token = JSON.parse(cookies[CONSTS.USER_COOKIE_TOKEN_KEY]);
        if (token) {
            response.success = token.deadline > new Date().getTime();
        }
        const { id, menus = [] } = req.body;
        let message = '';
        if (response.success) {
            const userItem = await User.findOne({ _id: token.id });
            if (userItem) {
                const role = userItem.toJSON().role;
                if (role == RoleType.ADMIN || role == RoleType.DEVELOPER) {
                    await User.updateOne({ _id: id }, { '$set': { menus } }, { upsert: true });
                    response.success = true;
                    return res.json(response);
                }
            } else {
              message = 'User not found';
            }
        } else {
          message = 'Invalid cookie';
        }
        response.message = message;
        res.status(400).json(response);
    } catch (err) {
        logger.error(`Failed to fetch user list. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

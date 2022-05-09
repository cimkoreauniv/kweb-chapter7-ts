import { RequestHandler } from 'express';

export const authRequired: RequestHandler = async (req, res, next) => {
    try {
        if (req.session.user) return next();
        else return res.redirect('/auth/sign_in');
    } catch (err) {
        return next(err);
    }
};
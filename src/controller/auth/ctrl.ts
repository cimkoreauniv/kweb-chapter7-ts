import { UserDAO } from "../../DAO";
import { generatePassword, verifyPassword } from "../../lib/authentication";
import express, { RequestHandler } from 'express';

declare module 'express-session'
{
    interface SessionData {
        user: {
            id: number,
            username: string,
            displayName: string,
            isStaff: number,
            isActive: number
        }
    }
}

export const signInForm: RequestHandler = async (req, res, next) => {
    try {
        const { user } = req.session;
        if (user) return res.redirect('/');
        return res.render('auth/sign-in.pug', { user });
    } catch (err) {
        next(err);
    }
}

export const signIn: RequestHandler = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!(username && password))
            throw new Error("BAD_REQUEST");
        
        const user = await UserDAO.getByUsername(username);
        if (!user) throw new Error('UNAUTHORIZED');

        const isValidPassword: boolean = await verifyPassword(password, user.password);
        if (!isValidPassword) throw new Error('UNAUTHORIZED');

        req.session.user = {
            id: user.id,
            username: username,
            displayName: user.displayName,
            isStaff: user.isStaff,
            isActive: user.isActive
        };
        return res.redirect('/');
    } catch (err) {
        next(err);
    }
};

export const signUpForm: RequestHandler = async (req, res, next) => {
    try {
        const { user } = req.session;
        return res.render('auth/sign-up.pug', { user });
    } catch (err) {
        next(err);
    }
};

export const signUp: RequestHandler = async (req, res, next) => {
    try {
        const username: string = req.body.username;
        const password: string = req.body.password;
        const displayName: string = req.body.displayName;
        if (!username || username.length > 16 || !password || !displayName || displayName.length > 32)
            throw new Error('BAD_REQUEST');
        const hashedPassword: string = await generatePassword(password);
        UserDAO.create(username, hashedPassword, displayName);
        return res.redirect('/auth/sign_in');
    } catch (err) {
        next(err);
    }
};

export const signOut: RequestHandler = async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) throw err;
            else return res.redirect('/');
        });
    } catch (err) {
        next(err);
    }
};
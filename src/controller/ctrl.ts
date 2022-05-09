import { RequestHandler } from "express";

const { ArticleDAO } = require('../DAO');

export const indexPage: RequestHandler = async (req, res, next) => {
    try {
        const { user } = req.session;
        return res.render('index.pug', { user });
    } catch (err) {
        return next(err);
    }
}

export const listArticles: RequestHandler = async (req, res, next) => {
    try {
        const { page } = req.params;
        const { user } = req.session;
        const pageNum = parseInt(page);
        if (pageNum < 0) throw new Error('BAD_REQUEST');

        const ARTICLES_PER_PAGE = 10;
        const startIndex = (pageNum - 1) * ARTICLES_PER_PAGE;

        const articles = await ArticleDAO.getList(startIndex, ARTICLES_PER_PAGE);
        const articleCount = await ArticleDAO.getTotalCount();
        const pageCount = Math.ceil(articleCount / ARTICLES_PER_PAGE);

        return res.render('articles/index.pug', {
            user, articles,
            page: pageNum, hasPrev: pageNum > 1, hasNext: pageNum < pageCount,
        });
    } catch (err) {
        return next(err)
    }
}

export const latestArticles: RequestHandler = async (req, res, next) => {
    try {
        res.redirect('/articles/page/1');
    } catch (err) {
        return next(err);
    }
}
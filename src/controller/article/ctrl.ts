import { RequestHandler } from 'express';
import { ArticleDAO } from '../../DAO';

export const readArticle: RequestHandler = async (req, res, next) => {
    try {
        const { user } = req.session;
        const id: number = parseInt(req.params.articleId);
        const article = await ArticleDAO.getById(id);
        if (!article)
            throw new Error('NOT_FOUND');

        return res.render('articles/details.pug', { user, article });
    } catch (err) {
        return next(err);
    }
};

export const writeArticleForm: RequestHandler = async (req, res, next) => {
    try {
        const { user } = req.session;
        return res.render('articles/editor.pug', { user });
    } catch (err) {
        return next(err);
    }
};

export const writeArticle: RequestHandler = async (req, res, next) => {
    try {
        const { user } = req.session;
        const title: string = req.body.title.trim();
        const content: string = req.body.content.trim();
        if (!title || title.length > 50 || !content || content.length > 65535)
            throw new Error('BAD_REQUEST');

        const newArticleId = await ArticleDAO.create(title, content, user);
        return res.redirect(`/article/${newArticleId}`);
    } catch (err) {
        return next(err);
    }
};

export const editArticleForm: RequestHandler = async (req, res, next) => {
    try {
        const { user } = req.session;
        const articleId: number = parseInt(req.params.articleId);
        const article = await ArticleDAO.getByIdAndAuthor(articleId, user);
        if (!article) throw new Error('NOT_FOUND');

        return res.render('articles/editor.pug', { user, article });
    } catch (err) {
        return next(err);
    }
};

export const editArticle: RequestHandler = async (req, res, next) => {
    try {
        console.log('hello');
        const { user } = req.session;
        const articleId: number = parseInt(req.params.articleId);

        const article = await ArticleDAO.getByIdAndAuthor(articleId, user);
        if (!article) throw new Error('NOT_FOUND');

        const title = req.body.title.trim();
        const content = req.body.content.trim();
        if (!title || title.length > 50 || !content || content.length > 65535)
            throw new Error('BAD_REQUEST');

        await ArticleDAO.update(articleId, title, content);
        return res.redirect(`/article/${articleId}`);
    } catch (err) {
        return next(err);
    }
};

export const deleteArticle: RequestHandler = async (req, res, next) => {
    try {
        const { user } = req.session;
        const articleId: number = parseInt(req.params.articleId);
        const article = await ArticleDAO.getByIdAndAuthor(articleId, user);
        if (!article) throw new Error('NOT_FOUND');

        await ArticleDAO.remove(articleId);
        return res.redirect('/articles/page/1');
    } catch (err) {
        return next(err);
    }
};
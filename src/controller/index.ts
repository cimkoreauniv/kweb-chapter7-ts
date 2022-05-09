import * as ctrl from './ctrl';
import article from './article';
import auth from './auth';
import { Router } from 'express';

const router = Router();

router.get('/', ctrl.indexPage);
router.get('/articles/page/:page(\\d+)', ctrl.listArticles);
router.get('/articles', ctrl.latestArticles);

router.use('/article', article);
router.use('/auth', auth);

export default router;
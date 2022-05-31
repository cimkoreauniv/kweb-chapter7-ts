import * as express from 'express';
import * as session from 'express-session';
import * as morgan from 'morgan';

import controller from './controller';
import { errorHandler } from './lib/error-handler';

const { MODE, SESSION_SECRET } = process.env;

const app = express();

app.set('views', `${__dirname}/../views`);
app.set('view engine', 'pug');

app.use('/', express.static(`${__dirname}/../public`));

app.use(morgan(MODE !== 'prod' ? 'dev' : 'combined'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: SESSION_SECRET || 'default',
	resave: false,
	saveUninitialized: true,
}));

app.use('/', controller);

app.use(errorHandler);

export default app;
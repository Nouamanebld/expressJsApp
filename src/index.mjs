import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './utils/constants.mjs';
import passport from 'passport';
import './strategies/local-strategy.mjs';

const app = express();

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(session({
    secret: 'Norman the dev',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    }
}));

app.use(passport.initialize());
app.use(passport.session())

app.use(routes);

app.post('/api/auth', passport.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

app.get('/api/auth/status', (req, res) => {
    console.log('inside auth/status endpoint');
    console.log(req.user);
    console.log(req.session);
    return req.user ? res.send(req.user) : res.sendStatus(401);
});

const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url} middleware`);
    next();
};

const PORT = process.env.PORT || 3000;

app.get('/',  loggingMiddleware, (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie('hello', 'world', { maxAge: 60000 * 60, signed: true });
    res.status(201).send({ msg: 'Hello!'});
});

app.post('/api/auth', (req, res) => {
    const { body: { userName, password} } = req;
    const findUser = mockUsers.find(user => user.userName === userName);
    if (!findUser || findUser.password !== password) return res.status(401).send({ msg: 'BAD CREDENTIALS' });
    
    req.session.user = findUser;
    return res.status(200).send(findUser);
});

app.get('/api/auth/status', (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session);
    });

    return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send({ msg: 'Not authenticated' });
});

app.post('/api/cart', (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
    const { body: item } = req;
    const { cart } = req.session;
    if (cart) {
        cart.push(item)
    } else {
        req.session.cart = [item];
    }
    return res.status(201).send(item);
});

app.get('/api/cart', (req, res) => {
    if (!req.session.user) return res.sendStatus(401)
    return res.status(200).send(req.session.cart ?? []);
});

app.post('/api/auth/logout', (req, res) => {
    if (!req.user) return res.sendStatus(401);
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        return res.send(200);
    });
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});


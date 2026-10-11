import { Router } from 'express';
import { query , validationResult, checkSchema, matchedData } from 'express-validator';
import { mockUsers } from '../utils/constants.mjs';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { resolveIndexByUserId } from '../utils/middlewares.mjs';
import { User } from '../mongoose/schemas/user.mjs';

const router = Router();

router.get('/api/users', query('filter').isString().notEmpty().withMessage('Must not be empty').isLength({ min: 3, max: 10 }).withMessage('Must be at least 3 - 10 characters'), (req, res) => {
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(sessionData);
    });
    const result = validationResult(req);
    const { 
        query: { filter, value }
    } = req;

    // when filter and value are undefined

    if (filter && value) return res.send(
        mockUsers.filter((user) => user[filter].includes(value))
    );
    return res.send(mockUsers);
});


router.post('/api/users', checkSchema(createUserValidationSchema),async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req);
    console.log(data);
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

router.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    const findUser = mockUsers[findUserIndex];
    return res.send(findUser);
});

router.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, displayName: body.displayName, userName: body.userName };
    return res.status(200).send(mockUsers);
});

router.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body};
    return res.sendStatus(200);
});

router.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req; 
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});


export default router;
import { Router } from 'express';

const router = Router();

router.get('/api/products', (req, res) => {
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies);
    if (req.signedCookies.hello && req.signedCookies.hello === 'world') 
        return res.send([
            { product: 'norman', id: 1, productDesc: 'normanBld'},
            { product: 'Delta', id: 2, productDesc: 'Dt'},
            { product: 'bravo', id: 3, productDesc: 'Bravo    '},
        ]);
    return res.send({ msg: 'Sorry. you need the correct cookie'});
});

export default router;
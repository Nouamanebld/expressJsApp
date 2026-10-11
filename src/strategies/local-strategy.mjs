import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";

passport.serializeUser((user, done) => {
    console.log('inside serialize user', user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('inside deserialize user:', id);
    try {
        const findUser = await User.findById(id);
        if (!findUser) throw new Error('User not found');
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
})

export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const findUser = await User.findOne({ username });
            if (!findUser) throw new Error('User not found');
            if (findUser.password !== password) throw new Error('Bad credentials');
            done(null, findUser);
        } catch (err) {
            done(err, null);
        }
    })
);
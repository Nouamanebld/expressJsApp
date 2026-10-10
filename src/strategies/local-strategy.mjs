import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
    console.log('inside serialize user', user.id);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('inside deserialize user:', id);
    try {
        const findUser = mockUsers.find((user) => user.id === id);
        if (!findUser) throw new Error('User not found');
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
})

export default passport.use(
    new Strategy({usernameField: "userName"}, (userName, password, done) => {
        console.log(`username: ${userName}, password: ${password}`)
        try {
            const findUser = mockUsers.find((user) => user.userName === userName);
            if (!findUser) throw new Error('User not found'); 
            if (findUser.password !== password) throw new Error('Invalid credentials');
            done(null, findUser);
        } catch (err) {
            done(err, null);
        }
    })
);
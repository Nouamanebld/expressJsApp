import passport from 'passport'
import { Strategy } from 'passport-discord'
import { DiscordUser } from '../mongoose/schemas/discord-user.mjs'
import { User } from "../mongoose/schemas/user.mjs"

passport.serializeUser((user, done) => {
    console.log('inside serialize user', user.id);
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('inside deserialize user:', id);
    try {
        const findUser = await DiscordUser.findById(id);
        return findUser ? done(null, findUser) : done(null, null);
    } catch (err) {
        done(err, null);
    }
})

export default passport.use(
    new Strategy({ 
        clientID: '1559163162996244510',
        clientSecret: 'VEDiRb8dejas0177vL5_jbHz_UYo18Qt',
        callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
        scope: ['identify'],
    },
    async (accessToken, refreshToken, profile, done) => {
        let findUser;
        try {
            findUser = await DiscordUser.findOne({ discordId: profile.id });
        } catch (err) {
            return done(err, null);
        }
        try {
            if (!findUser) {
                const newUser = new DiscordUser({ username: profile.username, discordId: profile.id })
                const newSavedUser = await newUser.save();
                return done(null, newSavedUser);
            }
            return done(null, findUser)
        } catch (err) {
            console.log(err);
            return done(err, null);
        }
        
    })
)
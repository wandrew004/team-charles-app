import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { verifyUser, getUserById } from '../controllers/users';

// Configure passport to use LocalStrategy
passport.use(new LocalStrategy(
    async (username: string, password: string, done) => {
        try {
            const user = await verifyUser(username, password);
            if (!user) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize user for session
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await getUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport; 
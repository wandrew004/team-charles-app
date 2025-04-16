import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { Express } from 'express';
import { getUserByUsername, verifyPassword, getUserByIdWithPassword } from '../controllers/users';
import { User, UserAttributes } from '../models/init-models';

// Extend Express.User to include our User model properties
declare global {
  namespace Express {
    interface User extends UserAttributes {}
  }
}

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);
      if (!user) return done(null, false, { message: 'Incorrect username' });

      const isValid = await verifyPassword(user, password);
      if (!isValid) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await getUserByIdWithPassword(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

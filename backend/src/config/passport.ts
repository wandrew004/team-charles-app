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
  async (username: string, password: string, done: (error: Error | null, user?: User | false, info?: { message: string }) => void) => {
    try {
      const user = await getUserByUsername(username);
      if (!user) return done(null, false, { message: 'Incorrect username' });

      const isValid = await verifyPassword(user, password);
      if (!isValid) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }
));

passport.serializeUser((user: Express.User, done: (err: Error | null, id?: number) => void) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done: (err: Error | null, user?: User | null) => void) => {
  try {
    const user = await getUserByIdWithPassword(id);
    done(null, user);
  } catch (error) {
    done(error as Error);
  }
});

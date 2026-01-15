import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import Auth from "../models/Auth.js";

export function passportConfig() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        const user = await Auth.findOne({
          email: email,
        });
        if (!user) return done(null, false);
        if (!bcrypt.compareSync(password, user.password))
          return done(null, false);
        return done(null, user);
      }
    )
  );
  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.id);
  });
  passport.deserializeUser(async (userId, done) => {
    const user = await Auth.findById(userId);
    done(null, user);
  });
}

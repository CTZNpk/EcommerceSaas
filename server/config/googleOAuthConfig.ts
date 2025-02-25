import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { ENV } from "./env";

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async (_: string, __: string, profile: Profile, done) => {
      return done(null, {
        profile,
      });
    },
  ),
);

export default passport;

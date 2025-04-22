import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  "current",
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (!user) {
        return done(null, false);
      }

      const currentUser = {
        id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      };

      return done(null, currentUser);
    } catch (err) {
      return done(err, false);
    }
  })
);

export const isAuthenticated = passport.authenticate("jwt", { session: false });
export const isCurrent = passport.authenticate("current", { session: false });
export const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res
    .status(403)
    .json({ message: "Acceso denegado: sólo administradores" });
};

export default passport;

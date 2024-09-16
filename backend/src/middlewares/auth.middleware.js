import passport from "passport";
import ApiError from "../utils/ApiError.js";

/**
 * @function verifyJWT
 * @description verify JWT token
 */
const verifyJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      throw new ApiError(401, "Unauthorized.");
    }

    req.user = user;
    return next();
  })(req, res, next);
};

export default verifyJWT;

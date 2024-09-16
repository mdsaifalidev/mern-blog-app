import { Router } from "express";
import * as auth from "../controllers/auth.controller.js";
import passport from "passport";
import verifyJwt from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import * as validation from "../validations/auth.validation.js";
import ms from "ms";

const router = Router();
const { CORS_ORIGIN } = process.env;

router
  .post(
    "/signup",
    validate(validation.userLoginOrSignupSchema),
    auth.signupUser
  )
  .post(
    "/login",
    validate(validation.userLoginOrSignupSchema),
    passport.authenticate("local"),
    auth.loginUser
  )
  .post("/logout", verifyJwt, auth.logoutUser)
  .get("/current-user", verifyJwt, auth.getCurrentUser)
  .get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  )
  .get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${CORS_ORIGIN}/login`,
    }),
    (req, res) => {
      res
        .cookie("accessToken", req.user.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          expires: new Date(Date.now() + ms(process.env.ACCESS_TOKEN_EXPIRY)),
        })
        .redirect(CORS_ORIGIN);
    }
  );

export default router;

import User, { sanitizeUser } from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ms from "ms";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

/**
 * @function signupUser
 * @description Signup a new user
 * @route POST /api/v1/auth/signup
 * @access Public
 */
const signupUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the email already exists
  const existedEmail = await User.findOne({ email });
  if (existedEmail) {
    throw new ApiError(400, "Email already exists.");
  }

  // Create a new user
  const user = await User.create({
    email,
    password,
  });

  const accessToken = user.generateAccessToken();

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + ms(process.env.ACCESS_TOKEN_EXPIRY)),
    })
    .json(new ApiResponse("User registered successfully.", sanitizeUser(user)));
});

/**
 * @function loginUser
 * @description Login a user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  // Generate access token
  const user = await User.findById(req.user._id);
  const accessToken = user.generateAccessToken();

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + ms(process.env.ACCESS_TOKEN_EXPIRY)),
    })
    .json(new ApiResponse("User logged in successfully.", req.user));
});

/**
 * @function logoutUser
 * @description Logout a user
 * @route POST /api/v1/auth/logout
 * @access Private
 */
const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken")
    .json(new ApiResponse("User logged out successfully."));
});

/**
 * @function getCurrentUser
 * @description Get the current user
 * @route GET /api/v1/auth/current-user
 * @access Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse("User fetched successfully.", req.user));
});

export { signupUser, loginUser, logoutUser, getCurrentUser };

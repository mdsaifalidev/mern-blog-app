import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export const sanitizeUser = (user) => {
  return {
    _id: user._id,
    email: user.email,
    role: user.role,
  };
};

/**
 * @description Hash the password before saving the user model
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * @function isPasswordCorrect
 * @description Compare the password with the hashed password
 */
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * @function generateAccessToken
 * @description Generate the access token for the user
 */
userSchema.methods.generateAccessToken = function () {
  const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } = process.env;
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const User = mongoose.model("User", userSchema);
export default User;

import Blog from "../models/blog.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";

/**
 * @function createBlog
 * @description Create a new blog post
 * @route POST /blogs
 * @access Private
 */
const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // Validate the image file
  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required.");
  }

  // Upload the image to Cloudinary
  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(500, "Failed to upload image.");
  }

  // Create the blog post
  await Blog.create({
    author: req.user._id,
    title,
    content,
    image,
  });

  return res.status(201).json(new ApiResponse("Blog created successfully."));
});

/**
 * @function getBlogs
 * @description Fetch all blogs
 * @route GET /blogs
 * @access Private
 */
const getBlogs = asyncHandler(async (req, res) => {
  const { _id, role } = req.user;
  let blogs = [];
  // If the user is an admin, fetch all blogs
  if (role === "admin") {
    blogs = await Blog.find();
  } else {
    blogs = await Blog.find({ author: _id });
  }

  return res
    .status(200)
    .json(new ApiResponse("Blogs fetched successfully.", blogs));
});

/**
 * @function getApprovedBlogs
 * @description Fetch all blogs
 * @route GET /blogs/approved
 * @access Private
 */
const getApprovedBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ status: "approved" });

  return res
    .status(200)
    .json(new ApiResponse("Blogs fetched successfully.", blogs));
});

/**
 * @function getBlog
 * @description Fetch a single blog post by ID
 * @route GET /blogs/:id
 * @access Private
 */
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findOne({ author: req.user._id, _id: id });

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse("Blog fetched successfully.", blog));
});

/**
 * @function updateBlog
 * @description Update a blog post
 * @route PUT /blogs/:id
 * @access Private
 */
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const blog = await Blog.findOne({ author: req.user._id, _id: id });
  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  const imageLocalPath = req.file?.path;
  let image = "";
  if (imageLocalPath) {
    // Upload the new image to Cloudinary if provided
    image = await uploadOnCloudinary(imageLocalPath);
    if (!image) {
      throw new ApiError(500, "Failed to upload image.");
    }
  }

  // Update the blog fields
  blog.title = title || blog.title;
  blog.content = content || blog.content;
  blog.image = image || blog.image;
  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse("Blog updated successfully.", blog));
});

/**
 * @function deleteBlog
 * @description Delete a blog post
 * @route DELETE /blogs/:id
 * @access Private
 */
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findOne({ author: req.user._id, _id: id });
  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  // Delete the blog post
  await Blog.deleteOne({ _id: id });

  return res.status(200).json(new ApiResponse("Blog deleted successfully."));
});

/**
 * @function approvedOrRejectedBlog
 * @description Approves or rejects a blog post and adds an admin comment.
 * @route PUT /blogs/:id/admin
 * @access Private (Admin only)
 */
const approvedOrRejectedBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  if (!req.user.role === "admin") {
    throw new ApiError(403, "Access denied. Admins only.");
  }

  const blog = await Blog.findById(id);

  blog.status = status;
  blog.comment = comment;
  await blog.save();

  // Send a response based on the action
  return res.status(200).json(new ApiResponse(`Blog has been ${status}.`));
});

export {
  createBlog,
  getBlogs,
  getApprovedBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  approvedOrRejectedBlog,
};

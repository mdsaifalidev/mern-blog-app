import { Router } from "express";
import * as blog from "../controllers/blog.controller.js";
import upload from "../middlewares/multer.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import { blogSchema } from "../validations/blog.validation.js";

const router = Router();

router
  .get("/", blog.getBlogs)
  .get("/approved", blog.getApprovedBlogs)
  .post(
    "/create",
    upload.single("image"),
    validate(blogSchema),
    blog.createBlog
  )
  .get("/:id", blog.getBlog)
  .put("/:id", upload.single("image"), validate(blogSchema), blog.updateBlog)
  .delete("/:id", blog.deleteBlog)
  .put("/:id/admin", blog.approvedOrRejectedBlog);

export default router;

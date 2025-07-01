import express from "express";
import { addComment, createBlog, getBlog, getMyBlogs, listBlogs, listComments, reactBlog } from "../../controllers/blogRelated/blogRelatedController";
// import { createBlog, listBlogs, getBlog, addComment, listComments, reactBlog } from "./controllers/blogs";


const Blogrouter = express.Router();

Blogrouter.get("/blogs", listBlogs);
Blogrouter.post("/blogs",createBlog);
Blogrouter.get("/blogs/:id",getBlog);
Blogrouter.get("/my/blogs",getMyBlogs);
Blogrouter.get("/blogs/:blogId/comments", listComments);
Blogrouter.post("/blogs/:blogId/comments",addComment);
Blogrouter.post("/blogs/:blogId/react",reactBlog);

export default Blogrouter;

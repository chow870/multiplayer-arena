// CombinedBlogManager.tsx
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Underline } from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import axios from "axios";
import { generateHTML } from "@tiptap/core";

interface Blog {
  id: string;
  title: string;
  content: any;
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
  author: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

interface Comment {
  id: string;
  content: any;
  createdAt: string;
  author: {
    username: string;
    avatarUrl?: string;
  };
}

export default function MainBlog() {
  const [activeTab, setActiveTab] = useState<"all" | "my" | "create">("all");
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  // TipTap Editor for Blog Creation
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Color,
      Highlight,
      Link,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "<p>Start writing your blog...</p>",
  });

  // Fetch all blogs
  const fetchAllBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/blog/blogs?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllBlogs(res.data.blogs);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
    setLoading(false);
  };

  // Fetch my blogs
  const fetchMyBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/blog/my/blogs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMyBlogs(res.data);
    } catch (error) {
      console.error("Error fetching my blogs:", error);
    }
    setLoading(false);
  };

  // Fetch comments for selected blog
  const fetchComments = async (blogId: string) => {
    try {
      const res = await axios.get(
        `/api/v1/blog/blogs/${blogId}/comments?page=${commentsPage}&limit=5`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setComments(res.data.comments);
      setCommentsTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Create new blog
  const handleCreateBlog = async () => {
    if (!editor || !title.trim()) return;
    try {
      const content = editor.getJSON();
      await axios.post(
        "/api/v1/blog/blogs",
        { title, content },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      alert("Blog published successfully!");
      setTitle("");
      editor.commands.setContent("<p>Start writing your blog...</p>");
      setActiveTab("all");
      fetchAllBlogs();
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to publish blog");
    }
  };

  // Post comment
  const postComment = async () => {
    if (!selectedBlog || !newComment.trim()) return;
    try {
      await axios.post(
        `/api/v1/blog/blogs/${selectedBlog.id}/comments`,
        {
          blogId: selectedBlog.id,
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: newComment }],
              },
            ],
          },
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setNewComment("");
      fetchComments(selectedBlog.id);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // React to blog
  const reactToBlog = async (type: "like" | "dislike") => {
    if (!selectedBlog) return;
    try {
      const res = await axios.post(
        `/api/v1/blog/blogs/${selectedBlog.id}/react`,
        { type },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setSelectedBlog((prev) =>
        prev
          ? { ...prev, likes: res.data.likes, dislikes: res.data.dislikes }
          : null,
      );
    } catch (error) {
      console.error("Error reacting to blog:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "all") {
      fetchAllBlogs();
    } else if (activeTab === "my") {
      fetchMyBlogs();
    }
  }, [activeTab, page]);

  useEffect(() => {
    if (selectedBlog) {
      fetchComments(selectedBlog.id);
    }
  }, [selectedBlog, commentsPage]);

  const tabs = [
    { id: "all", label: "All Blogs", icon: "📚" },
    { id: "my", label: "My Blogs", icon: "📝" },
    { id: "create", label: "Create Blog", icon: "✍️" },
  ];

  return (
    <div className="w-full bg-slate-800/20 rounded-xl border border-slate-700 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-slate-700 bg-slate-800/30">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedBlog(null);
                setPage(1);
              }}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                activeTab === tab.id
                  ? "text-blue-300 bg-slate-700/50"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {selectedBlog ? (
          /* Blog Detail View */
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to blogs
            </button>

            {/* Blog Content */}
            <div className="bg-slate-700/20 rounded-xl p-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                {selectedBlog.title}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {selectedBlog.author.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-300">
                  {selectedBlog.author.username}
                </span>
                <span className="text-slate-500 text-sm">
                  {new Date(selectedBlog.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: generateHTML(selectedBlog.content, [
                    StarterKit,
                    Bold,
                    Italic,
                    Underline,
                  ]),
                }}
              />

              {/* Reactions */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-600">
                <button
                  onClick={() => reactToBlog("like")}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors"
                >
                  👍 {selectedBlog.likes}
                </button>
                <button
                  onClick={() => reactToBlog("dislike")}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                >
                  👎 {selectedBlog.dislikes}
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-slate-700/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Comments
              </h3>

              {/* Add Comment */}
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                />
                <button
                  onClick={postComment}
                  disabled={!newComment.trim()}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Post Comment
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-slate-800/30 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {comment.author.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-300 font-medium">
                        {comment.author.username}
                      </span>
                      <span className="text-slate-500 text-sm">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      className="text-slate-200 prose prose-sm prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: generateHTML(comment.content, [StarterKit]),
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Comments Pagination */}
              {commentsTotalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: commentsTotalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCommentsPage(i + 1)}
                      className={`px-3 py-1 rounded transition-colors ${
                        commentsPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Tab Content */
          <>
            {activeTab === "all" && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">
                  All Blogs
                </h2>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {allBlogs.map((blog) => (
                        <div
                          key={blog.id}
                          className="bg-slate-700/20 rounded-xl p-6 hover:bg-slate-700/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedBlog(blog)}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {blog.author.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-slate-200 font-medium">
                                {blog.author.username}
                              </p>
                              <p className="text-slate-500 text-sm">
                                {new Date(blog.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {blog.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>👍 {blog.likes}</span>
                            <span>👎 {blog.dislikes}</span>
                            <span className="text-blue-400">Read more →</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              page === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "my" && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">
                  My Blogs
                </h2>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : myBlogs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-lg font-medium text-slate-300 mb-2">
                      No blogs yet
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Start writing your first blog post
                    </p>
                    <button
                      onClick={() => setActiveTab("create")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Create Blog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myBlogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="bg-slate-700/20 rounded-xl p-6 hover:bg-slate-700/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedBlog(blog)}
                      >
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {blog.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>
                            Created:{" "}
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                          <span>
                            Updated:{" "}
                            {new Date(blog.updatedAt).toLocaleDateString()}
                          </span>
                          <span className="text-blue-400">View →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "create" && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">
                  Create New Blog
                </h2>

                {/* Title Input */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Enter blog title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Editor Toolbar */}
                {editor && (
                  <div className="mb-4 flex flex-wrap gap-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <button
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`px-3 py-1 rounded transition-colors ${
                        editor.isActive("bold")
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      }`}
                    >
                      Bold
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                      className={`px-3 py-1 rounded transition-colors ${
                        editor.isActive("italic")
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      }`}
                    >
                      Italic
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                      }
                      className={`px-3 py-1 rounded transition-colors ${
                        editor.isActive("underline")
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      }`}
                    >
                      Underline
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                      }
                      className={`px-3 py-1 rounded transition-colors ${
                        editor.isActive("heading", { level: 2 })
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      }`}
                    >
                      H2
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                      className={`px-3 py-1 rounded transition-colors ${
                        editor.isActive("bulletList")
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      }`}
                    >
                      List
                    </button>
                  </div>
                )}

                {/* Editor Content */}
                <div className="mb-6">
                  <EditorContent
                    editor={editor}
                    className="min-h-[400px] p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white prose prose-invert max-w-none focus-within:border-blue-500"
                  />
                </div>

                {/* Publish Button */}
                <button
                  onClick={handleCreateBlog}
                  disabled={!title.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                >
                  Publish Blog
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

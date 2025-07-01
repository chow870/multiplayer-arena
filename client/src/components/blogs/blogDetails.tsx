// BlogDetail.tsx (View + comments + reactions)
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<any>();
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get(`api/v1/blog/blogs/${id}`,{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then(res => setBlog(res.data));
  }, [id]);

  useEffect(() => {
    axios.get(`api/v1/blog/blogs/${id}/comments?page=${page}&limit=5`,{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
      .then(res => {
        setComments(res.data.comments);
        setTotalPages(res.data.totalPages);
      });
  }, [page, id]);

  const [newComment, setNewComment] = useState("");
  const postComment = async () => {
    await axios.post(`api/v1/blog/blogs/${id}/comments`, { blogId: id, content: { type: "doc", content: [{ type: "text", text: newComment }] } },{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
    setNewComment("");
    setPage(1);
  };

  const react = async (type: "like" | "dislike") => {
    const res = await axios.post(`api/v1/blog/blogs/${id}/react`, { type },{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
    setBlog((prev:any) => ({ ...prev, likes: res.data.likes, dislikes: res.data.dislikes }));
  };

  return blog ? (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{blog.title}</h1>
      <p className="text-sm text-gray-500">by {blog.author.username}</p>
      <div className="mt-4 prose" dangerouslySetInnerHTML={{ __html: generateHTML(blog.content, [StarterKit]) }} />

      <div className="mt-6">
        <button onClick={() => react("like")}>👍 {blog.likes}</button>
        <button onClick={() => react("dislike")}>👎 {blog.dislikes}</button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl">Comments</h2>
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          className="border p-2 w-full"
        />
        <button onClick={postComment} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Post</button>

        {comments.map(c => (
          <div key={c.id} className="mt-4 p-4 bg-gray-100 rounded">
            <div className="flex items-center space-x-2">
              <img src={c.author.avatarUrl || "/default.png"} className="w-6 h-6 rounded-full" />
              <strong>{c.author.username}</strong>
            </div>
            <div dangerouslySetInnerHTML={{ __html: generateHTML(c.content, [StarterKit]) }} />
          </div>
        ))}

        <div className="mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i} disabled={i + 1 === page}
              onClick={() => setPage(i + 1)}
              className="px-2"
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : <div>Loading blog...</div>;
}

// MyBlogs.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface Blog {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("api/v1/blog/my/blogs").then(res => {
      setBlogs(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading your blogs...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Blogs</h1>
      {blogs.length === 0 ? (
        <p>You haven't written any blogs yet.</p>
      ) : (
        blogs.map(blog => (
          <div key={blog.id} className="border p-4 mb-4">
            <h2 className="text-lg font-semibold">{blog.title}</h2>
            <p className="text-sm text-gray-500">Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
            <button
              className="mt-2 text-blue-600"
              onClick={() => window.location.href = `/blogs/${blog.id}`}
            >
              View Blog →
            </button>
          </div>
        ))
      )}
    </div>
  );
}

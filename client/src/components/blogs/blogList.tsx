// BlogList.tsx
import { useState, useEffect } from "react";
import axios from "axios";
interface Blog 
{ id:string; title:string;
   author: {username:string;
            avatarUrl?: string}
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotal] = useState(1);

  useEffect(() => {
    async function fetch() {
      const res = await axios.get(`api/v1/blog/blogs?page=${page}&limit=10`,{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      setBlogs(res.data.blogs);
      setTotal(res.data.totalPages);
    }
    fetch();
  }, [page]);

  return (
    <div>
      {blogs.map(b => (
        <div key={b.id} className="shadow p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <img src={b.author.avatarUrl || "/default.png"} className="w-8 h-8 rounded-full"/>
            <strong>{b.author.username}</strong>
          </div>
          <h2 className="text-lg font-bold">{b.title}</h2>
          <button onClick={() => /* navigate to detail */ null}>Read more →</button>
        </div>
      ))}

      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            disabled={i + 1 === page}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

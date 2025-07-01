// BlogEditor.tsx (Tiptap-powered)
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { JSONContent } from "@tiptap/core";
import axios from "axios";

export default function BlogEditor(props:any) { // props
  const [title, setTitle] = React.useState(props.initialTitle); // props.initalTitle
  const editor = useEditor({
    extensions: [StarterKit],
    content: props.initialContent || "<p></p>", // props.initialContent
  });

  const handleSave = async () => {
    if (!editor) return;
    const content = editor.getJSON() as JSONContent;
    await axios.post("api/v1/blog/blogs", { title, content },{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
    alert("Blog saved!");
  };

  return (
    <div className="p-4">
      <input
        className="border p-2 w-full mb-4"
        placeholder="Blog Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <EditorContent editor={editor} className="border p-2 min-h-[300px]" />
      <button onClick={handleSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Publish
      </button>
    </div>
  );
}

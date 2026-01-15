import { useState } from "react";
import { supabase } from "../lib/supabase";

interface CreateProps {
  onCreated: () => void;
}

export default function Create({ onCreated }: CreateProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createItem = async () => {
    if (!title || !content) return alert("Title and content are required");
    await supabase.from("items").insert([{ title, content }]);
    setTitle("");
    setContent("");
    onCreated();
  };

  return (
    <div>
      <input
        placeholder="New Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />
      <textarea
        placeholder="New Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%", minHeight: 100 }}
      />
      <button onClick={createItem}>CREATE</button>
    </div>
  );
}

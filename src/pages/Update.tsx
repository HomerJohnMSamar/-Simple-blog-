import { useState } from "react";
import { supabase } from "../lib/supabase";

interface UpdateProps {
  item: { id: string; title: string; content: string };
  onSaved: () => void;
  onCancel: () => void;
}

export default function Update({ item, onSaved, onCancel }: UpdateProps) {
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);

  const saveEdit = async () => {
    await supabase.from("items").update({ title, content }).eq("id", item.id);
    onSaved();
  };

  return (
    <div>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%", minHeight: 100 }}
      />
      <button onClick={saveEdit} style={{ marginRight: 8 }}>
        Save Changes
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

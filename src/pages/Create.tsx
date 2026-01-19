import { useState } from "react";
import { supabase } from "../lib/supabase";

interface CreateProps {
  onCreated: () => void;
}

export default function Create({ onCreated }: CreateProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const createItem = async () => {
    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not logged in");
      return;
    }

    let image_url: string | null = null;

    // Upload image if provided
    if (imageFile) {
      const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      image_url = data.publicUrl;
    }

    // Insert blog post
    const { error } = await supabase.from("items").insert({
      title,
      content,
      image_url,
      user_id: user?.id,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setContent("");
    setImageFile(null);
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
        style={{
          display: "block",
          marginBottom: 8,
          width: "100%",
          minHeight: 100,
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />

      <button onClick={createItem}>CREATE</button>
    </div>
  );
}

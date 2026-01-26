import { useState } from "react";
import { supabase } from "../lib/supabase";

interface UpdateProps {
  item: {
    id: string;
    title: string;
    content: string;
    image_url?: string | null;
  };
  onSaved: () => void;
  onCancel: () => void;
}


export default function Update({ item, onSaved, onCancel }: UpdateProps) {
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file: File) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const path = `${user.id}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("blog-images")
      .upload(path, file);

    if (error) throw error;

    return supabase.storage
      .from("blog-images")
      .getPublicUrl(path).data.publicUrl;
  };

  const saveEdit = async () => {
    try {
      setLoading(true);

      let image_url = item.image_url;

      // Upload new image only if user selected one
      if (file) {
        image_url = await uploadImage(file);
      }

      const { error } = await supabase
        .from("items")
        .update({
          title,
          content,
          image_url,
        })
        .eq("id", item.id);

      if (error) throw error;

      onSaved();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Edit Blog</h3>

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
        style={{
          display: "block",
          marginBottom: 8,
          width: "100%",
          minHeight: 100,
        }}
      />

      {item.image_url && (
        <img
          src={item.image_url}
          alt="Current"
          style={{ width: "100%", marginBottom: 8 }}
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div style={{ marginTop: 8 }}>
        <button onClick={saveEdit} disabled={loading} style={{ marginRight: 8 }}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

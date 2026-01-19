import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Comments({ blogId }: { blogId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("blog_id", blogId)
      .order("created_at", { ascending: false });

    setComments(data || []);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const addComment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let image_url = null;

    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name}`;

      await supabase.storage
        .from("blog-images")
        .upload(path, file);

      image_url = supabase.storage
        .from("blog-images")
        .getPublicUrl(path).data.publicUrl;
    }

    await supabase.from("comments").insert({
      blog_id: blogId,
      user_id: user.id,
      content: text,
      image_url,
    });

    setText("");
    setFile(null);
    fetchComments();
  };

  return (
    <div>
      <h3>Comments</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
      />

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <button onClick={addComment}>Post</button>

      {comments.map((c) => (
        <div key={c.id} style={{ marginTop: 10 }}>
          <p>{c.content}</p>
          {c.image_url && <img src={c.image_url} width={200} />}
        </div>
      ))}
    </div>
  );
}

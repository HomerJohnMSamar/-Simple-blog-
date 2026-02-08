import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import "../App.css";

export default function Comments({ blogId }: { blogId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("blog_id", blogId)
      .order("created_at", { ascending: false });

    setComments(data || []);
  };

  const uploadImage = async (file: File) => {
    if (!userId) return null;

    const path = `${userId}/${Date.now()}-${file.name}`;

    await supabase.storage.from("blog-images").upload(path, file);

    return supabase.storage
      .from("blog-images")
      .getPublicUrl(path).data.publicUrl;
  };

  const addComment = async () => {
    if (!userId || !text.trim()) return;

    const image_url = file ? await uploadImage(file) : null;

    await supabase.from("comments").insert({
      blog_id: blogId,
      user_id: userId,
      content: text,
      image_url,
    });

    setText("");
    setFile(null);

    
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
    fetchComments();
  };

  const updateComment = async (comment: any) => {
    let image_url = comment.image_url;

    if (editFile) {
      image_url = await uploadImage(editFile);
    }

    await supabase
      .from("comments")
      .update({
        content: editText,
        image_url,
      })
      .eq("id", comment.id);

    setEditingId(null);
    setEditText("");
    setEditFile(null);
    fetchComments();
  };

  const deleteComment = async (id: string) => {
    if (!window.confirm("Delete this comment?")) return;

    await supabase.from("comments").delete().eq("id", id);
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
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        
      />

      <button onClick={addComment}>Post</button>

      {comments.map((c) => (
        <div key={c.id} style={{ marginTop: 15 }}>
          {editingId === c.id ? (
            <>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />

              <input
                type="file"
                onChange={(e) =>
                  setEditFile(e.target.files?.[0] || null)
                }
              />

              <button onClick={() => updateComment(c)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <p>{c.content}</p>

              {c.image_url && (
                <img src={c.image_url} width={200} />
              )}

              {c.user_id === userId && (
                <div>
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setEditText(c.content);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => deleteComment(c.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

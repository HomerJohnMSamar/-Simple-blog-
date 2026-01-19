import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Comments from "./Comments";

export default function BlogView() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setBlog(data));
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>

      {blog.image_url && (
        <img src={blog.image_url} style={{ width: "100%" }} />
      )}

      <hr />
      <Comments blogId={blog.id} />
    </div>
  );
}

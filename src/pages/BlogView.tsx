import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Comments from "./Comments";
import "../App.css";

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

  if (!blog) {
    return (
      <div className="page-container">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="blog-card">
        <h1 className="blog-title">{blog.title}</h1>
        <p className="blog-content">{blog.content}</p>

        {blog.image_url && (
          <img
            src={blog.image_url}
            alt="Blog"
            className="blog-image"
          />
        )}

        

        <hr className="divider" />

        <Comments blogId={blog.id} />
      </div>
    </div>
  );
}

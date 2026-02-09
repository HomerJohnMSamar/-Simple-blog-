import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function BlogUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        navigate("/");
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setCurrentImage(data.image_url);
      setLoading(false);
    };

    fetchBlog();
  }, [id, navigate]);

  const updateBlog = async () => {
    let image_url = currentImage;

    if (imageFile) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const path = `${user.id}/${Date.now()}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(path, imageFile);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      image_url = supabase.storage
        .from("blog-images")
        .getPublicUrl(path).data.publicUrl;
    }

    const { error } = await supabase
      .from("items")
      .update({
        title,
        content,
        image_url, // ← will be null if deleted
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="page-container">
      <div className="dashboard-card">
        <h2>Edit Blog</h2>

        <input
          className="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <textarea
          className="edit-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here..."
        />

        {currentImage && (
          <div className="image-wrapper">
            <img
              src={currentImage}
              className="blog-image1"
              alt="Current"
            />

            <button
              type="button"
              className="image-remove-btn"
              onClick={() => {
                setCurrentImage(null);
                setImageFile(null);
              }}
            >
              ×
            </button>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        <div className="blog-actions">
          <button className="update-btn" onClick={updateBlog}>
            Save Changes
          </button>

          <button
            className="cancel-btn"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
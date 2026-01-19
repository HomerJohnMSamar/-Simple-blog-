
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Create from "./Create";
import Delete from "./Delete";
import Update from "./Update";

interface Item {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  user_id: string;
}

export default function Pagination() {
  const [items, setItems] = useState<Item[]>([]);
  const [updatingItem, setUpdatingItem] = useState<Item | null>(null);
  const [page, setPage] = useState(1);
  const limit = 3; 
  const [totalItems, setTotalItems] = useState(0);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  // Fetch current user ID
  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  // Fetch items for current user only
  const fetchItems = async (pageNumber = page) => {
    if (!userId) return;

    const from = (pageNumber - 1) * limit;
    const to = pageNumber * limit - 1;

    // Count total items for this user
    const { count } = await supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    setTotalItems(count || 0);

    // Fetch paginated items for this user, newest first
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .range(from, to);

    setItems(data || []);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Refetch items when page changes or userId is ready
  useEffect(() => {
    if (userId) fetchItems(page);
  }, [page, userId]);

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div>
      {!updatingItem ? (
        <Create onCreated={() => fetchItems(page)} />
      ) : (
        <Update
          item={updatingItem}
          onSaved={() => {
            fetchItems(page);
            setUpdatingItem(null);
          }}
          onCancel={() => setUpdatingItem(null)}
        />
      )}

      <hr />

      <h2>All Blogs</h2>
      {items.map((item) => (
        <div
  key={item.id}
  onClick={() => navigate(`/blog/${item.id}`)}
  style={{
    border: "1px solid #ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    cursor: "pointer"
  }}
>
        
          <h3>{item.title}</h3>
          <p>{item.content}</p>
          {item.image_url && (
            <img src={item.image_url} alt="Blog" style={{ width: "100%", marginTop: 8 }} />
          )}
          <button
  onClick={(e) => {
    e.stopPropagation();
    setUpdatingItem(item);
  }}
>
  UPDATE
</button>

          <Delete id={item.id} onDeleted={() => fetchItems(page)} />
        </div>
      ))}

      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={{ marginRight: 8 }}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
          style={{ marginLeft: 8 }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Create from "./Create";
import Delete from "./Delete";
import Update from "./Update";

interface Item {
  id: string;
  title: string;
  content: string;
  
}

export default function Pagination() {
  const [items, setItems] = useState<Item[]>([]);
  const [updatingItem, setUpdatingItem] = useState<Item | null>(null);
  const [page, setPage] = useState(1);
  const limit = 3; 
  const [totalItems, setTotalItems] = useState(0);

  const fetchItems = async (pageNumber = page) => {
    const from = (pageNumber - 1) * limit;
    const to = pageNumber * limit - 1;

    
    const { count } = await supabase
      .from("items")
      .select("*", { count: "exact", head: true });
    setTotalItems(count || 0);

    
    const { data } = await supabase
  .from("items")   
  .select("*")
  .range(from, to)
  

    setItems(data || []);
  };

  useEffect(() => {
    fetchItems(page);
  }, [page]);

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
          style={{
            border: "1px solid #ccc",
            padding: 8,
            marginBottom: 8,
            borderRadius: 4,
          }}
        >
          <h3>{item.title}</h3>
          <p>{item.content}</p>
          <button
            onClick={() => setUpdatingItem(item)}
            style={{ marginRight: 8 }}
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

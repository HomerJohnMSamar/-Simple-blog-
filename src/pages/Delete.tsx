import { supabase } from "../lib/supabase";

interface DeleteProps {
  id: string;
  onDeleted: () => void;
}

export default function Delete({ id, onDeleted }: DeleteProps) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await supabase.from("items").delete().eq("id", id);
    onDeleted();
  };

  return <button onClick={handleDelete}>DELETE</button>;
}

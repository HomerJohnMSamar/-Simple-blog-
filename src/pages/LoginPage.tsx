import { supabase } from "../lib/supabase";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/authSlice";
import Pagination from "./Pagination";

export default function Dashboard() {
  
  const dispatch = useDispatch();

  

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
  };



  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>LOG IN PAGE -   USER HAS LOGGED IN</h1>
      <button onClick={logout}>Logout</button>
      <h2>CREATE A BLOG BELOW</h2>
      <Pagination />
    </div>
  );
}

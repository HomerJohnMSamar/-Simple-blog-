import { supabase } from "../lib/supabase";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/authSlice";
import Pagination from "./Pagination";
import "../App.css";

export default function Dashboard() {
  const dispatch = useDispatch();

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Welcome! </h1>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <p className="status-text">You are logged in</p>

        <h2>Create a Blog</h2>

        <Pagination />
      </div>
    </div>
  );
}


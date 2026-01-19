import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { setUser } from "./store/authSlice";
import { supabase } from "./lib/supabase";

import Login from "./pages/Logout";
import Register from "./pages/Registration";
import Dashboard from "./pages/LoginPage";
import BlogView from "./pages/BlogView";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        dispatch(setUser(data.session.user));
      }
    });
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/blog/:id" element={<BlogView />} />
      </Routes>
    </BrowserRouter>
  );
}

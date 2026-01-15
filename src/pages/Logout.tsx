import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) dispatch(setUser(data.user));
  };

  return (
    <div>
      <h2>Logout Page</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}

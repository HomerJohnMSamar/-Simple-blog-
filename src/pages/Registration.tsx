import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await supabase.auth.signUp({ email, password });
    alert("Registered! You can now login.");
  };

  return (
    <div>
      <h2>Registration Page</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
      <Link to="/">Back to Logout Page</Link>
    </div>
  );
}
    
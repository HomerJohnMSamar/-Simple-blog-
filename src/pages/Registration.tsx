import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import "../App.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await supabase.auth.signUp({ email, password });
    alert("Registered! You can now login.");
  };

  return (
    <div className="login-container">
      <div className="login-card">
      <h2>Register Here</h2>
      <input placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
      <p>
        <Link to="/">Back to Login Page</Link>
      </p>
      </div>
    </div>
  );
}
    
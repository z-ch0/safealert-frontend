import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // stops the browser's default page-reload-on-submit behavior
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Log In</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
      <br />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Log In</button>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
}
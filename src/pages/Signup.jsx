import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      });
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
      <br />
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
      <br />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Sign Up</button>
      <p>Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
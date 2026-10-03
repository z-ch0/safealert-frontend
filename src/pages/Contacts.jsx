import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Contacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // Points to users/{uid}/contacts — a "subcollection" nested under this specific user
  const contactsRef = collection(db, "users", user.uid, "contacts");

  // Loads existing contacts once, when the page first opens
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const snap = await getDocs(contactsRef);
    setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    // Basic validation: phone must be in E.164 format (+countrycode + number) for Twilio later
    if (!/^\+\d{10,15}$/.test(phone)) {
      setError("Phone must include country code, e.g. +919876543210");
      return;
    }
    await addDoc(contactsRef, { name, phone, email });
    setName("");
    setEmail("");
    fetchContacts(); // refresh the list after adding
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "contacts", id));
    fetchContacts();
  };

  return (
    <div>
      <h2>Emergency Contacts</h2>
      <p><Link to="/home">← Back to Home</Link></p>

      <form onSubmit={handleAdd}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+919876543210" required />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Contact's email" required />
        <button type="submit">Add Contact</button>
      </form>

      <ul>
        {contacts.map((c) => (
          <li key={c.id}>
            {c.name} — {c.phone}
            <button onClick={() => handleDelete(c.id)} style={{ marginLeft: 8 }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
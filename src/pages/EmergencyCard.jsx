import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function EmergencyCard() {
  const [card, setCard] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Runs once when the page opens — reads whatever's already saved locally
  useEffect(() => {
    const saved = localStorage.getItem("emergencyCard");
    if (saved) {
      const data = JSON.parse(saved);
      setCard(data);
      setBloodGroup(data.bloodGroup || "");
      setAllergies(data.allergies || "");
      setContactName(data.contactName || "");
      setContactPhone(data.contactPhone || "");
    } else {
      setEditing(true); // no card saved yet, so open straight into edit mode
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const data = { bloodGroup, allergies, contactName, contactPhone };
    localStorage.setItem("emergencyCard", JSON.stringify(data));
    setCard(data);
    setEditing(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <h2>Emergency Info Card</h2>
      <p><Link to="/home">← Back to Home</Link></p>
      <p style={{ opacity: 0.7, fontSize: 14 }}>
        This page works even without internet — it's saved on this device only.
      </p>

      {editing || !card ? (
        <form onSubmit={handleSave} style={{ textAlign: "left" }}>
          <label>Blood Group</label>
          <input value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} placeholder="e.g. O+" />
          <br />
          <label>Allergies</label>
          <input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Penicillin" />
          <br />
          <label>Emergency Contact Name</label>
          <input value={contactName} onChange={(e) => setContactName(e.target.value)} />
          <br />
          <label>Emergency Contact Phone</label>
          <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+91..." />
          <br />
          <button type="submit">Save</button>
        </form>
      ) : (
        <div style={{ fontSize: 20, lineHeight: 2, background: "#222", padding: 20, borderRadius: 12 }}>
          <p><strong>Blood Group:</strong> {card.bloodGroup || "—"}</p>
          <p><strong>Allergies:</strong> {card.allergies || "—"}</p>
          <p><strong>Emergency Contact:</strong> {card.contactName || "—"}</p>
          <p><strong>Phone:</strong> {card.contactPhone || "—"}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}
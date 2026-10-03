import { useRef, useState } from "react";
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useGeolocation } from "../hooks/useGeolocation";

const HOLD_DURATION = 5000; // how long the button must be held, in milliseconds
// Local backend for now — replace with your Render URL once it's deployed
const BACKEND_URL = "https://safealert-server.onrender.com";

export default function SOSButton() {
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const { user } = useAuth();
  const { getLocation } = useGeolocation();

  const startHold = () => {
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / HOLD_DURATION) * 100, 100));
    }, 50);

    timerRef.current = setTimeout(async () => {
      clearInterval(intervalRef.current);
      setTriggered(true);
      await fireSOS();
    }, HOLD_DURATION);
  };

  const cancelHold = () => {
    clearTimeout(timerRef.current);
    clearInterval(intervalRef.current);
    if (!triggered) setProgress(0); // only reset if it wasn't a full trigger
  };

  const fireSOS = async () => {
    setStatusMsg("Getting your location...");
    try {
      const location = await getLocation();

      setStatusMsg("Sending alert...");

      // Try to fetch the user's real name; if it fails, still send the alert with a generic name
      let realName = "A SafeAlert user";
      try {
        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        realName = userDocSnap.data()?.name || realName;
      } catch (err) {
        console.warn("Could not fetch name, sending with generic name:", err);
      }

      // Load this user's saved emergency contacts
      const contactsSnap = await getDocs(collection(db, "users", user.uid, "contacts"));
      const contacts = contactsSnap.docs.map((d) => d.data());

      if (contacts.length === 0) {
        setStatusMsg("No emergency contacts saved yet — add some first.");
        setTriggered(false);
        return;
      }

      // Send everything to the backend, which handles emails/SMS
      const res = await fetch(`${BACKEND_URL}/api/sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: realName, contacts, location }),
      });
      const result = await res.json();

      // Log the alert in Firestore as a record
      await addDoc(collection(db, "sosAlerts"), {
        userId: user.uid,
        location,
        status: result.success ? "notified" : "failed",
        createdAt: new Date().toISOString(),
      });

      setStatusMsg(result.success ? "Help notified!" : "Alert logged, but sending failed.");
    } catch (err) {
      console.error("SOS failed:", err);
      setStatusMsg("Could not send alert — check your internet connection and that the backend is running.");
      setTriggered(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: "none",
          color: "white",
          fontWeight: "bold",
          background: triggered
            ? "#c0392b"
            : `conic-gradient(#e74c3c ${progress}%, #f5b7b1 0)`,
        }}
      >
        {triggered ? "ALERT SENT" : "HOLD FOR SOS"}
      </button>
      <p>{statusMsg}</p>
    </div>
  );
}
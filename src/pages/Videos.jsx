import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Videos() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    fetchVideos();
    fetchWatched();
  }, []);

  const fetchVideos = async () => {
    const snap = await getDocs(collection(db, "videos"));
    setVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const fetchWatched = async () => {
    const snap = await getDocs(collection(db, "users", user.uid, "watchedVideos"));
    setWatched(snap.docs.map((d) => d.id));
  };

  const markWatched = async (videoId) => {
    await setDoc(doc(db, "users", user.uid, "watchedVideos", videoId), {
      watchedAt: new Date().toISOString(),
    });
    fetchWatched();
  };

  const unmarkWatched = async (videoId) => {
    await deleteDoc(doc(db, "users", user.uid, "watchedVideos", videoId));
    fetchWatched();
  };

  return (
    <div>
      <h2>Self-Defence Videos</h2>
      <p><Link to="/home">← Back to Home</Link></p>

      {videos.map((v) => (
        <div key={v.id} style={{ marginBottom: 24, borderBottom: "1px solid #444", paddingBottom: 16 }}>
          <h3>
            {v.title} {watched.includes(v.id) && "✅"}
          </h3>
          <p style={{ opacity: 0.7 }}>Scenario: {v.scenario}</p>
          <iframe
            width="320"
            height="180"
            src={`https://www.youtube.com/embed/${v.youtubeId}`}
            title={v.title}
            allowFullScreen
          />
          <br />
          {watched.includes(v.id) ? (
            <button onClick={() => unmarkWatched(v.id)}>Mark as unwatched</button>
          ) : (
            <button onClick={() => markWatched(v.id)}>Mark as watched</button>
          )}
        </div>
      ))}
    </div>
  );
}
import { Link } from "react-router-dom";
import SOSButton from "../components/sosButton";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>SafeAlert</h1>
      <SOSButton />
      <p style={{ marginTop: 20 }}>
        <Link to="/contacts">Manage Emergency Contacts</Link>
        <p><Link to="/videos">Self-Defence Videos</Link></p>
        <p><Link to="/emergency-card">Emergency Info Card</Link></p>
      </p>
    </div>
  );
}
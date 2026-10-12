import { Nav } from "../App.jsx";
import { useAuth } from "../auth.jsx";
export default function Dashboard() {
  const { user } = useAuth();
  return (
    <>
      <Nav />
      <main className="section">
        <h2>Hello, {user.first_name} 👋</h2>
        <p className="muted">Signed in as {user.email}. Orders and requests will appear here.</p>
      </main>
    </>
  );
}

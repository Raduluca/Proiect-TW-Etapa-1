import { useEffect, useState } from "react";
import ProdusList from "./components/ProdusList.jsx";
import { fetchProduse } from "./api.js";
import "./App.css";

export default function App() {
  const [produse, setProduse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");

  // Rulează o singură dată, la montarea componentei
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await fetchProduse();
        if (!ignore) {
          setProduse(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  function handleToggle(id) {
    setProduse((prev) =>
      prev.map((p) => (p.id === id ? { ...p, disponibil: !p.disponibil } : p))
    );
  }

  function handleDelete(id) {
    setProduse((prev) => prev.filter((p) => p.id !== id));
  }

  const produseDisponibile = produse.filter((p) => p.disponibil).length;

  return (
    <>
      <header className="header">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "light" ? "Mod întunecat" : "Mod luminos"}
        </button>
        <h1>DepoTrack</h1>
        <p>Gestionarea stocurilor și produselor din depozit.</p>
        <p className="counter">
          {produse.length} produse, dintre care {produseDisponibile} disponibile
        </p>
      </header>

      <main className="container">
        <section className="section-card">
          <h2>Produsele din depozit</h2>

          {loading && <p className="info">Se încarcă produsele...</p>}

          {error && (
            <p className="error">
              Nu am putut încărca datele: {error}. Rulează <code>npm run api</code>?
            </p>
          )}

          {!loading && !error && (
            <ProdusList
              produse={produse}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </>
  );
}
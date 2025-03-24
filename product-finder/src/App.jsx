import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchProducts = async () => {
    if (!query.trim()) {
      setError("Введіть запит для пошуку");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("Помилка сервера");

      const data = await response.json();

      if (!data.products || data.products.length === 0) {
        setError("Товарів не знайдено. Спробуйте інший запит.");
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Помилка при пошуку");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchProducts();
  };

  return (
    <div className="container">
      <h1>Пошук товарів на Rozetka</h1>
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введіть назву товару..."
        />
        <button onClick={searchProducts} disabled={loading}>
          {loading ? "Пошук..." : "Пошук"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="products-grid">
        {products.length > 0
          ? products.map((product, index) => (
              <div key={index} className="product-card">
                <img src={product.image} alt={product.title} />
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="price">{product.price}</p>
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy-btn"
                  >
                    Перейти до товару
                  </a>
                </div>
              </div>
            ))
          : !loading && <div className="empty">Товари не знайдені</div>}
      </div>
    </div>
  );
}

export default App;

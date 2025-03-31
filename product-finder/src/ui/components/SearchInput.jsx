import { useState } from "react";

const SearchBox = ({ searchProducts, loading }) => {
  const [query, setQuery] = useState("");
  const [lastSearch, setLastSearch] = useState(""); // Зберігає останній пошуковий запит

  const handleSearch = () => {
    if (!query.trim()) return;

    if (query === lastSearch) {
      searchProducts(""); // Очищення списку товарів
      setLastSearch(""); // Очистка збереженого пошуку
    } else {
      searchProducts(query);
      setLastSearch(query); // Запам'ятовуємо пошуковий запит
    }

    setQuery(""); // Очищаємо поле пошуку
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        maxWidth: "400px",
        background: "#fff",
        padding: "8px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Введіть назву товару..."
        style={{
          flex: 1,
          padding: "10px 14px",
          maxWidth: "242px",
          fontSize: "16px",
          border: "2px solid #ddd",
          borderRadius: "6px",
          outline: "none",
          transition: "border 0.3s ease, box-shadow 0.3s ease",
        }}
        onFocus={(e) => (e.target.style.border = "2px solid #007bff")}
        onBlur={(e) => (e.target.style.border = "2px solid #ddd")}
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#aaa" : "#007bff",
          color: "white",
          border: "none",
          padding: "10px 16px",
          fontSize: "16px",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease, transform 0.2s ease",
        }}
        onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
      >
        {loading ? "Пошук..." : "Пошук"}
      </button>
    </div>
  );
};

export default SearchBox;

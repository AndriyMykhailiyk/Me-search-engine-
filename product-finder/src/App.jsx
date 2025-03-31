import { useState } from "react";
import "./App.css";
import ProductCard from "./ui/components/ProductCard";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

function App() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOption, setSortOption] = useState("default"); // Додано стан для сортування

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

  // Функція для форматування ціни
  const formatPrice = (price) => {
    if (!price) return "0 ₴";
    return `${parseInt(price.replace(/\s/g, ""))} ₴`;
  };

  // Обробник зміни діапазону цін
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Обробник зміни сортування
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Фільтрація та сортування товарів
  const filteredAndSortedProducts = products
    .filter((product) => {
      const price = parseInt(product.price.replace(/\s/g, ""));
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      const priceA = parseInt(a.price.replace(/\s/g, ""));
      const priceB = parseInt(b.price.replace(/\s/g, ""));

      switch (sortOption) {
        case "price_desc":
          return priceB - priceA; // Від дорожчого до дешевшого
        case "price_asc":
          return priceA - priceB; // Від дешевшого до дорожчого
        default:
          return 0;
      }
    });

  // Стилізація повзунка
  const PriceSlider = styled(Slider)({
    color: "#3a8589",
    height: 8,
    "& .MuiSlider-track": {
      border: "none",
    },
    "& .MuiSlider-thumb": {
      height: 24,
      width: 24,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
        boxShadow: "inherit",
      },
      "&:before": {
        display: "none",
      },
    },
    "& .MuiSlider-valueLabel": {
      lineHeight: 1.2,
      fontSize: 12,
      background: "unset",
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: "50% 50% 50% 0",
      backgroundColor: "#3a8589",
      transformOrigin: "bottom left",
      transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
      "&:before": { display: "none" },
      "&.MuiSlider-valueLabelOpen": {
        transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
      },
      "& > *": {
        transform: "rotate(45deg)",
      },
    },
  });

  const searchAndClear = () => {
    if (!query.trim()) return;
    searchProducts(query);
    setQuery("");
  };
  return (
    <div className="container">
      <h1>Пошук товарів</h1>
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введіть назву товару..."
          style={{
            flex: 1,
            padding: "10px 14px",
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
          onClick={searchAndClear}
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

      {error && <div className="error">{error}</div>}

      <div className="products-grid">
        {/* Відображаємо сортування та фільтрацію тільки, якщо є товари */}
        {filteredAndSortedProducts.length > 0 && (
          <>
            <div className="sort-container">
              <FormControl fullWidth>
                <InputLabel id="sort-select-label">Сортування</InputLabel>
                <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sortOption}
                  label="Сортування"
                  onChange={handleSortChange}
                  sx={{ minWidth: 250 }}
                >
                  <MenuItem value="price_desc">
                    Від дорожчого до дешевшого
                  </MenuItem>
                  <MenuItem value="price_asc">
                    Від дешевшого до дорожчого
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="main-wrapper">
              {filteredAndSortedProducts.length > 0
                ? filteredAndSortedProducts.map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))
                : !loading && <p className="no-products">Товари не знайдено</p>}
            </div>
            <div className="filters-container">
              <div className="price-filter-container">
                <h4>Фільтр за ціною</h4>
                <div className="price-range-display">
                  <span>Від: {priceRange[0]} ₴</span>
                  <span>До: {priceRange[1]} ₴</span>
                </div>
                <PriceSlider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  min={0}
                  max={10000}
                  step={100}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

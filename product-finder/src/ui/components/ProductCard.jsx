import React, { useState, useEffect } from "react";
import "../../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} loading="lazy" />
      <div className="product-info">
        <h3>{product.title}</h3>
        <p className="price">{product.price} ₴</p>
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
  );
};

export default ProductCard;

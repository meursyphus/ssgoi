"use client";

import { SsgoiTransition } from "@meursyphus/ssgoi-react";
import Link from "next/link";
import styles from "./page.module.css";

const products = [
  {
    id: 1,
    name: "Premium Headphones",
    price: "$299",
    image: "🎧",
    color: "#4F46E5",
    description: "Wireless noise-cancelling headphones with premium sound quality"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "$399",
    image: "⌚",
    color: "#EC4899",
    description: "Track your fitness and stay connected on the go"
  },
  {
    id: 3,
    name: "Camera Lens",
    price: "$899",
    image: "📷",
    color: "#10B981",
    description: "Professional grade lens for stunning photography"
  },
  {
    id: 4,
    name: "Keyboard",
    price: "$159",
    image: "⌨️",
    color: "#F59E0B",
    description: "Mechanical keyboard with customizable RGB lighting"
  }
];

export default function ProductsPage() {
  return (
    <SsgoiTransition id="/demo/products">
      <div className="page-content">
        <h1 className={styles.pageTitle}>Our Products</h1>
        <p className={styles.pageSubtitle}>Click on any product to see the hero transition effect</p>
        
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <Link 
              key={product.id}
              href={`/demo/products/${product.id}`}
              className={styles.productCard}
            >
              <div 
                className={styles.productImage}
                data-hero-key={`product-${product.id}`}
                style={{ backgroundColor: product.color }}
              >
                <span className={styles.productEmoji}>{product.image}</span>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SsgoiTransition>
  );
}
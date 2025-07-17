"use client";

import { SsgoiTransition } from "@meursyphus/ssgoi-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./page.module.css";

const products = [
  {
    id: 1,
    name: "Premium Headphones",
    price: "$299",
    image: "🎧",
    color: "#4F46E5",
    description: "Wireless noise-cancelling headphones with premium sound quality",
    features: [
      "Active Noise Cancellation",
      "40-hour battery life",
      "Premium comfort design",
      "Hi-Fi audio quality"
    ]
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "$399",
    image: "⌚",
    color: "#EC4899",
    description: "Track your fitness and stay connected on the go",
    features: [
      "Heart rate monitoring",
      "GPS tracking",
      "Water resistant",
      "7-day battery life"
    ]
  },
  {
    id: 3,
    name: "Camera Lens",
    price: "$899",
    image: "📷",
    color: "#10B981",
    description: "Professional grade lens for stunning photography",
    features: [
      "85mm focal length",
      "f/1.4 aperture",
      "Weather sealed",
      "Ultra-sharp optics"
    ]
  },
  {
    id: 4,
    name: "Keyboard",
    price: "$159",
    image: "⌨️",
    color: "#F59E0B",
    description: "Mechanical keyboard with customizable RGB lighting",
    features: [
      "Cherry MX switches",
      "RGB backlighting",
      "Programmable keys",
      "Aluminum body"
    ]
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <SsgoiTransition id={`/demo/products/${productId}`}>
        <div className="page-content">
          <h1>Product not found</h1>
          <Link href="/demo/products">Back to products</Link>
        </div>
      </SsgoiTransition>
    );
  }

  return (
    <SsgoiTransition id={`/demo/products/${productId}`}>
      <div className="page-content">
        <Link href="/demo/products" className={styles.backButton}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to products
        </Link>
        
        <div className={styles.productDetail}>
          <div className={styles.productDetailGrid}>
            <div 
              className={styles.productHeroImage}
              data-hero-key={`product-${product.id}`}
              style={{ backgroundColor: product.color }}
            >
              <span className={styles.productHeroEmoji}>{product.image}</span>
            </div>
            
            <div className={styles.productDetailInfo}>
              <h1 className={styles.productDetailName}>{product.name}</h1>
              <p className={styles.productDetailPrice}>{product.price}</p>
              <p className={styles.productDetailDescription}>{product.description}</p>
              
              <div className={styles.productFeatures}>
                <h3 className={styles.featuresTitle}>Key Features</h3>
                <ul className={styles.featuresList}>
                  {product.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.productActions}>
                <button className={styles.addToCartButton}>
                  Add to Cart
                </button>
                <button className={styles.wishlistButton}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}
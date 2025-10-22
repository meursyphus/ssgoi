"use client";

import Link from "next/link";
import { SsgoiTransition } from "@ssgoi/react";
import { textShape } from "@ssgoi/react/view-transitions";

export default function TextShapeDemo() {
  return (
    <SsgoiTransition
      id="/text-shape"
      transition={textShape({
        color: "#764ba2", // 배경 색상
        texts: ["안녕하세요", "환영합니다"], // 순차적으로 표시될 텍스트
        textDuration: 1500, // 각 텍스트가 보여지는 시간 (ms)
        shape: "circle", // circle | square | triangle 선택 가능
      })}
    >
      <main
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "red",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Text + Shape Transition Demo
        </h1>
        <Link
          href="/"
          style={{
            padding: "1rem 2rem",
            background: "#667eea",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          홈으로 이동
        </Link>
      </main>
    </SsgoiTransition>
  );
}

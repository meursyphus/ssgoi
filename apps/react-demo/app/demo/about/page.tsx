import { SsgoiTransition } from "@meursyphus/ssgoi-react";

export default function AboutPage() {
  return (
    <SsgoiTransition id="/demo/about">
      <div>
        <h1>About Us</h1>
        <p>Learn more about our company and mission</p>
      </div>
    </SsgoiTransition>
  );
}
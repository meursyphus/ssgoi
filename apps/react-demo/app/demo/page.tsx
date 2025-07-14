import { SsgoiTransition } from "@meursyphus/ssgoi-react";

export default function DemoHomePage() {
  return (
    <SsgoiTransition id="/demo">
      <div>
        <h1>Welcome to Demo Home</h1>
        <p>This is the home page with fade transitions</p>
      </div>
    </SsgoiTransition>
  );
}
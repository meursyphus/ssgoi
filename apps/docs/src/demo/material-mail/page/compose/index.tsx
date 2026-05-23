"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { ComposeBar } from "./compose-bar";
import { ComposeForm } from "./compose-form";
import { ComposeToolbar } from "./compose-toolbar";

export default function ComposePage() {
  return (
    <SsgoiTransition
      id="/demo/material-mail/compose"
      className="relative flex min-h-full flex-col bg-white"
    >
      <ComposeBar />
      <div className="flex-1 overflow-y-auto">
        <ComposeForm />
      </div>
      <ComposeToolbar />
    </SsgoiTransition>
  );
}

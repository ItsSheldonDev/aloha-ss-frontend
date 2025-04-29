// src/components/TurnstileWidget.tsx
"use client"

import Turnstile from "react-turnstile";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
}

export default function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
  return (
    <div className="flex justify-center my-4">
      <Turnstile
        sitekey="0x4AAAAAAA5wkdZ3KOXDYPTi"
        onVerify={onVerify}
        onError={() => {
          console.error("Erreur de validation Turnstile");
          onVerify("");
        }}
        onExpire={() => {
          console.log("Token Turnstile expiré");
          onVerify("");
        }}
        refreshExpired="auto"
        theme="light"
        language="fr"
        fixedSize={true}
      />
    </div>
  );
}
"use client";

import { useEffect, useMemo, useRef } from "react";

interface AuroraProps {
  className?: string;
}

export function AuroraFix({ className = "" }: AuroraProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: "transparent",
        isolation: "isolate",
      }}
    >
      {/* 그라데이션 1 (가장 위에 보이는 레이어) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(99.16% 100% at 10.97% 0%, #006AE3 0%, rgba(0, 102, 212, 0.50) 26.56%, rgba(0, 102, 212, 0.00) 53.12%)",
        }}
      />

      {/* 그라데이션 2 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(99.16% 100% at 73.07% 0%, #1C22D9 0%, rgba(33, 19, 173, 0.90) 24.34%, rgba(59, 28, 217, 0.00) 59.95%)",
        }}
      />

      {/* 그라데이션 3 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(26, 0, 255, 0.50) 0%, rgba(0, 17, 255, 0.00) 12.67%)",
        }}
      />
    </div>
  );
}

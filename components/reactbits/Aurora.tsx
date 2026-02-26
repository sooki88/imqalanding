"use client";

interface AuroraProps {
  className?: string;
}

export default function Aurora({ className = "" }: AuroraProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: "transparent",
        isolation: "isolate",
      }}
    >
      {/* 아래 레이어: 컬러 그라데이션 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(270deg, rgba(105, 41, 255, 0.95) 9.52%, #01F 38.95%, rgba(0, 17, 255, 0.90) 64.6%, rgba(0, 174, 255, 0.95) 92.14%)",
        }}
      />

      {/* 위 레이어: 검정 오버레이 (위는 투명, 아래로 갈수록 검정) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 60%)",
        }}
      />
    </div>
  );
}

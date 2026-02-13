import { ReactNode } from "react";

export default function Tag({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex py-1 px=2 rounded-1 border border-[##6EFAFF] text-sm bg-[linear-gradient(273deg,#00FFD4_1.36%,#00EAFF_63.25%,#009DFF_96.02%)] 
  bg-clip-text 
  text-transparent"
    >
      {children}
    </div>
  );
}

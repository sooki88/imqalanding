import { ReactNode } from "react";

export default function Tag({ children }: { children: ReactNode }) {
  return (
    <div className="flex py-1 px-2 rounded-[4px] text-xs font-semibold bg-[linear-gradient(300deg,#0077ff_1.36%,#00EAFF_63.25%,#00bfff_96.02%)] text-black ">
      {children}
    </div>
  );
}

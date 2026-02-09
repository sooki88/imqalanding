import Image from "next/image";
import GlareHover from "./GlareHover";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-10 h-16 fixed top-0 right-0 left-0 z-1">
      <Image
        src="/imqa_logo_wht.svg"
        alt="IMQA logo"
        width={94}
        height={23}
        priority
      />
      <GlareHover
        glareColor="#ffffff"
        glareOpacity={0.3}
        glareAngle={-80}
        glareSize={600}
        width="80px"
        height="38px"
        borderRadius="4px"
        borderColor="#fff"
        transitionDuration={1000}
        playOnce={false}
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderWidth: "0.7px",
        }}
      >
        <h2 className="text-white text-sm font-medium leading-[1.5]">
          문의하기
        </h2>
      </GlareHover>
    </header>
  );
}

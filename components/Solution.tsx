// // 여섯번째 섹션 (IMQA로 답하세요)

// "use client";

// import Galaxy from "./reactbits/Galaxy";
// import ColorBends from "./reactbits/ColorBends";
// import GlareHover from "./reactbits/GlareHover";

// export default function Solution() {
//   return (
//     <section className="py-0 bg-slate-900">
//       <div className="absolute inset-0 z-0 mix-blend-screen"></div>
//       <div className="flex flex-col items-center justify-center w-full py-25">
//         <h3 className="text-3xl w-3/4 font-semibold leading-[1.4] break-keep text-white text-center">
//           서비스를 관찰하고 실제 사용자 경험을 분석해보세요 <br />
//           수많은 질문에 <strong className="text-main-blue">IMQA</strong>로
//           답하세요
//         </h3>
//         <div className="flex gap-4 mt-12 pointer-events-auto">
//           <GlareHover
//             glareColor="#ffffff"
//             glareOpacity={0.3}
//             glareAngle={-80}
//             glareSize={600}
//             width="172px"
//             height="44px"
//             borderRadius="4px"
//             borderColor="#fff"
//             transitionDuration={1000}
//             playOnce={false}
//             style={{
//               background: "rgba(0, 0, 0, 0.05)",
//               backdropFilter: "blur(4px)",
//               WebkitBackdropFilter: "blur(4px)",
//               borderWidth: "0.7px",
//             }}
//           >
//             <h2 className="text-white text-base font-medium leading-[1.5]">
//               소개서 다운로드
//             </h2>
//           </GlareHover>

//           <GlareHover
//             glareColor="#000"
//             glareOpacity={0.3}
//             glareAngle={-80}
//             glareSize={600}
//             width="172px"
//             height="44px"
//             borderRadius="4px"
//             borderColor="#fff"
//             transitionDuration={1000}
//             playOnce={false}
//             style={{
//               background: "rgba(255, 255, 255, 1)",
//               backdropFilter: "blur(8px)",
//               WebkitBackdropFilter: "blur(8px)",
//               borderWidth: "0.7px",
//             }}
//           >
//             <h2 className="text-black text-base font-medium leading-[1.5]">
//               IMQA 문의하기
//             </h2>
//           </GlareHover>
//         </div>
//       </div>
//     </section>
//   );
// }

// 여섯번째 섹션 (IMQA로 답하세요)

"use client";

import Galaxy from "./reactbits/Galaxy";
import ColorBends from "./reactbits/ColorBends";
import GlareHover from "./reactbits/GlareHover";
import Image from "next/image";

export default function Solution() {
  return (
    <section className="py-0 bg-slate-900">
      <div className="solution-bg absolute inset-0 -z-0">
        {/* <div className="solution-bg absolute inset-0" /> */}
      </div>
      <div className="flex flex-col items-center justify-center w-full py-25">
        <h3 className="text-3xl w-3/4 font-semibold leading-[1.4] break-keep text-white text-center">
          서비스를 관찰하고 실제 사용자 경험을 분석해보세요 <br />
          수많은 질문에 <strong className="text-main-blue">IMQA</strong>로
          답하세요
        </h3>
        <div className="flex gap-4 mt-12 pointer-events-auto">
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-80}
            glareSize={600}
            width="172px"
            height="44px"
            borderRadius="4px"
            borderColor="#fff"
            transitionDuration={1000}
            playOnce={false}
            style={{
              background: "rgba(0, 0, 0, 0.05)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              borderWidth: "0.7px",
            }}
          >
            <h2 className="text-white text-base font-medium leading-[1.5]">
              소개서 다운로드
            </h2>
          </GlareHover>

          <GlareHover
            glareColor="#000"
            glareOpacity={0.3}
            glareAngle={-80}
            glareSize={600}
            width="172px"
            height="44px"
            borderRadius="4px"
            borderColor="#fff"
            transitionDuration={1000}
            playOnce={false}
            style={{
              background: "rgba(255, 255, 255, 1)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderWidth: "0.7px",
            }}
          >
            <h2 className="text-black text-base font-medium leading-[1.5]">
              IMQA 문의하기
            </h2>
          </GlareHover>
        </div>
      </div>
    </section>
  );
}

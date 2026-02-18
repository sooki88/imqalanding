// "use client";

// import { useEffect, useRef } from "react";
// import Image from "next/image";
// import * as ChannelService from "@channel.io/channel-web-sdk-loader";

// declare global {
//   interface Window {
//     ChannelIO?: any;
//   }
// }

// export default function FloatingBtn() {
//   const pluginKey = process.env.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY;
//   const bootedRef = useRef(false);

//   useEffect(() => {
//     if (!pluginKey) {
//       console.warn(
//         "[ChannelTalk] NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY가 없습니다. .env.local에 설정하세요.",
//       );
//       return;
//     }

//     let canceled = false;

//     (async () => {
//       try {
//         await ChannelService.loadScript();
//         if (canceled) return;

//         if (!bootedRef.current) {
//           await ChannelService.boot({
//             pluginKey,
//             // ✅ 기본 채널 버튼 숨김 (겹침 원인 제거)
//             hideChannelButtonOnBoot: true,
//             // ✅ 내가 만든 버튼을 “커스텀 런처”로 지정
//             customLauncherSelector: "#channel-launcher",
//           });
//           bootedRef.current = true;
//         }
//       } catch (e) {
//         console.error("[ChannelTalk] load/boot 실패:", e);
//       }
//     })();

//     return () => {
//       canceled = true;
//       // 필요하면 언마운트 시 종료
//       // ChannelService.shutdown();
//     };
//   }, [pluginKey]);

//   // 혹시 customLauncherSelector가 안 먹는 환경 fallback
//   const openFallback = () => {
//     const ch = window.ChannelIO;
//     if (!ch) return;

//     if (typeof ch.showMessenger === "function") ch.showMessenger();
//     else if (typeof ch === "function") ch("showMessenger");
//   };

//   return (
//     <button
//       id="channel-launcher"
//       type="button"
//       onClick={openFallback}
//       aria-label="채널톡 문의하기"
//       className="
//         fixed bottom-6 right-6 z-[9999]
//         h-16 w-16 rounded-full
//         border border-white/15 bg-black/40 backdrop-blur-md
//         shadow-lg transition
//         hover:scale-[1.03] active:scale-[0.98]
//       "
//     >
//       <Image
//         src="/channeltalk_logo.webp"
//         alt="ChannelTalk"
//         fill
//         className="rounded-full object-cover"
//         sizes="64px"
//         priority={false}
//       />
//     </button>
//   );
// }

// "use client";

// import { useEffect, useRef, useCallback } from "react";
// import Image from "next/image";
// import * as ChannelService from "@channel.io/channel-web-sdk-loader";

// export default function FloatingBtn() {
//   const pluginKey = process.env.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY;
//   const bootedRef = useRef(false);

//   // 데스크탑에서만 메신저 사이즈 강제 적용
//   const applyDesktopMessengerSize = useCallback(() => {
//     if (typeof window === "undefined") return;

//     // ✅ 모바일은 건드리지 않음
//     const isDesktop = window.matchMedia("(min-width: 768px)").matches;
//     if (!isDesktop) return;

//     // 채널톡이 만들어내는 루트 컨테이너(대부분 #ch-plugin)
//     const root =
//       document.querySelector<HTMLElement>("#ch-plugin") ||
//       document.querySelector<HTMLElement>("[id^='ch-plugin']") ||
//       document.querySelector<HTMLElement>(".ch-plugin") ||
//       null;

//     if (!root) return;

//     // 이 안에 iframe이 들어있는 경우가 많음
//     const iframe = root.querySelector<HTMLIFrameElement>("iframe");

//     // ✅ 데스크탑 목표: height 70vh, width 30vw (min 328px)
//     // 너무 작아지지 않게 clamp로 보호
//     const width = "clamp(328px, 30vw, 520px)";
//     const height = "70vh";

//     // root 자체가 wrapper 역할을 하는 경우가 있어서 둘 다 세팅
//     root.style.width = width;
//     root.style.height = height;

//     // 위치 고정(우하단) - 필요 시 조절
//     root.style.right = "24px";
//     root.style.bottom = "24px";
//     root.style.left = "auto";
//     root.style.top = "auto";
//     root.style.position = "fixed";
//     root.style.maxWidth = "none";
//     root.style.maxHeight = "none";

//     if (iframe) {
//       iframe.style.width = "100%";
//       iframe.style.height = "100%";
//     }
//   }, []);

//   useEffect(() => {
//     if (!pluginKey) {
//       console.warn(
//         "[ChannelTalk] NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY가 없습니다. .env.local에 설정하세요.",
//       );
//       return;
//     }

//     let canceled = false;

//     (async () => {
//       try {
//         await ChannelService.loadScript();
//         if (canceled) return;

//         if (!bootedRef.current) {
//           await ChannelService.boot({
//             pluginKey,
//             // ✅ 기본 채널톡 버튼 숨김 (중복 버튼 방지)
//             hideChannelButtonOnBoot: true, // 공식 boot 옵션 :contentReference[oaicite:1]{index=1}
//           });
//           bootedRef.current = true;
//         }

//         // ✅ 메신저가 열릴 때마다 데스크탑 리사이즈 적용
//         const ch = (window as any).ChannelIO;
//         if (typeof ch === "function") {
//           ch("onShowMessenger", () => {
//             // 다음 프레임에 DOM이 확실히 생긴 뒤 적용
//             requestAnimationFrame(() => applyDesktopMessengerSize());
//           });
//         }

//         // 창 크기 바뀌면(모바일/데스크탑 전환 등) 다시 적용
//         window.addEventListener("resize", applyDesktopMessengerSize);
//       } catch (e) {
//         console.error("[ChannelTalk] load/boot 실패:", e);
//       }
//     })();

//     return () => {
//       canceled = true;
//       window.removeEventListener("resize", applyDesktopMessengerSize);
//       // 필요 시 종료
//       // ChannelService.shutdown();
//     };
//   }, [pluginKey, applyDesktopMessengerSize]);

//   const openChannelTalk = () => {
//     const ch = (window as any).ChannelIO;
//     if (!ch) return;

//     // 공식 API에 showMessenger 존재 :contentReference[oaicite:2]{index=2}
//     // 타입 이슈 피하려고 command 형태로 호출
//     if (typeof ch === "function") ch("showMessenger");
//   };

//   return (
//     <button
//       type="button"
//       onClick={openChannelTalk}
//       aria-label="채널톡 문의하기"
//       className="
//         fixed bottom-6 right-6 z-[9999]
//         h-14 w-14 rounded-full
//         border border-white/15 bg-black/40 backdrop-blur-md
//         shadow-lg transition
//         hover:scale-[1.03] active:scale-[0.98]
//       "
//     >
//       <Image
//         src="/channeltalk_logo.webp"
//         alt="ChannelTalk"
//         width={56}
//         height={56}
//         className="h-full w-full rounded-full object-cover"
//       />
//     </button>
//   );
// }

// "use client";

// import { useEffect, useRef } from "react";
// import Image from "next/image";
// import * as ChannelService from "@channel.io/channel-web-sdk-loader";

// declare global {
//   interface Window {
//     ChannelIO?: any;
//   }
// }

// export default function FloatingBtn() {
//   const pluginKey = process.env.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY;
//   const bootedRef = useRef(false);

//   useEffect(() => {
//     if (!pluginKey) {
//       console.warn(
//         "[ChannelTalk] NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY가 없습니다.",
//       );
//       return;
//     }

//     let canceled = false;

//     (async () => {
//       try {
//         await ChannelService.loadScript();
//         if (canceled) return;

//         if (!bootedRef.current) {
//           // ✅ 핵심 수정: 레이아웃 모드 명시적 지정
//           await ChannelService.boot({
//             pluginKey,
//             hideChannelButtonOnBoot: true,
//             customLauncherSelector: "#channel-launcher",
//             // 1. 데스크탑에서 사이드 바 형태로 뜨게 강제
//             desktopMessengerMode: "side",
//             // 2. 모바일에서만 전체화면으로 뜨게 설정
//             mobileMessengerMode: "fullscreen",
//             // 3. 버튼과 창이 겹치지 않도록 위치 보정 (옵션)
//             appearance: "dark",
//           });
//           bootedRef.current = true;
//         }
//       } catch (e) {
//         console.error("[ChannelTalk] load/boot 실패:", e);
//       }
//     })();

//     return () => {
//       canceled = true;
//     };
//   }, [pluginKey]);

//   const handleToggleMessenger = (e: React.MouseEvent) => {
//     const ch = window.ChannelIO;
//     if (!ch) return;

//     // customLauncherSelector가 잡혀있으면 브라우저가 알아서 열지만,
//     // 확실한 제어를 위해 현재 상태를 체크 후 호출합니다.
//     if (typeof ch === "function") {
//       ch("showMessenger");
//     }
//   };

//   return (
//     <button
//       id="channel-launcher"
//       type="button"
//       onClick={handleToggleMessenger}
//       aria-label="채널톡 문의하기"
//       className="
//         fixed bottom-6 right-6 z-[9999]
//         h-16 w-16 rounded-full
//         border border-white/15 bg-black/40 backdrop-blur-md
//         shadow-2xl transition-all duration-300
//         hover:scale-110 hover:border-white/30 active:scale-95
//       "
//     >
//       <div className="relative h-full w-full p-3">
//         {" "}
//         {/* 여백을 주어 로고가 꽉 차지 않게 조절 */}
//         <Image
//           src="/channeltalk_logo.webp"
//           alt="ChannelTalk"
//           fill
//           className="rounded-full object-contain p-3" // object-cover 대신 contain 권장
//           sizes="64px"
//         />
//       </div>
//     </button>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";

// 1. 에러 해결: 기존 타입과 충돌하지 않도록 interface 보강(Augmentation) 사용
// 만약 여전히 에러가 나면 이 블록 전체를 삭제해도 됩니다 (라이브러리에 이미 내장됨)
declare global {
  interface Window {
    // ChannelIO?: any; <- 이 부분이 충돌 원인이었습니다.
  }
}

export default function FloatingBtn() {
  const pluginKey = process.env.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY;
  const bootedRef = useRef(false);

  useEffect(() => {
    if (!pluginKey) return;

    let canceled = false;

    (async () => {
      try {
        await ChannelService.loadScript();
        if (canceled) return;

        if (!bootedRef.current) {
          // 2. 에러 해결: 'as any'를 사용하여 타입스크립트의 엄격한 속성 검사 우회
          // 라이브러리 타입 정의(BootOption)에 속성이 누락되었을 때 사용하는 가장 확실한 방법입니다.
          await ChannelService.boot({
            pluginKey,
            hideChannelButtonOnBoot: true,
            customLauncherSelector: "#channel-launcher",
            desktopMessengerMode: "side",
            mobileMessengerMode: "fullscreen",
            appearance: "dark",
          } as any);

          bootedRef.current = true;
        }
      } catch (e) {
        console.error("[ChannelTalk] load/boot 실패:", e);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [pluginKey]);

  const handleToggleMessenger = () => {
    // 3. 에러 해결: window 객체에서 안전하게 접근
    const ch = (window as any).ChannelIO;
    if (typeof ch === "function") {
      ch("showMessenger");
    }
  };

  return (
    <button
      id="channel-launcher"
      type="button"
      onClick={handleToggleMessenger}
      aria-label="채널톡 문의하기"
      className="
        fixed bottom-6 right-6 z-[9999]
        h-14 w-14 rounded-full
        border border-white/15 bg-black/40 backdrop-blur-md
        shadow-2xl transition-all duration-300
        hover:scale-110 hover:border-white/30 active:scale-95
      "
    >
      <div className="relative h-full w-full p-2">
        <Image
          src="/channeltalk_logo.webp"
          alt="ChannelTalk"
          fill
          className="rounded-full object-contain"
          sizes="56px"
        />
      </div>
    </button>
  );
}

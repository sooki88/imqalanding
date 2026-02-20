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

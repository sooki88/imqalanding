"use client";

import { useEffect } from "react";
import Image from "next/image";
import Script from "next/script";

declare global {
  interface Window {
    ChannelIO?: (...args: any[]) => void;
    ChannelIOInitialized?: boolean;
  }
}

export default function FloatingBtn() {
  const pluginKey = process.env.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY;

  useEffect(() => {
    // 플러그인키 없으면 버튼만 보여주고(클릭해도 아무 일 안함) 콘솔로 알려줌
    if (!pluginKey) {
      console.warn(
        "[ChannelTalk] NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY가 없습니다. .env에 설정하세요.",
      );
      return;
    }
  }, [pluginKey]);

  const openChannelTalk = () => {
    if (typeof window === "undefined") return;

    // SDK 로드되어 있으면 메신저 열기
    if (window.ChannelIO) {
      window.ChannelIO("showMessenger");
      return;
    }

    // 혹시 아직 로드 전이면 약간 기다렸다가 한번 더 시도
    setTimeout(() => {
      if (window.ChannelIO) window.ChannelIO("showMessenger");
    }, 150);
  };

  return (
    <>
      {/* 채널톡 스크립트 로드 */}
      {pluginKey && (
        <>
        <script>
  (function(){var w=window;if(w.ChannelIO){return w.console.error("ChannelIO script included twice.");}var ch=function(){ch.c(arguments);};ch.q=[];ch.c=function(args){ch.q.push(args);};w.ChannelIO=ch;function l(){if(w.ChannelIOInitialized){return;}w.ChannelIOInitialized=true;var s=document.createElement("script");s.type="text/javascript";s.async=true;s.src="https://cdn.channel.io/plugin/ch-plugin-web.js";var x=document.getElementsByTagName("script")[0];if(x.parentNode){x.parentNode.insertBefore(s,x);}}if(document.readyState==="complete"){l();}else{w.addEventListener("DOMContentLoaded",l);w.addEventListener("load",l);}})();

  ChannelIO('boot', {
    "pluginKey": "79dee640-fa46-4a1d-a36f-5ec650ceea8b"
  });
</script>

          {/* <Script id="channeltalk-loader" strategy="afterInteractive">
            {`
              (function() {
                var w = window;
                if (w.ChannelIOInitialized) return;
                w.ChannelIOInitialized = true;

                function ch() { ch.q.push(arguments); }
                ch.q = [];
                w.ChannelIO = ch;

                function l() {
                  if (w.ChannelIOInitializedLoaded) return;
                  w.ChannelIOInitializedLoaded = true;
                  var s = document.createElement("script");
                  s.type = "text/javascript";
                  s.async = true;
                  s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
                  var x = document.getElementsByTagName("script")[0];
                  x.parentNode.insertBefore(s, x);
                }

                if (document.readyState === "complete") l();
                else window.addEventListener("load", l, false);
              })();
            `}
          </Script>

          <Script id="channeltalk-boot" strategy="afterInteractive">
            {`
              (function() {
                if (!window.ChannelIO) return;
                window.ChannelIO('boot', { pluginKey: '${pluginKey}' });
              })();
            `}
          </Script> */}
        </>
      )}

      {/* 플로팅 버튼 */}
      <button
        type="button"
        onClick={openChannelTalk}
        aria-label="채널톡 문의하기"
        className="
          fixed bottom-6 right-6 z-[9999]
          h-14 w-14 rounded-full
          border border-white/15 bg-black/40 backdrop-blur-md
          shadow-lg transition
          hover:scale-[1.03] active:scale-[0.98]
        "
      >
        <Image
          src="/channeltalk_logo.webp"
          alt="ChannelTalk"
          width={56}
          height={56}
          className="h-full w-full rounded-full object-cover"
          priority={false}
        />
      </button>
    </>
  );
}

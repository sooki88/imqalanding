"use client";

interface PolicyContentProps {
  content: string;
}

export default function PolicyContent({ content }: PolicyContentProps) {
  const formatText = (text: string) => {
    return (
      text
        // 1. "제N조", "부칙" 등 큰 제목 스타일링
        // ^ (줄 시작)과 m 플래그를 사용하여 각 줄의 시작을 정확히 타겟팅합니다.
        .replace(
          /^(제\s*\d+\s*조|부\s*칙)(.*)$/gm,
          '<h2 class="text-xl font-semibold text-white pt-4 pb-1">$1$2</h2>',
        )

        // 2. '가. 나. 다.' 항목 (줄 시작 부분만)
        .replace(
          /^([가-하]\.\s.*)$/gm,
          '<p class="font-medium text-white py-1">$1</p>',
        )

        // 3. 항목 번호 (①, ② 등)와 그 뒤의 문장 전체
        // 번호 기호가 나오면 해당 줄 끝까지 강조
        .replace(
          /([①-⑮][^\n]+)/g,
          '<div class="py-1 text-white font-medium">$1</div>',
        )

        // 4. 불렛 포인트 (•) 들여쓰기
        .replace(
          /•\s?([^\n]+)/g,
          '<div class="flex items-start gap-2 pl-4 py-1 text-white/80"><span>•</span><span>$1</span></div>',
        )

      // 5. 남은 줄바꿈 처리 (태그 사이가 아닌 일반 텍스트 줄바꿈)
      // 위에서 태그로 감싸지 않은 나머지 일반 텍스트들에 대해 적용됩니다.
      // .replace(/\n(?!\n)/g, "<br />")
    );
  };

  return (
    <article
      className="flex-1 w-full max-w-[1200px] leading-[1.6] text-base text-white/80 break-keep"
      dangerouslySetInnerHTML={{ __html: formatText(content) }}
    />
  );
}

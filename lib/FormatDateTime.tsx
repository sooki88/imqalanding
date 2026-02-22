type FormatDateTimeOptions = {
  withTime?: boolean; // true면 시간 포함, false면 날짜만
};

export function formatDateTime(
  value?: string | null,
  options: FormatDateTimeOptions = { withTime: true },
) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  const { withTime = true } = options;

  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime
      ? {
          hour: "2-digit" as const,
          minute: "2-digit" as const,
        }
      : {}),
  });
}

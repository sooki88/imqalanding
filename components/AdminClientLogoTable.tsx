"use client";

import { useMemo, useState } from "react";
import useNewsQuery from "@/hooks/use-news-query";
import { formatDateTime } from "@/lib/FormatDateTime";
import LoadingSpinner from "./LoadingSpinner";
import useUpdateNewsMutation from "@/hooks/use-update-news-mutation";

export default function AdminClientLogoTable() {
  return <div className="space-y-4">고객사 로고 예정</div>;
}

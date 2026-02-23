"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import useUploadClientLogoMutation from "@/hooks/use-upload-client-logo-mutation";
import useClientLogosQuery from "@/hooks/use-client-logos-query";
import LoadingSpinner from "./LoadingSpinner";
import { formatDateTime } from "@/lib/FormatDateTime";
import useDeleteClientLogoMutation from "@/hooks/use-delete-client-logo-mutation";

type FormState = {
  file: File | null;
  name: string;
  alt: string;
  sortOrder: string; // input에서는 string으로 받고 저장 시 number 변환
};

const initialForm: FormState = {
  file: null,
  name: "",
  alt: "",
  sortOrder: "10",
};

export default function AdminClientLogoTable() {
  const uploadLogoMutation = useUploadClientLogoMutation();
  const clientLogosQuery = useClientLogosQuery();
  const deleteLogoMutation = useDeleteClientLogoMutation();

  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const logos = useMemo(() => {
    if (!Array.isArray(clientLogosQuery.data)) return [];
    return clientLogosQuery.data;
  }, [clientLogosQuery.data]);

  const canSubmit = useMemo(() => {
    const fileOk = !!form.file;
    const altOk = form.alt.trim().length > 0;
    const sortOrderOk =
      form.sortOrder.trim().length > 0 && !Number.isNaN(Number(form.sortOrder));
    return fileOk && altOk && sortOrderOk;
  }, [form]);

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!canSubmit || !form.file) return;

    try {
      await uploadLogoMutation.mutateAsync({
        file: form.file,
        name: form.name.trim() || undefined,
        alt: form.alt.trim(),
        sortOrder: Number(form.sortOrder),
      });

      alert("로고가 등록되었습니다.");
      setForm(initialForm);
      setSubmitted(false);

      // file input 초기화용 (controlled 불가라 key로 리마운트해도 되지만 간단히 state만 초기화)
      const input = document.getElementById(
        "client-logo-file",
      ) as HTMLInputElement | null;
      if (input) input.value = "";
    } catch (e) {
      console.error(e);
      alert("업로드에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 업로드 폼 */}
      <form onSubmit={onUpload} className="space-y-4 pt-3">
        <h3 className="text-xl md:text-2xl text-white font-semibold">
          고객사 로고 등록
        </h3>
        <p className="text-left text-slate-400 text-xs">
          <strong>사이즈 </strong>: 높이 90px 내 가운데 위치(export 배율: 1또는
          1.5배)
          <br />
          <strong>형식 </strong>: png형식 export 후 webp로 변환 <br />
          <strong>피그마 위치 </strong>:(디자인&마케팅의 홈페이지)
          https://www.figma.com/design/E81sF9D73eTUMx1hxQBc8O/%EB%94%94%EC%9E%90%EC%9D%B8-%EB%A7%88%EC%BC%80%ED%8C%85?node-id=4729-7408&t=Q72CzJyrHXqdPjzQ-1
        </p>

        <div className="flex flex-col gap-4">
          {/* 내부 관리용 (고객사)이름 */}
          <div>
            <label
              htmlFor="logo-name"
              className="block text-base text-slate-200 text-left"
            >
              고객사
            </label>
            <input
              id="logo-name"
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="예: 삼성생명"
              className="h-10 w-full rounded-sm border border-white/20 bg-black/30 px-3 text-white mt-1"
            />
          </div>

          {/* alt */}
          <div>
            <label
              htmlFor="logo-alt"
              className="block text-base text-slate-200 text-left"
            >
              alt 텍스트
            </label>
            <input
              id="logo-alt"
              type="text"
              value={form.alt}
              onChange={(e) => onChange("alt", e.target.value)}
              placeholder="예: 삼성 로고"
              className={`h-10 w-full rounded-sm border bg-black/30 px-3 text-white mt-1 ${
                submitted && form.alt.trim() === ""
                  ? "border-red-400/60"
                  : "border-white/20"
              }`}
            />
            {submitted && form.alt.trim() === "" && (
              <p className="text-xs text-red-400">alt 텍스트를 입력해주세요.</p>
            )}
          </div>

          {/* 파일 */}
          <div className="space-y-2 md:col-span-2">
            {/* <label
              htmlFor="client-logo-file"
              className="block text-sm text-slate-200"
            >
              로고 이미지 파일
            </label> */}
            <input
              id="client-logo-file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                onChange("file", file);
              }}
              className="block w-full text-sm text-slate-200 file:mr-3 file:h-9 file:border-0 file:rounded-sm file:bg-[#0077ff] file:px-3 file:text-white file:cursor-pointer"
            />
            {submitted && !form.file && (
              <p className="text-xs text-red-400">
                이미지 파일을 선택해주세요.
              </p>
            )}
          </div>

          {/* 정렬순서 */}
          {/* <div className="space-y-2 md:max-w-[220px]">
            <label
              htmlFor="logo-sort-order"
              className="block text-sm text-slate-200"
            >
              정렬 순서
            </label>
            <input
              id="logo-sort-order"
              type="number"
              value={form.sortOrder}
              onChange={(e) => onChange("sortOrder", e.target.value)}
              placeholder="10"
              className={`h-10 w-full rounded-sm border bg-black/30 px-3 text-white ${
                submitted &&
                (form.sortOrder.trim() === "" ||
                  Number.isNaN(Number(form.sortOrder)))
                  ? "border-red-400/60"
                  : "border-white/20"
              }`}
            />
          </div> */}
        </div>

        <button
          type="submit"
          disabled={uploadLogoMutation.isPending || !canSubmit}
          className="inline-flex w-fit items-center justify-center rounded-sm bg-[#0077ff] px-5 h-11 font-medium text-base text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
        >
          {uploadLogoMutation.isPending ? "등록 중..." : "등록"}
        </button>
      </form>

      {/* 구분 선 */}
      <div className="w-full h-[1px] bg-slate-500"></div>

      {/* 리스트 */}
      <div>
        {/* <h3 className="text-xl md:text-2xl text-white font-semibold">
          고객사 로고 리스트
        </h3> */}

        {clientLogosQuery.isLoading ? (
          <div className="flex items-center justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : clientLogosQuery.isError ? (
          <div className="py-10 text-center text-red-400">
            {clientLogosQuery.error instanceof Error
              ? clientLogosQuery.error.message
              : "로고 데이터를 불러오지 못했습니다."}
          </div>
        ) : logos.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            등록된 로고가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-white">
              <thead>
                <tr className="border-b border-white/10 text-slate-300">
                  <th className="text-left py-3 px-2 font-normal">미리보기</th>
                  <th className="text-left py-3 px-2 font-normal">고객사</th>
                  <th className="text-left py-3 px-2 font-normal">alt</th>
                  <th className="text-left py-3 px-2 font-normal">
                    image_path
                  </th>
                  {/* <th className="text-left py-3 px-2 font-normal">정렬순서</th> */}
                  <th className="text-left py-3 px-2 font-normal">생성일시</th>
                  <th className="text-left py-3 px-2 font-normal">삭제</th>
                </tr>
              </thead>
              <tbody>
                {logos.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 align-top hover:bg-white/5"
                  >
                    <td className="py-3 px-2">
                      <div className="relative h-10 w-32 rounded bg-white/5">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-contain p-1"
                          sizes="128px"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap text-left">
                      {item.name || "-"}
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap text-left">
                      {item.alt || "-"}
                    </td>
                    <td className="py-3 px-2 text-left">
                      <span className="break-all text-slate-300">
                        {item.image_path}
                      </span>
                    </td>
                    {/* <td className="py-3 px-2 whitespace-nowrap text-left">
                      {item.sort_order}
                    </td> */}
                    <td className="py-3 px-2 whitespace-nowrap text-left text-slate-300">
                      {formatDateTime(item.created_at)}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        type="button"
                        onClick={async () => {
                          const ok = window.confirm("이 로고를 삭제할까요?");
                          if (!ok) return;

                          try {
                            await deleteLogoMutation.mutateAsync({
                              id: item.id,
                              imagePath: item.image_path,
                            });
                            alert("삭제되었습니다.");
                          } catch (e) {
                            console.error(e);
                            alert("삭제에 실패했습니다.");
                          }
                        }}
                        disabled={deleteLogoMutation.isPending}
                        className="h-9 px-3 rounded-sm border border-red-400/40 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

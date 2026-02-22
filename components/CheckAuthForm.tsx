"use client";

import InputWithLabel from "@/components/InputWithLabel";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSignInAdminMutation from "@/hooks/use-sign-in-admin-mutation";
import useAdminSessionQuery from "@/hooks/use-admin-session-query";

export type FormState = {
  email: string;
  password: string;
};

const initialForm: FormState = {
  email: "",
  password: "",
};

export default function CheckAuthForm() {
  const router = useRouter();
  const signInMutation = useSignInAdminMutation();
  const adminSessionQuery = useAdminSessionQuery();

  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const isValidEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
    [form.email],
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // “제출 시도했거나 / 이메일 입력을 시작했으면” 에러 검사
  const showEmailError = submitted || emailTouched;
  const emailError =
    showEmailError && (form.email.trim() === "" || !isValidEmail);

  const passwordError = submitted && form.password.trim() === "";

  const canSubmit = useMemo(() => {
    const emailOk = form.email.trim().length > 0 && isValidEmail;
    const passwordOk = form.password.trim().length > 0;
    return emailOk && passwordOk;
  }, [form, isValidEmail]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (emailError || passwordError) return;

    signInMutation.mutate(
      {
        email: form.email,
        password: form.password,
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          //   router.replace("/admin/dashboard");
        },
        onError: (error) => {
          alert("로그인을 실패했습니다.");
        },
      },
    );
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-100">
      <InputWithLabel
        id="email"
        label="이메일 주소"
        type="email"
        placeholder="이메일 주소를 입력해주세요"
        value={form.email}
        onChange={(v) => {
          if (!emailTouched) setEmailTouched(true); // 입력 시작 순간부터 검사 ON
          update("email", v);
        }}
        error={emailError}
        errorText="이메일 주소를 확인해주세요"
      />
      <InputWithLabel
        id="password"
        label="password"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={form.password}
        onChange={(v) => update("password", v)}
        error={submitted && form.email.trim() === ""}
        errorText="비밀번호를 확인해주세요"
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-8 inline-flex w-fit items-center justify-center rounded-sm bg-[#0077ff] px-5 h-11 font-medium text-base text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
      >
        관리자 로그인하기
      </button>
    </form>
  );
}

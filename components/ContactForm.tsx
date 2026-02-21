// "use client";

// import InputWithLabel from "@/components/InputWithLabel";
// import { useMemo, useState } from "react";

// type RouteOption = "blog" | "portal" | "facebook" | "seminar" | "press" | "etc";

// const RouteList = [
//   { label: "블로그", value: "blog" },
//   { label: "포탈 검색", value: "portal" },
//   { label: "페이스북", value: "facebook" },
//   { label: "전시/세미나", value: "seminar" },
//   { label: "언론/보도자료", value: "press" },
//   { label: "기타", value: "etc" },
// ] as const;

// type FormState = {
//   route: RouteOption;
//   company: string;
//   email: string;
//   name: string;
//   tel: string;
//   content: string;
//   agree: boolean;
// };

// const initialForm: FormState = {
//   route: "blog",
//   company: "",
//   email: "",
//   name: "",
//   tel: "",
//   content: "",
//   agree: false,
// };

// export default function ContactForm() {
//   const [form, setForm] = useState<FormState>(initialForm);
//   const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
//     "idle",
//   );
//   // const [errorMsg, setErrorMsg] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   // 이메일 입력 시작 여부
//   const [emailTouched, setEmailTouched] = useState(false);

//   const isValidEmail = useMemo(
//     () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
//     [form.email],
//   );

//   const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const canSubmit = useMemo(() => {
//     const companyOk = form.company.trim().length > 0;
//     const nameOk = form.name.trim().length > 0;
//     const telOk = form.tel.trim().length > 0;
//     const contentOk = form.content.trim().length > 0;
//     const emailOk = form.email.trim().length > 0 && isValidEmail;
//     const agreeOk = form.agree;
//     return companyOk && nameOk && telOk && contentOk && emailOk && agreeOk;
//   }, [form, isValidEmail]);

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitted(true);

//     if (!canSubmit) return;

//     try {
//       setStatus("sending");

//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           route: form.route,
//           company: form.company,
//           email: form.email.trim(),
//           name: form.name,
//           tel: form.tel,
//           content: form.content,
//           agree: form.agree,
//         }),
//       });

//       if (!res.ok) throw new Error("Request failed");

//       setStatus("sent");
//       setForm(initialForm);
//       setSubmitted(false);
//       setEmailTouched(false); // 초기화
//     } catch {
//       setStatus("error");
//       alert("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
//     }
//   };

//   // “제출 시도했거나 / 이메일 입력을 시작했으면” 에러 검사
//   const showEmailError = submitted || emailTouched;
//   const emailError =
//     showEmailError && (form.email.trim() === "" || !isValidEmail);

//   return (
//     <form onSubmit={onSubmit} className="w-full lg:w-1/2">
//       <fieldset className="mt-6 flex flex-col gap-2">
//         <legend className="text-base font-semibold text-white">
//           유입 경로
//         </legend>

//         <div className="flex gap-2 flex-wrap mt-2">
//           {RouteList.map((opt) => (
//             <label
//               key={opt.value}
//               className={`flex cursor-pointer items-center justify-center rounded-sm border border-[0.7px] px-4 py-2 transition-all duration-200 text-white ${
//                 form.route === opt.value ? "bg-[#0077ff]" : "border-white"
//               }`}
//             >
//               <input
//                 type="radio"
//                 name="route"
//                 value={opt.value}
//                 checked={form.route === opt.value}
//                 onChange={() => update("route", opt.value)}
//                 className="sr-only"
//               />
//               <span className="text-sm font-medium">{opt.label}</span>
//             </label>
//           ))}
//         </div>
//       </fieldset>

//       <InputWithLabel
//         id="company"
//         label="회사명"
//         placeholder="회사명을 입력해주세요"
//         value={form.company}
//         onChange={(v) => update("company", v)}
//         error={submitted && form.company.trim() === ""}
//         errorText="회사명을 입력해주세요"
//       />

//       <InputWithLabel
//         id="email"
//         label="이메일 주소"
//         type="email"
//         placeholder="이메일 주소를 입력해주세요"
//         value={form.email}
//         onChange={(v) => {
//           if (!emailTouched) setEmailTouched(true); // 입력 시작 순간부터 검사 ON
//           update("email", v);
//         }}
//         error={emailError}
//         errorText="유효한 이메일 주소를 입력해주세요"
//       />

//       <InputWithLabel
//         id="name"
//         label="성함"
//         placeholder="성함을 입력해주세요"
//         value={form.name}
//         onChange={(v) => update("name", v)}
//         error={submitted && form.name.trim() === ""}
//         errorText="이름을 입력해주세요"
//       />

//       <InputWithLabel
//         id="tel"
//         label="연락처"
//         type="tel"
//         placeholder="연락처를 입력해주세요"
//         value={form.tel}
//         onChange={(v) => update("tel", v.replace(/[^\d]/g, ""))}
//         error={submitted && form.tel.trim() === ""}
//         errorText="연락처를 입력해주세요"
//       />

//       <InputWithLabel
//         id="content"
//         label="문의 내용"
//         as="textarea"
//         rows={6}
//         placeholder="궁금한 점이 있으시면 여기에 남겨주세요"
//         value={form.content}
//         onChange={(v) => update("content", v)}
//         error={submitted && form.content.trim() === ""}
//         errorText="문의 내용을 입력해주세요"
//       />

//       <label
//         htmlFor="agree"
//         className="flex cursor-pointer items-center gap-3 text-white mt-4"
//       >
//         <input
//           id="agree"
//           type="checkbox"
//           checked={form.agree}
//           onChange={(e) => update("agree", e.target.checked)}
//           className={`
//             h-4 w-4 rounded border bg-black/20
//             ${submitted && !form.agree ? "border-red-400/60" : "border-white/20"}
//             accent-[#0077ff]
//           `}
//         />
//         <span className="text-sm leading-[1.5]">
//           개인정보 수집 및 이용에 동의합니다.
//         </span>
//       </label>

//       <button
//         type="submit"
//         disabled={status === "sending" || !canSubmit}
//         className="mt-8 inline-flex w-fit items-center justify-center rounded-sm bg-[#0077ff] px-5 h-11 font-medium text-base text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
//       >
//         {status === "sending" ? "전송 중" : "문의하기"}
//       </button>
//     </form>
//   );
// }

// 이메일로 보내기

"use client";

import InputWithLabel from "@/components/InputWithLabel";
import { useMemo, useRef, useState } from "react";

type RouteOption = "blog" | "portal" | "facebook" | "seminar" | "press" | "etc";

const RouteList = [
  { label: "블로그", value: "blog" },
  { label: "포탈 검색", value: "portal" },
  { label: "페이스북", value: "facebook" },
  { label: "전시/세미나", value: "seminar" },
  { label: "언론/보도자료", value: "press" },
  { label: "기타", value: "etc" },
] as const;

type FormState = {
  route: RouteOption;
  company: string;
  email: string;
  name: string;
  tel: string;
  content: string;
  agree: boolean;
};

const initialForm: FormState = {
  route: "blog",
  company: "",
  email: "",
  name: "",
  tel: "",
  content: "",
  agree: false,
};

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [submitted, setSubmitted] = useState(false);

  // 이메일 입력 시작 여부
  const [emailTouched, setEmailTouched] = useState(false);

  const isValidEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
    [form.email],
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = useMemo(() => {
    const companyOk = form.company.trim().length > 0;
    const nameOk = form.name.trim().length > 0;
    const telOk = form.tel.trim().length > 0;
    const contentOk = form.content.trim().length > 0;
    const emailOk = form.email.trim().length > 0 && isValidEmail;
    const agreeOk = form.agree;
    return companyOk && nameOk && telOk && contentOk && emailOk && agreeOk;
  }, [form, isValidEmail]);

  // “제출 시도했거나 / 이메일 입력을 시작했으면” 에러 검사
  const showEmailError = submitted || emailTouched;
  const emailError =
    showEmailError && (form.email.trim() === "" || !isValidEmail);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!canSubmit) return;

    setStatus("sending");
    console.log(formRef.current);

    // FormSubmit로 네이티브 submit (action으로 POST)
    formRef.current?.submit();
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="w-full lg:w-1/2"
      action="https://formsubmit.co/shnam@onycom.com"
      method="POST"
    >
      {/* FormSubmit 옵션들 */}
      <input
        type="hidden"
        name="_subject"
        value={`[문의] ${form.company} / ${form.name}`}
      />
      <input type="hidden" name="_captcha" value="true" />
      {/* 전송 후 이동할 페이지 (본인 도메인으로) */}
      <input
        type="hidden"
        name="_next"
        value="https://localhost:3000/contact/thanks"
      />
      {/* 스팸봇 방지(허니팟) */}
      {/* <input type="hidden" name="_captcha" value="false" />
      <input type="text" name="_honey" className="hidden" /> */}

      {/* 실제 데이터도 FormSubmit이 읽을 수 있게 name 달기 */}
      <input type="hidden" name="route" value={form.route} />
      <input type="hidden" name="company" value={form.company} />
      <input type="hidden" name="email" value={form.email} />
      <input type="hidden" name="name" value={form.name} />
      <input type="hidden" name="tel" value={form.tel} />
      <input type="hidden" name="content" value={form.content} />
      {/* <input type="hidden" name="agree" value={form.agree ? "yes" : "no"} /> */}

      <fieldset className="mt-6 flex flex-col gap-2">
        <legend className="text-base font-semibold text-white">
          유입 경로
        </legend>

        <div className="flex gap-2 flex-wrap mt-2">
          {RouteList.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center justify-center rounded-sm border border-[0.7px] px-4 py-2 transition-all duration-200 text-white ${
                form.route === opt.value ? "bg-[#0077ff]" : "border-white"
              }`}
            >
              <input
                type="radio"
                name="route"
                value={opt.value}
                checked={form.route === opt.value}
                onChange={() => update("route", opt.value)}
                className="sr-only"
              />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <InputWithLabel
        id="company"
        label="회사명"
        placeholder="회사명을 입력해주세요"
        value={form.company}
        onChange={(v) => update("company", v)}
        error={submitted && form.company.trim() === ""}
        errorText="회사명을 입력해주세요"
      />

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
        errorText="유효한 이메일 주소를 입력해주세요"
      />

      <InputWithLabel
        id="name"
        label="성함"
        placeholder="성함을 입력해주세요"
        value={form.name}
        onChange={(v) => update("name", v)}
        error={submitted && form.name.trim() === ""}
        errorText="이름을 입력해주세요"
      />

      <InputWithLabel
        id="tel"
        label="연락처"
        type="tel"
        placeholder="연락처를 입력해주세요"
        value={form.tel}
        onChange={(v) => update("tel", v.replace(/[^\d]/g, ""))}
        error={submitted && form.tel.trim() === ""}
        errorText="연락처를 입력해주세요"
      />

      <InputWithLabel
        id="content"
        label="문의 내용"
        as="textarea"
        rows={6}
        placeholder="궁금한 점이 있으시면 여기에 남겨주세요"
        value={form.content}
        onChange={(v) => update("content", v)}
        error={submitted && form.content.trim() === ""}
        errorText="문의 내용을 입력해주세요"
      />

      <label
        htmlFor="agree"
        className="flex cursor-pointer items-center gap-3 text-white mt-4"
      >
        <input
          id="agree"
          type="checkbox"
          checked={form.agree}
          onChange={(e) => update("agree", e.target.checked)}
          className={`
            h-4 w-4 rounded border bg-black/20
            ${submitted && !form.agree ? "border-red-400/60" : "border-white/20"}
            accent-[#0077ff]
          `}
        />
        <span className="text-sm leading-[1.5]">
          개인정보 수집 및 이용에 동의합니다.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "sending" || !canSubmit}
        className="mt-8 inline-flex w-fit items-center justify-center rounded-sm bg-[#0077ff] px-5 h-11 font-medium text-base text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
      >
        {status === "sending" ? "전송 중" : "문의하기"}
      </button>
    </form>
  );
}

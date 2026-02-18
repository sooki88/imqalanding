"use client";

import React from "react";

type CommonProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorText?: string;
  className?: string;
};

type InputProps = CommonProps & {
  as?: "input";
  type?: "text" | "email" | "tel" | "password";
};

type TextareaProps = CommonProps & {
  as: "textarea";
  rows?: number;
};

type Props = InputProps | TextareaProps;

export default function InputWithLabel(props: Props) {
  const {
    id,
    label,
    placeholder,
    value,
    onChange,
    error,
    errorText,
    className = "",
  } = props;

  const isTextarea = props.as === "textarea";
  const type = !isTextarea ? (props.type ?? "text") : undefined;

  const getInputMode = () => {
    if (type === "email") return "email";
    if (type === "tel") return "tel";
    return "text";
  };

  const baseClass = `
    mt-[2px] w-full border-b py-2 text-white outline-none transition-all text-base
    ${error ? "border-red-400/50 focus:border-red-400" : "border-white focus:border-main-skyblue/60 focus:border-[#0077ff]"}
  `;

  return (
    <div className={`mt-6 ${className}`}>
      <label
        htmlFor={id}
        className="block flex gap-[2px] text-base font-semibold text-white"
      >
        {label}
        <div className="rounded-full bg-[#0077ff] size-[6px]"></div>
      </label>

      {isTextarea ? (
        <textarea
          id={id}
          autoComplete={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={(props as TextareaProps).rows ?? 5}
          className={`${baseClass} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type === "tel" ? "text" : type}
          inputMode={getInputMode()}
          autoComplete={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      )}

      {error && errorText && (
        <p className="mt-2 text-xs text-red-300">{errorText}</p>
      )}
    </div>
  );
}

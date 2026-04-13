export default function InsuranceLogo() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-6 w-6"
        fill="none"
      >
        <circle cx="16" cy="16" r="14" fill="#0CB8B6" opacity="0.15" />
        <path
          d="M10 22 C10 16, 16 10, 22 10"
          stroke="#0CB8B6"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M10 22 L16 16 L22 10"
          stroke="#0CB8B6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

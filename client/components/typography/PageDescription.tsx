import type React from 'react';

type PageDescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageDescription({
  children,
  className = '',
}: PageDescriptionProps) {
  return (
    <p
      className={`page-desc-text whitespace-pre-wrap text-[#4A5565] ${className}`}
    >
      {children}
    </p>
  );
}

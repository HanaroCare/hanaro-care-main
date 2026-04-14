import type React from 'react';

type PageHeadingProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageHeading({
  children,
  className = '',
}: PageHeadingProps) {
  return (
    <h1
      className={`page-center-text whitespace-pre-wrap text-black ${className}`}
    >
      {children}
    </h1>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

// 폰트 설정
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Hana Care On",
	description: "Hana Care On",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html
			lang="ko-KR"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
              (function() {
                try {
                  const level = localStorage.getItem('font-level') || '2';
                  document.documentElement.setAttribute('data-font-level', level);
                } catch (e) {}
              })();
            `,
					}}
				/>
			</head>
			<body className="flex min-h-full flex-col bg-zinc-50 font-sans">
				<div className="relative mx-auto w-full max-w-[375px] min-h-full bg-white shadow-sm">
					{children}
				</div>
			</body>
		</html>
	);
}

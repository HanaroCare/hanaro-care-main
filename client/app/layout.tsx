import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

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
		<html lang="ko" className="h-full antialiased">
			<body className="flex min-h-full flex-col bg-zinc-50 font-sans">
				<div className="relative mx-auto w-full max-w-[375px]">{children}</div>
			</body>
		</html>
	);
}

import Header from "../components/letter/Header";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="px-6.25">{children}</main>
    </>
  );
}

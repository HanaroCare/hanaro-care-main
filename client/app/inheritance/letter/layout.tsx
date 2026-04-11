import Header from "../components/letter/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="px-[25px]">{children}</main>
    </>
  );
}

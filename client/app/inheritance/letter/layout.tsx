import Header from "../components/letter/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="px-6.25">{children}</main>
    </>
  );
}

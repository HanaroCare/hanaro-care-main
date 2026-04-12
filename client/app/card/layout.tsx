export default function CardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-layout">
        <main className="app-main no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
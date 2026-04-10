type TrustStepLayoutProps = {
  children: React.ReactNode;
  footer: React.ReactNode;
};

export default function TrustStepLayout({ children, footer }: TrustStepLayoutProps) {
  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <main className="app-main no-scrollbar bg-white">{children}</main>
        {footer}
      </div>
    </div>
  );
}

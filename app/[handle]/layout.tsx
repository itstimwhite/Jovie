import DesktopQrOverlay from '@/components/organisms/DesktopQrOverlay';

export default function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { handle: string };
}) {
  return (
    <>
      {children}
      <DesktopQrOverlay handle={params.handle} />
    </>
  );
}

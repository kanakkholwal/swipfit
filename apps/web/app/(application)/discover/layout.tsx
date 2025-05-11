import { GeometricWrapper } from "@/components/animated/shape-landing-hero";

export default function SwipeRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GeometricWrapper className="fixed inset-0 top-20" wrapperParentClassName="p-0">{children}</GeometricWrapper>;
}

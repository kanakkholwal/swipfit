import { GeometricWrapper } from "@/components/animated/shape-landing-hero";

export default function SwipeRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GeometricWrapper>{children}</GeometricWrapper>;
}

// app/dashboard/layout.tsx

import { getSession } from "~/lib/auth-server";

import EmptyArea from "@/components/utils/empty-area";

export default async function DashboardLayout({
  children,
  influencer,
  customer,
  brand,
}: {
  children: React.ReactNode;
  influencer: React.ReactNode;
  customer: React.ReactNode;
  brand: React.ReactNode;
}) {
  const session = await getSession();

  // Determine the user's role
  const userRole = session?.user?.role;

  // Conditional rendering based on role
  let content: React.ReactNode;
  switch (userRole) {
    case "influencer":
      content = influencer;
      break;
    case "customer":
      content = customer;
      break;
    case "brand":
      content = brand;
      break;
    case "admin":
      content = brand;
      break;
    default:
      // If the user has no role, show an empty area
      content = (
        <EmptyArea
          title="No role assigned"
          description="Please contact the support to get a role assigned."
        />
      );
  }
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 bg-background">
      <aside className="sidebar">{/* Sidebar content */}</aside>
      <main className="space-y-8 mb-8 max-w-6xl mx-auto">
        {children}
        {content}
      </main>
    </div>
  );
}

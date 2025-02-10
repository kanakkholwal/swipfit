// app/dashboard/layout.tsx

import { getSession } from "~/lib/auth-server";

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
        case 'influencer':
            content = influencer;
            break;
        case 'customer':
            content = customer;
            break;
        case 'brand':
            content = brand;
            break;
        default:
            content = <div>Access Denied</div>; // Fallback for unauthorized access
    }
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-muted/50 p-4 md:p-8">
            <aside className="sidebar">
                {/* Sidebar content */}
            </aside>
            <main className="bg-background rounded-lg p-6 mb-8 max-w-6xl mx-auto">
                {content}
            </main>
        </div>
    );
}

// app/dashboard/page.tsx

// import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return <div className="rounded-lg p-6 py-10">
    <div className="flex flex-col items-center gap-4 text-center">
      {/* <Badge variant="outline">
        Your Dashboard
      </Badge> */}
      <h1 className="max-w-2xl text-3xl font-semibold md:text-4xl text-gray-800 dark:text-gray-100">
        Your Dashboard
      </h1>
      <p className="text-muted-foreground">
        Welcome to your dashboard! Here you can manage your account, view your orders and much more.
      </p>
    </div>
  </div>;
}

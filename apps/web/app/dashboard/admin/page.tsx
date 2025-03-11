import { StatsCard } from "@/components/application/stats-card";
import { RouterCard } from "@/components/extended/router-card";
import { ResponsiveContainer } from "@/components/utils/container";
import { admin_routes } from "@/data/dashboard";
import { CircleDashed, TrendingDown, TrendingUp } from "lucide-react";
import { FaGenderless } from "react-icons/fa";
import { TbUsersGroup } from "react-icons/tb";
import {
  getActiveSessions,
  getUsersByGender,
  getUsersByRole,
  users_CountAndGrowth,
} from "~/actions/dashboard.admin";

export default async function AdminDashboard() {
  const {
    total: totalUsers,
    growthPercent: userGrowth,
    growth,
    trend: userTrend,
  } = await users_CountAndGrowth("last_week");

  const usersByGender = await getUsersByGender();
  const usersByRole = await getUsersByRole();
  const activeSessions = await getActiveSessions();

  return (
    <main className="@container mx-auto max-w-screen-2xl w-full min-h-[50vh] h-full py-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-4">Dashboard</h2>
        <p className="text-lg text-muted-foreground">
          Welcome to the admin dashboard. Here you can view and manage all the
          users and their activities.
        </p>
      </div>
      <ResponsiveContainer className="max-w-screen-2xl">
        {/* Total Users Card */}

        <StatsCard
          title="Total Users"
          Icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <title>Users</title>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        >
          <h4 className="text-3xl font-bold text-primary">
            {totalUsers}
            <span className="text-sm text-muted-foreground">
              /{userTrend * growth}
            </span>
          </h4>
          <p className="text-xs text-muted-foreground">
            <span
              className={`${
                userTrend === 1
                  ? "text-green-500"
                  : userTrend === -1
                    ? "text-red-500"
                    : "text-primary/80"
              } text-base`}
            >
              {userTrend === 1 ? (
                <TrendingUp className="inline-block mr-2 size-4" />
              ) : userTrend === -1 ? (
                <TrendingDown className="inline-block mr-2 size-4" />
              ) : (
                <CircleDashed className="inline-block mr-2 size-4" />
              )}
              {userGrowth?.toFixed(2)}%
            </span>{" "}
            from last month
          </p>
        </StatsCard>

        {/* Active Sessions Card */}
        <StatsCard
          title="Active Sessions"
          Icon={<TbUsersGroup className="inline-block mr-2 size-4" />}
        >
          <h4 className="text-3xl font-bold text-primary">{activeSessions}</h4>
          <p className="text-xs text-muted-foreground">
            Currently active sessions
          </p>
        </StatsCard>

        {/* Users by Gender Card */}
        <StatsCard
          title="Users by Gender"
          Icon={<FaGenderless className="inline-block mr-2 size-4" />}
        >
          <ul className="text-sm text-muted-foreground">
            {usersByGender.map(({ gender, count }) => (
              <li key={gender}>
                {gender}: <span className="font-bold">{count}</span>
              </li>
            ))}
          </ul>
        </StatsCard>

        {/* Users by Role Card */}
        <StatsCard
          title="Users by Role"
          Icon={<CircleDashed className="inline-block mr-2 size-4" />}
        >
          <ul className="text-sm text-muted-foreground">
            {usersByRole.map(({ role, count }) => (
              <li key={role}>
                {role}: <span className="font-bold">{count}</span>
              </li>
            ))}
          </ul>
        </StatsCard>
      </ResponsiveContainer>

      <div>
        <h3 className="text-xl font-semibold text-primary mb-4">
          Quick manage
        </h3>

        <ResponsiveContainer className="max-w-screen-2xl">
          {Array.isArray(admin_routes?.dashboard)
            ? null
            : admin_routes?.dashboard?.items?.map((route) => {
                return (
                  <RouterCard
                    key={route.title}
                    href={route.path}
                    title={route.title}
                    description={route.description}
                    Icon={route.Icon}
                  />
                );
              })}
        </ResponsiveContainer>
      </div>
    </main>
  );
}

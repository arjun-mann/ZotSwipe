"use client";

import SignOutButton from "@/components/SignOutButton/SignOutButton";
import useIsSignedIn from "@/hooks/useIsSignedIn";

export default function Dashboard() {
  const { user, loading } = useIsSignedIn();

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Provider Dashboard</h1>
      <div className="text-lg">Welcome, {user.email}!</div>
      <SignOutButton />
    </div>
  );
}

"use client";

import { useAuthStore } from "@/store/auth.store";
import withAuth from "@/components/auth/withAuth";

function DashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="p-4">
      <h1 className="text-2xl">Welcome, {user?.name}</h1>
      <p>This is a protected dashboard page.</p>
      <button onClick={logout} className="mt-4 p-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  );
}

export default withAuth(DashboardPage);
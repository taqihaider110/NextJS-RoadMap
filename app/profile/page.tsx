"use client";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/users/me");
      setUser(response.data.user);
    } catch (error: any) {
      console.error("Failed to fetch user details:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-black">Profile Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded border p-4">
              <p className="mb-2 text-sm font-medium text-gray-500">User ID</p>
              <p className="font-mono text-sm">{user?.id}</p>
            </div>

            <div className="rounded border p-4">
              <p className="mb-2 text-sm font-medium text-gray-500">Account Status</p>
              <p className="font-semibold">
                {user?.isVerified ? (
                  <span className="text-green-600">✓ Verified</span>
                ) : (
                  <span className="text-yellow-600">⚠ Not Verified</span>
                )}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="mb-2 text-sm font-medium text-gray-500">Role</p>
              <p className="font-semibold">
                {user?.isAdmin ? "Administrator" : "User"}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="mb-2 text-sm font-medium text-gray-500">Member Since</p>
              <p className="font-semibold">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
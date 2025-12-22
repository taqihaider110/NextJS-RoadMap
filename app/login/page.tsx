"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {
    try {
      console.log(user);
      await axios.post("/api/login", user);
      router.push("/profile");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={onLogin}
        className="w-full max-w-md rounded-lg border p-6 shadow"
      >
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>

        {/* Email */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
            placeholder="Enter your email"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            value={user.password}
            onChange={(e) =>
              setUser({ ...user, password: e.target.value })
            }
            placeholder="Enter your password"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded bg-black px-4 py-2 text-white hover:opacity-90"
        >
          Login
        </button>

        {/* Login link */}
        <p className="mt-4 text-center text-sm">
          Forgot Password ?{" "}
          <Link href="/forgot-password" className="underline">
            Reset Password
          </Link>
        </p>
      </form>
    </div>
  );
}

"use client";
import React, {useEffect} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();

  const [user, setUser] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    try {
      setLoading(true);
      console.log(user);
      const response = await axios.post("/api/users/signup", user);

      console.log("Signup success:", response.data);
    //   router.push("/login");
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error);
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
        setButtonDisabled(false);
    } else {
        setButtonDisabled(true);
    }
    }, [user]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={onSignUp}
        className="w-full max-w-md rounded-lg border p-6 shadow"
      >
        <h1 className="mb-6 text-2xl font-bold text-center">Sign Up</h1>

        {/* Username */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            value={user.username}
            onChange={(e) =>
              setUser({ ...user, username: e.target.value })
            }
            placeholder="Enter your username"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            required
          />
        </div>

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
          disabled={buttonDisabled || loading}
          className="w-full rounded bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Login link */}
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

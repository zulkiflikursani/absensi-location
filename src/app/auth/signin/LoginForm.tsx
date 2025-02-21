"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

// Loading component for Suspense

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null); // Use state for error

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    if (searchParams) {
      const errorParam = searchParams.get("error");
      setError(errorParam);
    }
  }, [searchParams]);

  if (session) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false, // Prevent automatic redirect.
      username: username,
      password: password,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error); // Set the error from the signIn result.
      // Handle error (optional:  show a more specific message)
      if (result.error === "CredentialsSignin") {
        //You could set a user-friendly message specifically for credentials errors
      }
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 ">
      <div className="bg-white bg-opacity-80 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        {/* Display error message */}
        {error && (
          <div
            className=" border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline">
              {error === "CredentialsSignin"
                ? "Invalid username or password."
                : "An error occurred."}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";
import { signOut } from "next-auth/react";
import React from "react";

function Logout() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex bg-red-400 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white"
    >
      Logout
    </button>
  );
}

export default Logout;

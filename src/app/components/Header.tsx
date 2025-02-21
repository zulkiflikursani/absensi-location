"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
// import Image from "next/image";

function Header() {
  const router = useRouter();
  const pathName = usePathname();
  const isHomePage = pathName === "/home";
  const isIndex = pathName === "/";
  return (
    <div className="bg-blue-400 w-screen flex h-20 items-center">
      {!isHomePage &&
        !isIndex && ( // Tampilkan tombol kembali HANYA jika BUKAN di halaman utama
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3.0"
            stroke="currentColor"
            className="size-6  text-white mx-2 fixed"
            onClick={() => router.back()}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        )}
      <div className="flex w-full justify-center">
        <Image src="/logo.png" alt="Logo" width={250} height={200} />
      </div>
    </div>
  );
}

export default Header;

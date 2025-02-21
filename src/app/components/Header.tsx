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
    <div className="bg-blue-500 w-full flex h-20 items-center fixed top-0 left-0 z-50">
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
        <Image src="/logo.png" alt="Logo" width={200} height={100} />
      </div>
    </div>
  );
}

export default Header;

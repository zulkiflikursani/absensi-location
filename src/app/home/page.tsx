// "use client";
import Link from "next/link";
import CardProfile from "../components/CardProfile";
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/options";
import Logout from "../components/Logout";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex flex-col flex-grow  font-[family-name:var(--font-geist-sans)]">
      <main className="flex-grow w-full  p-5  items-start bg-gray-100 ">
        <CardProfile
          nama={session?.user.data.username}
          email={session?.user.data.email.toString()}
        />
        <div className="w-full h-full grid grid-cols-2 gap-2">
          <Link
            href="/home/absen"
            className="flex bg-blue-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white"
          >
            Absen
          </Link>
          <div className="flex bg-orange-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white">
            Setting
          </div>
          <Link
            href="/home/admin"
            className="flex bg-orange-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white"
          >
            Laporan
          </Link>
          <Logout />
          {/* <button
            type="button"
            onClick={() => signOut()}
            className="flex bg-green-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white"
          >
            Logout
          </button> */}

          <div className="flex gap-4 items-center flex-col sm:flex-row"></div>
        </div>
      </main>
    </div>
  );
}

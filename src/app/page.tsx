import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import Logout from "./components/Logout";
import Hero from "./components/Hero";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col flex-grow  font-[family-name:var(--font-geist-sans)]">
      <main className="flex-grow w-full  p-5  items-start ">
        <Hero />
        <div className="w-full h-full grid grid-cols-2 gap-2">
          <Link
            href="/home"
            className="flex bg-blue-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white"
          >
            {session?.user.data ? "home" : "login"}
          </Link>
          {session?.user.data ? (
            <Logout />
          ) : (
            <div className="flex bg-green-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white">
              Registrasi
            </div>
          )}

          <div className="flex gap-4 items-center flex-col sm:flex-row"></div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import CardProfile from "../components/CardProfile";
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/options";
import Logout from "../components/Logout";
import CekAbsesniHariini from "../components/CekAbsesniHariini";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex flex-col flex-grow  font-[family-name:var(--font-geist-sans)]">
      <main className="flex-grow w-full  p-5  items-start  ">
        <CardProfile
          nama={session?.user.data.full_name}
          email={session?.user.data.email.toString()}
        />
        <div className="mx-2 ">
          {session?.user.data.id && (
            <CekAbsesniHariini idUser={session?.user.data.id} />
          )}
        </div>
        <div className="w-full h-full grid grid-cols-2 gap-2">
          <Link
            href="/home/absen"
            className="flex bg-blue-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white"
          >
            Absen
          </Link>

          {/* <div className="flex bg-orange-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white">
            Setting
          </div> */}
          <Link
            href="/home/admin"
            className="flex bg-orange-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white"
          >
            Laporan
          </Link>
          <Link
            href="/home/aktivitas"
            className="flex bg-orange-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white"
          >
            Aktivitas
          </Link>

          {session?.user.data.level === "1" && (
            <>
              <Link
                href="/home/laporanadmin"
                className="flex bg-indigo-500 h-32 rounded-lg p-2 items-center text-center justify-center text-2xl text-white"
              >
                Laporan Admin
              </Link>
              <Link
                href="/home/admin/adminmasuk"
                className="flex bg-green-500 h-32 rounded-lg p-2 items-center text-center justify-center text-2xl text-white"
              >
                Edit Data Masuk
              </Link>
              <Link
                href="/home/admin/adminkeluar"
                className="flex bg-orange-500 h-32 rounded-lg p-2 items-center text-center justify-center text-2xl text-white"
              >
                Edit Data Keluar
              </Link>
              <Link
                href="/auth/register"
                className="flex bg-orange-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white"
              >
                Tambah User
              </Link>
            </>
          )}
          <Logout />
          <div className="flex gap-4 items-center flex-col sm:flex-row"></div>
        </div>
      </main>
    </div>
  );
}

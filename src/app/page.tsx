import Link from "next/link";
import CardProfile from "./components/CardProfile";

export default function Home() {
  return (
    <div className="flex flex-col flex-grow  font-[family-name:var(--font-geist-sans)]">
      <main className="flex-grow w-full  p-5  items-start bg-gray-100 ">
        <CardProfile />
        <div className="w-full h-full grid grid-cols-2 gap-2">
          <Link
            href="/home"
            className="flex bg-blue-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white"
          >
            Login
          </Link>
          <div className="flex bg-green-500 h-32 rounded-lg p-2 items-center justify-center text-2xl text-white">
            Registrasi
          </div>

          <div className="flex gap-4 items-center flex-col sm:flex-row"></div>
        </div>
      </main>
    </div>
  );
}

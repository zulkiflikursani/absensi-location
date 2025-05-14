"use client"; // Karena kita menggunakan useState dan event handler

import { useSession } from "next-auth/react";
import { useState, FormEvent, ChangeEvent } from "react";
interface ApiErrorResponse {
  message: string;
  error?: string; // error detail opsional untuk development
}

export default function TambahAktivitasPage() {
  const [kegiatan, setKegiatan] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const session = useSession();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    if (!kegiatan) {
      setError("Kegiatan harus diisi.");
      setIsLoading(false);
      return;
    }
    const idUser: number = parseInt(
      (session.data?.user.data.id as string) || "0",
      10
    ); // Menggunakan session.data?.user.id

    try {
      const response = await fetch("/api/aktivitas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Tipe untuk body payload
        body: JSON.stringify({ kegiatan, idUser } as {
          kegiatan: string;
          idUser: number;
        }),
      });

      // Kita perlu membaca response body untuk mendapatkan pesan error jika ada
      const data = await response.json();

      console.log(data);
      if (!response.ok) {
        // Jika response tidak ok, data seharusnya bertipe ApiErrorResponse
        const errorMessage =
          (data as ApiErrorResponse).message || "Gagal menyimpan aktivitas";
        throw new Error(errorMessage);
      }

      // Jika response ok, data seharusnya bertipe ApiSuccessResponse
      const newAktivitas = data;
      setSuccessMessage(
        `Aktivitas "${newAktivitas.kegiatan}" berhasil disimpan!`
      );
      setKegiatan(""); // Kosongkan form setelah berhasil
      // Opsional: redirect atau lakukan aksi lain
      // router.push('/daftar-aktivitas'); // Contoh redirect
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setKegiatan(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Tambah Aktivitas Baru
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="kegiatan"
                className="block text-sm font-medium text-gray-700"
              >
                Deskripsi Kegiatan
              </label>
              <div className="mt-1">
                <textarea
                  id="kegiatan"
                  name="kegiatan"
                  rows={4}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={kegiatan}
                  onChange={handleInputChange}
                  placeholder="Contoh: Mengerjakan laporan bulanan"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Waktu aktivitas akan dicatat secara otomatis saat disimpan.
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                {isLoading ? "Menyimpan..." : "Simpan Aktivitas"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

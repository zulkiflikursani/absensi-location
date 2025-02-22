"use client";
import moment from "moment-timezone";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface DataType {
  idUser: string;
  username: string;
  full_name: string;
  tanggal: number;
  jam_masuk: Date;
  jam_pulang: Date;
  waktu_masuk: Date;
  waktu_keluar: Date;
  terlambat: number;
  selisih_menit: number;
}

interface BodyType {
  bulan: string;
}

export default function LaporanAbsensi() {
  const { status } = useSession();
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [getBulan, setBulan] = useState<BodyType>({ bulan: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (getBulan.bulan !== "") {
        try {
          setLoading(true);
          const getData = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/getdataAdmin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(getBulan),
            }
          );
          const result = await getData.json();
          setData(result);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [getBulan]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Anda belum login.</div>;

  // Kelompokkan data berdasarkan idUser
  const groupedData = Array.isArray(data)
    ? data.reduce((acc, item) => {
        if (!item?.idUser) return acc; // Hindari error jika idUser tidak ada
        if (!acc[item.idUser]) acc[item.idUser] = [];
        acc[item.idUser].push(item);
        return acc;
      }, {} as Record<string, DataType[]>)
    : {};

  console.log("groupeddata", groupedData);

  return (
    <div className="min-h-screen mt-5 flex-col mx-2 text-[10px]">
      {/* Pilihan Bulan */}
      <div className="mb-4 bg-white mt-2 p-1">
        <label>Pilih Bulan: </label>
        <select
          onChange={(e) => setBulan({ bulan: e.target.value })}
          className="border p-1"
        >
          <option value="">Pilih Bulan</option>
          <option value="2025-01-01">Januari</option>
          <option value="2025-02-01">Februari</option>
          <option value="2025-03-01">Maret</option>
          <option value="2025-04-01">April</option>
          <option value="2025-05-01">Mei</option>
          <option value="2025-06-01">Juni</option>
          <option value="2025-07-01">Juli</option>
          <option value="2025-08-01">Agustus</option>
          <option value="2025-09-01">September</option>
          <option value="2025-10-01">Oktober</option>
          <option value="2025-11-01">November</option>
          <option value="2025-12-01">Desember</option>
        </select>
      </div>

      {/* Tombol Print */}
      <div className="mb-4">
        <button
          disabled={loading}
          onClick={() => window.print()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded print:hidden"
        >
          Print
        </button>
      </div>

      {/* Tampilkan data berdasarkan user */}
      {loading && <div className="text-center">Mengambil data...</div>}
      {Object.keys(groupedData).length > 0
        ? Object.entries(groupedData).map(([userId, userData]) => (
            <div key={userId} className="mb-8 bg-white">
              {/* Identitas User */}
              <div className="mb-2 p-2">
                <p>
                  <strong>ID:</strong> {userData[0].username}
                </p>
                <p>
                  <strong>Nama:</strong> {userData[0].full_name}
                </p>
              </div>

              {/* Tabel Absensi */}
              <table className="w-full border-collapse border border-gray-300 mt-2 bg-gray-50">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Tanggal</th>
                    <th className="border border-gray-300 p-2">Jam Masuk</th>
                    <th className="border border-gray-300 p-2">Jam Pulang</th>
                    <th className="border border-gray-300 p-2">Scan Masuk</th>
                    <th className="border border-gray-300 p-2">Scan Keluar</th>
                    <th className="border border-gray-300 p-2">Terlambat</th>
                    <th className="border border-gray-300 p-2">Jam Kerja</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((data, i) => (
                    <tr key={i}>
                      <td className="border border-gray-300 p-2">
                        {moment(data.tanggal).format("DD-MM-yyyy")}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {moment(data.jam_masuk).format("HH:mm")}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {moment(data.jam_pulang).format("HH:mm")}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.waktu_masuk && moment(data.waktu_masuk).isValid()
                          ? moment(data.waktu_masuk).format("HH:mm")
                          : "-"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.waktu_keluar &&
                        moment(data.waktu_keluar).isValid()
                          ? moment(data.waktu_keluar).format("HH:mm")
                          : "-"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.terlambat === null || data.terlambat < 0
                          ? "0"
                          : data.terlambat}{" "}
                        menit
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.selisih_menit === null ? "0" : data.selisih_menit}{" "}
                        menit
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        : !loading && <div className="text-center">Tidak ada data.</div>}
    </div>
  );
}

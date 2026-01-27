"use client";
import moment from "moment-timezone";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
interface DataType {
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
  idUser: number;
  bagian: string;
}
export default function LaporanAbsensi() {
  // const session = useSession();
  const { data: sessionData, status } = useSession(); // Destructure status
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);

  const [getBulan, setBulan] = useState<BodyType>({
    bulan: "",
    idUser: 0,
    bagian: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (getBulan.idUser !== 0 && getBulan.bulan !== "") {
        try {
          setLoading(true);
          const getData = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/getdata`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(getBulan),
            },
          );
          const data = await getData.json();
          console.log(data);
          setData(data);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [getBulan]);

  useEffect(() => {
    if (
      sessionData?.user?.data?.id &&
      parseFloat(sessionData.user.data.id) !== getBulan.idUser
    ) {
      setBulan((prevBulan) => ({
        ...prevBulan,
        idUser: parseFloat(sessionData.user.data.id),
      }));
    }
  }, [sessionData?.user?.data?.id, getBulan.idUser]);
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Anda belum login.</div>;
  }

  const startYear = 2025;
  const endYear = 2035;
  const months = [
    "januari",
    "februari",
    "maret",
    "april",
    "mei",
    "juni",
    "juli",
    "agustus",
    "september",
    "oktober",
    "november",
    "desember",
  ];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  const defaultValue = `${currentYear}-${currentMonth}-01`;

  // Membuat array tahun dari 2025 sampai 2035
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );
  return (
    <div className=" min-h-screen flex-col mx-2 text-[10px]">
      <div className="w-full grid grid-cols-2 my-2 bg-gray-100">
        <div className="col-span-2 ">
          <table className="w-full ">
            <tbody>
              <tr>
                <td>No ID</td>
                <td>:</td>
                <td>{sessionData?.user.data.username}</td>
              </tr>
              <tr>
                <td>Nama</td>
                <td>:</td>
                <td>{sessionData?.user.data.full_name}</td>
              </tr>
              <tr>
                <td>Bulan</td>
                <td>:</td>
                <td>
                  <select
                    defaultValue={defaultValue}
                    onChange={(e) =>
                      setBulan({ ...getBulan, bulan: e.target.value })
                    }
                  >
                    {years.flatMap((year) =>
                      months.map((monthName, index) => {
                        const monthValue = String(index + 1).padStart(2, "0");
                        const fullValue = `${year}-${monthValue}-01`;

                        return (
                          <option key={fullValue} value={fullValue}>
                            {monthName} {year}
                          </option>
                        );
                      }),
                    )}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-span-1 my-2">
        {/* Tombol Print (tambahkan class "no-print") */}
        <button
          disabled={loading}
          onClick={() => window.print()}
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded print:hidden"
        >
          Print
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-700 bg-white bg-grey-100">
        <thead className="table-header-group">
          <tr className="">
            <th className="border border-gray-300 p-2">Tanggal</th>
            <th className="border border-gray-300 p-2">Jam Masuk</th>
            <th className="border border-gray-300 p-2">Jam Pulang</th>
            <th className="border border-gray-300 p-2">Scan Masuk</th>
            <th className="border border-gray-300 p-2">Scan Keluar</th>
            <th className="border border-gray-300 p-2">Terlambat</th>
            <th className="border border-gray-300 p-2">Jam Kerja</th>
          </tr>
        </thead>
        <tbody className="">
          {loading === true && (
            <tr>
              <td colSpan={7} className="text-center">
                Mengambil data...
              </td>
            </tr>
          )}
          {getBulan.bulan !== "" &&
            data?.map((data: DataType, i) => (
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
                    ? moment(data.waktu_masuk).tz("utc").format("HH:mm")
                    : "-"}
                </td>
                <td className="border border-gray-300 p-2">
                  {data.waktu_keluar && moment(data.waktu_keluar).isValid()
                    ? moment(data.waktu_keluar).tz("utc").format("HH:mm")
                    : "-"}
                </td>
                <td className="border border-gray-300 p-2">
                  {data.terlambat === null || data.terlambat < 0
                    ? "0"
                    : data.terlambat}{" "}
                  menit
                </td>

                <td className="border border-gray-300 p-2">
                  {data.selisih_menit === null ? "0" : data.selisih_menit} menit
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

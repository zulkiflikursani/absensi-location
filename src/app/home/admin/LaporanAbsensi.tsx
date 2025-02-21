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
}
export default function LaporanAbsensi() {
  // const session = useSession();
  const { data: sessionData, status } = useSession(); // Destructure status
  const [data, setData] = useState<DataType[]>();

  const [getBulan, setBulan] = useState<BodyType>({
    bulan: "",
    idUser: 0,
  });
  // setBulan({
  //   bulan: "2025-02-01",
  // });

  useEffect(() => {
    const fetchData = async () => {
      if (getBulan.idUser !== 0 && getBulan.bulan !== "") {
        try {
          const getData = await fetch("http://localhost:3000/api/getdata", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(getBulan),
          });
          const data = await getData.json();
          console.log(data);
          setData(data);
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
  return (
    <div className=" min-h-screen flex-col mx-10">
      <div className="w-full grid grid-cols-2">
        <div className="col-span-1 grid grid-cols-2">
          <table className="">
            <tbody>
              <tr>
                <td>No ID</td>
                <td>:</td>
                <td>{sessionData?.user.data.id}</td>
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
                    onChange={(e) =>
                      setBulan({ ...getBulan, bulan: e.target.value })
                    }
                  >
                    <option value="">Pilih Bulan</option>
                    <option value="2025-01-01">januari</option>
                    <option value="2025-02-01">februari</option>
                    <option value="2025-03-01">maret</option>
                    <option value="2025-04-01">april</option>
                    <option value="2025-05-01">mei</option>
                    <option value="2025-06-01">juni</option>
                    <option value="2025-07-01">juli</option>
                    <option value="2025-08-01">agustus</option>
                    <option value="2025-09-01">september</option>
                    <option value="2025-10-01">oktober</option>
                    <option value="2025-11-01">november</option>
                    <option value="2025-12-01">desember</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-span-1">
        {/* Tombol Print (tambahkan class "no-print") */}
        <button
          onClick={() => window.print()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-print"
        >
          Print
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
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
        <tbody>
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
                    ? moment(data.waktu_masuk).format("HH:mm")
                    : "-"}
                </td>
                <td className="border border-gray-300 p-2">
                  {data.waktu_keluar && moment(data.waktu_keluar).isValid()
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
                  {data.selisih_menit === null ? "0" : data.selisih_menit} menit
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

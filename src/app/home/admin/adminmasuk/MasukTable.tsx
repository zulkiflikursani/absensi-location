"use client";
import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, getYear } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
interface MasukData {
  id: number;
  idUser: number;
  full_name: string;
  bagian: string;
  waktu: string;
  createdAt: string;
}

interface MasukTableProps {
  data: MasukData[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
}

const MasukTable: React.FC<MasukTableProps> = ({ data, onEdit, onDelete }) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  ); // Initialize with current month
  const [filteredData, setFilteredData] = useState<MasukData[]>(data);
  const [bagian, setBagian] = useState("");

  const [currentYear] = useState<number>(getYear(new Date()));

  // Filter data whenever selectedMonth or data changes
  useEffect(() => {
    // Filter the data based on the selected month
    const filterData = () => {
      if (!selectedMonth) {
        setFilteredData(data); // Show all data if no month is selected
        return;
      }
      const start = startOfMonth(new Date(selectedMonth));
      const end = endOfMonth(new Date(selectedMonth));

      const newData = data.filter((item) => {
        const itemDate = new Date(item.waktu);
        return itemDate >= start && itemDate <= end && item.bagian === bagian;
      });
      setFilteredData(newData);
    };

    filterData();
  }, [selectedMonth, data, bagian]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div>
      <div className="mb-1 bg-white p-1">
        <label htmlFor="month-select" className="mr-2">
          Bulan :
        </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border rounded p-1"
        >
          {/*  Option for each month */}
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => {
            const month = format(new Date(currentYear, i, 1), "yyyy-MM"); // Use a fixed year
            const monthName = format(new Date(currentYear, i, 1), "MMMM");
            return (
              <option key={month} value={month}>
                {monthName}
              </option>
            );
          })}
        </select>
      </div>
      <div className="mb-1 bg-white  p-1">
        <label>Prodi: </label>
        <select
          onChange={(e) => setBagian(e.target.value)}
          className="border p-1"
        >
          <option value="">Pilih Prodi</option>
          <option value="1">Akuntansi</option>
          <option value="2">Manajemen</option>
        </select>
      </div>
      <table className="min-w-full border border-gray-300 bg-gray-300">
        <thead>
          <tr>
            <th className="border-b p-2">ID</th>
            <th className="border-b p-2">ID User</th>
            <th className="border-b p-2">Nama</th>
            <th className="border-b p-2">Waktu</th>
            <th className="border-b p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => {
            let formattedWaktu = "";

            try {
              formattedWaktu = formatInTimeZone(
                new Date(item.waktu),
                "UTC",
                "yyyy-MM-dd HH:mm:ss"
              );
            } catch (error) {
              console.error("Error formatting date:", error);
              formattedWaktu = "Invalid Date";
            }
            return (
              <tr key={item.id}>
                <td className="border-b p-2">{item.id}</td>
                <td className="border-b p-2">{item.idUser}</td>
                <td className="border-b p-2">{item.full_name}</td>
                <td className="border-b p-2">{formattedWaktu}</td>
                <td className="border-b p-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                    onClick={() => onEdit(item.id)}
                    disabled={loadingId === item.id}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={async () => {
                      setLoadingId(item.id);
                      try {
                        await onDelete(item.id);
                      } finally {
                        setLoadingId(null);
                      }
                    }}
                    disabled={loadingId === item.id}
                  >
                    {loadingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MasukTable;

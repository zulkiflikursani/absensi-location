"use client";
import React, { useState } from "react";
import { formatInTimeZone } from "date-fns-tz";

interface MasukData {
  id: number;
  idUser: number;
  full_name: string;
  waktu: string;
  createdAt: string;
}

interface MasukTableProps {
  data: MasukData[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
}

const MasukTable: React.FC<MasukTableProps> = ({ data, onEdit, onDelete }) => {
  const [loadingId, setLoadingId] = useState<number | null>(null); //Untuk loading state per row

  return (
    <table className="min-w-full border border-gray-300 bg-gray-300">
      <thead>
        <tr>
          <th className="border-b p-2">ID</th>
          <th className="border-b p-2">ID User</th>
          <th className="border-b p-2">Nama</th>
          <th className="border-b p-2">Waktu</th>
          {/* <th className="border-b p-2">Created At</th> */}
          <th className="border-b p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td className="border-b p-2">{item.id}</td>
            <td className="border-b p-2">{item.idUser}</td>
            <td className="border-b p-2">{item.full_name}</td>
            <td className="border-b p-2">
              {formatInTimeZone(
                new Date(item.waktu),
                "utc",
                "yyyy-MM-dd HH:mm:ss"
              ).toLocaleString() || item.waktu}
            </td>
            {/* <td className="border-b p-2">{item.createdAt}</td> */}
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
                  setLoadingId(item.id); // Set loading state
                  try {
                    await onDelete(item.id);
                  } finally {
                    setLoadingId(null); // Reset loading
                  }
                }}
                disabled={loadingId === item.id}
              >
                {loadingId === item.id ? "Deleting..." : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MasukTable;

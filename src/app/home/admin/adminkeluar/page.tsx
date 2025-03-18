// src/app/masuk/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import KeluarTable from "./KeluarTable";
import KeluarForm from "./KeluarForm";

interface KeluarData {
  id: number;
  idUser: number;
  waktu: string;
  bagian: string;
  full_name: string;
  createdAt: string;
}

const KeluarPage = () => {
  const [data, setData] = useState<KeluarData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false); // Untuk memicu re-render setelah update/delete

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/adminkeluar");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refresh]); // Re-fetch data ketika refresh berubah

  const handleEdit = (id: number) => {
    scrollToTop();
    setEditingId(id);
    setShowForm(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Untuk animasi scrolling yang halus
    });
  };
  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const response = await fetch(`/api/adminkeluar/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Refresh data setelah delete
        setRefresh((prev) => !prev); // Simple toggle
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleSave = async (
    formData: { idUser: number; waktu: string },
    id?: number
  ) => {
    try {
      const method = id ? "PATCH" : "POST";
      const url = id ? `/api/adminkeluar/${id}` : "/api/adminkeluar";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Ambil pesan error dari server
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        ); // Gunakan pesan error
      }
      // Refresh data setelah save
      setRefresh((prev) => !prev);
      setShowForm(false); // Sembunyikan form setelah save
      setEditingId(null);
    } catch (error) {
      alert(error as string); // Tampilkan pesan error
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    setShowForm(true);
    setEditingId(null); // Pastikan editingId null saat menambah data baru
  };

  const editedData = editingId
    ? data.find((item) => item.id === editingId)
    : undefined;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Jadwal Keluar</h1>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleAdd}
      >
        Tambah Data
      </button>
      {showForm && (
        <KeluarForm
          initialData={editedData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      <KeluarTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default KeluarPage;

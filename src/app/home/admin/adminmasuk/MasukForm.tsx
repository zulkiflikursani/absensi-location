// src/app/masuk/MasukForm.tsx
"use client";
import React, { useState, useEffect } from "react";

interface MasukFormProps {
  initialData?: { id: number; idUser: number; waktu: string };
  onSave: (
    data: { idUser: number; waktu: string },
    id?: number
  ) => Promise<void>;
  onCancel: () => void;
}

const MasukForm: React.FC<MasukFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [idUser, setIdUser] = useState<number>(initialData?.idUser || 0);
  const [waktu, setWaktu] = useState<string>(initialData?.waktu || "");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Reset form saat initialData berubah (untuk edit)
  useEffect(() => {
    setIdUser(initialData?.idUser || 0);
    setWaktu(initialData?.waktu || "");
    setError("");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validasi input (contoh sederhana)
    if (!idUser) {
      setError("ID User harus diisi.");
      setLoading(false);
      return;
    }
    if (!waktu) {
      setError("Waktu harus diisi.");
      setLoading(false);
      return;
    }

    try {
      await onSave({ idUser, waktu }, initialData?.id);
    } catch (err) {
      setError((err as string) || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="idUser" className="block text-gray-700 font-bold mb-2">
          ID User:
        </label>
        <input
          type="number"
          id="idUser"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={idUser}
          onChange={(e) => setIdUser(parseInt(e.target.value, 10))}
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="waktu" className="block text-gray-700 font-bold mb-2">
          Waktu:
        </label>
        <input
          type="datetime-local" // Gunakan datetime-local
          id="waktu"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={waktu}
          onChange={(e) => setWaktu(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading
            ? initialData
              ? "Updating..."
              : "Saving..."
            : initialData
            ? "Update"
            : "Save"}
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MasukForm;

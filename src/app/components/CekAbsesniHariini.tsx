// components/CekAbsesniHariini.tsx (Client Component)
"use client";
import React, { useState, useEffect } from "react";

interface ResultType {
  message: string | null;
  status?: "success" | "error" | "loading"; // Optional status indicator
  // Add any other properties you expect from the API response
}

function CekAbsesniHariini(props: { idUser: string }) {
  const [result, setResult] = useState<ResultType>({
    message: null,
    status: "loading",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const databody = {
          id: props.idUser,
        };
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/statusabsensi",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(databody),
          }
        );

        if (!response.ok) {
          // Handle HTTP errors (e.g., 404, 500)
          const errorData = await response.json(); // Try to get error details
          throw new Error(
            errorData.message || `HTTP error: ${response.status}`
          );
        }

        const data: ResultType = await response.json(); // Type assertion
        setResult(data);
        setResult({ ...data, status: "success" });
        setLoading(false);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message || "An unexpected error occurred."
            : "An unexpected error occurred."
        );
        setResult({ message: "An error occurred.", status: "error" }); // Set a default error message
        setLoading(false);
      }
    };

    fetchData();
  }, [props.idUser]); // Dependency array: re-fetch when idUser changes

  if (loading) {
    return <div className="text-center my-2">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center my-2 bg-red-500 p-2 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="text-center my-2 ">
      {result.message !== null && result.status === "success" ? (
        <div className="bg-green-600 p-2 rounded">{result.message}</div>
      ) : result.status === "error" ? (
        <div className="bg-red-500 p-2 rounded">
          {result.message || "Anda belum Melakukan Absesn Masuk Hari ini"}
        </div>
      ) : result.message === null ? (
        <div className="bg-red-500 p-2 rounded">
          {"Anda belum Melakukan Absesn Masuk Hari ini"}
        </div>
      ) : (
        <div className="bg-yellow-500 p-2 rounded">Sedang memuat</div>
      )}
    </div>
  );
}

export default CekAbsesniHariini;

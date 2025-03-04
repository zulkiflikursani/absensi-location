import React from "react";

export const metadata = {
  title: "praktisius - pusat rekayasa teknologi dan sistem informasi",
  description:
    "praktisius-menerima jasa rancang bangun teknologi dan sistem informasi",
};
function page() {
  return (
    <div className="bg-gray-100 w-full text-center min-h-screen flex flex-col items-center py-10 -mt-4">
      <h2 className="text-4xl font-bold my-4 text-primary">
        Design By PRAKTISIUS
      </h2>
      <h1 className="text-4xl font-bold">Tim Pengembang: </h1>
      <p className="text-2xl font-bold mt-3 underline">Manajer Project :</p>
      <p className="text-xl font-bold"> Dr. Dinar, S.E., M.Si</p>
      <p className="text-xl ">
        (Dosen Program Studi Akuntansi Universitas Fajar)
      </p>
      <p className="text-2xl font-bold mt-3 underline">
        Analis Sistem & Desain:
      </p>
      <p className="text-xl font-bold">Akmal Hidayat, S.E., M.Si </p>
      <p className="text-xl ">
        (Dosen Program Studi Akuntansi Universitas Fajar)
      </p>
      <p className="text-2xl font-bold mt-3 underline">Programmer: </p>
      <p className="text-xl font-bold ">Zulkifli, S.ST., M.Si </p>
      <p className="text-xl ">
        (Dosen Program Studi Akuntansi Universitas Fajar)
      </p>
    </div>
  );
}

export default page;

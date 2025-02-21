import moment from "moment-timezone";
import React from "react";
interface Masuk {
  id: number;
  waktu: Date;
}
async function DataMasuk() {
  try {
    const getData = await fetch("http://localhost:3000/api/getdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await getData.json();
    console.log(data);
    setTimeout(() => {
      data.map((data: Masuk) => {
        const waktu = new Date(data.waktu); // Convert waktu to a Date object
        if (waktu instanceof Date && !isNaN(waktu.getTime())) {
          const selisih = Math.abs(
            (waktu.getTime() - new Date().getTime()) / 1000
          );
          console.log(`Selisih waktu: ${selisih} detik`);
        } else {
          console.error("Invalid date:", data.waktu);
        }
      });
    }, 1000);

    return (
      <div>
        {data.map((data: Masuk) => (
          <p key={data.id}>
            {moment(data.waktu)
              .tz("Asia/Makassar")
              .format("DD-MM-YYYY HH:mm:ss")}
          </p>
        ))}
      </div>
    );
  } catch (error) {
    console.log(error);
  }
}

export default DataMasuk;

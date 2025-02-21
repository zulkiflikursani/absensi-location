// components/Clock.js
import React, { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update setiap detik

    return () => clearInterval(intervalId); // Membersihkan interval saat komponen unmount
  }, []);

  const formattedTime = time.toLocaleTimeString("id-ID", {
    // Sesuaikan locale sesuai kebutuhan
    hour12: false, // Gunakan format 24 jam
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <h2>Waktu Saat Ini:</h2>
      </div>
      <div>
        <p className="font-bold text-4xl">{formattedTime}</p>
      </div>
    </div>
  );
};

export default Clock;

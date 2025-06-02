import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface TypeBody {
  bulan: string;
  bagian: string;
  // idUser: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // const { bulan, bagian } = body;
  const data: TypeBody = body;
  const prisma = new PrismaClient();

  try {
    const query = `WITH RECURSIVE DateSeries AS (
        SELECT CAST(${data.bulan} AS DATE) AS tanggal  -- Start date (1st of the month)
        UNION ALL
        SELECT tanggal + INTERVAL 1 DAY
        FROM DateSeries
        WHERE tanggal < LAST_DAY(${data.bulan}) -- End date (last day of the month)
    )
    SELECT
        u.id AS idUser,
        u.username,
        u.full_name,
        u.bagian,
        ds.tanggal,
        CONCAT(ds.tanggal, ' 07:30:00')  AS jam_masuk,
        CONCAT(ds.tanggal, ' 16:00:00') AS jam_pulang,
        min(m.waktu) AS waktu_masuk,  -- Earliest 'masuk' time
        max(k.waktu) AS waktu_keluar,   -- Latest 'keluar' time
       CAST(TIMESTAMPDIFF(MINUTE, MIN(m.waktu), MAX(k.waktu)) AS UNSIGNED) AS selisih_menit,
         CAST(TIMESTAMPDIFF(
        MINUTE,
        CONCAT(ds.tanggal, ' 07:30:00'), -- 08:00 Asia/Makassar
        MIN(m.waktu)  -- Waktu masuk (dalam UTC+7)
    ) AS SIGNED) AS terlambat
    FROM
      users u
    CROSS JOIN
        DateSeries ds
    LEFT JOIN
        masuk m ON DATE(ds.tanggal) =DATE(m.waktu) AND m.idUser = u.id 
    LEFT JOIN
        keluar k ON DATE(ds.tanggal) = DATE(k.waktu)AND k.idUser = u.id
    where
        u.id != '2' 
        and u.bagian = ${data.bagian}
    GROUP BY
        u.id, ds.tanggal
    ORDER BY
        u.id, ds.tanggal`;
    console.log(query);
    const result = await prisma.$queryRawUnsafe(query);
    console.log(result);
    const processedResult = Array.isArray(result)
      ? result.map((item) => {
          const newItem: { [key: string]: string } = {};
          for (const key in item) {
            newItem[key] =
              typeof item[key] === "bigint" ? item[key].toString() : item[key];
            // if (typeof item[key] === "bigint") {
            //   newItem[key] = item[key].toString(); // Ubah menjadi string
            // } else {
            //   newItem[key] = item[key];
            // }
          }
          return newItem;
        })
      : [];

    console.log("processedResult", processedResult);
    return NextResponse.json(processedResult);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching data" + error });
  }
}

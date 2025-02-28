import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface TypeBody {
  bulan: string;
  idUser: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data: TypeBody = body;
  const prisma = new PrismaClient();
  try {
    const result = await prisma.$queryRawUnsafe(`WITH RECURSIVE DateSeries AS (
        SELECT CAST('${data.bulan}' AS DATE) AS tanggal  -- Start date (1st of the month)
        UNION ALL
        SELECT tanggal + INTERVAL 1 DAY
        FROM DateSeries
        WHERE tanggal < LAST_DAY('${data.bulan}') -- End date (last day of the month)
    )
    SELECT
        ds.tanggal,
        CONCAT(ds.tanggal, ' 07:30:00') AS jam_masuk,
        CONCAT(ds.tanggal, ' 16:00:00') AS jam_pulang,
        m.waktu AS waktu_masuk,  -- Earliest 'masuk' time
        k.waktu AS waktu_keluar,   -- Latest 'keluar' time
       CAST(TIMESTAMPDIFF(MINUTE, MIN(m.waktu), MAX(k.waktu)) AS UNSIGNED) AS selisih_menit,
         CAST(TIMESTAMPDIFF(
        MINUTE,
        CONCAT(ds.tanggal, ' 07:30:00'), 
        MIN(m.waktu)  
    ) AS SIGNED) AS terlambat
    FROM
        DateSeries ds
    LEFT JOIN
        masuk m ON DATE(ds.tanggal) =DATE(m.waktu) AND m.idUser = ${data.idUser}
    LEFT JOIN
        keluar k ON DATE(ds.tanggal) = DATE(k.waktu)AND k.idUser = ${data.idUser}
    GROUP BY
        ds.tanggal
    ORDER BY
        ds.tanggal`);
    const processedResult = Array.isArray(result)
      ? result.map((item) => {
          const newItem: { [key: string]: string } = {};
          for (const key in item) {
            if (typeof item[key] === "bigint") {
              newItem[key] = item[key].toString(); // Ubah menjadi string
            } else {
              newItem[key] = item[key];
            }
          }
          return newItem;
        })
      : [];
    return NextResponse.json(processedResult);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching data" + error });
  }
}

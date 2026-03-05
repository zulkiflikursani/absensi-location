import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Inisialisasi prisma di luar handler untuk efisiensi koneksi
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bulan, bagian } = body;

    // 1. Pastikan targetDate valid (Contoh: "2025-02-01")
    const targetDate = bulan.length === 7 ? `${bulan}-01` : bulan;

    // 2. Query yang sudah diperbaiki (Proteksi terhadap angka negatif & null)
    const query = `
    WITH RECURSIVE DateSeries AS (
        SELECT CAST('${targetDate}' AS DATE) AS tanggal
        UNION ALL
        SELECT tanggal + INTERVAL 1 DAY
        FROM DateSeries
        WHERE tanggal < LAST_DAY('${targetDate}')
    )
    SELECT
        u.id AS idUser,
        u.username,
        u.full_name,
        u.bagian,
        ds.tanggal,
        CONCAT(ds.tanggal, ' 07:30:00') AS jam_masuk_target,
        MIN(m.waktu) AS waktu_masuk,
        MAX(k.waktu) AS waktu_keluar,
        
        -- MENGGUNAKAN SIGNED: Mencegah error N/A jika hasil TIMESTAMPDIFF negatif
        CAST(IFNULL(TIMESTAMPDIFF(MINUTE, MIN(m.waktu), MAX(k.waktu)), 0) AS SIGNED) AS selisih_menit,
        
        -- MENGGUNAKAN SIGNED & IFNULL: Menghitung keterlambatan dengan aman
        CAST(TIMESTAMPDIFF(
            MINUTE,
            CONCAT(ds.tanggal, ' 07:30:00'),
            IFNULL(MIN(m.waktu), CONCAT(ds.tanggal, ' 07:30:00'))
        ) AS SIGNED) AS terlambat
    FROM
        users u
    CROSS JOIN 
        DateSeries ds 
    LEFT JOIN masuk m ON DATE(m.waktu) = ds.tanggal AND m.idUser = u.id
    LEFT JOIN keluar k ON DATE(k.waktu) = ds.tanggal AND k.idUser = u.id
    WHERE
        u.id != '2' AND u.bagian = '${bagian}'
    GROUP BY
        u.id, ds.tanggal
    ORDER BY
        u.id, ds.tanggal`;

    // 3. Eksekusi Query
    const result = await prisma.$queryRawUnsafe(query);

    // 4. Konversi BigInt ke String (PENTING agar tidak error saat NextResponse.json)
    const processedResult = JSON.parse(
      JSON.stringify(result, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    return NextResponse.json(processedResult);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    const prismaCode = (error as { code?: string })?.code; // Type casting aman

    console.error("--- DEBUG ERROR ---");
    console.error("Message:", errorMessage);

    return NextResponse.json(
      {
        debug_message: errorMessage,
        prisma_code: prismaCode,
        stack: errorStack,
      },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { formatInTimeZone } from "date-fns-tz";

interface TypeMasuk {
  id: number;
  waktu: Date;
}
export async function POST(request: NextRequest) {
  const body = await request.json();
  const data: TypeMasuk = body;
  const waktu = new Date(data.waktu);
  // const waktu = new Date("2025-02-28 17:19:45+08:00");
  waktu.setHours(waktu.getHours() + 8);
  // console.log(data);
  try {
    // console.log("data", data);
    // Validasi data.waktu (sangat penting)
    if (!data.waktu || typeof data.waktu !== "string") {
      return NextResponse.json(
        { error: "Invalid 'waktu' format." },
        { status: 400 }
      );
    }
    const now = new Date();
    const timeZone = "Asia/Makassar";
    const nowMks = formatInTimeZone(now, timeZone, "yyyy-MM-dd");

    const query = `SELECT COUNT(*) AS count
        FROM masuk
        WHERE DATE(waktu) = ? and idUser = ?`;
    const cekAbsenMasuk = await prisma.$queryRawUnsafe<{ count: number }[]>(
      query,
      nowMks,
      data.id
    );
    const querykeluar = `SELECT COUNT(*) AS count
    FROM keluar
    WHERE DATE(waktu) = ? and idUser = ?`;
    const existingEntry = await prisma.$queryRawUnsafe<{ count: number }[]>(
      querykeluar,
      nowMks,
      data.id
    );

    if (existingEntry && existingEntry[0] && existingEntry[0].count > 0) {
      return NextResponse.json(
        { error: "Data keluar untuk tanggal ini sudah ada." },
        { status: 409 } // Gunakan status code 409 Conflict
      );
    }
    if (cekAbsenMasuk && cekAbsenMasuk[0] && cekAbsenMasuk[0].count > 0) {
      const createKeluar = await prisma.keluar.create({
        data: {
          idUser: data.id,
          waktu: new Date(waktu),
        },
      });
      return NextResponse.json(createKeluar);
    } else {
      return NextResponse.json(
        { error: "Data masuk untuk tanggal ini belum ada." },
        { status: 409 } // Gunakan status code 409 Conflict
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error saat keluar: " + error.message }, // Gunakan error.message
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

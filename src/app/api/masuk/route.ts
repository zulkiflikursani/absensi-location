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
  // const waktu = new Date("2025-02-28 07:19:45+08:00");
  waktu.setHours(waktu.getHours() + 8);
  try {
    // console.log("data", data);
    // Validasi data.waktu (sangat penting)
    if (!data.waktu || typeof data.waktu !== "string") {
      return NextResponse.json(
        { error: "Invalid 'waktu' format." },
        { status: 400 }
      );
    }
    // console.log("waktu masuk", waktu);
    const now = new Date();
    const timeZone = "Asia/Makassar";
    const nowMks = formatInTimeZone(now, timeZone, "yyyy-MM-dd");

    const query = `SELECT COUNT(*) AS count
        FROM masuk
        WHERE DATE(waktu) = ? and idUser = ?`;
    const result = await prisma.$queryRawUnsafe<{ count: number }[]>(
      query,
      nowMks,
      data.id
    );
    if (result && result[0] && result[0].count > 0) {
      return NextResponse.json(
        { error: "Data masuk untuk tanggal ini sudah ada." },
        { status: 409 } // Gunakan status code 409 Conflict
      );
    }
    const createMasuk = await prisma.masuk.create({
      data: {
        idUser: data.id,
        waktu: new Date(waktu),
      },
    });
    return NextResponse.json(createMasuk);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error saat masuk: " + error.message }, // Gunakan error.message
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

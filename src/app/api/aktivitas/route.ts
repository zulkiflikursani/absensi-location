// pages/api/aktivitas.ts
import { PrismaClient } from "@prisma/client";
import { toZonedTime } from "date-fns-tz";
import { NextRequest, NextResponse } from "next/server";
import { formatInTimeZone } from "date-fns-tz";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const body = await req.json();
    const { kegiatan, idUser } = body;
    if (!idUser || typeof idUser !== "number") {
      return NextResponse.json(
        { message: "idUser tidak valid." },
        { status: 400 }
      );
    }
    if (!kegiatan) {
      return NextResponse.json(
        { message: "kegiatan harus diisi" },
        { status: 400 }
      );
    }

    const userIdInt = parseInt(String(idUser), 10);
    const timeZone = "Asia/Makassar"; // Sesuaikan
    const waktuDate = new Date();
    // waktuDate.setHours(waktuDate.getHours() + 8);
    const waktuUTC = toZonedTime(waktuDate, timeZone);

    const now = new Date();
    // now.setHours(now.getHours() + 8);
    const nowMks = formatInTimeZone(now, timeZone, "yyyy-MM-dd");
    console.log("now mks", nowMks);
    const query = `SELECT COUNT(*) AS count
        FROM aktivitas
        WHERE DATE(waktu) = ? and idUser = ?`;
    const result = await prisma.$queryRawUnsafe<{ count: number }[]>(
      query,
      nowMks,
      userIdInt
    );
    if (result && result[0] && result[0].count > 0) {
      return NextResponse.json(
        { message: "Data aktivitas untuk hari ini sudah ada." },
        { status: 409 } // Gunakan status code 409 Conflict
      );
    }
    const newAktivitas = await prisma.aktivitas.create({
      data: {
        idUser: userIdInt,
        kegiatan: kegiatan,
        waktu: waktuUTC,
      },
    });

    return NextResponse.json(newAktivitas, { status: 201 });
  } catch (error) {
    console.error("Error creating aktivitas:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan internal server";
    const errorDetails =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.stack
        : undefined;
    return NextResponse.json({
      status: 500,
      message: "Gagal membuat aktivitas",
      error: errorDetails || errorMessage,
    });
  }
}

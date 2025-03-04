import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

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
    const todayUTCPlus8Start = new Date(now);
    todayUTCPlus8Start.setUTCHours(0, 0, 0, 0); // Start of *today* in UTC
    todayUTCPlus8Start.setHours(todayUTCPlus8Start.getHours() - 8); // Shift back to the beginning of today in UTC+8

    const todayUTCPlus8End = new Date(now);
    todayUTCPlus8End.setUTCHours(24, 0, 0, 0); //start of *tomorrow* in UTC
    todayUTCPlus8End.setHours(todayUTCPlus8End.getHours()); //shift to the beginning of tommorow in UTC+8

    // const startOfDay = new Date(data.waktu);
    // startOfDay.setHours(0, 0, 0, 0);

    // const endOfDay = new Date(data.waktu);
    // endOfDay.setHours(23, 59, 59, 999);

    const existingEntry = await prisma.keluar.findFirst({
      where: {
        idUser: data.id,
        waktu: {
          gte: todayUTCPlus8Start,
          lt: todayUTCPlus8End,
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Data keluar untuk tanggal ini sudah ada." },
        { status: 409 } // Gunakan status code 409 Conflict
      );
    }
    const cekAbsenMasuk = await prisma.masuk.findFirst({
      where: {
        idUser: data.id,
        waktu: {
          gte: todayUTCPlus8Start,
          lt: todayUTCPlus8End,
        },
      },
    });
    if (!cekAbsenMasuk) {
      return NextResponse.json(
        { error: "Data masuk untuk tanggal ini belum ada." },
        { status: 409 } // Gunakan status code 409 Conflict
      );
    }
    const createKeluar = await prisma.keluar.create({
      data: {
        idUser: data.id,
        waktu: new Date(waktu),
      },
    });
    return NextResponse.json(createKeluar);
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

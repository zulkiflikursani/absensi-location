import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

interface TypeMasuk {
  id: number;
  waktu: Date;
}
export async function POST(request: NextRequest) {
  const body = await request.json();
  const data: TypeMasuk = body;
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
    const startOfDay = new Date(data.waktu);
    startOfDay.setUTCHours(0, 0, 0, 0); // Start of *today* in UTC
    startOfDay.setHours(startOfDay.getHours() - 8); // Shift back to the beginning of today in UTC+8

    const endOfDay = new Date(data.waktu);
    endOfDay.setUTCHours(23, 59, 59, 999); //start of *tomorrow* in UTC
    endOfDay.setHours(endOfDay.getHours() - 8); //shift to the beginning of tommorow in UTC+8

    // const startOfDay = new Date(data.waktu);
    // startOfDay.setHours(0, 0, 0, 0);

    // const endOfDay = new Date(data.waktu);
    // endOfDay.setHours(23, 59, 59, 999);

    console.log("star :", startOfDay + " end: " + endOfDay);
    console.log("masuk", data.waktu);
    const existingEntry = await prisma.keluar.findFirst({
      where: {
        idUser: data.id,
        waktu: {
          gte: startOfDay,
          lt: endOfDay,
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
          gte: startOfDay,
          lt: endOfDay,
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
        waktu: new Date(data.waktu),
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

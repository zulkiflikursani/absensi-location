import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface TypeMasuk {
  id: number;
}
export async function POST(request: NextRequest) {
  const body = await request.json();
  const data: TypeMasuk = body;
  const prisma = new PrismaClient();
  // console.log(data);
  try {
    // console.log("data", data);
    // Validasi data.waktu (sangat penting)
    const now = new Date();
    const todayUTCPlus8Start = new Date(now);
    todayUTCPlus8Start.setUTCHours(0, 0, 0, 0); // Start of *today* in UTC
    todayUTCPlus8Start.setHours(todayUTCPlus8Start.getHours() - 8); // Shift back to the beginning of today in UTC+8

    const todayUTCPlus8End = new Date(now);
    todayUTCPlus8End.setUTCHours(24, 0, 0, 0); //start of *tomorrow* in UTC
    todayUTCPlus8End.setHours(todayUTCPlus8End.getHours() - 8); //shift to the beginning of tommorow in UTC+8

    if (!data.id || typeof data.id !== "string") {
      const result = await prisma.masuk.findFirst({
        where: {
          idUser: data.id,
          waktu: {
            gte: todayUTCPlus8Start, // Start of today (UTC)
            lt: todayUTCPlus8End, // Start of tomorrow (UTC) - effectively end of today
          },
        },
      });
      console.log("data:", result);
      if (result) {
        const cek = await prisma.keluar.findFirst({
          where: {
            idUser: data.id,
            waktu: {
              gte: todayUTCPlus8Start, // Start of today (UTC)
              lt: todayUTCPlus8End, // Start of tomorrow (UTC) - effectively end of today
            },
          },
        });
        console.log("data:", cek);
        if (cek) {
          return NextResponse.json({
            message: "Anda Sudah Melakukan Absen Keluar",
          });
        } else {
          return NextResponse.json({
            message: "Anda Sudah Melakukan Absen Masuk",
          });
        }
      } else {
        return NextResponse.json({
          message: null,
        });
      }
    } else {
      return NextResponse.json({ message: data });
    }
  } catch (error) {
    console.log(error);
  }
}

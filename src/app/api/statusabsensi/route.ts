import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { formatInTimeZone } from "date-fns-tz";
interface TypeMasuk {
  id: number;
}
export async function POST(request: NextRequest) {
  const body = await request.json();
  const data: TypeMasuk = body;
  const prisma = new PrismaClient();
  // console.log(data);
  try {
    const now = new Date();
    const timeZone = "Asia/Makassar";
    const nowMks = formatInTimeZone(now, timeZone, "yyyy-MM-dd");

    if (!data.id || typeof data.id !== "string") {
      const query = `SELECT COUNT(*) AS count
                        FROM masuk
                        WHERE DATE(waktu) = ? and idUser = ?`;
      const result = await prisma.$queryRawUnsafe<{ count: number }[]>(
        query,
        nowMks,
        data.id
      );
      if (result && result[0] && result[0].count > 0) {
        const query = `SELECT COUNT(*) AS count
        FROM keluar
        WHERE DATE(waktu) = ? and idUser=?`;
        const cek = await prisma.$queryRawUnsafe<{ count: number }[]>(
          query,
          nowMks,
          data.id
        );
        if (cek && cek[0] && cek[0].count > 0) {
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
  } catch (error: unknown) {
    // const a = error;
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message });
    } else {
      return NextResponse.json({ message: String(error) });
    }
    // return NextResponse.json({ message: error.toString() });

    // console.log(error);
  }
}

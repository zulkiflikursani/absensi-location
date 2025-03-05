import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { toZonedTime } from "date-fns-tz";

// --- GET: Ambil semua data masuk ---
export async function GET() {
  const prisma = new PrismaClient();
  try {
    const query = `
      SELECT m.id, m.idUser, m.waktu, m.createdAt, u.full_name
      FROM masuk m
      JOIN users u ON m.idUser = u.id
      ORDER BY m.idUser, m.waktu ASC;
    `;
    const masukData = await prisma.$queryRawUnsafe(query);

    // Tidak perlu formatting di sini, karena kita sudah menformatnya didalam query
    // Formatting HANYA diperlukan jika query mengembalikan Date objects

    return NextResponse.json(masukData);
  } catch (error) {
    console.error("Error fetching masuk data:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data masuk." },
      { status: 500 }
    );
  }
}

// --- POST: Tambah data masuk baru ---
export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const body = await request.json();
    const { idUser, waktu } = body;

    // Validasi input (sangat penting!)
    if (!idUser || typeof idUser !== "number") {
      return NextResponse.json(
        { message: "idUser tidak valid." },
        { status: 400 }
      );
    }
    if (!waktu || typeof waktu !== "string") {
      return NextResponse.json(
        { message: "Format waktu tidak valid." },
        { status: 400 }
      );
    }

    // Konversi ke Date object dan tangani timezone
    const timeZone = "Asia/Makassar"; // Sesuaikan
    const waktuDate = new Date(waktu);
    waktuDate.setHours(waktuDate.getHours() + 8);
    const waktuUTC = toZonedTime(waktuDate, timeZone);

    const newMasuk = await prisma.masuk.create({
      data: {
        idUser,
        waktu: waktuUTC,
      },
    });

    return NextResponse.json(newMasuk, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("Error creating masuk data:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan data masuk." },
      { status: 500 }
    );
  }
}

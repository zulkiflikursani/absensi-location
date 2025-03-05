// src/app/api/masuk/[id]/route.ts
import { PrismaClient } from "@prisma/client";
import { toZonedTime } from "date-fns-tz";
import { NextRequest, NextResponse } from "next/server";

// --- DELETE: Hapus data masuk berdasarkan ID ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const prisma = new PrismaClient();
  const { id } = await params; // Konversi ID ke integer

  if (isNaN(id)) {
    return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
  }

  try {
    await prisma.masuk.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Data masuk berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting masuk data:", error);
    return NextResponse.json(
      { message: "Gagal menghapus data masuk." },
      { status: 500 }
    );
  }
}

// --- PATCH: Update data masuk berdasarkan ID ---
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const prisma = new PrismaClient();
  const id = parseInt((await params).id.toString(), 10);
  //   const { id } = await params;
  if (isNaN(id)) {
    return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { idUser, waktu } = body; // Data yang akan diupdate

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

    const updatedMasuk = await prisma.masuk.update({
      where: { id },
      data: {
        idUser,
        waktu: waktuUTC,
      },
    });

    return NextResponse.json(updatedMasuk);
  } catch (error) {
    // console.error("Error updating masuk data:", error as string);
    return NextResponse.json(
      { message: ("Gagal memperbarui data masuk." + error) as string },
      { status: 500 }
    );
  }
}

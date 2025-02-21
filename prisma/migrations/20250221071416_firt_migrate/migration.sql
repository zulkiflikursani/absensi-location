/*
  Warnings:

  - Added the required column `idUser` to the `keluar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUser` to the `masuk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `keluar` ADD COLUMN `idUser` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `masuk` ADD COLUMN `idUser` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `full_name` VARCHAR(191) NOT NULL DEFAULT 'username';

/*
  Warnings:

  - You are about to drop the column `is_group` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chats" DROP COLUMN "is_group",
ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT false;

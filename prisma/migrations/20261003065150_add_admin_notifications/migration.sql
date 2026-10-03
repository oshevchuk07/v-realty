-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyDealTypes" "DealType"[] DEFAULT ARRAY[]::"DealType"[],
ADD COLUMN     "telegramChatId" TEXT;

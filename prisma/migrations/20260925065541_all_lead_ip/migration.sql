-- AlterTable
ALTER TABLE "LeadRequest" ADD COLUMN     "ip" TEXT;

-- CreateIndex
CREATE INDEX "LeadRequest_ip_createdAt_idx" ON "LeadRequest"("ip", "createdAt");

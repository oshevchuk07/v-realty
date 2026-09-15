-- CreateTable
CREATE TABLE "LeadRequest" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadRequest_propertyId_idx" ON "LeadRequest"("propertyId");

-- AddForeignKey
ALTER TABLE "LeadRequest" ADD CONSTRAINT "LeadRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

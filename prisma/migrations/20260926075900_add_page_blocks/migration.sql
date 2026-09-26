-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('HERO_BANNER', 'HORIZONTAL_SLIDER', 'ITEM_GRID', 'IMAGE_TEXT');

-- CreateTable
CREATE TABLE "PageBlock" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL DEFAULT 'main',
    "type" "BlockType" NOT NULL,
    "order" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageBlock_page_order_idx" ON "PageBlock"("page", "order");

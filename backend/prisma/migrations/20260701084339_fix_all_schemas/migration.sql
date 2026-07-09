/*
  Warnings:

  - A unique constraint covering the columns `[jobId,reviewerId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Review_jobId_key";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "hiredStudent" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Review_jobId_reviewerId_key" ON "Review"("jobId", "reviewerId");

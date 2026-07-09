-- CreateTable
CREATE TABLE "JobMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobMessage_applicationId_idx" ON "JobMessage"("applicationId");

-- CreateIndex
CREATE INDEX "JobMessage_senderId_idx" ON "JobMessage"("senderId");

-- AddForeignKey
ALTER TABLE "JobMessage" ADD CONSTRAINT "JobMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobMessage" ADD CONSTRAINT "JobMessage_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

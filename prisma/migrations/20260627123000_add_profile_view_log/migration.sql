-- CreateTable
CREATE TABLE "ProfileViewLog" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "viewerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileViewLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfileViewLog_profileId_createdAt_idx" ON "ProfileViewLog"("profileId", "createdAt");

-- CreateIndex
CREATE INDEX "ProfileViewLog_profileId_idx" ON "ProfileViewLog"("profileId");

-- AddForeignKey
ALTER TABLE "ProfileViewLog" ADD CONSTRAINT "ProfileViewLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

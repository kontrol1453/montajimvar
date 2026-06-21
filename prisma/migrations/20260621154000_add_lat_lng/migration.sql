-- AlterTable: add latitude and longitude to Profile
ALTER TABLE "Profile" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "Profile" ADD COLUMN "longitude" DOUBLE PRECISION;

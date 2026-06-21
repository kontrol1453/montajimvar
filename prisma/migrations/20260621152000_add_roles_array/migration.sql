-- AlterTable: role String -> roles String[]
-- Preserve existing data with ALTER COLUMN TYPE using ARRAY[] cast

ALTER TABLE "User" ADD COLUMN "roles" TEXT[] DEFAULT ARRAY['CUSTOMER']::TEXT[] NOT NULL;
UPDATE "User" SET "roles" = ARRAY["role"]::TEXT[] WHERE "role" IS NOT NULL;
ALTER TABLE "User" DROP COLUMN "role";

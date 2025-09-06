-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "activity" TEXT,
ADD COLUMN     "altura" INTEGER,
ADD COLUMN     "birth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "objective" TEXT,
ADD COLUMN     "peso" INTEGER;

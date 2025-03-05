-- DropForeignKey
ALTER TABLE "comment_like" DROP CONSTRAINT "comment_like_comment_id_fkey";

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("unique_id") ON DELETE CASCADE ON UPDATE CASCADE;

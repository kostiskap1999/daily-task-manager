/*
  Warnings:

  - You are about to drop the column `createdAt` on the `RecurrenceRule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `RecurrenceRule` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RecurrenceRule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "weekdays" JSONB,
    "endsAt" DATETIME,
    CONSTRAINT "RecurrenceRule_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RecurrenceRule" ("endsAt", "frequency", "id", "interval", "taskId", "weekdays") SELECT "endsAt", "frequency", "id", "interval", "taskId", "weekdays" FROM "RecurrenceRule";
DROP TABLE "RecurrenceRule";
ALTER TABLE "new_RecurrenceRule" RENAME TO "RecurrenceRule";
CREATE UNIQUE INDEX "RecurrenceRule_taskId_key" ON "RecurrenceRule"("taskId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `id_user` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Album" (
    "id_album" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "id_year" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Album_id_year_fkey" FOREIGN KEY ("id_year") REFERENCES "Year" ("id_year") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "ContactText" (
    "id_contact_text" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" string,
    "content" string
);

-- CreateTable
CREATE TABLE "Document" (
    "id_document" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id_event" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "img_url" TEXT,
    "title" TEXT,
    "date" DATETIME,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Food" (
    "id_food" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "img_url" string
);

-- CreateTable
CREATE TABLE "IntroText" (
    "id_intro_text" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" string,
    "content" string
);

-- CreateTable
CREATE TABLE "PrivatePhoto" (
    "id_private_photo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT,
    "id_album" INTEGER
);

-- CreateTable
CREATE TABLE "PublicPhoto" (
    "id_public_photo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" string
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id_teacher" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" string,
    "job" string,
    "filename" string
);

-- CreateTable
CREATE TABLE "Year" (
    "id_year" TEXT NOT NULL PRIMARY KEY,
    "password_hash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "id_role" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT 'User'
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id_user" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" INTEGER NOT NULL,
    CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "Role" ("id_role") ON DELETE NO ACTION ON UPDATE NO ACTION
);
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_ContactText_1" ON "ContactText"("id_contact_text");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_IntroText_1" ON "IntroText"("id_intro_text");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_PrivatePhoto_1" ON "PrivatePhoto"("filename");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_PublicPhoto_1" ON "PublicPhoto"("id_public_photo");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_Teacher_1" ON "Teacher"("id_teacher");
Pragma writable_schema=0;

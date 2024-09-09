-- CreateEnum
CREATE TYPE "Payment_Status" AS ENUM ('CREATED', 'PENDING', 'CANCELLED', 'PAID');

-- CreateEnum
CREATE TYPE "Jenis_Pertandingan" AS ENUM ('OPEN', 'RANK');

-- CreateEnum
CREATE TYPE "Add_Ons" AS ENUM ('AIR_MINERAL');

-- CreateTable
CREATE TABLE "kolam" (
    "id" SERIAL NOT NULL,
    "label" INTEGER NOT NULL,
    "jumlah_pancang" INTEGER NOT NULL,

    CONSTRAINT "kolam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarikh_memancing" (
    "id" SERIAL NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "tarikh" TIMESTAMPTZ(6) NOT NULL,
    "created_on" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tarikh_memancing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "nama_pertama" TEXT NOT NULL,
    "nama_akhir" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "forgot_password" TEXT,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "nama_pertama" TEXT NOT NULL,
    "nama_akhir" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verification_token" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "forgot_password" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kolam_booking" (
    "id" SERIAL NOT NULL,
    "kolam_id" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "user_id" INTEGER,
    "payment_status" "Payment_Status" NOT NULL DEFAULT 'CREATED',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "tarikh" TIMESTAMP(6) NOT NULL,
    "qr_link_file_name" TEXT,
    "is_checked_in" BOOLEAN NOT NULL DEFAULT false,
    "is_manual" BOOLEAN DEFAULT false,
    "check_in_on" TIMESTAMPTZ(6),
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kolam_booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_booking" (
    "id" SERIAL NOT NULL,
    "nama_penuh" TEXT,
    "telefon" TEXT,
    "email" TEXT,
    "kolam_id" INTEGER NOT NULL,

    CONSTRAINT "manual_booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kolam_booking_pancang" (
    "id" SERIAL NOT NULL,
    "nombor" TEXT,
    "kolam_booking_id" INTEGER NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kolam_booking_pancang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kolam_booking_add_ons" (
    "id" SERIAL NOT NULL,
    "type" "Add_Ons" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "kolam_booking_id" INTEGER NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kolam_booking_add_ons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kolam_booking_payments" (
    "id" SERIAL NOT NULL,
    "bill_code" TEXT,
    "ref_no" TEXT,
    "status" TEXT,
    "fpx_transaction_id" TEXT,
    "transaction_id" TEXT,
    "reason" TEXT,
    "kolam_booking_id" INTEGER NOT NULL,
    "transaction_time" TIMESTAMP(3),

    CONSTRAINT "kolam_booking_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pancang" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "kolam_id" INTEGER NOT NULL,
    "is_left" BOOLEAN DEFAULT false,
    "is_right" BOOLEAN DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pancang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_availability" (
    "id" SERIAL NOT NULL,
    "kolam_id" INTEGER NOT NULL,
    "tarikh" TIMESTAMP(3),
    "pancang_id" INTEGER NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "booking_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pertandingan" (
    "id" SERIAL NOT NULL,
    "tarikh" TIMESTAMP(3),
    "jenis" "Jenis_Pertandingan",
    "poster_url" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pertandingan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pertandingan_audit_log" (
    "id" SERIAL NOT NULL,
    "pertandingan_id" INTEGER NOT NULL,
    "pancang_value" TEXT NOT NULL,
    "berat" DECIMAL(18,6) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pertandingan_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "manual_booking_kolam_id_key" ON "manual_booking"("kolam_id");

-- CreateIndex
CREATE UNIQUE INDEX "kolam_booking_payments_kolam_booking_id_key" ON "kolam_booking_payments"("kolam_booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "pancang_id_key" ON "pancang"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pancang_value_key" ON "pancang"("value");

-- CreateIndex
CREATE UNIQUE INDEX "booking_availability_pancang_id_kolam_id_tarikh_key" ON "booking_availability"("pancang_id", "kolam_id", "tarikh");

-- CreateIndex
CREATE UNIQUE INDEX "pertandingan_tarikh_key" ON "pertandingan"("tarikh");

-- AddForeignKey
ALTER TABLE "kolam_booking" ADD CONSTRAINT "kolam_booking_kolam_id_fkey" FOREIGN KEY ("kolam_id") REFERENCES "kolam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kolam_booking" ADD CONSTRAINT "kolam_booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_booking" ADD CONSTRAINT "manual_booking_kolam_id_fkey" FOREIGN KEY ("kolam_id") REFERENCES "kolam_booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kolam_booking_pancang" ADD CONSTRAINT "kolam_booking_pancang_kolam_booking_id_fkey" FOREIGN KEY ("kolam_booking_id") REFERENCES "kolam_booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kolam_booking_add_ons" ADD CONSTRAINT "kolam_booking_add_ons_kolam_booking_id_fkey" FOREIGN KEY ("kolam_booking_id") REFERENCES "kolam_booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kolam_booking_payments" ADD CONSTRAINT "kolam_booking_payments_kolam_booking_id_fkey" FOREIGN KEY ("kolam_booking_id") REFERENCES "kolam_booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pancang" ADD CONSTRAINT "pancang_kolam_id_fkey" FOREIGN KEY ("kolam_id") REFERENCES "kolam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_availability" ADD CONSTRAINT "booking_availability_kolam_id_fkey" FOREIGN KEY ("kolam_id") REFERENCES "kolam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_availability" ADD CONSTRAINT "booking_availability_pancang_id_fkey" FOREIGN KEY ("pancang_id") REFERENCES "pancang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pertandingan_audit_log" ADD CONSTRAINT "pertandingan_audit_log_pertandingan_id_fkey" FOREIGN KEY ("pertandingan_id") REFERENCES "pertandingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pertandingan_audit_log" ADD CONSTRAINT "pertandingan_audit_log_pancang_value_fkey" FOREIGN KEY ("pancang_value") REFERENCES "pancang"("value") ON DELETE RESTRICT ON UPDATE CASCADE;

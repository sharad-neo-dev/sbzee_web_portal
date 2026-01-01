import type { Metadata } from "next";
import { Suspense } from "react";
import OTPVerificationForm from "./OTPVerificationForm";
import { OtpPageLoader } from "./OtpPageLoader";
import { PublicRoute } from "@/components/auth/PublicRoute";

export const metadata: Metadata = {
  title: "Verify OTP | Sbzee - Fresh Fruits & Vegetables",
  description:
    "Verify your OTP to login to your Sbzee account and order fresh fruits & vegetables",
  keywords: "OTP verification, login, Sbzee, fruits, vegetables, grocery",
  robots: "noindex, follow",
};

export default function VerifyOTPPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 px-4 py-8">
        <Suspense fallback={<OtpPageLoader />}>
          <OTPVerificationForm />
        </Suspense>
      </div>
    </PublicRoute>
  );
}

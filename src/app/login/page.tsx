import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { LoginPageLoader } from "./LoginPageLoader";

export const metadata: Metadata = {
  title: "Login | Sbzee - Fresh Fruits & Vegetables Delivery",
  description:
    "Login to your Sbzee account to order fresh fruits, vegetables, and groceries online. Fast delivery to your doorstep.",
  keywords:
    "login, Sbzee, fruits, vegetables, grocery delivery, online shopping, fresh produce",
  robots: "noindex, follow",
  openGraph: {
    title: "Login to Sbzee - Fresh Fruits & Vegetables",
    description: "Access your Sbzee account to shop fresh produce",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login | Sbzee",
    description: "Login to your Sbzee account",
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 px-4 py-8">
      <Suspense fallback={<LoginPageLoader />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

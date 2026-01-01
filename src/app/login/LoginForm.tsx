"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLoginMutation } from "@/redux/services/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { sendOtpStart, clearError } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [phone, setPhoneInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    otpSentTo,
    userId,
    error: authError,
  } = useAppSelector((state) => state.auth);

  const [login, { isLoading: loginLoading, error: loginError }] =
    useLoginMutation();

  // Use local submitting state instead of Redux isLoading
  const isLoading = isSubmitting || loginLoading;
  const error =
    validationError || authError || (loginError as any)?.data?.message;

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    dispatch(clearError());
    setIsSubmitting(true);

    if (!phone.trim()) {
      setValidationError("Phone number is required");
      setIsSubmitting(false);
      return;
    }

    if (!validatePhone(phone)) {
      setValidationError("Please enter a valid 10-digit Indian mobile number");
      setIsSubmitting(false);
      return;
    }

    try {
      dispatch(sendOtpStart(phone));
      const result = await login({ phone }).unwrap();

      if (result.success) {
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "/";
        // Success - navigate to OTP page
        router.push(
          `/verify-otp?phone=${phone}&userId=${
            result.data.user.id
          }&redirect=${encodeURIComponent(redirectUrl)}`
        );
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Error is already handled by RTK Query
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Enter your phone number to continue</p>
      </motion.div>

      <form onSubmit={handleSendOtp} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">+91</span>
            </div>
            <input
              type="tel"
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhoneInput(value);
                if (validationError) setValidationError("");
              }}
              className={cn(
                "w-full border pl-12 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-all",
                error
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              )}
              disabled={isLoading}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm mt-2 flex items-center">
              <span className="mr-1">⚠</span> {error}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300",
              "bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
              "text-white shadow-md hover:shadow-lg",
              isLoading && "opacity-70 cursor-not-allowed"
            )}>
            {isLoading ? (
              <span className="flex items-center justify-center">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Sending OTP...
              </span>
            ) : (
              "Send OTP"
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              className="text-green-600 hover:text-green-700 font-medium">
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-green-600 hover:text-green-700 font-medium">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
}

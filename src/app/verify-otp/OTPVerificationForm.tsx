"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useVerifyOtpMutation } from "@/redux/services/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { verifyOtpStart, clearError } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OTPVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const phone = searchParams.get("phone") || "";
  const userId = searchParams.get("userId") || "";
  const redirectUrl = searchParams.get("redirect") || "/";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [validationError, setValidationError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { isLoading: authLoading, error: authError } = useAppSelector(
    (state) => state.auth
  );

  const [verifyOtp, { isLoading: verifyLoading, error: verifyError }] =
    useVerifyOtpMutation();

  const isLoading = authLoading || verifyLoading;
  const error =
    validationError || authError || (verifyError as any)?.data?.message;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, "");
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (validationError) setValidationError("");
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    const newOtp = [...otp];

    pastedData.split("").forEach((char, index) => {
      if (index < 4) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);

    // Focus on the last filled input
    const lastFilledIndex = Math.min(pastedData.length, 3);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    dispatch(clearError());

    const otpString = otp.join("");

    if (otpString.length !== 4) {
      setValidationError("Please enter the complete 4-digit OTP");
      return;
    }

    if (!userId) {
      setValidationError("User ID is missing. Please try logging in again.");
      return;
    }

    try {
      dispatch(verifyOtpStart());
      const result = await verifyOtp({
        otp: otpString,
        type: "customer_login",
        userId,
      }).unwrap();

      if (result.success) {
        sessionStorage.removeItem("redirectAfterLogin");
        // Success - redirect to home page
        router.push(redirectUrl);
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      // Error is already handled by RTK Query
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setResendTimer(30);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    setValidationError("");
    dispatch(clearError());

    // Focus on first input
    inputRefs.current[0]?.focus();

    // You can implement resend OTP API call here
    console.log("Resend OTP for phone:", phone);
    // You would call your resend OTP API here
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
        <p className="text-gray-600">
          Enter the 4-digit code sent to{" "}
          <span className="font-semibold text-green-600">+91 {phone}</span>
        </p>
      </motion.div>

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4">
          <div className="flex justify-between gap-3">
            {[0, 1, 2, 3].map((index) => (
              <motion.input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                className={cn(
                  "w-full h-16 text-2xl font-bold text-center border-2 rounded-lg",
                  "focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200",
                  "transition-all duration-200",
                  error ? "border-red-300" : "border-gray-300",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
                initial={{ scale: 1 }}
                whileFocus={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm text-center">
              ⚠ {error}
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
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center">
          <p className="text-gray-600 text-sm mb-2">
            Didn't receive the code?{" "}
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-500">
                Resend in <span className="font-semibold">{resendTimer}s</span>
              </span>
            )}
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
            ← Change phone number
          </button>
        </motion.div>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>
          Having trouble? Contact us at{" "}
          <a
            href="mailto:support@sbzee.com"
            className="text-green-600 hover:text-green-700">
            support@sbzee.com
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useVerifyOtpMutation } from "@/redux/services/authApi";
import {
  verifyOtpStart,
  verifyOtpFailure,
  resetOtpState,
} from "@/redux/features/auth/authSlice";
import type { RootState } from "@/redux/store";

interface OtpVerificationProps {
  phone: string;
  userId: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function OtpVerification({
  phone,
  userId,
  onBack,
  onSuccess,
}: OtpVerificationProps) {
  const dispatch = useDispatch();
  const [verifyOtp] = useVerifyOtpMutation();
  const { isVerifying, verifyError } = useSelector(
    (state: RootState) => state.auth.otp
  );

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedOtp = value.split("").slice(0, 4);
      const newOtp = [...otp];
      pastedOtp.forEach((digit, idx) => {
        if (idx < 4) newOtp[idx] = digit;
      });
      setOtp(newOtp);

      const lastFilledIndex = pastedOtp.length - 1;
      if (lastFilledIndex < 3 && inputRefs.current[lastFilledIndex + 1]) {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      }
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      dispatch(verifyOtpFailure("Please enter 4-digit OTP"));
      return;
    }

    dispatch(verifyOtpStart());

    try {
      await verifyOtp({
        otp: otpString,
        type: "customer_login",
        userId,
      }).unwrap();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      dispatch(
        verifyOtpFailure(
          error?.data?.message || "Invalid OTP. Please try again."
        )
      );
    }
  };

  const handleResendOtp = () => {
    setTimer(60);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    dispatch(resetOtpState());
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
      <button
        onClick={onBack}
        className="text-gray-500 hover:text-gray-700 mb-4 flex items-center">
        ← Back
      </button>

      <h2 className="text-2xl font-semibold mb-2 text-center">Enter OTP</h2>
      <p className="text-gray-600 text-sm mb-6 text-center">
        We've sent a 4-digit OTP to <strong>+91 {phone}</strong>
      </p>

      {/* OTP Inputs */}
      <div className="flex justify-center space-x-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            autoFocus={index === 0}
          />
        ))}
      </div>

      {/* Error Message */}
      {verifyError && (
        <p className="text-red-600 text-sm mb-4 text-center">{verifyError}</p>
      )}

      {/* Timer */}
      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm">
          {canResend ? (
            <button
              onClick={handleResendOtp}
              className="text-green-600 hover:text-green-700 font-medium">
              Resend OTP
            </button>
          ) : (
            `Resend OTP in ${timer}s`
          )}
        </p>
      </div>

      <Button
        onClick={handleVerifyOtp}
        disabled={isVerifying || otp.join("").length !== 4}
        className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50">
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
}

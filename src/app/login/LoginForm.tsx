"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSendOtpMutation } from "@/redux/services/authApi";
import {
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
  setOtpPhone,
  setOtpUserId,
} from "@/redux/features/auth/authSlice";
import OtpVerification from "@/components/auth/OtpVerification";
import { Button } from "@/components/ui/button";
import { useLoginRedirect } from "@/hooks/useLoginRedirect";
import { AlertCircle } from "lucide-react";
import type { RootState } from "@/redux/store";

export default function LoginForm() {
  const dispatch = useDispatch();
  const [sendOtp] = useSendOtpMutation();
  const { otp } = useSelector((state: RootState) => state.auth);
  const { isLoading, error, isOtpSent, userId } = otp;
  const { redirectAfterLogin } = useLoginRedirect();

  const [phone, setPhoneInput] = useState("");

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      dispatch(sendOtpFailure("Please enter a valid 10-digit phone number"));
      return;
    }

    dispatch(sendOtpStart());
    dispatch(setOtpPhone(phone));

    try {
      const response = await sendOtp({ phone }).unwrap();

      if (response.success && response.data?.user?.id) {
        dispatch(setOtpUserId(response.data.user.id));
        dispatch(sendOtpSuccess());
      } else {
        dispatch(sendOtpFailure(response.message || "Failed to send OTP"));
      }
    } catch (err: any) {
      dispatch(
        sendOtpFailure(
          err?.data?.message || "Failed to send OTP. Please try again."
        )
      );
    }
  };

  const handleLoginSuccess = () => {
    redirectAfterLogin();
  };

  if (isOtpSent && userId) {
    return (
      <OtpVerification
        phone={phone}
        userId={userId}
        onBack={() => {
          dispatch(sendOtpFailure(""));
          dispatch(setOtpUserId(null));
        }}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
            <div className="px-4 py-3 bg-gray-50 text-gray-700 border-r">
              +91
            </div>
            <input
              type="tel"
              maxLength={10}
              placeholder="Enter 10-digit number"
              value={phone}
              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
              className="flex-1 px-4 py-3 focus:outline-none"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          onClick={handleSendOtp}
          disabled={isLoading || phone.length !== 10}
          className="w-full h-12 text-base bg-green-600 hover:bg-green-700 disabled:opacity-50">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending OTP...
            </div>
          ) : (
            "Send OTP"
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            We'll send a 4-digit OTP to this number
          </p>
        </div>
      </div>
    </div>
  );
}

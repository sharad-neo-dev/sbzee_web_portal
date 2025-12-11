"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
} from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store/store";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { isLoading, error, isOtpSent } = useSelector(
    (state: RootState) => state.auth
  );

  const [phone, setPhoneInput] = useState("");

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    dispatch(sendOtpStart(phone));

    try {
      console.log("OTP request sent for:", phone);

      dispatch(sendOtpSuccess());
    } catch (err: any) {
      dispatch(sendOtpFailure("Failed to send OTP"));
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

      <label className="block text-sm font-medium mb-1">Phone Number</label>
      <input
        type="tel"
        maxLength={10}
        placeholder="Enter 10-digit phone"
        value={phone}
        onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
        className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring focus:ring-blue-300"
      />

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <Button
        onClick={handleSendOtp}
        disabled={isLoading}
        className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50">
        {isLoading ? "Sending..." : "Send OTP"}
      </Button>

      {isOtpSent && (
        <p className="text-green-600 text-sm mt-2 text-center">
          OTP sent successfully!
        </p>
      )}
    </div>
  );
}

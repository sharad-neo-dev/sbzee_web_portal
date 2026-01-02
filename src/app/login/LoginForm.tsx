"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, Smartphone, Shield, Truck, ChevronLeft } from "lucide-react";
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
  const [showBenefits, setShowBenefits] = useState(false);

  const {
    otpSentTo,
    userId,
    error: authError,
  } = useAppSelector((state) => state.auth);

  const [login, { isLoading: loginLoading, error: loginError }] =
    useLoginMutation();

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
        router.push(
          `/verify-otp?phone=${phone}&userId=${
            result.data.user.id
          }&redirect=${encodeURIComponent(redirectUrl)}`
        );
      }
    } catch (err: any) {
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row overflow-hidden">
      <div className="md:hidden p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBenefits(!showBenefits)}
          className="w-full border-green-200 text-green-700 hover:bg-green-50">
          {showBenefits ? (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Login
            </>
          ) : (
            <>
              <Leaf className="h-4 w-4 mr-2" />
              Why Choose Sbzee?
            </>
          )}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "bg-linear-to-br from-green-600 to-emerald-700 text-white",
          "md:w-1/2 md:flex flex-col justify-between p-8 md:p-12",
          "md:block",
          showBenefits ? "block" : "hidden"
        )}>
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 p-2 rounded-lg">
              <Leaf className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Sbzee</h1>
              <p className="text-green-100 text-sm">
                Fresh Fruits & Vegetables
              </p>
            </div>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Farm Fresh Produce <br className="hidden md:block" />
            Delivered Daily
          </h2>

          <p className="text-green-100 text-base md:text-lg mb-8 md:mb-10 max-w-lg">
            Experience the freshest fruits and vegetables, delivered to your
            doorstep. Quality you can taste, service you can trust.
          </p>

          <div className="space-y-5 md:space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2 rounded-full mt-0.5 shrink-0">
                <Truck className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg">
                  Next Morning Delivery
                </h3>
                <p className="text-green-100 text-sm">
                  Order by 11 PM, delivered fresh by morning
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2 rounded-full mt-0.5 shrink-0">
                <Shield className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg">
                  100% Quality Checked
                </h3>
                <p className="text-green-100 text-sm">
                  Every item inspected for freshness
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2 rounded-full mt-0.5 shrink-0">
                <Smartphone className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg">
                  Easy & Secure Login
                </h3>
                <p className="text-green-100 text-sm">
                  Quick OTP verification, no passwords needed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats for mobile */}
        <div className="mt-8 md:hidden">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="text-lg font-bold">10K+</div>
              <div className="text-xs text-green-100">Customers</div>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="text-lg font-bold">50+</div>
              <div className="text-xs text-green-100">Farms</div>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="text-lg font-bold">25+</div>
              <div className="text-xs text-green-100">Cities</div>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-10 pt-6 border-t border-white/20">
          <p className="text-green-100 text-xs md:text-sm">
            © {new Date().getFullYear()} Sbzee. Fresh fruits & vegetables
            delivery.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={cn(
          "flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 bg-white overflow-y-auto",
          "md:block",
          showBenefits ? "hidden" : "block"
        )}>
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="mb-8 md:hidden text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sbzee</h1>
                <p className="text-sm text-gray-600">Login to continue</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome to Sbzee
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Enter your mobile number to login or register
            </p>
          </motion.div>

          <form onSubmit={handleSendOtp} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <div className="pl-4 pr-3 py-3 border-r border-gray-300">
                    <span className="text-gray-700 font-medium">+91</span>
                  </div>
                </div>

                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setPhoneInput(value);
                    if (validationError) setValidationError("");
                  }}
                  className={cn(
                    "w-full border pl-20 pr-4 py-3 rounded-xl",
                    "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500",
                    "text-base placeholder:text-gray-400 placeholder:text-sm",
                    "transition-all duration-200",
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500",
                    isLoading && "opacity-70 cursor-not-allowed bg-gray-50"
                  )}
                  disabled={isLoading}
                  autoFocus
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="mt-0.5">⚠</div>
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3.5 md:py-4 text-base md:text-lg font-semibold rounded-xl",
                  "bg-green-600 hover:bg-green-700",
                  "text-white shadow-lg hover:shadow-xl",
                  "transition-all duration-300 active:scale-[0.98]",
                  isLoading && "opacity-80 cursor-not-allowed"
                )}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending OTP...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Send OTP
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-3">
                By continuing, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2">
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2">
                  Privacy Policy
                </a>
              </p>

              <p className="text-gray-500 text-xs">
                Need help?{" "}
                <a
                  href="mailto:support@sbzee.com"
                  className="text-green-600 hover:text-green-700 font-medium">
                  support@sbzee.com
                </a>
              </p>
            </div>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="h-3 w-3" />
              <span>Secure OTP verification</span>
            </div>
          </motion.div>

          {/* Stats for desktop */}
          <div className="mt-8 hidden md:grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">10K+</div>
              <div className="text-xs text-gray-600">Happy Customers</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">50+</div>
              <div className="text-xs text-gray-600">Farm Partners</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">25+</div>
              <div className="text-xs text-gray-600">Cities Served</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import LoginForm from "./LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-linear-to-br from-green-500 to-emerald-600 p-8 md:p-12 flex flex-col justify-center items-center text-white">
        <div className="max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome to Sbzee</h1>
            <p className="text-green-100">
              Fresh fruits & vegetables delivered to your doorstep
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg">🥦</span>
              </div>
              <div>
                <h3 className="font-semibold">Farm Fresh Quality</h3>
                <p className="text-sm text-green-100">
                  Direct from farm to your home
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg">🚚</span>
              </div>
              <div>
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-sm text-green-100">
                  Quick delivery within hours
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg">💰</span>
              </div>
              <div>
                <h3 className="font-semibold">Best Prices</h3>
                <p className="text-sm text-green-100">
                  Competitive prices guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm />

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              By logging in, you agree to our{" "}
              <a href="/terms" className="text-green-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-green-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

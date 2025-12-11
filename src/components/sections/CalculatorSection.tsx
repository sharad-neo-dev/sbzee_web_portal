"use client";

import Image from "next/image";
import { Check, MoveUpRight } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useState, useEffect, useCallback } from "react";

export function CalculatorSection() {
  const keyPoints = [
    "Working capital gets locked in invoices and credit notes.",
    "Vendors demand shorter payment cycles and early payment.",
    "Growth initiatives are delayed to manage near-term liquidity.",
  ];

  const [invoiceAmount, setInvoiceAmount] = useState(10000);
  const [delayDays, setDelayDays] = useState(60);
  const [feePercentage, setFeePercentage] = useState(0.2);

  const [totalInterest, setTotalInterest] = useState(0);
  const [totalRepayable, setTotalRepayable] = useState(0);
  const [unlockableToday, setUnlockableToday] = useState(0);

  const calculateValues = useCallback(() => {
    // interest: Amount x (Delay ÷ 365 x Fee %)
    const interest = invoiceAmount * (delayDays / 365) * (feePercentage / 100);

    // total repayable (invoice amount + interest)
    const repayable = invoiceAmount + interest;

    // unlockable amount (invoice amount - interest)
    const unlockable = invoiceAmount - interest;

    setTotalInterest(Math.round(interest));
    setTotalRepayable(Math.round(repayable));
    setUnlockableToday(Math.max(0, Math.round(unlockable)));
  }, [invoiceAmount, delayDays, feePercentage]);

  useEffect(() => {
    calculateValues();
  }, [calculateValues]);

  const handleInvoiceAmountChange = (value: number) => {
    setInvoiceAmount(Math.min(Math.max(value, 1000), 100000));
  };

  const handleDelayDaysChange = (value: number) => {
    setDelayDays(Math.min(Math.max(value, 1), 365));
  };

  const handleFeePercentageChange = (value: number) => {
    setFeePercentage(Math.min(Math.max(value, 0.2), 0.5));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section id="calculator" className="section-padding bg-[#F3F8FF]">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top Calculator Section */}
          <RevealOnScroll>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Estimate Your Unlockable Cash
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Indicative view of value locked in your receivables.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 w-full bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg mb-6 sm:mb-8">
              {/* Left side - Details */}
              <div className="lg:w-1/2">
                <div className="space-y-4 sm:space-y-6 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5">
                    <p className="text-gray-700 font-bold text-xl sm:text-2xl lg:text-3xl">
                      Your Invoice Amount
                    </p>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-[#FA8334]">
                        {formatCurrency(invoiceAmount)}
                      </p>
                      <div className="flex justify-end mt-1">
                        <p className="text-xs sm:text-sm text-gray-500">
                          @{feePercentage.toFixed(2)}% per day
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-2">
                      Total Repayable Amount
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {formatCurrency(totalRepayable)}
                    </p>
                  </div>
                  <hr className="border-gray-300" />
                  <div>
                    <p className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-2">
                      Total Interest Charged
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {formatCurrency(totalInterest)}
                    </p>
                  </div>

                  <div className="pt-4 sm:pt-6 lg:pt-8"></div>

                  <div className="bg-[#C6F5D2] p-4 sm:p-5 rounded-lg">
                    <p className="text-[#25522F] font-bold text-lg sm:text-xl mb-1.5 sm:mb-2">
                      You Could Unlock {formatCurrency(unlockableToday)} Today!
                    </p>
                    <p className="text-[#348040] text-xs sm:text-sm mb-1.5 sm:mb-2">
                      * Calculation: Amount x (Delay ÷ 365 x Fee %)—For
                      Illustration Only.
                    </p>
                    <p className="text-[#348040] text-xs sm:text-sm sm:ml-3">
                      Final Pricing Depends on Risk Assessment and Partner bank.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Input Ranges */}
              <div className="lg:w-1/2 space-y-6 sm:space-y-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      Invoice Amount (₹)
                    </p>
                    <input
                      type="number"
                      value={invoiceAmount}
                      onChange={(e) =>
                        handleInvoiceAmountChange(Number(e.target.value))
                      }
                      min="1000"
                      max="100000"
                      className="border border-gray-300 p-1.5 sm:p-2 rounded-lg w-full sm:w-32 text-left text-sm sm:text-base"
                    />
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    value={invoiceAmount}
                    onChange={(e) =>
                      handleInvoiceAmountChange(Number(e.target.value))
                    }
                    className="w-full accent-[#303981] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>₹1,000</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      Typical Delay (Days)
                    </p>
                    <input
                      type="number"
                      value={delayDays}
                      onChange={(e) =>
                        handleDelayDaysChange(Number(e.target.value))
                      }
                      min="1"
                      max="365"
                      className="border border-gray-300 p-1.5 sm:p-2 rounded-lg w-full sm:w-32 text-left text-sm sm:text-base"
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="365"
                    value={delayDays}
                    onChange={(e) =>
                      handleDelayDaysChange(Number(e.target.value))
                    }
                    className="w-full accent-[#303981] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>1 Day</span>
                    <span>365 Days</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      Estimated Fee % (0.2 - 0.5)
                    </p>
                    <input
                      type="number"
                      value={feePercentage}
                      onChange={(e) =>
                        handleFeePercentageChange(Number(e.target.value))
                      }
                      min="0.2"
                      max="0.5"
                      step="0.1"
                      className="border border-gray-300 p-1.5 sm:p-2 rounded-lg w-full sm:w-32 text-left text-sm sm:text-base"
                    />
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.5"
                    step="0.1"
                    value={feePercentage}
                    onChange={(e) =>
                      handleFeePercentageChange(Number(e.target.value))
                    }
                    className="w-full accent-[#303981] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>0.2%</span>
                    <span>0.5%</span>
                  </div>
                </div>

                <div className="flex justify-center w-full">
                  <button
                    className="bg-gradient-to-r from-[#162acb] to-[#303981] text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg w-full text-sm sm:text-base"
                    aria-label="Start Your Application">
                    Start Your Application
                    <MoveUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* How Finance Teams Use This */}
          <RevealOnScroll delay={0.3}>
            <div className="w-full bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                How Finance Teams Use This
              </h3>
              <RevealOnScroll delay={0.2} distance={10}>
                <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
                  {keyPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#FA8334] rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                      <p className="text-gray-700 text-sm sm:text-base">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
              <p className="text-gray-700 text-sm sm:text-base">
                AssuredPay helps you convert a portion of this into immediate
                working capital - so you can focus on sales, not chasing
                collections.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

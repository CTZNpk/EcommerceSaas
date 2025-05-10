import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import useFetch from "@/hooks/useFetch";

const stripePromise = loadStripe(
  "pk_test_51R1Oz7Rt564ooPGdwIVcStiPeUbckVgmIdSoGwpBo7yYXJuhA6FsJbLVaC9pTmJxdKwUO6sla84bxMHIWj0Q05xA004UFiaLKk",
);

// Custom card styles
const cardElementOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { error: fetchError, triggerFetch } = useFetch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [cardComplete, setCardComplete] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (fetchError) {
      setErrorMessage(fetchError || "Payment processing failed");
    }
  }, [fetchError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    // Handle card tokenization
    const { token, error: stripeError } = await stripe.createToken(cardElement);

    if (stripeError) {
      setErrorMessage(stripeError.message || "Payment processing failed");
      setIsProcessing(false);
      return;
    }

    // Process payment
    const response = await triggerFetch(
      "/stripe/pay",
      {
        method: "POST",
        body: JSON.stringify({
          token,
          amount: 10,
        }),
      },
      true,
    );

    setIsProcessing(false);

    // Handle successful response with potential server error
    if (response?.data?.error) {
      setErrorMessage(response.data.error);
    } else if (response?.data?.message) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="text-emerald-500 mb-5">
          <svg className="w-16 h-16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm5.66,9.05-6.25,6.25a1,1,0,0,1-1.41,0l-3.61-3.61a1,1,0,0,1,1.41-1.41L10.83,13,16.3,7.46a1,1,0,0,1,1.41,0A1,1,0,0,1,17.66,9.05Z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-500">Thank you for your purchase</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Complete Payment
          </h2>
          <div className="flex space-x-2">
            {/* Credit card icons could be replaced with actual images */}
            <div className="w-10 h-6 bg-gray-100 rounded"></div>
            <div className="w-10 h-6 bg-gray-100 rounded"></div>
            <div className="w-10 h-6 bg-gray-100 rounded"></div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 p-3 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition">
            <CardElement
              options={cardElementOptions}
              onChange={(e) => setCardComplete(e.complete)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
          <div className="text-sm text-gray-600">Total Amount:</div>
          <div className="text-lg font-semibold text-gray-800">$10.00</div>
        </div>

        {errorMessage && (
          <div className="flex items-center space-x-2 px-4 py-3 bg-red-50 text-red-700 border-l-4 border-red-500 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing || !cardComplete}
          className={`w-full py-4 px-4 bg-indigo-600 text-white font-medium rounded-lg transition 
            ${!stripe || isProcessing || !cardComplete ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"} 
            relative`}
        >
          <span className={isProcessing ? "opacity-0" : ""}>
            {isProcessing ? "Processing..." : "Pay $10.00"}
          </span>
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </button>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Secure payment processed by Stripe</span>
        </div>
      </form>
    </div>
  );
};

const StripePaymentScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentScreen;

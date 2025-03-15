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

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { loading, error: fetchError, triggerFetch } = useFetch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (fetchError) {
      setErrorMessage(fetchError || "Payment processing failed");
    }
  }, [fetchError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    // Handle card tokenization
    const { token, error: stripeError } = await stripe.createToken(cardElement);
    if (stripeError) {
      setErrorMessage(stripeError.message || "Payment processing failed");
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

    // Handle successful response with potential server error
    if (response?.data?.error) {
      setErrorMessage(response.data.error);
    } else if (response?.data?.message) {
      alert(response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {errorMessage && (
        <div style={{ color: "red", margin: "10px 0" }}>{errorMessage}</div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{ marginTop: "10px" }}
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

const StripePaymentScreen = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default StripePaymentScreen;

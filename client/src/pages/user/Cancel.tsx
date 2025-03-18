import { useNavigate } from "react-router-dom";
import { XCircleIcon } from "@heroicons/react/24/solid";

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <XCircleIcon className="h-20 w-20 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-800">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 text-center">
            Your payment was not completed. You can try again whenever you're
            ready.
          </p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Return Home
            </button>
            <button
              onClick={() => navigate("/checkout")} // Replace with your checkout path
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;

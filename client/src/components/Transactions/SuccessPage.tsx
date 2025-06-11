// /src/pages/PaymentSuccess.tsx
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const referenceId = searchParams.get("reference");

  return (
    <div className="payment-success">
      <h2>Payment Successful ✅</h2>
      <p>Reference ID: {referenceId}</p>
    </div>
  );
};

export default PaymentSuccess;

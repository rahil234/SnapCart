import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RazorpayOptions, RazorpayResponse } from 'types/razorpay';
import { Button } from "../ui/button";
import { toast } from "sonner";
import orderEndpoints from "@/api/orderEndpoints";
import { ImportMeta, catchError } from "shared/types";

interface PaymentButtonProps {
   orderId: string;
   className?: string;
   children: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({className, children, orderId }) => {

   const navigate = useNavigate();

   useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
         document.body.removeChild(script);
      };
   }, []);

   const handlePayment = async () => {
      try {
         const order = (await orderEndpoints.createPayment(orderId)).data;

         if (!window.Razorpay) {
            alert("Razorpay SDK failed to load. Please check your connection.");
            return;
         }

         const options: RazorpayOptions = {
            key: (import.meta as unknown as ImportMeta).env.VITE_RAZORPAY_KEY_ID,
            order_id: order.id,
            description: "Product Purchase",
            handler: (response) => {
               verifyPayment({ ...response, orderId });
            },
            modal:{
               "ondismiss": () => {},
            },
            prefill: {
               name: "Rahil",
               email: "rahil@example.com",
               contact: "8136900460",
            }
         };

         const rzp = new window.Razorpay(options);

         rzp.on("payment.failed", (response) => {
            console.log("failed", response);
            toast.error("Payment failed");
            navigate('/order-failure', { replace: true });
         });
         rzp.open();
      } catch (error) {
         toast.error((error as catchError).response.data.message);
      }
   };

   const verifyPayment = async (data: RazorpayResponse) => {
      try {
         const orderId = (await orderEndpoints.verifyPayment(data)).orderId;

         navigate('/order-success/' + orderId, { replace: true });
      } catch (error) {
         toast.error((error as catchError).response.data.message);
      }
   };

   return <Button className={className} onClick={handlePayment}>{children}</Button>;
};

export default PaymentButton;
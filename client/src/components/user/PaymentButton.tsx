import orderEndpoints from "@/api/orderEndpoints";
import React, { useEffect, useState } from "react";
import { ImportMeta } from "shared/types";
import { RazorpayOptions, RazorpayResponse } from "types/razorpay";
import { Button } from "../ui/button";
import { UseFormGetValues } from "react-hook-form";
import { CheckoutFormValues } from "@/pages/user/CheckoutPage";
import { toast } from "sonner";

interface Order {
   id: string;
   amount: number;
   currency: string;
};


interface PaymentButtonProps {
   getValues: UseFormGetValues<CheckoutFormValues>;
   children: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ children, getValues }) => {
   const [order, setOrder] = useState<Order | null>(null)

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
         const orderData = getValues();
         await orderEndpoints.verifyCheckout();
         const response = await orderEndpoints.createPayment(orderData);
         setOrder(response.data);

         if (!order) return;

         if (!window.Razorpay) {
            alert("Razorpay SDK failed to load. Please check your connection.");
            return;
         }

         const options: RazorpayOptions = {
            key: (import.meta as unknown as ImportMeta).env.VITE_RAZORPAY_KEY_ID,
            order_id: order.id,
            description: "Product Purchase",
            handler: (response) => {
               console.log(response);
               verifyPayment(response);
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
         });
         rzp.open();
      } catch (error) {
         toast.error(error.response.data.message);
      }
   };

   const verifyPayment = (response: RazorpayResponse) => {
      orderEndpoints.verifyPayment(response).then((res) => {
         return res.data;
      }).catch((error) => {
         alert(error.response.data);
      });
   };

   return <Button className="w-full" onClick={handlePayment}>{children}</Button>;
};

export default PaymentButton;
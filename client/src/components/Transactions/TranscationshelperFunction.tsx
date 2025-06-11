import axios from "axios";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const myId = localStorage.getItem("userId");

interface Transaction {
  amount: number;
  type: 'BuyPremium' | 'Bet' | 'Topup' ;
}
const token = localStorage.getItem('token');

export default async function checkout({ amount, type }: Transaction) {
  // Implement checkout logic here
    if(amount <=0) return ;
    console.log(`Processing ${type} transaction for amount: ${amount}`);
    try{
        const { data: { key } } = await axios.get("/api/v1/pay/getkey", {
         headers: {
          Authorization: `Bearer ${token}`,
        },
        })
        console.log("the key received is helper function is : ", key)
        const { data: { order } } = await axios.post("/api/v1/pay/checkout", {
            amount,
            type
        },{
          headers: {
          Authorization: `Bearer ${token}`,
          },
        });

         const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "Aditya Choudhary",
            description: "Tutorial of RazorPay",
            image: "https://avatars.githubusercontent.com/u/150316743?s=400&v=4",
            order_id: order.id,
            callback_url: "http://localhost:3000/api/v1/pay/paymentverification",
            prefill: {
                name: "Aditya Choudhary",
                email: "aditya.choudhary@example.com",
                contact: "9999999999"
            },
            notes: {
                "address": "Razorpay Corporate Office",
                "userId" : myId
            },
            theme: {
                "color": "#121212"
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();
    }   
    catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || error.message || "An error occurred during checkout.");
      } else {
        alert("An unexpected error occurred during checkout.");
      }
      console.error("Error during checkout:", error);
    }

}

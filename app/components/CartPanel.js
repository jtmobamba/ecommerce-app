import {useState} from "react"
import { loadStripe } from "@stripe/stripe-js"
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
export default function CartPanel({ cart, updateQuantity, removeFromCart, total, closeCart }){
    const [ loading, setLoading ] = useState(false);
    const checkout = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({cart}),
            })
            const session = await response.json();
            const stripe = await stripePromise;
        } catch(error){
            console.error("checkout error:", error);
        }finally{
            setLoading(false)
        }
    }
    return(
        <div className="reletive text-white z-50 fixed top-0 right-0 w-screen sm:w-[450px] h-full shadow-lg p-6 bg-zinc-950">
            <button onClick={closeCart} className="absolute top-4 right-4 text-3xl">x</button>
            <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
            { cart.length === 0 ? (
            <p className="text-white">Your cart is empty.</p>
            ): (
                <div>
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center space-x-4">
                                <img src={item.image} className="w-16 h-16 object-cover rounded"/>
                                <div>
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p>{item.price} x {item.quantity}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            <button className="text-red-500" onClick={() => removeFromCart(item.id)}>remove</button>
                            </div>
                        </div>
                    ))}
                    <div className="text-lg font-bold mt-4">Total: ${total.toFixed(2)}</div>
                    <button onClick={checkout} disabled={loading} className="mt-4 py-2 bg-green-200 text-black rounded px-6">
                        {loading ? "Processing..." : "Checkout"}
                    </button>
                </div>
            )}
        </div>
    )
}
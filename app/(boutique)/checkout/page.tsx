import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata: Metadata = { title: "Commande", description: "Demande de commande Moluki Alembakate, sans encaissement." }

export default function CheckoutPage() {
  return <CheckoutForm />
}

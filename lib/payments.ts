export type PaymentPreparation = {
  provider: "unconfigured"
  status: "not_charged"
  orderId: string
}

/**
 * Point d'extension pour un prestataire (Stripe, etc.).
 * Tant qu'aucune clé n'est branchée, aucune intention de paiement n'est créée
 * et aucun encaissement n'est simulé.
 */
export async function preparePayment(orderId: string): Promise<PaymentPreparation> {
  return {
    provider: "unconfigured",
    status: "not_charged",
    orderId,
  }
}

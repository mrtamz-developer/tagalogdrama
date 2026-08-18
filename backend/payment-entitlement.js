import { randomUUID } from 'node:crypto';

export const PLAN_DAYS = Object.freeze({ daily: 1, weekly: 7, monthly: 30 });
export const PLAN_PRICES_CENTAVOS = Object.freeze({ daily: 2900, weekly: 9900, monthly: 24900 });

export function entitlementFromCheckout({ eventId, userId, plan, session, now = new Date() }) {
  if (!eventId || !userId || !session) throw new Error('Missing payment fulfillment data');
  if (!Object.hasOwn(PLAN_DAYS, plan)) throw new Error('Invalid subscription plan');

  const amount = session.attributes?.line_items?.[0]?.amount;
  const currency = session.attributes?.line_items?.[0]?.currency;
  if (amount !== PLAN_PRICES_CENTAVOS[plan] || currency !== 'PHP') {
    throw new Error('Payment amount or currency does not match plan');
  }

  const startedAt = new Date(now);
  const expiresAt = new Date(startedAt);
  expiresAt.setUTCDate(expiresAt.getUTCDate() + PLAN_DAYS[plan]);

  return {
    webhookEvent: {
      id: randomUUID(),
      providerEventId: eventId,
      status: 'processed',
      processedAt: startedAt.toISOString()
    },
    payment: {
      userId,
      provider: 'paymongo',
      checkoutSessionId: session.id,
      providerPaymentId: session.attributes?.payments?.[0]?.id ?? null,
      plan,
      amountCentavos: amount,
      currency,
      status: 'paid',
      livemode: Boolean(session.livemode),
      paidAt: startedAt.toISOString()
    },
    subscription: {
      userId,
      plan,
      status: 'active',
      provider: 'paymongo',
      providerCheckoutSessionId: session.id,
      startsAt: startedAt.toISOString(),
      expiresAt: expiresAt.toISOString()
    }
  };
}

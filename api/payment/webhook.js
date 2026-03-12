// api/payment/webhook.js — Vercel Serverless Function
// Receives Midtrans payment notifications (POST webhook)
// Set this URL in Midtrans dashboard: https://yourdomain.vercel.app/api/payment/webhook

import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const notification = req.body;
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status
  } = notification;

  // ── Verify signature ───────────────────────────────────────
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const expectedSig = crypto
    .createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest('hex');

  if (signature_key !== expectedSig) {
    console.error('Invalid Midtrans signature for order:', order_id);
    return res.status(403).json({ error: 'Invalid signature' });
  }

  // ── Handle payment result ──────────────────────────────────
  const isPaid = (
    (transaction_status === 'capture' && fraud_status === 'accept') ||
    transaction_status === 'settlement'
  );
  const isFailed = ['deny','cancel','expire','failure'].includes(transaction_status);

  console.log(`Order ${order_id}: ${transaction_status} | paid=${isPaid}`);

  // TODO (optional): Save to your database here
  // e.g. await db.orders.upsert({ orderId: order_id, paid: isPaid })
  // For now, the frontend polls /api/payment/status to check directly via Midtrans API

  return res.status(200).json({ received: true, paid: isPaid });
}

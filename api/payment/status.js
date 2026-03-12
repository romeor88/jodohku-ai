// api/payment/status.js — Vercel Serverless Function
// Checks Midtrans payment status by orderId (used for polling)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { orderId } = req.query;
  if (!orderId) return res.status(400).json({ error: 'orderId required' });

  const serverKey   = process.env.MIDTRANS_SERVER_KEY;
  const encoded     = Buffer.from(serverKey + ':').toString('base64');
  const isProduction = process.env.MIDTRANS_ENV === 'production';

  const baseUrl = isProduction
    ? `https://api.midtrans.com/v2/${orderId}/status`
    : `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

  try {
    const response = await fetch(baseUrl, {
      headers: { 'Authorization': `Basic ${encoded}` }
    });
    const data = await response.json();

    // Midtrans transaction_status values:
    // settlement / capture = paid ✅
    // pending = still waiting
    // deny / cancel / expire / failure = failed
    const paid = ['settlement', 'capture'].includes(data.transaction_status);
    const failed = ['deny','cancel','expire','failure'].includes(data.transaction_status);

    return res.status(200).json({
      status: paid ? 'paid' : failed ? 'failed' : 'pending',
      raw: data.transaction_status
    });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({ status: 'error' });
  }
}

// api/payment/create.js — Vercel Serverless Function
// Creates a Midtrans Snap transaction token

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, amount, orderId } = req.body;

  // Midtrans server key (Sandbox: starts with SB-, Production: starts with Mid-)
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const encoded   = Buffer.from(serverKey + ':').toString('base64');

  // Use sandbox URL for testing, production URL for live
  const isProduction = process.env.MIDTRANS_ENV === 'production';
  const baseUrl = isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount // 9900
    },
    customer_details: {
      first_name: name,
      email: email || 'user@jodohku.ai'
    },
    item_details: [{
      id: 'PREMIUM_READING',
      price: amount,
      quantity: 1,
      name: 'Ramalan Jodoh Premium – Jodohku.ai'
    }],
    // Enable specific payment methods popular in Indonesia
    enabled_payments: [
      'qris', 'gopay', 'shopeepay', 'dana',
      'bca_va', 'bni_va', 'bri_va', 'mandiri_va',
      'indomaret', 'alfamart'
    ],
    expiry: {
      unit: 'hours',
      duration: 2 // token expires in 2 hours
    }
  };

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encoded}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.token) {
      return res.status(200).json({ token: data.token, orderId });
    } else {
      console.error('Midtrans error:', data);
      return res.status(400).json({ error: 'Failed to create payment token', detail: data });
    }
  } catch (error) {
    console.error('Payment create error:', error);
    return res.status(500).json({ error: 'Payment service unavailable' });
  }
}

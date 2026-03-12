# Jodohku.ai 🔮

AI-powered Indonesian jodoh (soulmate) compatibility app using Weton Jawa + Zodiak + Claude AI.

## Stack
- **Frontend**: Pure HTML/CSS/JS (no framework needed)
- **Backend**: Vercel Serverless Functions (Node.js)
- **AI**: Anthropic Claude API
- **Payments**: Midtrans Snap

---

## 🚀 Deploy in 20 Minutes

### Step 1 — Get your API keys

#### Anthropic (Claude AI)
1. Go to https://console.anthropic.com
2. Create account → API Keys → Create Key
3. Copy the key (starts with `sk-ant-...`)

#### Midtrans
1. Go to https://dashboard.midtrans.com
2. Register with KTP (individual is fine, no PT needed)
3. Go to Settings → Access Keys
4. Copy **Server Key** and **Client Key**
5. Start with **Sandbox** environment for testing

---

### Step 2 — Deploy to Vercel

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login:
   ```
   vercel login
   ```

3. Deploy from this folder:
   ```
   vercel --prod
   ```

4. Vercel will give you a URL like: `https://jodohku-ai.vercel.app`

---

### Step 3 — Set Environment Variables

In Vercel dashboard → Your Project → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxx` |
| `MIDTRANS_SERVER_KEY` | `SB-Mid-server-xxxxx` (sandbox) or `Mid-server-xxxxx` (production) |
| `MIDTRANS_ENV` | `sandbox` or `production` |

Then redeploy: `vercel --prod`

---

### Step 4 — Update Frontend with Midtrans Client Key

In `public/index.html`, find this line at the bottom:
```html
<script src="https://app.midtrans.com/snap/snap.js" data-client-key="YOUR_MIDTRANS_CLIENT_KEY">
```

Replace `YOUR_MIDTRANS_CLIENT_KEY` with your actual Midtrans **Client Key** (not server key).

For **sandbox testing**, use: `https://app.sandbox.midtrans.com/snap/snap.js`
For **production**, use: `https://app.midtrans.com/snap/snap.js`

---

### Step 5 — Set Midtrans Webhook URL

In Midtrans Dashboard → Settings → Configuration:
- **Payment Notification URL**: `https://your-vercel-url.vercel.app/api/payment/webhook`

---

### Step 6 — Custom Domain (optional, recommended)

1. Buy `jodohku.id` or `jodohku.my.id` at Niagahoster (~Rp 200k/year)
2. In Vercel → Domains → Add your domain
3. Point DNS to Vercel (they'll guide you)

---

## 💰 Revenue Calculation

At Rp 9.900 per reading:
- 10 sales/day = Rp 2.97M/month
- 50 sales/day = Rp 14.8M/month
- 200 sales/day = Rp 59.4M/month

Midtrans fee: ~2.9% per transaction (Rp ~287 per sale)

---

## 📱 Promote It

Share this on:
- TikTok: Record yourself using the app, show the result
- Instagram Stories: "Cek jodoh kamu! link di bio"
- WhatsApp group: Share your result screenshot

---

## 🧪 Test Payments (Sandbox)

Use these test credentials in Midtrans Sandbox:
- **GoPay**: Any phone number, approve in Midtrans Simulator
- **QRIS**: Use the simulator at https://simulator.sandbox.midtrans.com
- **VA Transfer**: Use test VA numbers provided by Midtrans

---

## File Structure

```
jodohku/
├── public/
│   └── index.html          ← Main frontend
├── api/
│   ├── reading.js           ← Claude AI reading generator
│   └── payment/
│       ├── create.js        ← Creates Midtrans payment token
│       ├── status.js        ← Checks payment status (polling)
│       └── webhook.js       ← Receives Midtrans notifications
├── vercel.json              ← Vercel routing config
└── package.json
```

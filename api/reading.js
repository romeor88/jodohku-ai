// api/reading.js — Vercel Serverless Function
// Generates free + premium AI readings using Claude API

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { type, n1, n2, z1, z2, w1, w2, score } = req.body;

  const isPremium = type === 'premium';

  const systemPrompt = `Kamu adalah dukun digital Jawa yang bijaksana bernama Ki Jodohku. 
Kamu memberikan ramalan jodoh dalam Bahasa Indonesia yang hangat, poetic, dan personal.
Gaya bicara kamu: misterius tapi menenangkan, seperti kakek bijak yang tahu segalanya.
PENTING: Selalu ingatkan bahwa ini hanya untuk hiburan di akhir.
Output kamu harus berupa HTML dengan class CSS yang sudah tersedia.`;

  const userPrompt = isPremium
    ? `Berikan RAMALAN PREMIUM lengkap untuk pasangan ini:
- ${n1} (Weton: ${w1}, Zodiak: ${z1})
- ${n2} (Weton: ${w2}, Zodiak: ${z2})
- Skor kecocokan: ${score}%

Buat 4 section HTML dengan format:
<div class="section"><h4>[JUDUL]</h4><p>[ISI RAMALAN]</p></div>

Section yang harus ada:
1. "Hari & Bulan Terbaik" — kapan waktu terbaik bertemu, jadian, atau bicara serius
2. "Pantangan Weton" — hari/situasi yang harus dihindari pasangan ini
3. "Ramalan Cinta 6 Bulan Ke Depan" — narasi romantis tentang perjalanan hubungan mereka
4. "Pesan Ki Jodohku" — pesan personal dan bijak untuk pasangan ini

Tulis dengan gaya puitis dan personal. Sebut nama ${n1} dan ${n2} langsung.`

    : `Berikan ramalan GRATIS singkat untuk pasangan ini:
- ${n1} (Weton: ${w1}, Zodiak: ${z1})  
- ${n2} (Weton: ${w2}, Zodiak: ${z2})
- Skor kecocokan: ${score}%

Buat 2 section HTML:
<div class="reading-section"><h4>💕 Kecocokan Cinta</h4><p>[ISI]</p></div>
<div class="reading-section"><h4>🌿 Saran Primbon</h4><p>[ISI]</p></div>

Tulis 2-3 kalimat per section. Personal, poetic, sebut nama mereka langsung. Jangan terlalu panjang.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await response.json();
    const html = data.content?.[0]?.text || '<p>Ramalan sedang diproses...</p>';

    return res.status(200).json({ html });
  } catch (error) {
    console.error('Reading API error:', error);
    return res.status(500).json({ html: '<p>Gagal memuat ramalan. Coba lagi.</p>' });
  }
}

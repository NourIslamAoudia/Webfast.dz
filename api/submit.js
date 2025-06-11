// pages/api/submit.js
export default async function handler(req, res) {
  // 1) Répondre au preflight CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  // 2) N’accepter que les POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // 3) Récupérer le JSON envoyé par le front
    const payload   = req.body;

    // 4) Appeler votre Apps Script Web App
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzFhJXEBNbZaXy_VF7latzHV1s5LRNNYSv_X4iIBvkaa_5TaNodf_ZqnLVEq6Qd3PYI/exec';
    const upstream  = await fetch(scriptUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });

    // 5) Récupérer sa réponse JSON
    const data = await upstream.json();

    // 6) Renvoi au client avec CORS autorisé
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(upstream.status).json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ status: 'error', error: err.message });
  }
}

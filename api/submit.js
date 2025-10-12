// pages/api/submit.js - Version avec debug
export default async function handler(req, res) {
  console.log("API called with method:", req.method);

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const payload = req.body;
    console.log("Payload to send:", payload);

    // REMPLACEZ PAR VOTRE NOUVELLE URL APPS SCRIPT
    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbzKlx4SvOIZ-l1bC-zYGy47eXhs4lN0fZ9c7WAaOPtkTgzA6PKtEKV928CZ2nYz3bDd/exec";

    console.log("Calling Apps Script at:", scriptUrl);

    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; API-Proxy/1.0)",
      },
      body: JSON.stringify(payload),
    });

    console.log("Apps Script responded with status:", upstream.status);
    console.log(
      "Response headers:",
      Object.fromEntries(upstream.headers.entries())
    );

    const responseText = await upstream.text();
    console.log("Raw response:", responseText.substring(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
      console.log("Parsed response:", data);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      console.error("Response was:", responseText);

      // Si la réponse contient du HTML, c'est probablement une erreur d'autorisation
      if (
        responseText.includes("<!DOCTYPE") ||
        responseText.includes("<html")
      ) {
        throw new Error(
          "Apps Script returned HTML - check permissions and deployment"
        );
      }

      throw new Error("Invalid JSON response from Apps Script");
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(500).json({
      status: "error",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}

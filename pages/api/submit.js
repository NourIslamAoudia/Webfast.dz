// pages/api/submit.js - Version Production Sécurisée

const ALLOWED_ORIGINS = [
  "https://webfast-dz.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5500", // Live Server
];

// Rate limiting en mémoire
const rateLimitMap = new Map();

function validatePayload(data) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\s()-]+$/;

  if (!data || typeof data !== "object")
    return { valid: false, error: "Données invalides" };
  
  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0 || data.name.length > 100) {
    return { valid: false, error: "Nom invalide" };
  }
  
  if (!data.email || !emailRegex.test(data.email) || data.email.length > 255) {
    return { valid: false, error: "Email invalide" };
  }
  
  if (!data.phone || !phoneRegex.test(data.phone) || data.phone.length > 20) {
    return { valid: false, error: "Téléphone invalide" };
  }
  
  if (!data.type || !data.budget || !data.deadline || !data.message) {
    return { valid: false, error: "Tous les champs sont requis" };
  }
  
  if (data.message.length > 2000) {
    return { valid: false, error: "Message trop long" };
  }

  return { valid: true };
}

function checkRateLimit(ip) {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  const recentRequests = requests.filter((time) => now - time < 60000);

  if (recentRequests.length >= 5) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);

  if (rateLimitMap.size > 1000) {
    const keysToDelete = Array.from(rateLimitMap.keys()).slice(0, 100);
    keysToDelete.forEach((key) => rateLimitMap.delete(key));
  }

  return true;
}

function sanitizeString(str) {
  if (typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "").substring(0, 2000);
}

export default async function handler(req, res) {
  const origin = req.headers.origin;

  // CORS preflight
  if (req.method === "OPTIONS") {
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(204).end();
  }

  // Vérifier la méthode
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      error: "Méthode non autorisée",
    });
  }

  // Rate limiting
  const clientIP =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    "unknown";

  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({
      status: "error",
      error: "Trop de requêtes. Attendez une minute.",
    });
  }

  try {
    const payload = req.body;

    // Validation
    const validation = validatePayload(payload);
    if (!validation.valid) {
      return res.status(400).json({
        status: "error",
        error: validation.error,
      });
    }

    // Sanitization
    const sanitizedPayload = {
      name: sanitizeString(payload.name),
      email: sanitizeString(payload.email).toLowerCase(),
      phone: sanitizeString(payload.phone),
      type: sanitizeString(payload.type),
      budget: sanitizeString(payload.budget),
      deadline: sanitizeString(payload.deadline),
      message: sanitizeString(payload.message),
    };

    // ⚠️ METTEZ VOTRE URL APPS SCRIPT ICI
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL || 
      "https://script.google.com/macros/s/VOTRE_URL_ICI/exec";

    console.log("Calling Apps Script...");

    // Appel à Apps Script avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedPayload),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    console.log("Apps Script status:", upstream.status);

    const responseText = await upstream.text();

    // Parser la réponse
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      
      if (responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
        throw new Error("Apps Script configuration error");
      }
      
      throw new Error("Invalid response from server");
    }

    // Headers de sécurité
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");

    return res.status(200).json(data);

  } catch (err) {
    console.error("API error:", err);

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    let errorMessage = "Une erreur est survenue";
    let statusCode = 500;

    if (err.name === "AbortError") {
      errorMessage = "Le serveur met trop de temps à répondre";
      statusCode = 504;
    } else if (err.message.includes("configuration")) {
      errorMessage = "Erreur de configuration du serveur";
      statusCode = 503;
    }

    return res.status(statusCode).json({
      status: "error",
      error: errorMessage,
    });
  }
}
// api/submit.js - API Vercel Sécurisée

const ALLOWED_ORIGINS = [
  "https://webfast-dz.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
];

const rateLimitMap = new Map();

function validatePayload(data) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\s()-]+$/;

  if (!data || typeof data !== "object") {
    return { valid: false, error: "Données invalides" };
  }
  
  if (!data.name || data.name.trim().length === 0 || data.name.length > 100) {
    return { valid: false, error: "Nom invalide" };
  }
  
  if (!data.email || !emailRegex.test(data.email)) {
    return { valid: false, error: "Email invalide" };
  }
  
  if (!data.phone || !phoneRegex.test(data.phone) || data.phone.length > 20) {
    return { valid: false, error: "Téléphone invalide" };
  }
  
  if (!data.type || !data.budget || !data.deadline || !data.message) {
    return { valid: false, error: "Tous les champs sont requis" };
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

  // CORS
  if (req.method === "OPTIONS") {
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

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
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
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
      if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
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

    // URL Apps Script depuis variable d'environnement
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      console.error("GOOGLE_APPS_SCRIPT_URL not configured");
      if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
      return res.status(503).json({
        status: "error",
        error: "Service temporairement indisponible",
      });
    }

    console.log("Calling Apps Script...");

    // Appel à Apps Script
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(sanitizedPayload),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    console.log("Apps Script status:", upstream.status);

    const responseText = await upstream.text();
    console.log("Raw response:", responseText.substring(0, 200));

    // Parser JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      
      if (responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
        throw new Error("Apps Script permission error");
      }
      
      throw new Error("Invalid JSON response");
    }

    // Headers de sécurité
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("X-Content-Type-Options", "nosniff");

    console.log("Success!");
    return res.status(200).json(data);

  } catch (err) {
    console.error("API error:", err);

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    let errorMessage = "Une erreur est survenue";
    let statusCode = 500;

    if (err.name === "AbortError") {
      errorMessage = "Timeout: le serveur met trop de temps";
      statusCode = 504;
    } else if (err.message.includes("permission")) {
      errorMessage = "Erreur de configuration serveur";
      statusCode = 503;
    }

    return res.status(statusCode).json({
      status: "error",
      error: errorMessage,
    });
  }
}
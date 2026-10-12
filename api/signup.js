module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { email, company } = req.body || {};
  if (company) return res.status(200).json({ ok: true });

  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return res
      .status(503)
      .json({
        error: "Signups are not available yet. Please try again later.",
      });
  }

  let endpoint;
  try {
    endpoint = new URL("/rest/v1/waitlist_signups", supabaseUrl);
  } catch {
    return res
      .status(500)
      .json({ error: "Signups are temporarily unavailable." });
  }
  if (endpoint.protocol !== "https:" && endpoint.protocol !== "http:") {
    return res
      .status(500)
      .json({ error: "Signups are temporarily unavailable." });
  }
  endpoint.searchParams.set("on_conflict", "email");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        source: "clarity-landing-page",
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Supabase responded ${response.status}: ${detail}`);
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Signup failed:", error);
    return res
      .status(502)
      .json({ error: "We couldn't complete your signup. Please try again." });
  } finally {
    clearTimeout(timeout);
  }
};

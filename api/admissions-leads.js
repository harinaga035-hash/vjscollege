module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed.' });
    return;
  }

  const webhookUrl = "https://script.google.com/macros/s/AKfycbxHF3F1k1vv6eAV-tpKIP6QAoO91-YBt-k1tGhII6BTcVpqkWteTLsEhJwoTlVU3pkx/exec";
  if (!webhookUrl) {
    console.error('[Admissions CRM] Missing ADMISSIONS_CRM_WEBHOOK_URL.');
    res.status(500).json({
      ok: false,
      message: 'CRM webhook is not configured for Vercel.'
    });
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[Admissions CRM] Webhook failed.', response.status, text);
      res.status(502).json({ ok: false, message: 'CRM webhook failed.' });
      return;
    }

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = { ok: true };
    }

    res.status(200).json({ ok: true, crm: data });
  } catch (error) {
    console.error('[Admissions CRM] Webhook request error.', error);
    res.status(500).json({ ok: false, message: 'Unable to save lead.' });
  }
};

// Vercel Serverless Function - Envoi d'email sécurisé via Brevo
// La clé API est stockée dans les variables d'environnement Vercel

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.nagcoaching.fr');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API key is configured
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { name, phone, email, goal, availability, message } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    // Sanitize inputs
    const sanitize = (str) => String(str || '').replace(/[<>]/g, '');

    const data = {
      name: sanitize(name),
      phone: sanitize(phone),
      email: sanitize(email) || 'Non renseigné',
      goal: sanitize(goal) || 'Non renseigné',
      availability: sanitize(availability) || 'Non renseigné',
      message: sanitize(message) || 'Aucun'
    };

    const emailContent = {
      sender: { name: 'Nag Coaching Site', email: 'contact@nagcoaching.fr' },
      to: [{ email: 'nagcoachingpro@gmail.com', name: 'Nag Coaching' }],
      subject: `Nouvelle demande d'essai - ${data.name}`,
      htmlContent: `
        <h2>Nouvelle demande de séance d'essai</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Prénom</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Téléphone</strong></td><td style="padding: 10px; border: 1px solid #ddd;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Email</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Objectif</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${data.goal}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Disponibilités</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${data.availability}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Message</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${data.message}</td></tr>
        </table>
        <p style="margin-top: 20px; color: #666;">Envoyé depuis le formulaire de contact nagcoaching.fr</p>
      `
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(emailContent)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Brevo API error:', errorData);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

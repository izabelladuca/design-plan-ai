export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { systemPrompt, userQuery } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // A chave ficará protegida aqui

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar IA' });
  }
}

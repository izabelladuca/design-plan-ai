export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { systemPrompt, userQuery } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Chave API_KEY não encontrada nas variáveis da Vercel.' });
    }

    // URL sem a chave (como no seu curl)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey // Passando a chave pelo cabeçalho conforme o seu curl
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { 
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        const text = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor da Vercel.' });
    }
}

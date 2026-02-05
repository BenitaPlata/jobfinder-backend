const OpenAI = require('openai').default;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY no definida");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function analyzeCVWithAI(cvText) {
  try {

    const openai = getOpenAI(); // ✅ IMPORTANTE

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 2500,
      messages: [
        {
          role: 'system',
          content: `
Eres un experto senior en:
- Análisis de currículums
- Sistemas ATS
- Reclutamiento técnico IT
- Optimización de CV
Respondes SIEMPRE en ESPAÑOL.
Respondes SIEMPRE con JSON válido.
`,
        },
        {
          role: 'user',
          content: `...`,
        },
      ],
    });

    const responseText = completion.choices[0].message.content;

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('La IA no devolvió un JSON válido');
    }

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error('❌ Error en análisis de CV:', error);
    throw error;
  }
}

module.exports = {
  analyzeCVWithAI,
};

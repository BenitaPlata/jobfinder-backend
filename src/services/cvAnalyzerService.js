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
    const openai = getOpenAI(); 

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 2500,
      messages: [
        {
          role: 'system',
          content: `Eres un experto senior en análisis de currículums, sistemas ATS y reclutamiento técnico IT.
Respondes SIEMPRE en ESPAÑOL y SIEMPRE con JSON válido.
Analiza el CV y devuelve un JSON con esta estructura exacta:
{
  "score": número del 0 al 100,
  "atsCompatibility": "Bajo" | "Medio" | "Alto",
  "strengths": ["punto fuerte 1", "punto fuerte 2", ...],
  "weaknesses": ["punto débil 1", "punto débil 2", ...],
  "detectedSkills": ["skill1", "skill2", ...],
  "keywordsMissing": ["keyword1", "keyword2", ...],
  "recommendations": ["recomendación 1", "recomendación 2", ...],
  "sectionFeedback": {
    "experiencia": "feedback",
    "educacion": "feedback",
    "habilidades": "feedback"
  }
}`
        },
        {
          role: 'user',
          content: `Analiza este currículum y proporciona un análisis detallado siguiendo la estructura JSON indicada.

CV a analizar:

${cvText}

Asegúrate de:
1. Evaluar la compatibilidad con sistemas ATS
2. Identificar todas las habilidades técnicas mencionadas
3. Detectar palabras clave faltantes importantes para puestos IT
4. Dar recomendaciones concretas y accionables
5. Proporcionar feedback específico por sección

Devuelve SOLO el JSON, sin texto adicional.`
        },
      ],
    });

    const responseText = completion.choices[0].message.content.trim();
    
    console.log('🤖 Respuesta de OpenAI:', responseText.substring(0, 200));

    // Extraer JSON de la respuesta
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      // Intentar limpiar markdown
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    }

    if (!jsonMatch) {
      throw new Error('La IA no devolvió un JSON válido');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    // Validar que tiene los campos requeridos
    if (!analysis.score && analysis.score !== 0) {
      throw new Error('El análisis no contiene un score válido');
    }

    return analysis;

  } catch (error) {
    console.error('❌ Error en análisis de CV:', error.message);
    throw error;
  }
}

module.exports = {
  analyzeCVWithAI,
};
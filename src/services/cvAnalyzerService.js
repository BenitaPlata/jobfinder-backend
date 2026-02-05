const OpenAI = require('openai').default;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeCVWithAI(cvText) {
  try {
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
- Sistemas ATS (Applicant Tracking Systems)
- Reclutamiento técnico IT
- Optimización de CV para ofertas tecnológicas

Tu tarea es analizar currículums de perfiles tech (frontend, backend, full stack, data, devops).

Respondes SIEMPRE en ESPAÑOL.
Respondes SIEMPRE con JSON VÁLIDO.
NO añadas texto fuera del JSON.
`,
        },
        {
          role: 'user',
          content: `
Analiza el siguiente CV y devuelve un INFORME COMPLETO con el siguiente formato JSON EXACTO:

{
  "score": <número de 0 a 100>,
  "atsCompatibility": "Excelente | Buena | Regular | Mala",

  "strengths": [
    "Fortalezas claras del CV"
  ],

  "weaknesses": [
    "Debilidades importantes del CV"
  ],

  "missing": [
    "Elementos importantes que faltan en el CV"
  ],

  "toRemove": [
    "Contenido irrelevante o negativo que debería eliminarse"
  ],

  "detectedSkills": [
    "Skills técnicas detectadas en el CV"
  ],

  "keywordsMissing": [
    "Palabras clave técnicas que un ATS esperaría pero NO aparecen"
  ],

  "sectionFeedback": {
    "summary": "Feedback del resumen profesional",
    "experience": "Feedback de la experiencia laboral",
    "education": "Feedback de la formación",
    "skills": "Feedback de la sección de habilidades"
  },

  "recommendations": [
    "Recomendaciones concretas y accionables para mejorar el CV"
  ]
}

INSTRUCCIONES IMPORTANTES:
- Sé crítico pero constructivo
- Piensa como un ATS real
- Piensa como un recruiter técnico
- Prioriza empleabilidad real
- Detecta inconsistencias
- No inventes datos
- Si algo no existe en el CV, indícalo claramente

CV A ANALIZAR:
"""
${cvText}
"""
`,
        },
      ],
    });

    const responseText = completion.choices[0].message.content;

    // Seguridad extra: extraer solo JSON
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

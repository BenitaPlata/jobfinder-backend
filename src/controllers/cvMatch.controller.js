const OpenAI = require('openai');
const User = require('../models/User');
const Job = require('../models/Job');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const compareCVWithJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Obtener CV del usuario
    const user = await User.findById(req.user._id).select('cvText cvSkills');

    if (!user.cvText) {
      return res.status(400).json({
        success: false,
        message: 'Debes subir tu CV en tu perfil primero',
      });
    }

    // Obtener oferta
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Oferta no encontrada',
      });
    }

    // Construir descripción completa de la oferta
    const jobDescription = `
Título: ${job.title}
Empresa: ${job.company}
Descripción: ${job.description}
Tecnologías: ${job.techDetails?.technologies?.join(', ') || 'No especificadas'}
Experiencia requerida: ${job.techDetails?.experienceRequired || 'No especificada'}
Modalidad: ${job.techDetails?.workModality || 'No especificada'}
Tipo de contrato: ${job.contractType}
Salario: ${job.salaryRange?.min ? `${job.salaryRange.min}€ - ${job.salaryRange.max}€` : 'No especificado'}
    `.trim();

    // Comparar con IA
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: `
Eres un experto en ATS y selección técnica IT.
Analizas la compatibilidad entre un CV y una oferta de trabajo.
Respondes SOLO en JSON válido y en español.
Sé específico, objetivo y constructivo.
          `,
        },
        {
          role: 'user',
          content: `
CV DEL CANDIDATO:
${user.cvText}

OFERTA DE TRABAJO:
${jobDescription}

Devuelve SOLO este JSON (sin texto adicional):

{
  "matchScore": <número de 0 a 100>,
  "overallFit": "Alta | Media | Baja",
  "matchedSkills": ["skills técnicas que coinciden"],
  "missingSkills": ["skills importantes que faltan en el CV"],
  "missingKeySkills": ["skills críticas que faltan"],
  "experienceFit": "Adecuada | Justa | Insuficiente",
  "atsRisk": "Bajo | Medio | Alto",
  "recommendations": [
    "Cambios específicos para mejorar encaje con esta oferta"
  ],
  "strengths": [
    "Puntos fuertes del candidato para esta oferta"
  ],
  "summary": "Resumen claro y conciso del encaje candidato-oferta (2-3 líneas)"
}

IMPORTANTE:
- Sé muy específico con las skills
- Prioriza skills técnicas mencionadas en la oferta
- Piensa como un reclutador técnico real
- El matchScore debe ser realista
          `,
        },
      ],
    });

    const responseText = completion.choices[0].message.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('La IA no devolvió un JSON válido');
    }

    const comparison = JSON.parse(jsonMatch[0]);

    res.json({
      success: true,
      comparison,
      jobTitle: job.title,
      company: job.company,
    });
  } catch (error) {
    console.error('❌ Error comparando CV con oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al comparar CV con la oferta',
      error: error.message,
    });
  }
};

module.exports = { compareCVWithJob };
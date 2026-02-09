const { PDFParse } = require('pdf-parse');
const { analyzeCVWithAI } = require('../services/cvAnalyzerService');

const analyzeCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Solo se permiten archivos PDF' });
    }

    // Extraer texto con pdf-parse v2
    const parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    const cvText = result.text;

    console.log('📄 Texto extraído:', cvText.substring(0, 200));

    if (!cvText || cvText.trim().length < 100) {
      return res.status(400).json({
        message: 'El PDF no contiene suficiente texto legible',
      });
    }

    const analysis = await analyzeCVWithAI(cvText);

    if (!analysis || typeof analysis !== 'object') {
      console.error('❌ La IA devolvió algo inválido:', analysis);
      return res.status(500).json({
        message: 'La IA no devolvió un análisis válido',
      });
    }

    const normalizedAnalysis = {
      score: analysis.score ?? 0,
      atsCompatibility: analysis.atsCompatibility ?? 'Desconocido',
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [],
      detectedSkills: Array.isArray(analysis.detectedSkills)
        ? analysis.detectedSkills
        : [],
      keywordsMissing: Array.isArray(analysis.keywordsMissing)
        ? analysis.keywordsMissing
        : [],
      recommendations: Array.isArray(analysis.recommendations)
        ? analysis.recommendations
        : [],
      sectionFeedback:
        typeof analysis.sectionFeedback === 'object'
          ? analysis.sectionFeedback
          : {},
    };

    res.json({
      success: true,
      analysis: normalizedAnalysis,
    });
  } catch (error) {
    console.error('❌ Error analizando CV:', error);
    res.status(500).json({
      message: 'Error al analizar el CV',
      error: error.message,
    });
  }
};

module.exports = { analyzeCV };
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { analyzeCVWithAI } = require('../services/cvAnalyzerService');

const analyzeCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Solo se permiten archivos PDF' });
    }

    // Extraer texto con pdfjs-dist
    const pdfData = new Uint8Array(req.file.buffer);
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    
    let cvText = '';
    
    // Extraer texto de cada página
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      cvText += pageText + '\n';
    }

    if (!cvText || cvText.trim().length < 100) {
      return res.status(400).json({
        message: 'El PDF no contiene suficiente texto legible',
      });
    }

    const analysis = await analyzeCVWithAI(cvText);

    // 🔒 PROTECCIÓN CRÍTICA
    if (!analysis || typeof analysis !== 'object') {
      console.error('❌ La IA devolvió algo inválido:', analysis);
      return res.status(500).json({
        message: 'La IA no devolvió un análisis válido',
      });
    }

    // 🔒 NORMALIZACIÓN SEGURA
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
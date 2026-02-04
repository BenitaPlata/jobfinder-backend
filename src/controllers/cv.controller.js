const pdfParse = require('pdf-parse');
const { analyzeCVWithAI } = require('../services/cvAnalyzerService');

const analyzeCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Solo se permiten archivos PDF' });
    }

    // ✅ AHORA SÍ: pdf-parse funciona
    const pdfData = await pdfParse(req.file.buffer);
    const cvText = pdfData.text;

    if (!cvText || cvText.trim().length < 100) {
      return res.status(400).json({
        message: 'El PDF no contiene suficiente texto legible',
      });
    }

    const analysis = await analyzeCVWithAI(cvText);

    res.json({
      success: true,
      analysis,
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

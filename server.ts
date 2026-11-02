import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client server-side
// Model requirement: gemini-2.5-flash-lite (strict instruction)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Customer Support Agent for AhorraAI (gemini-2.5-flash-lite)
app.post('/api/gemini/customer-agent', async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: true,
        reply: 'Hola. Soy el asistente de AhorraAI en Vigo. Para cualquier duda sobre nuestros carteles acrílicos troquelados con chip NFC o para cambiar los datos de tu Unitree (web, teléfono, SMS, email) o enlace de reseñas de Google, escríbenos directamente a ahorraai@gmail.com o por WhatsApp.',
      });
    }

    const systemInstruction = `Eres el Agente Oficial de Atención al Cliente de AhorraAI (ahorraai.com) en Vigo.
Información clave de AhorraAI:
- Producto principal: Carteles acrílicos troquelados con formas únicas y originales (hamburguesas, dientes dentales, jarras de cerveza, llaves de taller, casas inmobiliarias, etc.).
- Cada cartel tiene un espacio pensado y reservado para pegar una etiqueta NFC con código QR impreso.
- Formatos de programación (gestionados con NFC Tools / Unitree):
  1) Solo Reseñas de Google (para captar valoraciones 5 estrellas al instante).
  2) Perfil Unitree multi-contacto (1 URL web, 1 teléfono de llamada, 1 SMS y 1 email).
- Grabación de chips: El fundador los graba directamente desde el móvil con la app NFC Tools y genera el QR.
- Si un cliente ya tiene un cartel y quiere cambiar sus datos:
  * Puede cambiar su enlace de Google Reseñas o actualizar sus datos de Unitree (URL, teléfono, SMS o email).
  * Pídele amablemente el nombre de su negocio, su email y los nuevos datos a actualizar.
  * Indícale que también puede escribir directamente a ahorraai@gmail.com o por WhatsApp para una actualización inmediata.
- Responde siempre de forma clara, concisa, profesional y en español (tono cercano de Vigo/Galicia). Evita respuestas largas innecesarias.`;

    const contents = [
      ...chatHistory.map((msg: { role: string; text: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      {
        role: 'user',
        parts: [{ text: message || 'Hola, ¿cómo puedo cambiar mis datos de Unitree o reseñas?' }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: contents as any,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text?.trim() || 'Para cambiar tus datos de Unitree o enlace de reseñas, envíanos los nuevos datos a ahorraai@gmail.com y los actualizaremos de inmediato.';

    return res.json({
      success: true,
      reply: replyText,
      model: 'gemini-2.5-flash-lite',
    });
  } catch (error: any) {
    console.error('Error in Gemini customer agent:', error);
    return res.status(200).json({
      success: true,
      reply: 'Para cambiar los datos de tu cartel (enlace de Google Reseñas o datos de Unitree: web, teléfono, SMS, email), puedes contactarnos directamente en ahorraai@gmail.com o enviarnos un WhatsApp.',
      fallback: true,
    });
  }
});

// Endpoint: AI Copywriter helper
app.post('/api/gemini/generate-copy', async (req, res) => {
  try {
    const { businessName, sector, actionType, city = 'Vigo' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: true,
        text: `¡Bienvenido a ${businessName || 'tu negocio'} en ${city}! Acerca tu teléfono al soporte NFC para acceder al instante.`,
      });
    }

    const prompt = `Actúa como especialista en marketing para comercio local en ${city}.
Genera un copy breve, persuasivo y cercano (máximo 2 líneas) para imprimir en un soporte físico troquelado con chip NFC y código QR.
- Negocio: ${businessName || 'Comercio Local'}
- Sector: ${sector || 'Servicios'}
- Propósito: ${actionType || 'Reseñas 5 estrellas en Google Maps'}
Devuelve únicamente el texto para el cliente, directo y profesional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: 'Eres un redactor profesional de marketing experiencial en español para AhorraAI en Vigo.',
      },
    });

    return res.json({
      success: true,
      text: response.text?.trim() || '',
      model: 'gemini-2.5-flash-lite',
    });
  } catch (error: any) {
    return res.status(200).json({
      success: true,
      text: `Acerca tu móvil o escanea el QR para conectar directamente con ${req.body?.businessName || 'nuestro local en Vigo'}.`,
      fallback: true,
    });
  }
});

// Mount Vite middleware in development or serve static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();

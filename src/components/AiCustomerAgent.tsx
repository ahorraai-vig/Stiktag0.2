import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, RefreshCw, Mail, Phone } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface AiCustomerAgentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const AiCustomerAgent: React.FC<AiCustomerAgentProps> = ({
  isOpen,
  onClose,
  onOpen,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: '¡Hola! Soy el asistente de AhorraAI en Vigo. ¿Tienes dudas sobre nuestros carteles acrílicos troquelados con chip NFC o necesitas cambiar tu enlace de Google Reseñas o datos de Unitree (Web, Teléfono, SMS, Email)? Dime qué necesitas.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Quiero cambiar mi enlace de Reseñas de Google',
    'Quiero actualizar mis datos de Unitree (Web, Tel, SMS, Email)',
    '¿Cómo funciona el espacio reservado para la etiqueta NFC+QR?',
    '¿Cómo programáis el chip con NFC Tools?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/customer-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatHistory: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'Para procesar tu cambio de Unitree o Google Reseñas, puedes escribirnos también a ahorraai@gmail.com.';

      setMessages((prev) => [...prev, { role: 'model', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Puedes enviarnos los datos actualizados a ahorraai@gmail.com o por WhatsApp (+34 600 000 000) y aplicaremos el cambio en tu Unitree o enlace de reseñas de inmediato.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={onOpen}
        aria-label="Abrir Asistente de Atención al Cliente"
        className="fixed bottom-5 left-5 z-40 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 text-xs font-bold"
      >
        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="hidden sm:inline">¿Dudas o Cambios? Asistente IA</span>
        <span className="sm:hidden">Asistente IA</span>
      </button>

      {/* Slide-over or Modal Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-start sm:p-4">
          <div
            className="w-full max-w-md bg-white h-full sm:h-[620px] sm:rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden sm:my-auto border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Atención & Cambios AhorraAI</span>
                    <span className="text-[9px] font-mono bg-indigo-900 text-indigo-300 px-1.5 py-0.2 rounded">
                      gemini-2.5-flash-lite
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Soporte para carteles NFC troquelados (Vigo)
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700">Canal directo fundador:</span>
              <div className="flex items-center gap-3">
                <a
                  href="mailto:ahorraai@gmail.com?subject=Cambio%20de%20datos%20cartel%20NFC"
                  className="flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <Mail className="w-3 h-3" />
                  <span>Email</span>
                </a>
                <span className="text-slate-300">·</span>
                <a
                  href="https://wa.me/34600000000?text=Hola%20AhorraAI,%20necesito%20cambiar%20los%20datos%20de%20mi%20cartel%20NFC"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-600 font-semibold hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-xl text-xs text-slate-500 border border-slate-200 flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                    <span>El asistente está respondiendo...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 rounded-lg whitespace-nowrap shrink-0 transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu consulta o datos a cambiar..."
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

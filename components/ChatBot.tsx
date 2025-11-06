
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: userInput }] };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    // Format history for the API
    const history = messages.map(msg => ({
        role: msg.role,
        parts: msg.parts.map(part => ({ text: part.text })),
    }));

    const responseText = await getChatResponse(history, userInput);
    const modelMessage: Message = { role: 'model', parts: [{ text: responseText }] };
    
    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105 z-50"
        aria-label="Abrir chat de ayuda"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-36 right-6 w-full max-w-sm h-full max-h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 transform transition-all duration-300 ease-out origin-bottom-right scale-100 opacity-100">
          <header className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">Asistente Virtual</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">&times;</button>
          </header>

          <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs">
                    ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                  </div>
              </div>
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} p-3 rounded-lg max-w-xs whitespace-pre-wrap`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {isLoading && (
                  <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs">
                          Escribiendo...
                      </div>
                  </div>
              )}
            </div>
          </div>

          <footer className="p-4 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
                Enviar
              </button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default ChatBot;

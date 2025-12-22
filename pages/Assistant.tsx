
import React, { useState, useRef, useEffect } from 'react';
import { usePetContext } from '../context/PetContext';
import { GeminiService } from '../services/geminiService';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const Assistant: React.FC = () => {
  const { t } = useTranslation();
  const { pets } = usePetContext();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hello! I am your AI Pet Care Assistant. Ask me anything about your pets or general care advice.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Default to first pet context for demo simplicity
  const selectedPet = pets.length > 0 ? pets[0] : undefined;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await GeminiService.getCareAdvice(userMsg, selectedPet);

    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Bot className="text-white" size={20} />
             </div>
             <div>
                <h2 className="font-bold text-gray-900 dark:text-white">{t('assistant.title')}</h2>
                <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {t('assistant.online')}
                </p>
             </div>
        </div>
        {selectedPet && (
            <div className="hidden md:block text-xs text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                {t('assistant.context')}: <span className="font-bold text-gray-700 dark:text-gray-300">{selectedPet.name}</span>
            </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-teal-500 text-white rounded-br-none' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-600'
                }`}>
                    {msg.text}
                </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                    <Sparkles size={16} className="text-teal-500 animate-spin" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('assistant.thinking')}</span>
                 </div>
            </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('assistant.placeholder')} 
                className="flex-1 bg-gray-100 dark:bg-gray-900 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-md shadow-teal-500/20"
            >
                <Send size={20} />
            </button>
        </div>
        <div className="text-[10px] text-center text-gray-400 mt-2">
            {t('assistant.disclaimer')}
        </div>
      </div>
    </div>
  );
};

export default Assistant;

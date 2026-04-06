/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  FileText, 
  Share2, 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  Loader2, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Hash,
  Zap,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const genAI = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    summary: string;
    facebook: string;
    linkedin: string;
    twitter: string;
    keywords: string[];
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Hãy phân tích nội dung sau và trả về kết quả dưới định dạng JSON:\n\n${inputText}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "Tóm tắt ngắn gọn nội dung bài viết trong khoảng 3-4 câu." },
              facebook: { type: Type.STRING, description: "Một bài đăng Facebook thu hút, có sử dụng emoji." },
              linkedin: { type: Type.STRING, description: "Một bài đăng LinkedIn chuyên nghiệp, tập trung vào giá trị cốt lõi." },
              twitter: { type: Type.STRING, description: "Một bài đăng Twitter ngắn gọn, súc tích (dưới 280 ký tự)." },
              keywords: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Danh sách 5-7 từ khóa SEO liên quan."
              }
            },
            required: ["summary", "facebook", "linkedin", "twitter", "keywords"]
          },
          systemInstruction: "Bạn là một chuyên gia Content Marketing và SEO. Nhiệm vụ của bạn là tối ưu hóa nội dung cho các nền tảng mạng xã hội khác nhau.",
        }
      });

      const data = JSON.parse(response.text || "{}");
      setResults(data);
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Đã có lỗi xảy ra khi kết nối với AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const clearAll = () => {
    setInputText('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">AI Content <span className="text-indigo-600">Assistant</span></h1>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            Powered by Gemini AI
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Nội dung gốc
                </label>
                <button 
                  onClick={clearAll}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Xóa tất cả"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Dán nội dung bài viết hoặc ý tưởng của bạn vào đây..."
                className="w-full h-[400px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none leading-relaxed"
              />
              <button 
                onClick={handleGenerate}
                disabled={isLoading || !inputText.trim()}
                className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang phân tích...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Tạo nội dung thông minh
                  </>
                )}
              </button>
            </div>

            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Mẹo nhỏ
              </h3>
              <p className="text-sm text-indigo-700 leading-relaxed">
                Bạn có thể dán một bài báo dài, AI sẽ tự động trích xuất những ý quan trọng nhất và biến chúng thành các bài đăng mạng xã hội thu hút.
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Summary Card */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Search className="w-5 h-5 text-indigo-600" />
                        Tóm tắt nội dung
                      </h3>
                      <button 
                        onClick={() => copyToClipboard(results.summary, 'summary')}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                      >
                        {copiedField === 'summary' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{results.summary}</p>
                  </div>

                  {/* Social Posts Grid */}
                  <div className="grid md:grid-cols-1 gap-6">
                    {/* Facebook */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 font-bold text-blue-600">
                          <Facebook className="w-5 h-5" /> Facebook Post
                        </div>
                        <button 
                          onClick={() => copyToClipboard(results.facebook, 'facebook')}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                        >
                          {copiedField === 'facebook' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-slate-600 text-sm whitespace-pre-wrap">{results.facebook}</p>
                    </div>

                    {/* LinkedIn */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 font-bold text-indigo-700">
                          <Linkedin className="w-5 h-5" /> LinkedIn Post
                        </div>
                        <button 
                          onClick={() => copyToClipboard(results.linkedin, 'linkedin')}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                        >
                          {copiedField === 'linkedin' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-slate-600 text-sm whitespace-pre-wrap">{results.linkedin}</p>
                    </div>

                    {/* Twitter */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <Twitter className="w-5 h-5" /> Twitter (X)
                        </div>
                        <button 
                          onClick={() => copyToClipboard(results.twitter, 'twitter')}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                        >
                          {copiedField === 'twitter' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-slate-600 text-sm">{results.twitter}</p>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Hash className="w-5 h-5 text-indigo-600" />
                      Từ khóa SEO gợi ý
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.keywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white/50 border-2 border-dashed border-slate-200 rounded-[40px]">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Share2 className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400 mb-2">Chưa có kết quả</h3>
                  <p className="text-slate-400 max-w-xs">Nhập nội dung bên trái và nhấn nút để AI bắt đầu công việc của mình.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm">© 2026 AI Content Assistant. Phan Van Chinh Web Developer.</p>
      </footer>
    </div>
  );
};

export default App;

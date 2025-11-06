
import React, { useState } from 'react';
import { NAV_LINKS } from '../constants';
import { searchWithGrounding } from '../services/geminiService';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ text: string; sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setSearchResults(null);
    const results = await searchWithGrounding(searchQuery);
    setSearchResults(results);
    setIsLoading(false);
  };
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="#inicio" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">Municipalidad</span>
          </a>

          <nav className="hidden lg:flex space-x-6 items-center">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="block py-2 px-4 text-gray-600 hover:bg-blue-50 rounded-md">
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="mt-6 relative">
          <form onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="¿Qué necesitas? Busca trámites, programas o pregunta a la IA..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
             <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors">
              Buscar
            </button>
          </form>
          {isLoading && <div className="mt-4 text-center text-gray-600">Buscando con IA...</div>}
          {searchResults && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                <p className="text-gray-800 whitespace-pre-wrap">{searchResults.text}</p>
                {searchResults.sources.length > 0 && (
                    <div className="mt-4 pt-2 border-t">
                        <h4 className="font-semibold text-sm text-gray-600">Fuentes:</h4>
                        <ul className="list-disc list-inside text-sm text-blue-600">
                            {searchResults.sources.map((source, index) => (
                                <li key={index}>
                                    <a href={source.web?.uri} target="_blank" rel="noopener noreferrer" className="hover:underline">{source.web?.title || source.web?.uri}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

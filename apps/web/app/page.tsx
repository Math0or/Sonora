'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { searchMusic, Music } from '@/lib/api-client';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Music[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    const data = await searchMusic(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            🎵 Sonora
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comece com uma música e descubra todo o universo relacionado a ela
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Search Box */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquise uma música, artista, álbum..."
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : results.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Resultados ({results.length})
                </h2>
                <div className="grid gap-4">
                  {results.map((music) => (
                    <Link
                      key={music.id}
                      href={`/music/${music.id}`}
                      className="group p-6 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {music.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {music.artist}
                          </p>
                          {music.album && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                              Álbum: {music.album}
                            </p>
                          )}
                          {music.releaseDate && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {new Date(music.releaseDate).getFullYear()}
                            </p>
                          )}
                        </div>
                        <div className="text-2xl group-hover:translate-x-1 transition-transform">
                          →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Nenhuma música encontrada para "{query}"
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  Tente pesquisar por "Chico Buarque" ou "Construção"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!hasSearched && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Comece a descobrir
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Pesquise uma música acima para começar sua jornada de descoberta
            </p>
            <div className="mt-8 flex gap-4 justify-center text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                ✓ Dados Mockados (v0.1)
              </span>
              <span className="flex items-center gap-2">
                ✓ Spotify (v0.2)
              </span>
              <span className="flex items-center gap-2">
                ✓ Multi-source (v0.3+)
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          Sonora v0.1 - Music Discovery Core
        </div>
      </footer>
    </div>
  );
}

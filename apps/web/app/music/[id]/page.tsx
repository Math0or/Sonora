'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMusicDetail, getMusicUniverse, Universe, Music } from '@/lib/api-client';

interface PageProps {
  params: {
    id: string;
  };
}

export default function MusicDetailPage({ params }: PageProps) {
  const [music, setMusic] = useState<Music | null>(null);
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [musicData, universeData] = await Promise.all([
          getMusicDetail(params.id),
          getMusicUniverse(params.id),
        ]);

        if (!musicData) {
          setError('Música não encontrada');
          return;
        }

        setMusic(musicData);
        setUniverse(universeData);
      } catch (err) {
        setError('Erro ao carregar a música');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !music) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link href="/" className="text-purple-600 dark:text-purple-400 hover:underline">
              ← Voltar
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {error || 'Música não encontrada'}
            </h1>
            <Link href="/" className="text-purple-600 dark:text-purple-400 hover:underline mt-4 inline-block">
              Voltar para busca
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium">
            ← Voltar
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Music Header */}
        <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {music.title}
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-4">
                {music.artist}
              </p>
              {music.album && (
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                  Álbum: <span className="font-semibold">{music.album}</span>
                </p>
              )}
              {music.releaseDate && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Lançamento: {new Date(music.releaseDate).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            <div className="text-6xl">🎵</div>
          </div>
        </div>

        {/* Universe Section */}
        {universe && (
          <div className="space-y-8">
            {/* Books */}
            {universe.books && universe.books.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📚</span> Livros Relacionados
                </h2>
                <div className="grid gap-4">
                  {universe.books.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white dark:bg-slate-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        {book.author}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        {book.description}
                      </p>
                      {book.url && (
                        <a
                          href={book.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 dark:text-purple-400 hover:underline text-sm mt-3 inline-block"
                        >
                          Saiba mais →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Videos */}
            {universe.videos && universe.videos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🎬</span> Vídeos Relacionados
                </h2>
                <div className="grid gap-4">
                  {universe.videos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-white dark:bg-slate-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        {video.channel}
                      </p>
                      {video.url && (
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 dark:text-purple-400 hover:underline text-sm mt-3 inline-block"
                        >
                          Assistir no YouTube →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Articles */}
            {universe.articles && universe.articles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📄</span> Artigos Científicos
                </h2>
                <div className="grid gap-4">
                  {universe.articles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white dark:bg-slate-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        {article.source}
                      </p>
                      {article.url && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 dark:text-purple-400 hover:underline text-sm mt-3 inline-block"
                        >
                          Ler artigo →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Status Badge */}
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>
            🎵 Dados mockados (v0.1) | Spotify em breve (v0.2) | Multi-source (v0.3+)
          </p>
        </div>
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

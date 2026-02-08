"use client";

import { useState } from "react";
import { getRecommendedMoviesAction, addLikedMovie } from "@/app/actions";
import { TMDBMovieBrief } from "@/utils/types";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "ko", label: "Korean" },
  { code: "ja", label: "Japanese" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "hi", label: "Hindi" },
  { code: "zh", label: "Chinese" },
];

function MovieCard({
  movie,
  actionLabel,
  actionDisabled,
  onAction,
}: {
  movie: TMDBMovieBrief;
  actionLabel: string;
  actionDisabled?: boolean;
  onAction?: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
          No poster
        </div>
      )}
      <div className="p-2 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium leading-tight">{movie.title}</p>
          <p className="text-xs text-gray-500">
            {movie.release_date?.slice(0, 4)}
            {" · "}
            <span className="uppercase font-mono">
              {movie.original_language}
            </span>
          </p>
          {movie.overview && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-3">
              {movie.overview}
            </p>
          )}
        </div>
        {onAction && (
          <button
            onClick={onAction}
            disabled={actionDisabled}
            className="mt-2 w-full text-sm bg-[#003595] text-white py-1 rounded-md hover:bg-[#1a4fba] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function RecommendationPage() {
  const [targetLanguage, setTargetLanguage] = useState("ko");
  const [allRecommendations, setAllRecommendations] = useState<
    TMDBMovieBrief[]
  >([]);
  const [filtered, setFiltered] = useState<TMDBMovieBrief[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [showDebug, setShowDebug] = useState(true);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setHasFetched(false);

    const result = await getRecommendedMoviesAction(targetLanguage);

    setAllRecommendations(result.allRecommendations);
    setFiltered(result.filtered);
    setHasFetched(true);
    setLoading(false);
  };

  const handleAddToLiked = async (movie: TMDBMovieBrief) => {
    await addLikedMovie(movie.id);
    setAddedIds((prev) => new Set(prev).add(movie.id));
  };

  const langLabel =
    LANGUAGES.find((l) => l.code === targetLanguage)?.label ?? targetLanguage;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#003595]">
        Recommendations
      </h1>

      {/* Language Selector */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div>
            <label className="block text-sm font-medium mb-1">
              Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="form-input"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGetRecommendations}
            disabled={loading}
            className="bg-[#003595] text-white px-4 py-2 rounded-md hover:bg-[#1a4fba] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200 font-medium"
          >
            {loading ? "Loading..." : "Get Recommendations"}
          </button>
          {hasFetched && (
            <button
              onClick={() => setShowDebug((v) => !v)}
              className="text-sm text-gray-500 underline cursor-pointer"
            >
              {showDebug ? "Hide" : "Show"} debug view
            </button>
          )}
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <p className="text-sm text-gray-500 mb-4">
          Finding recommendations...
        </p>
      )}

      {/* Debug Panel: Raw TMDB output */}
      {hasFetched && !loading && showDebug && (
        <section className="mb-10 border-2 border-dashed border-orange-300 rounded-lg p-4 bg-orange-50">
          <h2 className="text-lg font-semibold mb-1 text-orange-700">
            Debug: Raw TMDB Recommendations (before language filter)
          </h2>
          <p className="text-xs text-orange-600 mb-3">
            {allRecommendations.length} unique movies returned by TMDB across
            all languages. Each card shows the{" "}
            <span className="font-mono font-bold">original_language</span> code.
          </p>
          {allRecommendations.length === 0 ? (
            <p className="text-sm text-gray-500">
              No recommendations returned from TMDB. You may need to like some
              movies first.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {allRecommendations.map((movie) => (
                <div
                  key={movie.id}
                  className={`border rounded-lg overflow-hidden flex flex-col shadow-sm text-xs ${
                    movie.original_language === targetLanguage
                      ? "border-green-400 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                      No poster
                    </div>
                  )}
                  <div className="p-1.5">
                    <p className="font-medium leading-tight truncate">
                      {movie.title}
                    </p>
                    <p className="text-gray-500">
                      {movie.release_date?.slice(0, 4)}
                      {" · "}
                      <span
                        className={`uppercase font-mono font-bold ${
                          movie.original_language === targetLanguage
                            ? "text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        {movie.original_language}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Filtered Results */}
      {hasFetched && !loading && (
        <section>
          <h2 className="text-lg font-semibold mb-1 text-[#003595]">
            Filtered: {langLabel} only
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            {filtered.length} movies after filtering to{" "}
            <span className="font-mono font-bold">{targetLanguage}</span>
          </p>

          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500">
              No recommendations found for {langLabel}. Try liking more movies on
              your{" "}
              <a href="/profile" className="text-[#003595] underline">
                Profile
              </a>{" "}
              page, or select a different language.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  actionLabel={
                    addedIds.has(movie.id) ? "Added" : "Add to Liked"
                  }
                  actionDisabled={addedIds.has(movie.id)}
                  onAction={() => handleAddToLiked(movie)}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

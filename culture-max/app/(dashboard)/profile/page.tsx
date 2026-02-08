"use client";

import { useState, useEffect, useCallback } from "react";
import {
  searchMoviesAction,
  getLikedMovies,
  addLikedMovie,
  removeLikedMovie,
  getProfile,
  updateProfile,
} from "@/app/actions";
import { TMDBMovieBrief } from "@/utils/types";

export default function ProfilePage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMovieBrief[]>([]);
  const [likedMovies, setLikedMovies] = useState<TMDBMovieBrief[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingLiked, setLoadingLiked] = useState(true);

  const [nativeLanguage, setNativeLanguage] = useState("");
  const [otherLanguages, setOtherLanguages] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile) {
        setNativeLanguage(profile.native_language ?? "");
        setOtherLanguages((profile.other_languages ?? []).join(", "));
      }
      setProfileLoaded(true);
    });
    getLikedMovies().then((movies) => {
      setLikedMovies(movies);
      setLoadingLiked(false);
    });
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const langs = otherLanguages
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await updateProfile({ native_language: nativeLanguage, other_languages: langs });
    setSavingProfile(false);
  };

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const results = await searchMoviesAction(q);
    setSearchResults(results);
    setSearching(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 400);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleAdd = async (movie: TMDBMovieBrief) => {
    await addLikedMovie(movie.id);
    setLikedMovies((prev) => [...prev, movie]);
  };

  const handleRemove = async (movieId: number) => {
    await removeLikedMovie(movieId);
    setLikedMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  const likedIds = new Set(likedMovies.map((m) => m.id));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#003595]">Your Profile</h1>

      {/* Profile Info */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-[#003595]">Profile Info</h2>
        {!profileLoaded ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Native Language
              </label>
              <input
                type="text"
                placeholder="e.g. English"
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Other Languages
              </label>
              <input
                type="text"
                placeholder="e.g. Spanish, French"
                value={otherLanguages}
                onChange={(e) => setOtherLanguages(e.target.value)}
                className="form-input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated list of languages
              </p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="bg-[#003595] text-white px-4 py-2 rounded-md hover:bg-[#1a4fba] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200 font-medium"
            >
              {savingProfile ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </section>

      {/* Movie Search */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-[#003595]">Search Movies</h2>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-input mb-4"
        />

        {searching && <p className="text-sm text-gray-500 mb-2">Searching...</p>}

        {searchResults.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                className="border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
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
                    <p className="text-sm font-medium leading-tight">
                      {movie.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {movie.release_date?.slice(0, 4)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAdd(movie)}
                    disabled={likedIds.has(movie.id)}
                    className="mt-2 w-full text-sm bg-[#003595] text-white py-1 rounded-md hover:bg-[#1a4fba] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200"
                  >
                    {likedIds.has(movie.id) ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Liked Movies */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-[#003595]">
          Liked Movies {!loadingLiked && `(${likedMovies.length})`}
        </h2>

        {loadingLiked ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : likedMovies.length === 0 ? (
          <p className="text-sm text-gray-500">
            No liked movies yet. Search above to add some!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {likedMovies.map((movie) => (
              <div
                key={movie.id}
                className="border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
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
                    <p className="text-sm font-medium leading-tight">
                      {movie.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {movie.release_date?.slice(0, 4)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(movie.id)}
                    className="mt-2 w-full text-sm bg-red-500 text-white py-1 rounded-md hover:bg-red-600 cursor-pointer transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

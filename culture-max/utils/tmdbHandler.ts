import { TMDBMoviesRecommendation } from "./types";

/**
 * @param movie_id incrementing integer
 * @param language for example, en-us (default)
 */
export async function getMovieRecommendations(
  movie_id: number,
  language = "en-US",
) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_KEY}`,
    },
  };

  const res = (await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}/recommendations?language=${language}&page=1`,
    options,
  ).then((res) => res.json())) as TMDBMoviesRecommendation;
  return res;
}

export async function getSimilarMovies(movie_id: number, language = "en-US") {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_KEY}`,
    },
  };

  const res = (await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}/similar?language=${language}&page=1`,
    options,
  ).then((res) => res.json())) as TMDBMoviesRecommendation;
  return res;
}

export async function searchMovies(query: string, language = "en-US") {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_KEY}`,
    },
  };

  const res = (await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=${language}&page=1`,
    options,
  ).then((res) => res.json())) as TMDBMoviesRecommendation;
  return res;
}

export async function getMovieDetails(movie_id: number, language = "en-US") {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_KEY}`,
    },
  };

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}?language=${language}`,
    options,
  ).then((res) => res.json());
  return res;
}

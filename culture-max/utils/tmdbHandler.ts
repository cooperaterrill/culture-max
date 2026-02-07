import * as dotenv from "dotenv";
dotenv.config();

console.log(process.env.TMDB_KEY);
import { TMDBMoviesRecommendation } from "./types";
/**
 * @param movie_id incrementing integer
 * @param language for example, en-us (default)
 * @returns
 */
async function getMovieRecommendationsById(
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
  ).then((res) => res.json())) as TMDBMoviesRecommendation[];
  return res;
}

async function getSimilarMoviesById(movie_id: number, language = "en-US") {
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

getMovieRecommendationsById(550).then((d) => console.log(d));

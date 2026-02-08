import { getMovieRecommendations } from "./tmdbHandler";
import { TMDBMovieBrief } from "./types";

export interface RecommendationResult {
  /** All unique recommendations from TMDB before any language filtering */
  allRecommendations: TMDBMovieBrief[];
  /** Only the ones where original_language matches targetLanguage */
  filtered: TMDBMovieBrief[];
}

export async function getRecommendedMovies(
  likedMovieIds: number[],
  targetLanguage: string,
  numRecommendations = 20,
): Promise<RecommendationResult> {
  // Track all unique recs (before language filter) and filtered recs separately
  const allMap = new Map<number, { movie: TMDBMovieBrief; count: number }>();
  const filteredMap = new Map<
    number,
    { movie: TMDBMovieBrief; count: number }
  >();

  for (const likedMovieId of likedMovieIds) {
    const recs = await getMovieRecommendations(likedMovieId);
    for (const rec of recs.results) {
      if (likedMovieIds.includes(rec.id)) continue;

      // Track in allMap regardless of language
      const allExisting = allMap.get(rec.id);
      if (allExisting) {
        allExisting.count += 1;
      } else {
        allMap.set(rec.id, { movie: rec, count: 1 });
      }

      // Track in filteredMap only if language matches
      if (rec.original_language === targetLanguage) {
        const filteredExisting = filteredMap.get(rec.id);
        if (filteredExisting) {
          filteredExisting.count += 1;
        } else {
          filteredMap.set(rec.id, { movie: rec, count: 1 });
        }
      }
    }
  }

  const sortByCount = (
    map: Map<number, { movie: TMDBMovieBrief; count: number }>,
    limit: number,
  ) =>
    Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map((entry) => entry.movie);

  return {
    allRecommendations: sortByCount(allMap, 50),
    filtered: sortByCount(filteredMap, numRecommendations),
  };
}

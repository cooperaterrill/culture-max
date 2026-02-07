import { getMovieRecommendations } from "./tmdbHandler";

async function getRecommendedMovieIds(
  likedMovieIds: number[],
  numRecommendations: number,
  language = "en-US",
) {
  //maps id to number of appearances
  //TODO: should we look at "similar" movies instead?
  const recommendationIds = new Map<number, number>();
  for (const likedMovieId of likedMovieIds) {
    const recs = await getMovieRecommendations(likedMovieId, language);
    recs.results.map((rec) => {
      if (!recommendationIds.has(rec.id)) {
        recommendationIds.set(rec.id, 0);
      }
      recommendationIds.set(rec.id, recommendationIds.get(rec.id)! + 1);
    });
  }
  //sort based on count frequency, then take id
  const sorted = Array.from(recommendationIds)
    .sort((rec1, rec2) => rec1[1] - rec2[1])
    .map((pair) => pair[0]);
  return sorted.slice(0, numRecommendations);
}

"use server";

import { createClient } from "@/utils/supabase/server";
import { searchMovies, getMovieDetails } from "@/utils/tmdbHandler";
import {
  getRecommendedMovies,
  RecommendationResult,
} from "@/utils/movieRecommender";
import { TMDBMovieBrief } from "@/utils/types";

export async function searchMoviesAction(query: string) {
  if (!query.trim()) return [];
  const data = await searchMovies(query);
  return data.results ?? [];
}

export async function getLikedMovies(): Promise<TMDBMovieBrief[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("liked_movie_ids")
    .eq("id", user.id)
    .single();

  const ids: number[] = profile?.liked_movie_ids ?? [];
  if (ids.length === 0) return [];

  const movies = await Promise.all(ids.map((id) => getMovieDetails(id)));
  return movies;
}

export async function addLikedMovie(movieId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("liked_movie_ids")
    .eq("id", user.id)
    .single();

  const current: number[] = profile?.liked_movie_ids ?? [];
  if (current.includes(movieId)) return { error: "Already liked" };

  const { error } = await supabase
    .from("profiles")
    .update({ liked_movie_ids: [...current, movieId] })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("native_language, other_languages")
    .eq("id", user.id)
    .single();

  return profile ?? { native_language: "", other_languages: [] };
}

export async function updateProfile(data: {
  native_language: string;
  other_languages: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({
      native_language: data.native_language,
      other_languages: data.other_languages,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getRecommendedMoviesAction(
  targetLanguage: string,
): Promise<RecommendationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { allRecommendations: [], filtered: [] };

  const { data: profile } = await supabase
    .from("profiles")
    .select("liked_movie_ids")
    .eq("id", user.id)
    .single();

  const ids: number[] = profile?.liked_movie_ids ?? [];
  if (ids.length === 0) return { allRecommendations: [], filtered: [] };

  return getRecommendedMovies(ids, targetLanguage);
}

export async function removeLikedMovie(movieId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("liked_movie_ids")
    .eq("id", user.id)
    .single();

  const current: number[] = profile?.liked_movie_ids ?? [];
  const updated = current.filter((id) => id !== movieId);

  const { error } = await supabase
    .from("profiles")
    .update({ liked_movie_ids: updated })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

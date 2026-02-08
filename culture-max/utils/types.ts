export interface TMDBMovieBrief {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBMoviesRecommendation {
  page: number;
  results: TMDBMovieBrief[];
  total_pages: number;
  total_results: number;
}

export interface LastFMSimilarArtist {
  name: string;
  mbid?: string;
  match: string;
  url: string;
  image: ImageDataArray; //TODO: this is probably not correct type
  streamable: string;
}

export interface LastFMSimliarArtists {
  similarartists: {
    artist: LastFMSimilarArtist[];
    "@attr": { artist: string };
  };
}

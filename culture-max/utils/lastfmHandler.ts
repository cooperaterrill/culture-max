import * as dotenv from "dotenv";
import { LastFMSimliarArtists } from "./types";
dotenv.config();

async function getSimilarArtists(artist: string) {
  const res = (await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=${encodeURIComponent(artist)}&api_key=${process.env.LASTFM_KEY}&format=json`,
  ).then((d) => d.json())) as LastFMSimliarArtists;
  return res.similarartists.artist;
}

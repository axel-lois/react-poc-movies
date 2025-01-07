// src/config/omdb.ts
const OMDB_API_KEY = import.meta.env.VITE_API_KEY;
if (!OMDB_API_KEY) {
  throw new Error("VITE_OMDB_API_KEY is not defined");
}

export const OMDB_API_URL = import.meta.env.VITE_API_URL;
if (!OMDB_API_URL) {
  throw new Error("VITE_OMDB_API_URL is not defined");
}

// You could export them as part of a config object or individually
export default {
  OMDB_API_KEY,
  OMDB_API_URL,
};

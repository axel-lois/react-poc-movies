// src/api/movies.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "../lib/axios";
import { moviesQueryKeys } from "./query-key-factory";
import { MovieResponse } from "../types/movies";

/**
 * 1. Plain function that fetches data from the OMDb API via Axios
 */
export const getMoviesByTitle = async (
  title: string,
  page: number = 1
): Promise<MovieResponse> => {
  // We only pass the path/query portion, since axios baseURL is configured.
  const { data } = await axios.get("", {
    params: {
      s: title,
      page,
    },
  });
  return data;
};

/**
 * 2. A function that returns the default UseQueryOptions
 */
export const getMoviesByTitleQueryOptions = (
  title: string,
  page: number
): UseQueryOptions<MovieResponse, Error> => ({
  queryKey: moviesQueryKeys.search(title, page),
  queryFn: () => getMoviesByTitle(title, page),
  enabled: title.trim().length > 0,
});

/**
 * 3. A custom hook that merges default + user provided options
 */
type UseGetMoviesByTitleOptions = {
  title: string;
  page?: number;
  queryConfig?: UseQueryOptions<MovieResponse, Error>;
};

export const useGetMoviesByTitle = ({
  title,
  page = 1,
  queryConfig,
}: UseGetMoviesByTitleOptions) => {
  return useQuery<MovieResponse, Error>({
    ...getMoviesByTitleQueryOptions(title, page),
    ...queryConfig,
  });
};

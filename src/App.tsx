// App.tsx

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "./lib/axios"; // or wherever your axios instance is located
import { MovieResponse, Movie } from "./types/movies";

function App() {
  const [typedTerm, setTypedTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  /**
   * We'll define our fetch function inline here for simplicity, but
   * it could live in your src/api folder (e.g. getMoviesByTitle).
   */
  const fetchMovies = async ({
    queryKey,
  }: {
    queryKey: [string, string, number];
  }) => {
    const [, title, pageNumber] = queryKey;
    const { data } = await axios.get<MovieResponse>("", {
      params: {
        s: title,
        page: pageNumber,
      },
    });
    return data;
  };

  /**
   * Because enabled: false => the query does NOT automatically run on mount.
   * We'll call refetch() ourselves in useEffect whenever searchTerm or page changes.
   */
  const { data, error, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["movies", searchTerm, page],
    queryFn: fetchMovies,
    enabled: false, // manual fetching
    staleTime: 5000, // keep data fresh for 5 seconds while fetching next/prev page
  });

  // Whenever searchTerm or page changes, if we have a valid searchTerm, we refetch.
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      refetch();
    }
  }, [searchTerm, page, refetch]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTerm(e.target.value);
  };

  const handleSearchClick = () => {
    // Update searchTerm from typedTerm, reset page to 1
    // This triggers the useEffect -> refetch if non-empty
    setSearchTerm(typedTerm);
    setPage(1);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  // Optional: figure out maxPage by dividing totalResults by 10 (OMDb returns 10 results per page).
  let maxPage = 1;
  if (data?.totalResults) {
    maxPage = Math.ceil(parseInt(data.totalResults, 10) / 10);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Movie Search (Manual Pagination)</h1>

      {/* Input field + Search button */}
      <div>
        <input
          type="text"
          placeholder="Type a movie name..."
          value={typedTerm}
          onChange={handleInputChange}
        />
        <button onClick={handleSearchClick}>Search</button>
      </div>

      {/* If no searchTerm yet, show placeholder */}
      {searchTerm.trim().length === 0 && (
        <p>Type something, then click "Search"</p>
      )}

      {/* Loading / Error states */}
      {isLoading && <p>Loading...</p>}
      {isError && (
        <p style={{ color: "red" }}>Error: {(error as Error)?.message}</p>
      )}

      {/* If we have movies, display them */}
      {data?.Search?.map((movie: Movie) => (
        <div key={movie.imdbID} style={{ margin: "1rem 0" }}>
          <img
            src={movie.Poster}
            alt={movie.Title}
            style={{ width: "100px", height: "150px", objectFit: "cover" }}
          />
          <div>
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        </div>
      ))}

      {/* If OMDb responded with "False", show that error message */}
      {data?.Response === "False" && data.Error && (
        <p style={{ color: "red" }}>{data.Error}</p>
      )}

      {/* Pagination controls */}
      {/* Only show if we actually got a successful response from OMDb */}
      {data?.Response === "True" && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handlePrevPage} disabled={page === 1}>
            Prev
          </button>
          <span style={{ margin: "0 1rem" }}>
            Page {page}
            {isFetching && <small> (fetching...)</small>}
          </span>
          <button onClick={handleNextPage} disabled={page >= maxPage}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

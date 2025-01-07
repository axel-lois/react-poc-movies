// src/api/query-key-factory.ts

// For more complex apps, you’d group query keys by domain (e.g. products, movies).
export const moviesQueryKeys = {
    all: ['movies'] as const,
    search: (title: string, page: number) =>
      [...moviesQueryKeys.all, 'search', { title, page }] as const,
  };
  
import { fetchApi } from "../fetchApi";
import { mockGameDetails, mockGames } from "./mocks";
import type { ApiResult, GameCard, GameDetail } from "./types";

function cloneFallback<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "object" && item !== null ? { ...item } : item
    ) as T;
  }
  if (typeof value === "object" && value !== null) {
    return { ...(value as Record<string, unknown>) } as T;
  }
  return value;
}

async function requestWithFallback<T>(
  path: string,
  fallback: T
): Promise<ApiResult<T>> {
  try {
    const data = await fetchApi<T>(`${path}`);
    return { data, isMock: false };
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.warn(`[gameApi] ${path} 요청 실패로 mock 데이터 사용`, error);
    }
    return { data: cloneFallback(fallback), isMock: true };
  }
}

export async function getGames(): Promise<ApiResult<GameCard[]>> {
  return requestWithFallback<GameCard[]>("/games", mockGames);
}

export async function getGameDetail(
  slug: string
): Promise<ApiResult<GameDetail | null>> {
  const fallback =
    mockGameDetails[slug] ?? Object.values(mockGameDetails)[0] ?? null;
  const result = await requestWithFallback<GameDetail | null>(
    `/games/${slug}`,
    fallback
  );
  return result;
}

export async function searchGames(
  query: string
): Promise<ApiResult<GameCard[]>> {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  const path = `/games/search${params.toString() ? `?${params}` : ""}`;
  const fallback = query
    ? mockGames.filter((game) =>
        game.name.toLowerCase().includes(query.toLowerCase())
      )
    : mockGames;
  return requestWithFallback<GameCard[]>(path, fallback);
}

export async function getSearchFilters(): Promise<
  ApiResult<{
    genres: string[];
    features: string[];
    themes: string[];
  }>
> {
  const tags = Array.from(
    new Set(mockGames.flatMap((game: GameCard) => game.tags ?? []))
  ).sort();
  const fallback = {
    genres: tags,
    features: tags,
    themes: tags,
  };
  return requestWithFallback("/games/filters", fallback);
}

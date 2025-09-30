import { GameSection } from "./GameSection";
import { FeaturedGame } from "./FeaturedGame";
import { GameCard } from "./GameCard";
import { NewGamesSection } from "./NewGamesSection";
import type { GameCard as StoreGame } from "../../api/game/types";

interface UiGame {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviews: string;
  genre: string;
  tags: string[];
  price: string;
  description: string;
}

interface GameGridProps {
  games: StoreGame[];
  selectedCategory: string;
  onCategoryChange?: (category: string) => void;
  loading?: boolean;
}

export function GameGrid({
  games = [],
  selectedCategory,
  onCategoryChange,
  loading,
}: GameGridProps) {
  const currencyFormatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  });

  const toUiGame = (game: StoreGame): UiGame => ({
    id: String(game.id),
    title: game.name,
    image: game.thumbnailUrl,
    rating: game.averageScore ?? 0,
    reviews: (game.reviewCount ?? 0).toLocaleString("ko-KR"),
    genre: game.tags[0] ?? "장르 미정",
    tags: game.tags,
    price:
      (game.price ?? 0) <= 0
        ? "무료"
        : currencyFormatter.format(game.price ?? 0),
    description: "게임 소개가 준비 중입니다.",
  });

  const adaptedGames = games.map((game) => ({
    raw: game,
    ui: toUiGame(game),
  }));

  if (!adaptedGames.length) {
    return (
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto">
        <div className="rounded-lg border border-primary/20 bg-background/80 p-6 text-center text-muted-foreground">
          {loading
            ? "게임 정보를 불러오는 중입니다..."
            : "표시할 게임 데이터가 없습니다."}
        </div>
      </main>
    );
  }

  const sortedByRating = [...adaptedGames].sort(
    (a, b) => (b.raw.averageScore ?? 0) - (a.raw.averageScore ?? 0)
  );
  const topRatedGames = sortedByRating
    .filter((entry) => (entry.raw.averageScore ?? 0) >= 4.7)
    .slice(0, 6)
    .map((entry) => entry.ui);

  const bundleDeals = adaptedGames
    .filter((entry) => (entry.raw.price ?? 0) > 0 && Math.random() > 0.5)
    .slice(0, 6)
    .map((entry) => entry.ui);

  const freeGames = adaptedGames
    .filter((entry) => (entry.raw.price ?? 0) === 0)
    .slice(0, 6)
    .map((entry) => entry.ui);

  const isNewRelease = (releaseDate?: string) => {
    if (!releaseDate) return false;
    const releasedAt = new Date(releaseDate).getTime();
    if (Number.isNaN(releasedAt)) return false;
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    return Date.now() - releasedAt <= ninetyDays;
  };

  const newReleases = adaptedGames
    .filter((entry) => isNewRelease(entry.raw.releaseDate))
    .slice(0, 6)
    .map((entry) => entry.ui);

  const trendingGames = adaptedGames
    .filter((entry) => (entry.raw.reviewCount ?? 0) >= 200)
    .slice(0, 6)
    .map((entry) => entry.ui);

  const featuredEntry = sortedByRating[0] ?? adaptedGames[0];
  const featuredGame = featuredEntry?.ui;

  if (!featuredGame) {
    return (
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto">
        <div className="rounded-lg border border-primary/20 bg-background/80 p-6 text-center text-muted-foreground">
          {loading
            ? "게임 정보를 불러오는 중입니다..."
            : "표시할 게임 데이터가 없습니다."}
        </div>
      </main>
    );
  }

  // If a specific category is selected, show filtered results
  if (selectedCategory !== "recommended") {
    const filteredGames = adaptedGames.filter(({ raw, ui }) => {
      switch (selectedCategory) {
        case "trending":
          return (raw.reviewCount ?? 0) >= 200;
        case "new":
          return isNewRelease(raw.releaseDate);
        case "action":
          return ui.genre === "액션";
        case "rpg":
          return ui.genre === "RPG";
        case "racing":
          return ui.genre === "레이싱";
        case "multiplayer":
          return ui.genre === "멀티플레이어";
        case "puzzle":
          return ui.genre === "퍼즐";
        case "simulation":
          return ui.genre === "시뮬레이션";
        case "무료게임":
          return (raw.price ?? 0) === 0;
        default:
          return ui.tags.some((tag) =>
            tag.toLowerCase().includes(selectedCategory.toLowerCase())
          );
      }
    });

    const getCategoryTitle = (category: string) => {
      const categoryMap: Record<string, string> = {
        trending: "트렌딩 게임",
        new: "신작 게임",
        action: "액션 게임",
        rpg: "RPG 게임",
        racing: "레이싱 게임",
        multiplayer: "멀티플레이어 게임",
        puzzle: "퍼즐 게임",
        simulation: "시뮬레이션 게임",
        무료게임: "무료 게임",
      };
      return categoryMap[category] || `${category} 게임`;
    };

    return (
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="mb-2 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text font-semibold text-transparent">
            {getCategoryTitle(selectedCategory)}
          </h2>
          <p className="text-muted-foreground">
            {filteredGames.length}개의 게임을 찾았습니다
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredGames.map(({ ui }) => (
            <div key={ui.id} className="w-full">
              <GameCard game={ui} />
            </div>
          ))}
        </div>
      </main>
    );
  }

  // Default home page with sections
  return (
    <main className="flex-1 px-4 py-6 max-w-7xl mx-auto space-y-8">
      {/* Featured + New Games (same row) */}
      <div className="grid grid-7-3 gap-6 items-stretch">
        <div className="h-full">
          <FeaturedGame embed game={featuredGame} />
        </div>
        <div className="h-full">
          <NewGamesSection
            embed
            games={newReleases.map((g) => ({
              id: g.id,
              title: g.title,
              image: g.image,
              price: g.price,
              description: g.description,
            }))}
          />
        </div>
      </div>

      {/* Categories bar removed per request */}

      <GameSection
        title="🏆 인기 TOP 게임"
        games={topRatedGames.slice(1)} // Exclude featured game
      />

      <GameSection title="💎 번들 할인" games={bundleDeals} />

      <GameSection title="🆓 무료 게임" games={freeGames} />

      <GameSection title="✨ 신작 게임" games={newReleases} />

      <GameSection title="🔥 트렌딩" games={trendingGames} />
    </main>
  );
}

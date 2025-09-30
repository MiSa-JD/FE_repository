export interface ApiResult<T> {
  data: T;
  isMock: boolean;
}

export interface Game {
  id: number;
  name: string;
  price: number;
  discountRate: number;
  tags: string[];
  publisherId: number;
  publisherName: string;
  reviewCount: number;
  averageScore: number;
  media: string[];
  spec: string;
  description: string;
  thumbnailUrl: string;
  releaseDate: string; // =released
}
export interface GameCard {
  id: number;
  name: string;
  price: number;
  discountRate: number;
  tags: string[];
  publisherId: number;
  publisherName: string;
  reviewCount: number;
  averageScore: number;
  releaseDate: string; // =released
  thumbnailUrl: string;
}
export interface GameDetail extends Game {
  id: number;
  name: string;
  price: number;
  discountRate: number;
  tags: string[];
  publisherId: number;
  publisherName: string;
  reviewCount: number;
  averageScore: number;
  releaseDate: string; // =released
  media: string[];
  spec: string;
  description: string;
}

export interface GameNotice {
  id: number;
  title: string;
  content: string;
  releaseDate: string;
  category: GameNoticeCategory;
}
export interface GameNoticeCategory {
  displayName: string;
  description: string;
}

export interface GamesResponse {
  games: Game[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GameCardResponse {
  games: GameCard[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

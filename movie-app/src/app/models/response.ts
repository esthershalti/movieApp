export interface Item {
  Title: string;
  Year: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'game';
  Poster: string;
}

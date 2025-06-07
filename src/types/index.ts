export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  artwork?: string;
  isFavorite?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  artwork?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'google' | 'dropbox';
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  queue: Track[];
  currentIndex: number;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark' | 'system';
  playlists: Playlist[];
  favorites: Track[];
  player: PlayerState;
}
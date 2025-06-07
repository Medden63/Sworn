import React from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Clock, Heart } from 'lucide-react';
import { Track, Playlist } from '../../types';
import { TrackList } from './TrackList';
import { Button } from '../common/Button';

interface HomeContentProps {
  recentTracks: Track[];
  trendingTracks: Track[];
  playlists: Playlist[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track, tracks: Track[]) => void;
  onToggleFavorite: (trackId: string) => void;
  onPlaylistSelect: (playlist: Playlist) => void;
}

export const HomeContent: React.FC<HomeContentProps> = ({
  recentTracks,
  trendingTracks,
  playlists,
  currentTrack,
  isPlaying,
  onTrackSelect,
  onToggleFavorite,
  onPlaylistSelect,
}) => {
  const handleTrackSelect = (track: Track, index: number, tracks: Track[]) => {
    onTrackSelect(track, tracks);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue sur Sworn
        </h1>
        <p className="text-primary-100 mb-6">
          Découvrez votre musique préférée et explorez de nouveaux sons
        </p>
        <Button
          variant="secondary"
          size="lg"
          icon={Play}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20 text-white"
        >
          Commencer l'écoute
        </Button>
      </motion.section>

      {/* Quick Access Playlists */}
      {playlists.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-primary-600" />
            Vos Playlists
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists.slice(0, 4).map((playlist) => (
              <motion.div
                key={playlist.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                onClick={() => onPlaylistSelect(playlist)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 mb-3 flex items-center justify-center relative overflow-hidden">
                  {playlist.artwork ? (
                    <img
                      src={playlist.artwork}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Play className="w-8 h-8 text-white" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="md"
                      icon={Play}
                      className="opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-sm text-white"
                    />
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {playlist.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {playlist.tracks.length} titre{playlist.tracks.length > 1 ? 's' : ''}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Played */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary-600" />
          Récemment écoutés
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <TrackList
            tracks={recentTracks.slice(0, 5)}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackSelect={(track, index) => handleTrackSelect(track, index, recentTracks)}
            onToggleFavorite={onToggleFavorite}
            showArtwork={true}
          />
        </div>
      </section>

      {/* Trending */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
          Tendances
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <TrackList
            tracks={trendingTracks.slice(0, 10)}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackSelect={(track, index) => handleTrackSelect(track, index, trendingTracks)}
            onToggleFavorite={onToggleFavorite}
            showArtwork={true}
          />
        </div>
      </section>
    </div>
  );
};
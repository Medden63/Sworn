import React from 'react';
import { Track } from '../../types';
import { TrackList } from './TrackList';

interface RecentPageProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track, index: number) => void;
  onToggleFavorite: (trackId: string) => void;
}

export const RecentPage: React.FC<RecentPageProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackSelect,
  onToggleFavorite,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Récemment joués</h1>
        <p className="text-blue-100">
          {tracks.length} titre{tracks.length > 1 ? 's' : ''}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <TrackList
          tracks={tracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTrackSelect={(track, index) => onTrackSelect(track, index)}
          onToggleFavorite={onToggleFavorite}
          showArtwork={true}
        />
      </div>
    </div>
  );
};

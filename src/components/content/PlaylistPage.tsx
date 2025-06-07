import React from 'react';
import { Pencil, Trash } from 'lucide-react';
import { Playlist, Track } from '../../types';
import { Button } from '../common/Button';
import { TrackList } from './TrackList';

interface PlaylistPageProps {
  playlist: Playlist;
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track, index: number) => void;
  onToggleFavorite: (trackId: string) => void;
  onRenamePlaylist: (id: string, name: string) => void;
  onDeletePlaylist: (id: string) => void;
  onRenameTrack: (trackId: string) => void;
  onRemoveTrack: (trackId: string) => void;
  onMoveTrackUp: (index: number) => void;
  onMoveTrackDown: (index: number) => void;
  onReorderTracks: (from: number, to: number) => void;
}

export const PlaylistPage: React.FC<PlaylistPageProps> = ({
  playlist,
  currentTrack,
  isPlaying,
  onTrackSelect,
  onToggleFavorite,
  onRenamePlaylist,
  onDeletePlaylist,
  onRenameTrack,
  onRemoveTrack,
  onMoveTrackUp,
  onMoveTrackDown,
  onReorderTracks,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 text-white flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-primary-100">
            {playlist.description} • {playlist.tracks.length} titre{playlist.tracks.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Pencil}
            onClick={() => {
              const name = prompt('Nouveau nom de la playlist ?');
              if (name) onRenamePlaylist(playlist.id, name);
            }}
            ariaLabel="Renommer la playlist"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash}
            onClick={() => {
              if (confirm('Supprimer cette playlist ?')) onDeletePlaylist(playlist.id);
            }}
            ariaLabel="Supprimer la playlist"
          />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <TrackList
          tracks={playlist.tracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTrackSelect={onTrackSelect}
          onToggleFavorite={onToggleFavorite}
          showArtwork={true}
          onRenameTrack={onRenameTrack}
          onRemoveTrack={onRemoveTrack}
          onMoveTrackUp={onMoveTrackUp}
          onMoveTrackDown={onMoveTrackDown}
          onReorder={onReorderTracks}
        />
      </div>
    </div>
  );
};

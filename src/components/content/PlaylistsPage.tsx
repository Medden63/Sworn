import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Music } from 'lucide-react';
import { Playlist } from '../../types';
import { Button } from '../common/Button';

interface PlaylistsPageProps {
  playlists: Playlist[];
  onSelect: (playlist: Playlist) => void;
  onCreate: () => void;
}

export const PlaylistsPage: React.FC<PlaylistsPageProps> = ({
  playlists,
  onSelect,
  onCreate,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mes Playlists
        </h1>
        <Button variant="primary" size="sm" icon={Plus} onClick={onCreate}>
          Nouvelle playlist
        </Button>
      </div>
      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Aucune playlist disponible
          </p>
          <Button variant="primary" size="sm" onClick={onCreate}>
            Créer ma première playlist
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <motion.div
              key={playlist.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelect(playlist)}
              role="button"
              tabIndex={0}
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
      )}
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import { Track } from '../../types';
import { truncateText } from '../../utils/format';

interface NowPlayingProps {
  track: Track | null;
  isPlaying: boolean;
}

export const NowPlaying: React.FC<NowPlayingProps> = ({ track, isPlaying }) => {
  if (!track) {
    return (
      <div className="flex items-center space-x-4 p-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <Music className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucune piste sélectionnée
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="flex items-center space-x-4 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <motion.img
          src={track.artwork}
          alt={`Pochette de ${track.album || track.title}`}
          className="w-16 h-16 rounded-lg object-cover"
          animate={isPlaying ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {isPlaying && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  animate={{
                    height: [4, 12, 4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
          {truncateText(track.title, 30)}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {truncateText(track.artist, 25)}
        </p>
        {track.album && (
          <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
            {truncateText(track.album, 25)}
          </p>
        )}
      </div>
    </motion.div>
  );
};
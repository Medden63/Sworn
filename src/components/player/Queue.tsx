import React from 'react';
import { Track } from '../../types';
import { formatTime } from '../../utils/format';

interface QueueProps {
  tracks: Track[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const Queue: React.FC<QueueProps> = ({ tracks, currentIndex, onSelect }) => {
  if (tracks.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        File de lecture vide
      </div>
    );
  }

  return (
    <div className="max-h-60 overflow-y-auto mt-4 space-y-1">
      {tracks.map((track, index) => (
        <button
          key={track.id}
          onClick={() => onSelect(index)}
          className={`w-full flex justify-between px-3 py-1 rounded-md text-left focus:outline-none ${index === currentIndex ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <span className="truncate">{track.title}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(track.duration)}
          </span>
        </button>
      ))}
    </div>
  );
};

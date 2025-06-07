import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  ListMusic
} from 'lucide-react';
import { Button } from '../common/Button';
import { formatTime } from '../../utils/format';

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isFavorite?: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleFavorite?: () => void;
  isQueueVisible?: boolean;
  onToggleQueue?: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffled,
  repeatMode,
  isFavorite = false,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFavorite,
  isQueueVisible = false,
  onToggleQueue,
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div 
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group"
          onClick={handleProgressClick}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          tabIndex={0}
        >
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full relative transition-all duration-150"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          icon={Shuffle}
          onClick={onToggleShuffle}
          className={isShuffled ? 'text-primary-600' : 'text-gray-400'}
          ariaLabel="Mode aléatoire"
        />

        <Button
          variant="ghost"
          size="md"
          icon={SkipBack}
          onClick={onPrevious}
          ariaLabel="Piste précédente"
        />

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            size="lg"
            icon={isPlaying ? Pause : Play}
            onClick={onPlayPause}
            className="w-12 h-12 rounded-full"
            ariaLabel={isPlaying ? 'Pause' : 'Lecture'}
          />
        </motion.div>

        <Button
          variant="ghost"
          size="md"
          icon={SkipForward}
          onClick={onNext}
          ariaLabel="Piste suivante"
        />

        <Button
          variant="ghost"
          size="sm"
          icon={Repeat}
          onClick={onToggleRepeat}
          className={repeatMode !== 'none' ? 'text-primary-600' : 'text-gray-400'}
          ariaLabel="Mode répétition"
        />
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-between">
        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="sm"
            icon={Heart}
            onClick={onToggleFavorite}
            className={isFavorite ? 'text-red-500' : 'text-gray-400'}
            ariaLabel={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          />
        )}

        {/* Queue Toggle */}
        {onToggleQueue && (
          <Button
            variant="ghost"
            size="sm"
            icon={ListMusic}
            onClick={onToggleQueue}
            className={isQueueVisible ? 'text-primary-600' : 'text-gray-400'}
            ariaLabel="File de lecture"
          />
        )}

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={isMuted ? VolumeX : Volume2}
            onClick={onToggleMute}
            ariaLabel={isMuted ? 'Réactiver le son' : 'Couper le son'}
          />
          
          <div className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            />
          </div>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="sr-only"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
};
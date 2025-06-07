import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Play, Pause } from 'lucide-react';
import { PlayerControls } from './PlayerControls';
import { NowPlaying } from './NowPlaying';
import { Button } from '../common/Button';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

interface PlayerProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export const Player: React.FC<PlayerProps> = ({ isExpanded, onToggleExpanded }) => {
  const {
    playerState,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
  } = useAudioPlayer();

  const handleToggleFavorite = () => {
    // This would update the track's favorite status
    console.log('Toggle favorite for:', playerState.currentTrack?.title);
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mini Player */}
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <NowPlaying 
            track={playerState.currentTrack} 
            isPlaying={playerState.isPlaying}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="md"
            icon={playerState.isPlaying ? Pause : Play}
            onClick={togglePlay}
            ariaLabel={playerState.isPlaying ? 'Pause' : 'Lecture'}
          />
          
          <Button
            variant="ghost"
            size="sm"
            icon={isExpanded ? ChevronDown : ChevronUp}
            onClick={onToggleExpanded}
            ariaLabel={isExpanded ? 'Réduire le lecteur' : 'Agrandir le lecteur'}
          />
        </div>
      </div>

      {/* Expanded Player */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <div className="p-6">
              <PlayerControls
                isPlaying={playerState.isPlaying}
                currentTime={playerState.currentTime}
                duration={playerState.duration}
                volume={playerState.volume}
                isMuted={playerState.isMuted}
                isShuffled={playerState.isShuffled}
                repeatMode={playerState.repeatMode}
                isFavorite={playerState.currentTrack?.isFavorite}
                onPlayPause={togglePlay}
                onNext={next}
                onPrevious={previous}
                onSeek={seek}
                onVolumeChange={setVolume}
                onToggleMute={toggleMute}
                onToggleShuffle={toggleShuffle}
                onToggleRepeat={toggleRepeat}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
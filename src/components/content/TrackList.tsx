import React from 'react';
import { motion } from 'framer-motion';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  Pencil,
  Trash,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Track } from '../../types';
import { formatTime } from '../../utils/format';
import { Button } from '../common/Button';

interface TrackListProps {
  tracks: Track[];
  currentTrack?: Track | null;
  isPlaying?: boolean;
  onTrackSelect: (track: Track, index: number) => void;
  onToggleFavorite: (trackId: string) => void;
  showAlbum?: boolean;
  showArtwork?: boolean;
  onRenameTrack?: (trackId: string) => void;
  onRemoveTrack?: (trackId: string) => void;
  onMoveTrackUp?: (index: number) => void;
  onMoveTrackDown?: (index: number) => void;
  onReorder?: (from: number, to: number) => void;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying = false,
  onTrackSelect,
  onToggleFavorite,
  showAlbum = true,
  showArtwork = true,
  onRenameTrack,
  onRemoveTrack,
  onMoveTrackUp,
  onMoveTrackDown,
  onReorder,
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!onReorder || !result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="track-list">
        {(provided) => (
          <div
            className="space-y-1"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tracks.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;

            return (
              <Draggable draggableId={track.id} index={index} key={track.id}>
                {(dragProvided) => (
                  <motion.div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...(onReorder ? dragProvided.dragHandleProps : {})}
            className={`
              group flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer
              ${isCurrentTrack ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
            `}
            onClick={() => onTrackSelect(track, index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTrackSelect(track, index);
              }
            }}
            role="button"
            tabIndex={0}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Track Number / Play Button */}
            <div className="w-8 flex items-center justify-center">
              {isCurrentTrack && isPlaying ? (
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary-600 rounded-full"
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
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:hidden">
                  {index + 1}
                </span>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                icon={isCurrentTrack && isPlaying ? Pause : Play}
                className="hidden group-hover:flex w-8 h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackSelect(track, index);
                }}
                ariaLabel={isCurrentTrack && isPlaying ? 'Pause' : 'Lecture'}
              />
            </div>

            {/* Artwork */}
            {showArtwork && (
              <img
                src={track.artwork}
                alt={`Pochette de ${track.album || track.title}`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className={`font-medium truncate ${
                  isCurrentTrack 
                    ? 'text-primary-700 dark:text-primary-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {track.title}
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {track.artist}
                {showAlbum && track.album && ` • ${track.album}`}
              </p>
            </div>

            {/* Duration */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon={Heart}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(track.id);
                }}
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                  track.isFavorite ? 'text-red-500 opacity-100' : 'text-gray-400'
                }`}
                ariaLabel={track.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              />

              <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                {formatTime(track.duration)}
              </span>

              <Button
                variant="ghost"
                size="sm"
                icon={MoreHorizontal}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
                ariaLabel="Plus d'options"
              />

              {onMoveTrackUp && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowUp}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveTrackUp(index);
                  }}
                  ariaLabel="Monter le titre"
                />
              )}

              {onMoveTrackDown && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowDown}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveTrackDown(index);
                  }}
                  ariaLabel="Descendre le titre"
                />
              )}

              {onRenameTrack && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Pencil}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRenameTrack(track.id);
                  }}
                  ariaLabel="Renommer le titre"
                />
              )}

              {onRemoveTrack && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTrack(track.id);
                  }}
                  ariaLabel="Supprimer le titre"
                />
              )}
                    </div>
                  </motion.div>
                )}
              </Draggable>
            );
          })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
import { useState, useRef, useEffect, useCallback } from 'react';
import { Track, PlayerState } from '../types';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    isShuffled: false,
    repeatMode: 'none',
    queue: [],
    currentIndex: -1,
  });

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    const updateTime = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      }));
    };

    const handleEnded = () => {
      if (playerState.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: audio.duration || 0,
      }));
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playerState.repeatMode]);

  const loadTrack = useCallback((track: Track) => {
    if (!audioRef.current) return;
    
    audioRef.current.src = track.url;
    audioRef.current.load();
    
    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current || !playerState.currentTrack) return;
    
    try {
      await audioRef.current.play();
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, [playerState.currentTrack]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(() => {
    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [playerState.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setPlayerState(prev => ({ 
      ...prev, 
      volume: clampedVolume,
      isMuted: clampedVolume === 0 
    }));
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    
    if (playerState.isMuted) {
      audioRef.current.volume = playerState.volume;
      setPlayerState(prev => ({ ...prev, isMuted: false }));
    } else {
      audioRef.current.volume = 0;
      setPlayerState(prev => ({ ...prev, isMuted: true }));
    }
  }, [playerState.isMuted, playerState.volume]);

  const setQueue = useCallback((tracks: Track[], startIndex = 0) => {
    setPlayerState(prev => ({
      ...prev,
      queue: tracks,
      currentIndex: startIndex,
    }));
    
    if (tracks[startIndex]) {
      loadTrack(tracks[startIndex]);
    }
  }, [loadTrack]);

  const next = useCallback(() => {
    const { queue, currentIndex, isShuffled, repeatMode } = playerState;
    
    if (queue.length === 0) return;
    
    let nextIndex: number;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          return;
        }
      }
    }
    
    setPlayerState(prev => ({ ...prev, currentIndex: nextIndex }));
    loadTrack(queue[nextIndex]);
    
    if (playerState.isPlaying) {
      setTimeout(() => play(), 100);
    }
  }, [playerState, loadTrack, play]);

  const previous = useCallback(() => {
    const { queue, currentIndex, repeatMode } = playerState;
    
    if (queue.length === 0) return;
    
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if (repeatMode === 'all') {
        prevIndex = queue.length - 1;
      } else {
        return;
      }
    }
    
    setPlayerState(prev => ({ ...prev, currentIndex: prevIndex }));
    loadTrack(queue[prevIndex]);
    
    if (playerState.isPlaying) {
      setTimeout(() => play(), 100);
    }
  }, [playerState, loadTrack, play]);

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isShuffled: !prev.isShuffled }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      repeatMode: prev.repeatMode === 'none' 
        ? 'all' 
        : prev.repeatMode === 'all' 
        ? 'one' 
        : 'none'
    }));
  }, []);

  return {
    playerState,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setQueue,
    next,
    previous,
    toggleShuffle,
    toggleRepeat,
    loadTrack,
  };
};
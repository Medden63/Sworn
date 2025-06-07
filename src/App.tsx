import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Player } from './components/player/Player';
import { AuthModal } from './components/auth/AuthModal';
import { HomeContent } from './components/content/HomeContent';
import { TrackList } from './components/content/TrackList';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { mockTracks, mockPlaylists } from './data/mockData';
import { User, Track, Playlist } from './types';

function App() {
  const [user, setUser] = useLocalStorage<User | null>('sworn-user', null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>('sworn-playlists', mockPlaylists);
  const [tracks, setTracks] = useLocalStorage<Track[]>('sworn-tracks', mockTracks);
  const [favorites, setFavorites] = useLocalStorage<string[]>('sworn-favorites', []);

  const { playerState, setQueue, loadTrack, play } = useAudioPlayer();

  // Update track favorites based on stored favorites
  useEffect(() => {
    const updatedTracks = tracks.map(track => ({
      ...track,
      isFavorite: favorites.includes(track.id)
    }));
    setTracks(updatedTracks);
  }, [favorites, setTracks]);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sworn-user');
  };

  const handleTrackSelect = (track: Track, trackList: Track[]) => {
    const trackIndex = trackList.findIndex(t => t.id === track.id);
    setQueue(trackList, trackIndex);
    setTimeout(() => play(), 100);
  };

  const handleToggleFavorite = (trackId: string) => {
    setFavorites(prev => {
      if (prev.includes(trackId)) {
        return prev.filter(id => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  };

  const handleCreatePlaylist = () => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: `Ma Playlist ${playlists.length + 1}`,
      description: 'Nouvelle playlist',
      tracks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    setActiveSection(`playlist-${playlist.id}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <HomeContent
            recentTracks={tracks.slice(0, 5)}
            trendingTracks={tracks}
            playlists={playlists}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
            onTrackSelect={handleTrackSelect}
            onToggleFavorite={handleToggleFavorite}
            onPlaylistSelect={handlePlaylistSelect}
          />
        );
      
      case 'favorites':
        const favoriteTracks = tracks.filter(track => favorites.includes(track.id));
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Mes Favoris</h1>
              <p className="text-red-100">
                {favoriteTracks.length} titre{favoriteTracks.length > 1 ? 's' : ''} favori{favoriteTracks.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <TrackList
                tracks={favoriteTracks}
                currentTrack={playerState.currentTrack}
                isPlaying={playerState.isPlaying}
                onTrackSelect={(track, index) => handleTrackSelect(track, favoriteTracks)}
                onToggleFavorite={handleToggleFavorite}
                showArtwork={true}
              />
            </div>
          </div>
        );
      
      case 'library':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Ma Bibliothèque</h1>
              <p className="text-purple-100">
                Toute votre musique en un seul endroit
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <TrackList
                tracks={tracks}
                currentTrack={playerState.currentTrack}
                isPlaying={playerState.isPlaying}
                onTrackSelect={(track, index) => handleTrackSelect(track, tracks)}
                onToggleFavorite={handleToggleFavorite}
                showArtwork={true}
              />
            </div>
          </div>
        );
      
      default:
        if (activeSection.startsWith('playlist-')) {
          const playlistId = activeSection.replace('playlist-', '');
          const playlist = playlists.find(p => p.id === playlistId);
          
          if (playlist) {
            return (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 text-white">
                  <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
                  <p className="text-primary-100">
                    {playlist.description} • {playlist.tracks.length} titre{playlist.tracks.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <TrackList
                    tracks={playlist.tracks}
                    currentTrack={playerState.currentTrack}
                    isPlaying={playerState.isPlaying}
                    onTrackSelect={(track, index) => handleTrackSelect(track, playlist.tracks)}
                    onToggleFavorite={handleToggleFavorite}
                    showArtwork={true}
                  />
                </div>
              </div>
            );
          }
        }
        
        return (
          <HomeContent
            recentTracks={tracks.slice(0, 5)}
            trendingTracks={tracks}
            playlists={playlists}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
            onTrackSelect={handleTrackSelect}
            onToggleFavorite={handleToggleFavorite}
            onPlaylistSelect={handlePlaylistSelect}
          />
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col overflow-hidden">
      <Header
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          playlists={playlists}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onCreatePlaylist={handleCreatePlaylist}
        />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 pb-32">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {playerState.currentTrack && (
          <Player
            isExpanded={isPlayerExpanded}
            onToggleExpanded={() => setIsPlayerExpanded(!isPlayerExpanded)}
          />
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;
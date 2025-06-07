import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Player } from './components/player/Player';
import { AuthModal } from './components/auth/AuthModal';
import { HomeContent } from './components/content/HomeContent';
import { TrackList } from './components/content/TrackList';
import { PlaylistsPage } from './components/content/PlaylistsPage';
import { PlaylistPage } from './components/content/PlaylistPage';
import { SettingsModal } from './components/settings/SettingsModal';
import { Pencil, Trash } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { User, Track, Playlist } from './types';
import { extractMetadata } from './utils/metadata';


function App() {
  const [user, setUser] = useLocalStorage<User | null>('sworn-user', null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>('sworn-playlists', []);
  const [tracks, setTracks] = useLocalStorage<Track[]>('sworn-tracks', []);
  const [favorites, setFavorites] = useLocalStorage<string[]>('sworn-favorites', []);

  const { playerState, setQueue, loadTrack, play } = useAudioPlayer();

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get('access_token');
    const provider = localStorage.getItem('oauth-provider') as 'google' | 'dropbox' | null;

    if (accessToken && provider && !user) {
      const fetchUser = async () => {
        try {
          if (provider === 'google') {
            const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await res.json();
            setUser({
              id: data.id,
              name: data.name,
              email: data.email,
              avatar: data.picture,
              provider: 'google'
            });
          } else {
            const res = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            });
            const data = await res.json();
            setUser({
              id: data.account_id,
              name: data.name.display_name,
              email: data.email,
              avatar: data.profile_photo_url,
              provider: 'dropbox'
            });
          }
        } catch (err) {
          console.error('OAuth callback error', err);
        } finally {
          localStorage.removeItem('oauth-provider');
          window.location.hash = '';
        }
      };

      fetchUser();
    }
  }, [setUser, user]);

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise(resolve => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        const duration = isNaN(audio.duration) ? 0 : audio.duration;
        URL.revokeObjectURL(audio.src);
        resolve(duration);
      };
    });
  };

  const handleFilesSelected = async (files: FileList) => {
    const newTracks: Track[] = [];
    for (const file of Array.from(files)) {
      const [duration, meta] = await Promise.all([
        getAudioDuration(file),
        extractMetadata(file),
      ]);
      newTracks.push({
        id: `local-${Date.now()}-${Math.random()}`,
        title: meta.title || file.name.replace(/\.[^/.]+$/, ''),
        artist: meta.artist || 'Local',
        album: meta.album || 'Local Files',
        duration,
        url: URL.createObjectURL(file),
        isFavorite: false,
      });
    }
    setTracks(prev => [...prev, ...newTracks]);
  };

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

  const handleUserUpdate = (updated: User) => {
    setUser(updated);
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

  const handleRenamePlaylist = (playlistId: string, name: string) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId ? { ...p, name, updatedAt: new Date() } : p
      )
    );
  };

  const handleDeletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (activeSection === `playlist-${playlistId}`) {
      setActiveSection('home');
    }
  };

  const handleRenameTrack = (
    playlistId: string,
    trackId: string,
    title: string
  ) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId
          ? {
              ...p,
              tracks: p.tracks.map(t =>
                t.id === trackId ? { ...t, title } : t
              ),
              updatedAt: new Date(),
            }
          : p
      )
    );
  };

  const handleRemoveTrack = (playlistId: string, trackId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    const track = playlist?.tracks.find(t => t.id === trackId);
    if (track && track.url.startsWith('blob:')) {
      URL.revokeObjectURL(track.url);
    }

    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId
          ? {
              ...p,
              tracks: p.tracks.filter(t => t.id !== trackId),
              updatedAt: new Date(),
            }
          : p
      )
    );

    setTracks(prev => prev.filter(t => t.id !== trackId));
  };

  const handleReorderTracks = (
    playlistId: string,
    from: number,
    to: number
  ) => {
    if (from === to) return;
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id !== playlistId) return p;
        const updated = [...p.tracks];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        return { ...p, tracks: updated, updatedAt: new Date() };
      })
    );
  };

  const filterTracks = (list: Track[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      (t.album && t.album.toLowerCase().includes(q))
    );
  };

  const filterPlaylists = (list: Playlist[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <HomeContent
            recentTracks={filterTracks(tracks).slice(0, 5)}
            trendingTracks={filterTracks(tracks)}
            playlists={filterPlaylists(playlists)}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
            onTrackSelect={handleTrackSelect}
            onToggleFavorite={handleToggleFavorite}
            onPlaylistSelect={handlePlaylistSelect}
          />
        );
      
      case 'favorites':
        const favoriteTracks = filterTracks(
          tracks.filter(track => favorites.includes(track.id))
        );
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
                tracks={filterTracks(tracks)}
                currentTrack={playerState.currentTrack}
                isPlaying={playerState.isPlaying}
                onTrackSelect={(track, index) => handleTrackSelect(track, tracks)}
                onToggleFavorite={handleToggleFavorite}
                showArtwork={true}
              />
            </div>
          </div>
        );

      case 'playlists':
        return (
          <PlaylistsPage
            playlists={filterPlaylists(playlists)}
            onSelect={handlePlaylistSelect}
            onCreate={handleCreatePlaylist}
          />
        );

      default:
        if (activeSection.startsWith('playlist-')) {
          const playlistId = activeSection.replace('playlist-', '');
          const playlist = playlists.find(p => p.id === playlistId);

          if (playlist) {
            return (
              <PlaylistPage
                playlist={{ ...playlist, tracks: filterTracks(playlist.tracks) }}
                currentTrack={playerState.currentTrack}
                isPlaying={playerState.isPlaying}
                onTrackSelect={(track, index) => handleTrackSelect(track, playlist.tracks)}
                onToggleFavorite={handleToggleFavorite}
                onRenamePlaylist={handleRenamePlaylist}
                onDeletePlaylist={handleDeletePlaylist}
                onRenameTrack={(trackId) => {
                  const title = prompt('Nouveau titre ?');
                  if (title) handleRenameTrack(playlist.id, trackId, title);
                }}
                onRemoveTrack={(trackId) => {
                  if (confirm('Supprimer ce titre ?')) handleRemoveTrack(playlist.id, trackId);
                }}
                onMoveTrackUp={(index) => handleReorderTracks(playlist.id, index, Math.max(0, index - 1))}
                onMoveTrackDown={(index) => handleReorderTracks(playlist.id, index, Math.min(playlist.tracks.length - 1, index + 1))}
                onReorderTracks={(from, to) => handleReorderTracks(playlist.id, from, to)}
              />
            );
          }
        }
        
        return (
          <HomeContent
            recentTracks={filterTracks(tracks).slice(0, 5)}
            trendingTracks={filterTracks(tracks)}
            playlists={filterPlaylists(playlists)}
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
        onFilesSelected={handleFilesSelected}
        onSearchChange={setSearchQuery}
        onSettingsClick={() => setShowSettingsModal(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          playlists={filterPlaylists(playlists)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onCreatePlaylist={handleCreatePlaylist}
          onRenamePlaylist={(id) => {
            const name = prompt('Nouveau nom de la playlist ?');
            if (name) handleRenamePlaylist(id, name);
          }}
          onDeletePlaylist={(id) => {
            if (confirm('Supprimer cette playlist ?')) handleDeletePlaylist(id);
          }}
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

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        user={user}
        onUserUpdate={handleUserUpdate}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;
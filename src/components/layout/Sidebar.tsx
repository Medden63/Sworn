import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Library, 
  Heart, 
  Plus,
  Music,
  TrendingUp,
  Clock,
  PlusCircle,
  Pencil,
  Trash
} from 'lucide-react';
import { Button } from '../common/Button';
import { Playlist } from '../../types';

interface SidebarProps {
  playlists: Playlist[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  onCreatePlaylist: () => void;
  onRenamePlaylist: (id: string) => void;
  onDeletePlaylist: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  playlists,
  activeSection,
  onSectionChange,
  onCreatePlaylist,
  onRenamePlaylist,
  onDeletePlaylist,
}) => {
  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'search', label: 'Rechercher', icon: Search },
    { id: 'library', label: 'Bibliothèque', icon: Library },
    { id: 'playlists', label: 'Playlists', icon: Music },
    { id: 'favorites', label: 'Favoris', icon: Heart },
    { id: 'trending', label: 'Tendances', icon: TrendingUp },
    { id: 'recent', label: 'Récemment joués', icon: Clock },
    { id: 'added', label: 'Ajoutés récemment', icon: PlusCircle },
  ];

  return (
    <motion.aside 
      className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full"
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Mes Playlists
          </h3>
          <Button
            variant="ghost"
            size="sm"
            icon={Plus}
            onClick={onCreatePlaylist}
            ariaLabel="Créer une playlist"
          />
        </div>

        <div className="space-y-2">
          {playlists.map((playlist) => (
            <motion.div
              key={playlist.id}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              whileHover={{ scale: 1.02 }}
            >
              <button
                onClick={() => onSectionChange(`playlist-${playlist.id}`)}
                className="flex items-center space-x-3 flex-1 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {playlist.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {playlist.tracks.length} titre{playlist.tracks.length > 1 ? 's' : ''}
                  </p>
                </div>
              </button>
              <div className="flex-shrink-0 flex space-x-1 opacity-0 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Pencil}
                  ariaLabel="Renommer la playlist"
                  onClick={() => onRenamePlaylist(playlist.id)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash}
                  ariaLabel="Supprimer la playlist"
                  onClick={() => onDeletePlaylist(playlist.id)}
                />
              </div>
            </motion.div>
          ))}

          {playlists.length === 0 && (
            <div className="text-center py-8">
              <Music className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Aucune playlist
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={onCreatePlaylist}
              >
                Créer ma première playlist
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
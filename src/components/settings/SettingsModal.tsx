import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { User } from '../../types';
import { useTheme, Theme } from '../../hooks/useTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdate: (user: User) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}) => {
  const { theme, changeTheme } = useTheme();
  const [localUser, setLocalUser] = useState<User | null>(user);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const handleSave = () => {
    if (localUser) {
      onUserUpdate(localUser);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Param\xE8tres" size="lg">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gestion du compte</h3>
          {localUser ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={localUser.name}
                  onChange={(e) => setLocalUser({ ...localUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={localUser.email}
                  onChange={(e) => setLocalUser({ ...localUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
              <Button onClick={handleSave} variant="primary" size="md" className="mt-2">
                Enregistrer
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">Aucun utilisateur connect\xE9.</p>
          )}
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pr\xE9f\xE9rences</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Th\xE8me
            </label>
            <select
              value={theme}
              onChange={(e) => changeTheme(e.target.value as Theme)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="system">Syst\xE8me</option>
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
};


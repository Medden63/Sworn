import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Eye, EyeOff, Chrome, Droplet } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = {
        id: '1',
        name: formData.name || 'Utilisateur',
        email: formData.email,
        provider: 'email' as const,
      };
      
      onAuthSuccess(user);
      setLoading(false);
      onClose();
    }, 1500);
  };

  const handleSocialAuth = (provider: 'google' | 'dropbox') => {
    setLoading(true);
    
    // Simulate social auth
    setTimeout(() => {
      const user = {
        id: '1',
        name: `Utilisateur ${provider}`,
        email: `user@${provider}.com`,
        provider,
      };
      
      onAuthSuccess(user);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isLogin 
              ? 'Connectez-vous à votre compte Sworn'
              : 'Créez votre compte Sworn'
            }
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => handleSocialAuth('google')}
            variant="secondary"
            size="md"
            icon={Chrome}
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Continuer avec Google
          </Button>
          
          <Button
            onClick={() => handleSocialAuth('dropbox')}
            variant="secondary"
            size="md"
            icon={Droplet}
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Continuer avec Dropbox
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
              ou
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name\" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                required={!isLogin}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Votre nom complet"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="votre@email.com"
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {isLogin ? 'Se connecter' : 'Créer le compte'}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            disabled={loading}
          >
            {isLogin 
              ? "Pas de compte ? S'inscrire"
              : 'Déjà un compte ? Se connecter'
            }
          </button>
        </div>
      </div>
    </Modal>
  );
};
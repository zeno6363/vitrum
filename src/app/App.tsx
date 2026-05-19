import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Crown, Star, Zap } from 'lucide-react';
import logoVitrum from '../imports/vvvv.png';
import bg1 from '../imports/bg1.png';
import bg2 from '../imports/bg2.png';
import bg3 from '../imports/bg3.png';
import bg4 from '../imports/bg4.png';

// Déclaration des fonctions GMod pour TypeScript
declare global {
  interface Window {
    steamName?: string;
    steamAvatar?: string;
    playerRank?: string; // VIP, Donateur, Premium, etc.
    gameDetails?: (servername: string, serverurl: string, mapname: string, maxplayers: number, steamid: string, gamemode: string) => void;
  }
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [playerInfo, setPlayerInfo] = useState({
    name: 'Chargement...',
    avatar: '',
    steamId: '',
    playTime: '0h',
    rank: '' // VIP, Donateur, Premium, etc.
  });

  const backgrounds = [bg1, bg2, bg3, bg4];

  // Configuration des badges selon le rang
  const getBadgeConfig = (rank: string) => {
    const rankUpper = rank.toUpperCase();

    if (rankUpper.includes('VITRUM ELITE') || rankUpper.includes('ELITE')) {
      return {
        icon: Zap,
        label: 'VITRUM ELITE',
        bgColor: 'from-cyan-500 via-blue-500 to-purple-600',
        textColor: 'text-cyan-300',
        glowColor: 'rgba(6, 182, 212, 0.6)',
        ringColor: 'ring-cyan-400/80'
      };
    } else if (rankUpper.includes('VIP OR') || rankUpper.includes('VIP GOLD')) {
      return {
        icon: Crown,
        label: 'VIP OR',
        bgColor: 'from-yellow-400 via-yellow-500 to-amber-600',
        textColor: 'text-yellow-300',
        glowColor: 'rgba(251, 191, 36, 0.5)',
        ringColor: 'ring-yellow-400/70'
      };
    } else if (rankUpper.includes('VIP ARGENT') || rankUpper.includes('VIP SILVER')) {
      return {
        icon: Star,
        label: 'VIP ARGENT',
        bgColor: 'from-slate-300 via-slate-400 to-slate-500',
        textColor: 'text-slate-200',
        glowColor: 'rgba(148, 163, 184, 0.5)',
        ringColor: 'ring-slate-400/60'
      };
    }
    return null;
  };

  useEffect(() => {
    // Récupérer les informations du joueur depuis GMod
    const loadPlayerInfo = () => {
      // GMod expose ces variables globalement
      const steamName = window.steamName || 'Joueur';
      const steamAvatar = window.steamAvatar || '';
      const playerRank = window.playerRank || '';

      setPlayerInfo({
        name: steamName,
        avatar: steamAvatar,
        steamId: '',
        playTime: '0h',
        rank: playerRank
      });
    };

    // Charger les infos immédiatement
    loadPlayerInfo();

    // Écouter les mises à jour de GMod
    const originalGameDetails = window.gameDetails;
    window.gameDetails = function(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
      loadPlayerInfo();
      if (originalGameDetails) {
        originalGameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode);
      }
    };

    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += 0.3;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, 30);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    // Change background every 5 seconds
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
      clearInterval(bgInterval);
    };
  }, []);

  return (
    <div className="size-full bg-black text-white overflow-hidden relative">
      {/* Animated background slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgrounds[currentBgIndex]})`
          }}
        ></motion.div>
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black/90"></div>

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>

      {/* Steam Profile Card - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute top-8 right-8 z-20"
      >
        <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4 min-w-[280px] shadow-[0_0_30px_rgba(6,182,212,0.2)] relative overflow-hidden">
          {/* Badge VIP/Donateur si applicable */}
          {playerInfo.rank && getBadgeConfig(playerInfo.rank) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              className="absolute top-2 right-2"
            >
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${getBadgeConfig(playerInfo.rank)!.bgColor} shadow-lg`}
                style={{
                  boxShadow: `0 0 20px ${getBadgeConfig(playerInfo.rank)!.glowColor}`
                }}
              >
                {(() => {
                  const Icon = getBadgeConfig(playerInfo.rank)!.icon;
                  return <Icon className="w-3.5 h-3.5 text-white" />;
                })()}
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  {getBadgeConfig(playerInfo.rank)!.label}
                </span>
              </div>
            </motion.div>
          )}

          <div className="flex items-center gap-3 mb-3">
            {playerInfo.avatar ? (
              <div className="relative">
                <img
                  src={playerInfo.avatar}
                  alt="Avatar Steam"
                  className={`w-12 h-12 rounded-full ring-2 object-cover ${
                    playerInfo.rank && getBadgeConfig(playerInfo.rank)
                      ? getBadgeConfig(playerInfo.rank)!.ringColor
                      : 'ring-cyan-400/50'
                  }`}
                />
                {/* Effet de brillance pour les VIP */}
                {playerInfo.rank && getBadgeConfig(playerInfo.rank) && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        `0 0 0px ${getBadgeConfig(playerInfo.rank)!.glowColor}`,
                        `0 0 20px ${getBadgeConfig(playerInfo.rank)!.glowColor}`,
                        `0 0 0px ${getBadgeConfig(playerInfo.rank)!.glowColor}`
                      ]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  ></motion.div>
                )}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center ring-2 ring-cyan-400/50">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm truncate max-w-[140px]">{playerInfo.name}</h3>
              <p className="text-xs text-cyan-400">En ligne</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-white/60">
            <div className="flex justify-between">
              <span>Temps de jeu:</span>
              <span className="text-white/80">{playerInfo.playTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Statut:</span>
              <span className="text-white/80">Connexion en cours</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white/70">Connecté au serveur</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 size-full flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 blur-3xl bg-cyan-500/20 scale-110"></div>
            <img
              src={logoVitrum}
              alt="Vitrum Logo"
              className="w-64 h-64 object-contain relative z-10 drop-shadow-[0_0_40px_rgba(6,182,212,0.4)]"
            />
          </div>
        </motion.div>

        {/* Server name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold tracking-[0.4em] uppercase text-white/90 text-center">
            VITRUM ROLEPLAY
          </h1>
        </motion.div>

        {/* Loading spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 border-2 border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
        </motion.div>

        {/* Progress bar section - fixed at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-2xl px-8"
        >
          {/* Progress info */}
          <div className="flex justify-between items-center mb-3 text-sm text-white/60">
            <span className="tracking-wide">Loading{dots}</span>
            <span className="font-mono tabular-nums text-cyan-400 font-semibold">{Math.round(progress)}%</span>
          </div>

          {/* Segmented Progress bar */}
          <div className="relative h-3 bg-black/40 rounded border border-cyan-500/20 overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 flex gap-[2px] p-[2px]">
              {Array.from({ length: 50 }).map((_, index) => {
                const segmentValue = ((index + 1) / 50) * 100;
                const isActive = progress >= segmentValue;
                return (
                  <motion.div
                    key={index}
                    className={`flex-1 rounded-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                        : 'bg-white/5'
                    }`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{ originY: 1 }}
                  >
                    {isActive && (
                      <div className="w-full h-full bg-gradient-to-b from-white/30 to-transparent"></div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Background indicator dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
        >
          {backgrounds.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentBgIndex ? 'bg-cyan-400 w-6' : 'bg-white/20'
              }`}
            ></div>
          ))}
        </motion.div>

        {/* Watermark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="fixed bottom-6 left-6 text-xs text-white/20 tracking-wider"
        >
          VitRumGaming.com
        </motion.div>
      </div>
    </div>
  );
}
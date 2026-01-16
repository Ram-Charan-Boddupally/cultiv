
import React from 'react';
import { TreeHealth } from '../types';

interface TreeProps {
  stage: number;
  health: TreeHealth;
  size?: 'sm' | 'lg';
}

const Tree: React.FC<TreeProps> = ({ stage, health, size = 'sm' }) => {
  const isSmall = size === 'sm';
  const width = isSmall ? 64 : 200;
  const height = isSmall ? 64 : 200;

  const getColors = () => {
    switch (health) {
      case TreeHealth.HEALTHY: return { trunk: '#5D4037', leaves: '#4CAF50', accent: '#81C784' };
      case TreeHealth.PAUSED: return { trunk: '#5D4037', leaves: '#9CCC65', accent: '#AED581' };
      case TreeHealth.DRYING: return { trunk: '#795548', leaves: '#D4E157', accent: '#E6EE9C' };
      case TreeHealth.WITHERED: return { trunk: '#8D6E63', leaves: '#FFB300', accent: '#FFD54F' };
      case TreeHealth.DEAD: return { trunk: '#757575', leaves: '#BDBDBD', accent: '#E0E0E0' };
      default: return { trunk: '#5D4037', leaves: '#4CAF50', accent: '#81C784' };
    }
  };

  const colors = getColors();

  const renderStage = () => {
    switch (stage) {
      case 0: // Seed
        return (
          <g>
            <ellipse cx="32" cy="54" rx="4" ry="2" fill="#3E2723" />
            <path d="M32 54 Q32 50 34 52" stroke="#8D6E63" strokeWidth="1" fill="none" />
          </g>
        );
      case 1: // Sprout
        return (
          <g>
            <path d="M32 55 L32 45" stroke={colors.trunk} strokeWidth="2" />
            <path d="M32 45 Q38 40 42 42" fill={colors.leaves} />
            <path d="M32 45 Q26 40 22 42" fill={colors.accent} />
          </g>
        );
      case 2: // Leafy
        return (
          <g>
            <path d="M32 55 L32 35" stroke={colors.trunk} strokeWidth="3" />
            <circle cx="28" cy="38" r="6" fill={colors.leaves} />
            <circle cx="36" cy="38" r="6" fill={colors.accent} />
            <circle cx="32" cy="30" r="5" fill={colors.leaves} />
          </g>
        );
      case 3: // Small Plant
        return (
          <g>
            <path d="M32 55 L32 30" stroke={colors.trunk} strokeWidth="5" />
            <path d="M32 40 L22 32" stroke={colors.trunk} strokeWidth="2" />
            <path d="M32 40 L42 32" stroke={colors.trunk} strokeWidth="2" />
            <circle cx="22" cy="32" r="8" fill={colors.leaves} />
            <circle cx="42" cy="32" r="8" fill={colors.accent} />
            <circle cx="32" cy="22" r="10" fill={colors.leaves} />
          </g>
        );
      case 4: // Young Tree
        return (
          <g>
            <path d="M32 55 L32 25" stroke={colors.trunk} strokeWidth="7" />
            <circle cx="20" cy="30" r="12" fill={colors.leaves} opacity="0.9" />
            <circle cx="44" cy="30" r="12" fill={colors.accent} opacity="0.9" />
            <circle cx="32" cy="18" r="14" fill={colors.leaves} />
          </g>
        );
      case 5: // Mature Tree
        return (
          <g>
            <path d="M32 55 L32 20" stroke={colors.trunk} strokeWidth="9" />
            <circle cx="15" cy="35" r="14" fill={colors.leaves} />
            <circle cx="49" cy="35" r="14" fill={colors.accent} />
            <circle cx="32" cy="15" r="18" fill={colors.leaves} />
            <circle cx="24" cy="22" r="12" fill={colors.accent} opacity="0.7" />
            <circle cx="40" cy="22" r="12" fill={colors.accent} opacity="0.7" />
          </g>
        );
      default: return null;
    }
  };

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 64 64" 
      className={`transition-all duration-1000 ${health === TreeHealth.DEAD ? 'grayscale brightness-75' : ''}`}
    >
      <path d="M10 55 Q32 62 54 55" stroke="#D7CCC8" strokeWidth="4" fill="none" strokeLinecap="round" />
      {renderStage()}
    </svg>
  );
};

export default Tree;

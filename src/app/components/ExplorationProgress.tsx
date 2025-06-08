'use client';

import React from 'react';
import { motion } from 'framer-motion';
// import { CheckCircle, Circle } from 'lucide-react';

interface ExplorationProgressProps {
  totalNodes: number;
  visitedNodes: Set<string>;
  currentNode: string | null;
}

const ExplorationProgress: React.FC<ExplorationProgressProps> = ({ 
  totalNodes, 
  visitedNodes, 
  currentNode 
}) => {
  const progressPercentage = (visitedNodes.size / totalNodes) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 right-4 pixel-panel p-4 min-w-[220px]"
      style={{ background: 'var(--pixel-bg-light)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span 
          className="text-sm font-mono"
          style={{ 
            color: 'var(--pixel-primary)',
            fontFamily: 'Press Start 2P, monospace',
            fontSize: '12px'
          }}
        >
          PROGRESS
        </span>
        <span 
          className="text-xs font-mono"
          style={{ 
            color: 'var(--pixel-text-dim)',
            fontFamily: 'VT323, monospace'
          }}
        >
          [{visitedNodes.size}/{totalNodes}]
        </span>
      </div>
      
      {/* 8-bit 风格进度条 */}
      <div 
        className="w-full h-4 mb-3 relative"
        style={{ 
          background: 'var(--pixel-bg)',
          border: '2px solid var(--pixel-border)'
        }}
      >
        <motion.div 
          className="h-full relative"
          style={{ 
            background: `linear-gradient(90deg, var(--pixel-primary) 0%, var(--pixel-accent) 100%)`,
            imageRendering: 'pixelated'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
        {/* 像素风格进度条纹理 */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* 当前查看 */}
      {currentNode && (
        <div 
          className="flex items-center gap-2 text-xs font-mono mb-2"
          style={{ color: 'var(--pixel-accent)' }}
        >
          <span 
            className="pixel-blink"
            style={{ 
              fontFamily: 'Press Start 2P, monospace',
              fontSize: '10px'
            }}
          >
            ●
          </span>
          <span style={{ fontFamily: 'VT323, monospace' }}>VIEWING_DETAILS</span>
        </div>
      )}

      {/* 完成提示 */}
      {visitedNodes.size === totalNodes && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 text-xs font-mono"
          style={{ color: 'var(--pixel-primary)' }}
        >
          <span 
            style={{ 
              fontFamily: 'Press Start 2P, monospace',
              fontSize: '10px'
            }}
          >
            ✓
          </span>
          <span style={{ fontFamily: 'VT323, monospace' }}>QUEST_COMPLETE!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExplorationProgress; 
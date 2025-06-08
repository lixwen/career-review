'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

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
      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg min-w-[200px]"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-700">探索进度</span>
        <span className="text-xs text-gray-500">({visitedNodes.size}/{totalNodes})</span>
      </div>
      
      {/* 进度条 */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <motion.div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* 当前查看 */}
      {currentNode && (
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <Circle size={12} />
          <span>正在查看详情</span>
        </div>
      )}

      {/* 完成提示 */}
      {visitedNodes.size === totalNodes && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 text-xs text-green-600 mt-2"
        >
          <CheckCircle size={12} />
          <span>探索完成！</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExplorationProgress; 
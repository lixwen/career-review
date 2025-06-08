'use client';

import React, { useState, useCallback } from 'react';
import MindMap from './components/MindMap';
import DetailPanel from './components/DetailPanel';
import ExplorationProgress from './components/ExplorationProgress';
import { careerData, TreeNode } from './data/careerData';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root'])); // 初始只展开根节点

  // 统计总节点数（除了根节点）
  const getTotalNodes = (node: TreeNode): number => {
    let count = node.id !== 'root' ? 1 : 0;
    if (node.children) {
      count += node.children.reduce((sum, child) => sum + getTotalNodes(child), 0);
    }
    return count;
  };

  const totalNodes = getTotalNodes(careerData);

  const handleNodeClick = useCallback((node: TreeNode) => {
    // 如果点击的节点有子节点且还没展开，则展开它
    if (node.children && node.children.length > 0 && !expandedNodes.has(node.id)) {
      setExpandedNodes(prev => new Set(prev).add(node.id));
      // 同时记录为已访问
      setVisitedNodes(prev => new Set(prev).add(node.id));
    } else {
      // 如果没有子节点或已经展开，则显示详情
      setSelectedNode(node);
      if (node.id !== 'root') {
        setVisitedNodes(prev => new Set(prev).add(node.id));
      }
    }
  }, [expandedNodes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 头部标题 */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-6 py-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4"
          >
            转正述职报告
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 mb-2"
          >
            交互式思维导图展示
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-500"
          >
            点击节点深入了解我的成长历程与收获
          </motion.p>
        </div>
      </motion.header>

      {/* 思维导图主体 */}
      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="h-[calc(100vh-200px)] px-4"
      >
        <div className="h-full max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden relative">
          <MindMap 
            data={careerData} 
            onNodeClick={handleNodeClick}
            expandedNodes={expandedNodes}
          />
          <ExplorationProgress 
            totalNodes={totalNodes}
            visitedNodes={visitedNodes}
            currentNode={selectedNode?.id || null}
          />
        </div>
      </motion.main>

      {/* 详情面板 */}
      <DetailPanel 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />

      {/* 底部信息 */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center py-6 text-sm text-gray-500"
      >
        <p>感谢您的关注与指导</p>
        <p className="mt-1">© 2025 - 个人转正述职报告</p>
      </motion.footer>
    </div>
  );
}

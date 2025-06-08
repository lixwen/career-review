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
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set()); // 初始状态不展开任何节点，只显示根节点

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
    // 单击：总是显示详情卡片并标记为已访问
    setSelectedNode(node);
    setVisitedNodes(prev => new Set(prev).add(node.id));
  }, []);

  const handleNodeDoubleClick = useCallback((node: TreeNode) => {
    // 双击：展开/收起有子节点的节点
    if (node.children && node.children.length > 0) {
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(node.id)) {
          newSet.delete(node.id); // 如果已展开，则收起
        } else {
          newSet.add(node.id); // 如果未展开，则展开
        }
        return newSet;
      });
    }
  }, []);

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
            onNodeDoubleClick={handleNodeDoubleClick}
            expandedNodes={expandedNodes}
            visitedNodes={visitedNodes}
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

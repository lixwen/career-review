'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MindMap from '../components/MindMap';
import DetailPanel from '../components/DetailPanel';
import ExplorationProgress from '../components/ExplorationProgress';
import { careerData, TreeNode } from '../data/careerData';

export default function MainPage() {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set()); // 初始状态不展开任何节点，只显示根节点
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // 检查移动设备和身份验证状态
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    const checkAuth = () => {
      const authStatus = localStorage.getItem('d5_authenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      } else {
        router.push('/auth');
      }
      setIsLoading(false);
    };

    checkMobile();
    checkAuth();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [router]);

  // 统计总节点数（除了根节点）
  const countTotalNodes = useCallback((node: TreeNode): number => {
    let count = 1; // 当前节点
    if (node.children) {
      node.children.forEach(child => {
        count += countTotalNodes(child);
      });
    }
    return count;
  }, []);

  const totalNodes = countTotalNodes(careerData);

  const handleNodeClick = useCallback((node: TreeNode) => {
    console.log('Node clicked:', node);
    setSelectedNode(node);
    setVisitedNodes(prev => new Set([...prev, node.id]));
  }, []);

  const handleNodeDoubleClick = useCallback((node: TreeNode) => {
    console.log('Node double clicked:', node);
    if (node.children && node.children.length > 0) {
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(node.id)) {
          newSet.delete(node.id);
        } else {
          newSet.add(node.id);
        }
        return newSet;
      });
    }
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // 加载中或未认证时显示加载界面
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pixel-scanlines" style={{ background: 'var(--pixel-bg)' }}>
        <div className="text-center">
          <div className="pixel-title text-xl mb-4" style={{ color: 'var(--pixel-primary)' }}>
            LOADING...
          </div>
          <div className="pixel-blink text-lg" style={{ color: 'var(--pixel-accent)' }}>
            █
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 正在重定向到认证页面
  }

  return (
    <div className="min-h-screen pixel-scanlines" style={{ background: 'var(--pixel-bg)' }}>
      {/* 8-bit 风格头部 */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-4 sm:px-6 py-4 sm:py-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* 像素风格装饰边框 */}
          <div className="pixel-panel mb-4 sm:mb-6 p-4 sm:p-6 mx-2 sm:mx-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              {/* 8-bit 风格标题 */}
              <h1 className="pixel-title text-xl sm:text-2xl md:text-4xl mb-3 sm:mb-4" style={{ color: 'var(--pixel-primary)' }}>
                ▲ 转正述职报告 ▲
              </h1>
              
              {/* 像素风格副标题 */}
              <div className="font-mono text-xs sm:text-sm md:text-base mb-3 sm:mb-4" style={{ color: 'var(--pixel-text-dim)' }}>
                <span className="pixel-blink">█</span> 
                <span className="ml-1 sm:ml-2">{isMobile ? 'CAREER REVIEW' : 'INTERACTIVE CAREER REVIEW SYSTEM'}</span>
                <span className="pixel-blink ml-1 sm:ml-2">█</span>
              </div>
              
              {/* 8-bit 状态栏 */}
              <div className="flex justify-center items-center gap-2 sm:gap-4 text-xs font-mono flex-wrap">
                <span style={{ color: 'var(--pixel-accent)' }}>STATUS: ONLINE</span>
                <span style={{ color: 'var(--pixel-warning)' }}>LEVEL: PROBATION→FULL</span>
                <span style={{ color: 'var(--pixel-primary)' }}>EXP: 999+</span>
                <span style={{ color: 'var(--pixel-primary)' }}>NAME: 温立旭</span>
              </div>
              
              {/* 注销按钮 */}
              <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'}`}>
                <button
                  onClick={() => {
                    localStorage.removeItem('d5_authenticated');
                    router.push('/auth');
                  }}
                  className="pixel-btn text-xs px-2 py-1 touch-friendly"
                  style={{ 
                    background: 'var(--pixel-danger)',
                    fontSize: isMobile ? '8px' : '10px'
                  }}
                >
                  LOGOUT
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* 移动端操作提示 */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xs font-mono mb-4 text-center mobile-hint"
              style={{ 
                color: 'var(--pixel-accent)',
                fontFamily: 'VT323, monospace'
              }}
            >
              <div className="pixel-panel p-2 mx-4" style={{ background: 'var(--pixel-bg)' }}>
                <div>📱 移动端操作指南:</div>
                <div>• 单击节点查看详情</div>
                <div>• 双击节点展开/收起</div>
                <div>• 拖拽可移动视角</div>
                <div>• 双指缩放调整大小</div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* 8-bit 思维导图主体 */}
      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className={`${isMobile ? 'h-[calc(100vh-180px)]' : 'h-[calc(100vh-220px)]'} px-2 sm:px-4`}
      >
        <div className="h-full max-w-7xl mx-auto pixel-panel overflow-hidden relative mindmap-container">
          {/* 8-bit 风格顶部栏 */}
          <div className="absolute top-0 left-0 right-0 h-6 sm:h-8 z-10 flex items-center px-2 sm:px-4" 
               style={{ background: 'var(--pixel-bg-light)', borderBottom: '2px solid var(--pixel-border)' }}>
            <div className="flex items-center gap-1 sm:gap-2 text-xs font-mono">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm" style={{ color: 'var(--pixel-text-dim)' }}>
                {isMobile ? 'MINDMAP' : 'MINDMAP.EXE'}
              </span>
            </div>
          </div>
          
          <div className="pt-6 sm:pt-8 h-full" style={{ background: 'var(--pixel-bg)' }}>
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
        </div>
      </motion.main>

      {/* DetailPanel */}
      <DetailPanel node={selectedNode} onClose={handleCloseDetail} />

      {/* 8-bit 风格底部 */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center py-4"
      >
        <div className="pixel-panel mx-4 p-4">
          <div className="font-mono text-xs" style={{ color: 'var(--pixel-text-dim)' }}>
            <div className="flex justify-center items-center gap-4 mb-2">
              <span>THANK_YOU.exe</span>
              <span className="pixel-blink">●</span>
              <span>LOADED</span>
            </div>
            <p>© 2025 - PERSONAL_CAREER_REVIEW_v1.0</p>
            <p className="mt-1" style={{ color: 'var(--pixel-primary)' }}>
              [ PRESS ANY KEY TO CONTINUE ]
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
} 
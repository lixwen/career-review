'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeNode } from '../data/careerData';
// import { ChevronRight } from 'lucide-react';

interface DetailPanelProps {
  node: TreeNode | null;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ node, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!node) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'root': return '█';
      case 'main': return '▲';
      case 'sub': return '●';
      default: return '◆';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'root': return 'ROOT_NODE';
      case 'main': return 'MAIN_MODULE';
      case 'sub': return 'SUB_CONTENT';
      default: return 'DATA_INFO';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
        style={{ background: 'rgba(42, 42, 42, 0.9)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className={`pixel-panel w-full ${
            isMobile 
              ? 'max-w-[95vw] max-h-[90vh] mx-2' 
              : 'max-w-2xl max-h-[80vh]'
          } overflow-hidden modal-content`}
          style={{ background: 'var(--pixel-bg-light)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 8-bit 风格头部 */}
          <div 
            className={`relative ${isMobile ? 'p-4' : 'p-6'} modal-header`}
            style={{ 
              backgroundColor: node.color,
              borderBottom: '4px solid var(--pixel-border)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <span 
                  className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-mono flex-shrink-0`}
                  style={{ 
                    fontFamily: 'Press Start 2P, monospace',
                    color: '#ffffff',
                    textShadow: '2px 2px 0px rgba(0,0,0,0.8)'
                  }}
                >
                  {node.icon || getCategoryIcon(node.category)}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 
                    className={`${
                      isMobile ? 'text-lg' : 'text-xl'
                    } font-mono mb-1 truncate`}
                    style={{ 
                      fontFamily: 'VT323, monospace',
                      color: '#ffffff',
                      textShadow: '1px 1px 0px rgba(0,0,0,0.8)'
                    }}
                    title={node.name}
                  >
                    {node.name}
                  </h2>
                  <p 
                    className="text-xs sm:text-sm font-mono"
                    style={{ 
                      color: 'rgba(255,255,255,0.8)',
                      fontFamily: 'VT323, monospace'
                    }}
                  >
                    [{getCategoryText(node.category)}]
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`pixel-btn text-xs ${
                  isMobile ? 'p-3' : 'p-2'
                } touch-friendly flex-shrink-0 ml-2`}
                style={{ 
                  background: 'var(--pixel-danger)',
                  color: '#ffffff',
                  minWidth: isMobile ? '48px' : '36px',
                  minHeight: isMobile ? '48px' : '36px'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* 8-bit 风格内容区域 */}
          <div 
            className={`${
              isMobile ? 'p-4' : 'p-6'
            } overflow-y-auto modal-body`}
            style={{ 
              background: 'var(--pixel-bg-light)',
              maxHeight: isMobile ? 'calc(90vh - 120px)' : 'calc(80vh - 120px)'
            }}
          >
            {/* 描述 */}
            {node.description && (
              <div className="mb-4 sm:mb-6">
                <h3 
                  className={`${
                    isMobile ? 'text-sm' : 'text-lg'
                  } font-mono mb-3 flex items-center gap-2`}
                  style={{ 
                    color: 'var(--pixel-primary)',
                    fontFamily: 'Press Start 2P, monospace',
                    fontSize: isMobile ? '12px' : '14px'
                  }}
                >
                  <span 
                    className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}
                    style={{ 
                      background: 'var(--pixel-accent)',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                  ></span>
                  OVERVIEW
                </h3>
                <div 
                  className={`pixel-panel ${isMobile ? 'p-3' : 'p-4'}`}
                  style={{ 
                    background: 'var(--pixel-bg)',
                    color: 'var(--pixel-text)',
                    fontFamily: 'VT323, monospace',
                    fontSize: isMobile ? '14px' : '16px',
                    lineHeight: '1.4'
                  }}
                >
                  {node.description}
                </div>
              </div>
            )}

            {/* 详细信息 */}
            {node.details && node.details.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 
                  className={`${
                    isMobile ? 'text-sm' : 'text-lg'
                  } font-mono mb-3 flex items-center gap-2`}
                  style={{ 
                    color: 'var(--pixel-primary)',
                    fontFamily: 'Press Start 2P, monospace',
                    fontSize: isMobile ? '12px' : '14px'
                  }}
                >
                  <span 
                    className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}
                    style={{ 
                      background: 'var(--pixel-secondary)',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                  ></span>
                  DETAILS
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {node.details.map((detail, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start gap-2 sm:gap-3 ${
                        isMobile ? 'p-2' : 'p-3'
                      } pixel-panel`}
                      style={{ 
                        background: 'var(--pixel-bg)',
                        borderColor: 'var(--pixel-border)'
                      }}
                    >
                      <span 
                        className="mt-1 flex-shrink-0 font-mono"
                        style={{ 
                          color: 'var(--pixel-accent)',
                          fontFamily: 'Press Start 2P, monospace',
                          fontSize: isMobile ? '10px' : '12px'
                        }}
                      >
                        ►
                      </span>
                      <span 
                        className="leading-relaxed font-mono"
                        style={{ 
                          color: 'var(--pixel-text)',
                          fontFamily: 'VT323, monospace',
                          fontSize: isMobile ? '14px' : '16px'
                        }}
                      >
                        {detail}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}



            {/* 子节点导航 */}
            {node.children && node.children.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 
                  className={`${
                    isMobile ? 'text-sm' : 'text-lg'
                  } font-mono mb-3 flex items-center gap-2`}
                  style={{ 
                    color: 'var(--pixel-primary)',
                    fontFamily: 'Press Start 2P, monospace',
                    fontSize: isMobile ? '12px' : '14px'
                  }}
                >
                  <span 
                    className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}
                    style={{ 
                      background: 'var(--pixel-accent)',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                  ></span>
                  SUB_MODULES
                </h3>
                <div className="grid gap-2 sm:gap-3">
                  {node.children.map((child, index) => (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`pixel-panel ${isMobile ? 'p-2' : 'p-3'} flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-opacity-80`}
                      style={{ 
                        background: child.color + '20',
                        borderColor: child.color
                      }}
                    >
                      <span 
                        className="text-lg flex-shrink-0"
                        style={{ 
                          color: child.color,
                          fontFamily: 'Press Start 2P, monospace',
                          fontSize: isMobile ? '12px' : '16px'
                        }}
                      >
                        {child.icon || '◆'}
                      </span>
                      <span 
                        className="font-mono flex-1 min-w-0"
                        style={{ 
                          color: 'var(--pixel-text)',
                          fontFamily: 'VT323, monospace',
                          fontSize: isMobile ? '14px' : '16px'
                        }}
                      >
                        {child.name}
                      </span>
                      <span 
                        className="text-xs font-mono flex-shrink-0"
                        style={{ 
                          color: 'var(--pixel-accent)',
                          fontFamily: 'Press Start 2P, monospace',
                          fontSize: isMobile ? '8px' : '10px'
                        }}
                      >
                        ►
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 移动端提示 */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs font-mono text-center p-2 mobile-hint"
                style={{ 
                  color: 'var(--pixel-accent)',
                  fontFamily: 'VT323, monospace',
                  background: 'var(--pixel-bg)',
                  border: '1px solid var(--pixel-border)'
                }}
              >
                双击节点展开更多内容 | 拖拽可移动视角
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailPanel; 
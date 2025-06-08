'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeNode } from '../data/careerData';
import { X, ChevronRight } from 'lucide-react';

interface DetailPanelProps {
  node: TreeNode | null;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ node, onClose }) => {
  if (!node) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'root': return '🎯';
      case 'main': return '📋';
      case 'sub': return '📌';
      default: return '•';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'root': return '核心主题';
      case 'main': return '主要模块';
      case 'sub': return '具体内容';
      default: return '详细信息';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div 
            className="relative p-6 text-white"
            style={{ backgroundColor: node.color }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{node.icon || getCategoryIcon(node.category)}</span>
                <div>
                  <h2 className="text-2xl font-bold">{node.name}</h2>
                  <p className="text-white/80 text-sm">{getCategoryText(node.category)}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* 描述 */}
            {node.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  概述
                </h3>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {node.description}
                </p>
              </div>
            )}

            {/* 详细信息 */}
            {node.details && node.details.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  详细内容
                </h3>
                <ul className="space-y-3">
                  {node.details.map((detail, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* 子模块 */}
            {node.children && node.children.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  子模块 ({node.children.length})
                </h3>
                <div className="grid gap-3">
                  {node.children.map((child, index) => (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: child.color }}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{child.name}</h4>
                        {child.description && (
                          <p className="text-sm text-gray-600 mt-1">{child.description}</p>
                        )}
                      </div>
                      {child.icon && (
                        <span className="text-lg">{child.icon}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* 底部操作 */}
          {/* <div className="p-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
            >
              继续探索其他内容
            </button>
          </div> */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailPanel; 
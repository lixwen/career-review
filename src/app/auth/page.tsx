'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const AuthPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // 检查是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 检查是否已经通过验证
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('d5_authenticated');
    if (isAuthenticated === 'true') {
      router.push('/main');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswer = 'dimension5';
    
    if (input.toLowerCase().trim() === correctAnswer) {
      // 验证成功
      localStorage.setItem('d5_authenticated', 'true');
      router.push('/main');
    } else {
      // 验证失败，跳转到贪吃蛇404页面
      router.push('/snake-404');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center pixel-scanlines px-4 py-8"
      style={{ background: 'var(--pixel-bg)' }}
    >
      {/* 8-bit 风格终端 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="pixel-panel p-4 sm:p-8 max-w-md w-full mx-4 modal-content"
      >
        {/* 终端头部 */}
        <div 
          className="flex items-center justify-between mb-4 sm:mb-6 pb-4"
          style={{ borderBottom: '2px solid var(--pixel-border)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500"></div>
          </div>
          <span 
            className="text-xs font-mono hidden sm:inline"
            style={{ 
              color: 'var(--pixel-text-dim)',
              fontFamily: 'VT323, monospace'
            }}
          >
            SECURE_TERMINAL.EXE
          </span>
        </div>

        {/* 标题 */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pixel-title text-lg sm:text-xl mb-4 sm:mb-6 text-center"
          style={{ color: 'var(--pixel-primary)' }}
        >
          ▲ SECURITY CHECK ▲
        </motion.h1>

        {/* 问题显示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-4 sm:mb-6"
        >
          <div 
            className="font-mono text-xs sm:text-sm mb-4"
            style={{ 
              color: 'var(--pixel-text)',
              fontFamily: 'VT323, monospace',
              lineHeight: '1.4'
            }}
          >
            <span style={{ color: 'var(--pixel-accent)' }}>root@d5-system:~$</span> 
            <span className="ml-2">QUESTION_PROMPT</span>
          </div>
          
          <div 
            className="pixel-panel p-3 sm:p-4 mb-4"
            style={{ background: 'var(--pixel-bg)' }}
          >
            <p 
              className="font-mono text-center"
              style={{ 
                color: 'var(--pixel-warning)',
                fontFamily: 'Press Start 2P, monospace',
                fontSize: isMobile ? '10px' : '12px',
                lineHeight: '1.6'
              }}
            >
              Where am I now?
            </p>
          </div>
        </motion.div>

        {/* 输入表单 */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="输入答案..."
              className="w-full p-3 sm:p-3 pixel-panel font-mono text-sm touch-friendly"
              style={{
                background: 'var(--pixel-bg)',
                color: 'var(--pixel-text)',
                fontFamily: 'VT323, monospace',
                fontSize: '16px',
                outline: 'none'
              }}
              autoFocus={!isMobile} // 移动端不自动聚焦，避免键盘弹出
            />
            {isTyping && (
              <span 
                className="absolute right-3 top-3 pixel-blink"
                style={{ color: 'var(--pixel-primary)' }}
              >
                █
              </span>
            )}
          </div>

          <button
            type="submit"
            className="pixel-btn w-full touch-friendly"
            disabled={!input.trim()}
          >
            EXECUTE
          </button>
        </motion.form>

        {/* 提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 sm:mt-6 text-center"
        >
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-mono underline touch-friendly"
            style={{ 
              color: 'var(--pixel-text-dim)',
              fontFamily: 'VT323, monospace'
            }}
          >
            需要提示？
          </button>
          
          {showHint && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-xs font-mono mt-2"
              style={{ 
                color: 'var(--pixel-accent)',
                fontFamily: 'VT323, monospace'
              }}
            >
              Hint: Fullname of D5
            </motion.p>
          )}
        </motion.div>

        {/* 移动端操作提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 sm:mt-8 text-xs font-mono mobile-hint text-center"
          style={{ 
            color: 'var(--pixel-primary)',
            fontFamily: 'VT323, monospace'
          }}
        >
          <div>📱 移动端优化版本</div>
          <div>触摸操作已启用</div>
        </motion.div>

        {/* 装饰性代码滚动 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 sm:mt-8 text-xs font-mono opacity-30 desktop-hint"
          style={{ 
            color: 'var(--pixel-primary)',
            fontFamily: 'VT323, monospace'
          }}
        >
          <div>{">"} LOADING AUTHENTICATION MODULE...</div>
          <div>{">"} CHECKING PERMISSIONS...</div>
          <div>{">"} READY FOR INPUT</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage; 
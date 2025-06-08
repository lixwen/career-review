'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 150;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // 检查移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 读取历史最高分
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake_high_score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // 生成随机食物位置
  const generateFood = useCallback((snakeBody: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // 重置游戏
  const resetGame = useCallback((e?: React.TouchEvent | React.MouseEvent) => {
    if (e && isMobile) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSnake(INITIAL_SNAKE);
    setFood({ x: 15, y: 15 });
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  }, [isMobile]);

  // 改变方向
  const changeDirection = useCallback((newDirection: Direction) => {
    if (gameOver) return;
    
    // 防止反向移动
    switch (newDirection) {
      case 'UP':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'DOWN':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'LEFT':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'RIGHT':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [direction, gameOver]);

  // 游戏主循环
  const gameLoop = useCallback(() => {
    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      // 根据方向移动头部
      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // 检查边界碰撞
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      // 检查自身碰撞
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // 检查是否吃到食物
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood]);

  // 启动游戏循环
  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(gameLoop, GAME_SPEED);
      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameStarted, gameOver, gameLoop]);

  // 游戏结束时更新最高分
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake_high_score', score.toString());
    }
  }, [gameOver, score, highScore]);

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted && !gameOver) {
        setGameStarted(true);
        return;
      }

      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, changeDirection]);

  const startGame = (e?: React.TouchEvent | React.MouseEvent) => {
    if (e && isMobile) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!gameStarted) {
      setGameStarted(true);
    }
  };

  // 虚拟手柄按钮点击处理
  const handleVirtualButton = (direction: Direction, e?: React.TouchEvent | React.MouseEvent) => {
    if (e && isMobile) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!gameStarted && !gameOver) {
      setGameStarted(true);
    }
    changeDirection(direction);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center pixel-scanlines px-2 sm:px-4"
      style={{ background: 'var(--pixel-bg)' }}
    >
      <div className="text-center max-w-4xl mx-auto p-2 sm:p-4 w-full">
        {/* 404 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <h1 
            className={`pixel-title ${isMobile ? 'text-4xl' : 'text-6xl'} mb-2 sm:mb-4`}
            style={{ 
              color: 'var(--pixel-danger)',
              textShadow: '4px 4px 0px rgba(0,0,0,0.8)'
            }}
          >
            404
          </h1>
          <h2 
            className={`pixel-title ${isMobile ? 'text-lg' : 'text-xl'} mb-1 sm:mb-2`}
            style={{ color: 'var(--pixel-warning)' }}
          >
            ACCESS DENIED
          </h2>
          <p 
            className={`font-mono ${isMobile ? 'text-sm' : 'text-base'} mb-2 sm:mb-4`}
            style={{ 
              color: 'var(--pixel-text-dim)',
              fontFamily: 'VT323, monospace'
            }}
          >
            {isMobile ? '验证失败！玩游戏获得第二次机会' : '验证失败！但是你可以玩贪吃蛇游戏获得第二次机会'}
          </p>
        </motion.div>

        {/* 游戏区域 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="pixel-panel mb-4 sm:mb-6 p-3 sm:p-6 mx-auto max-w-lg"
        >
          {/* 游戏信息 */}
          <div className="flex justify-between items-center mb-3 sm:mb-4 text-xs sm:text-sm font-mono">
            <div style={{ color: 'var(--pixel-primary)' }}>
              分数: {score}
            </div>
            <div style={{ color: 'var(--pixel-warning)' }}>
              最高分: {highScore}
            </div>
          </div>

          {/* 游戏画布 */}
          <div 
            className="game-grid mx-auto mb-3 sm:mb-4 relative"
            style={{
              width: isMobile ? '90vw' : '400px',
              height: isMobile ? '90vw' : '400px',
              maxWidth: '400px',
              maxHeight: '400px',
              background: 'var(--pixel-bg)',
              border: '3px solid var(--pixel-text)',
              boxShadow: 'inset 0 0 0 1px var(--pixel-border)'
            }}
          >
            {/* 网格背景 */}
            <div 
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                opacity: 0.1
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                <div 
                  key={i}
                  style={{ 
                    border: '1px solid var(--pixel-border)'
                  }}
                />
              ))}
            </div>

            {/* 蛇身 */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  background: index === 0 ? 'var(--pixel-primary)' : 'var(--pixel-accent)',
                  border: '1px solid var(--pixel-text)',
                  boxSizing: 'border-box',
                  transition: 'all 0.1s linear'
                }}
              />
            ))}

            {/* 食物 */}
            <div
              className="absolute pixel-blink"
              style={{
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                background: 'var(--pixel-warning)',
                border: '1px solid var(--pixel-text)',
                boxSizing: 'border-box'
              }}
            />

            {/* 游戏状态覆盖层 */}
            {(!gameStarted || gameOver) && (
              <div className="absolute inset-0 flex items-center justify-center"
                   style={{ background: 'rgba(42, 42, 42, 0.9)' }}>
                <div className="text-center p-4">
                  {!gameStarted && (
                    <>
                      <p className={`font-mono ${isMobile ? 'text-xs' : 'text-sm'} mb-4`}
                         style={{ color: 'var(--pixel-text)', fontFamily: 'VT323, monospace' }}>
                        {isMobile ? '点击按钮开始游戏' : '按任意键或点击按钮开始游戏'}
                      </p>
                      <button 
                        onClick={startGame}
                        {...(isMobile && { onTouchStart: startGame })}
                        className="pixel-btn touch-friendly"
                      >
                        START
                      </button>
                    </>
                  )}
                  {gameOver && (
                    <>
                      <p className={`font-mono ${isMobile ? 'text-lg' : 'text-xl'} mb-2`}
                         style={{ color: 'var(--pixel-danger)', fontFamily: 'Press Start 2P, monospace' }}>
                        GAME OVER
                      </p>
                      <p className={`font-mono ${isMobile ? 'text-xs' : 'text-sm'} mb-4`}
                         style={{ color: 'var(--pixel-text)', fontFamily: 'VT323, monospace' }}>
                        最终分数: {score}
                      </p>
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button 
                          onClick={resetGame}
                          {...(isMobile && { onTouchStart: resetGame })}
                          className="pixel-btn touch-friendly"
                        >
                          RETRY
                        </button>
                        <button 
                          onClick={(e) => {
                            if (isMobile) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                            router.push('/auth');
                          }}
                          {...(isMobile && { 
                            onTouchStart: (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          })}
                          className="pixel-btn touch-friendly"
                          style={{ background: 'var(--pixel-accent)' }}
                        >
                          BACK
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 桌面端控制说明 */}
          {!isMobile && (
            <div className="text-xs font-mono text-center desktop-hint"
                 style={{ color: 'var(--pixel-text-dim)', fontFamily: 'VT323, monospace' }}>
              使用方向键或 WASD 控制
            </div>
          )}
        </motion.div>

        {/* 移动端虚拟游戏手柄 */}
        {isMobile && (gameStarted && !gameOver) && (
          <div className="virtual-gamepad">
            <div className="grid grid-cols-3 grid-rows-3 gap-2">
              <div></div>
              <button 
                className="gamepad-btn no-select"
                onTouchStart={(e) => handleVirtualButton('UP', e)}
                onClick={(e) => handleVirtualButton('UP', e)}
              >
                ▲
              </button>
              <div></div>
              <button 
                className="gamepad-btn no-select"
                onTouchStart={(e) => handleVirtualButton('LEFT', e)}
                onClick={(e) => handleVirtualButton('LEFT', e)}
              >
                ◄
              </button>
              <div className="w-12 h-12 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <button 
                className="gamepad-btn no-select"
                onTouchStart={(e) => handleVirtualButton('RIGHT', e)}
                onClick={(e) => handleVirtualButton('RIGHT', e)}
              >
                ►
              </button>
              <div></div>
              <button 
                className="gamepad-btn no-select"
                onTouchStart={(e) => handleVirtualButton('DOWN', e)}
                onClick={(e) => handleVirtualButton('DOWN', e)}
              >
                ▼
              </button>
              <div></div>
            </div>
          </div>
        )}

        {/* 404 信息和返回按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="pixel-panel p-3 sm:p-4 mb-4 sm:mb-6">
            <p className={`font-mono ${isMobile ? 'text-xs' : 'text-sm'} mb-3 sm:mb-4`}
               style={{ color: 'var(--pixel-text)', fontFamily: 'VT323, monospace' }}>
              系统错误代码: INVALID_CREDENTIALS
            </p>
            <button
              onClick={(e) => {
                if (isMobile) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                router.push('/auth');
              }}
              {...(isMobile && { 
                onTouchStart: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }
              })}
              className="pixel-btn touch-friendly"
              style={{ background: 'var(--pixel-primary)' }}
            >
              返回验证页面
            </button>
          </div>

          {/* 移动端提示 */}
          {isMobile && (
            <div className="text-xs font-mono mobile-hint"
                 style={{ color: 'var(--pixel-accent)', fontFamily: 'VT323, monospace' }}>
              <div className="pixel-panel p-2">
                📱 移动端优化版贪吃蛇游戏
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SnakeGame; 
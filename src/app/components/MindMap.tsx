'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '../data/careerData';

interface MindMapProps {
  data: TreeNode;
  onNodeClick: (node: TreeNode) => void;
  onNodeDoubleClick: (node: TreeNode) => void;
  expandedNodes: Set<string>;
  visitedNodes: Set<string>;
}

interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  color: string;
  icon?: string;
  originalData: TreeNode;
  level: number;
  children?: D3Node[];
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: D3Node;
  target: D3Node;
}

const MindMap: React.FC<MindMapProps> = ({ data, onNodeClick, onNodeDoubleClick, expandedNodes, visitedNodes }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 检查移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 使用 useCallback 来稳定化检查函数
  const isNodeExpanded = useCallback((nodeId: string) => {
    return expandedNodes.has(nodeId);
  }, [expandedNodes]);

  // 检查节点是否已访问
  const isNodeVisited = useCallback((nodeId: string) => {
    return visitedNodes.has(nodeId);
  }, [visitedNodes]);

  // 智能点击处理函数，区分单击和双击
  const handleNodeClickEvent = useCallback((event: MouseEvent | TouchEvent, node: TreeNode) => {
    event.stopPropagation();
    
    // 移动端使用不同的处理逻辑
    if (isMobile) {
      // 移动端：短触摸为单击，长触摸为双击
      if (event.type === 'touchstart') {
        touchTimeoutRef.current = setTimeout(() => {
          touchTimeoutRef.current = null;
          onNodeDoubleClick(node);
        }, 500); // 500ms长按
      } else if (event.type === 'touchend') {
        if (touchTimeoutRef.current) {
          clearTimeout(touchTimeoutRef.current);
          touchTimeoutRef.current = null;
          onNodeClick(node);
        }
      }
    } else {
      // 桌面端：保持原有的双击逻辑
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
        onNodeDoubleClick(node);
      } else {
        clickTimeoutRef.current = setTimeout(() => {
          clickTimeoutRef.current = null;
          onNodeClick(node);
        }, 250);
      }
    }
  }, [onNodeClick, onNodeDoubleClick, isMobile]);

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      // 清理定时器
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    const width = dimensions.width;
    const height = dimensions.height;

    // 转换数据为D3格式
    const nodes: D3Node[] = [];
    const links: D3Link[] = [];

    function processNode(node: TreeNode, level = 0, parent?: D3Node) {
      const d3Node: D3Node = {
        id: node.id,
        name: node.name,
        category: node.category,
        color: node.color,
        icon: node.icon,
        originalData: node,
        level,
        x: width / 2,
        y: height / 2,
      };

      nodes.push(d3Node);

      if (parent) {
        links.push({ source: parent, target: d3Node });
      }

      // 只有当节点已展开时，才处理其子节点
      if (node.children && isNodeExpanded(node.id)) {
        node.children.forEach(child => processNode(child, level + 1, d3Node));
      }
    }

    processNode(data);

    // 清除旧内容并重新创建
    svg.selectAll('*').remove();

    // 创建力导向图
    const simulation = d3.forceSimulation<D3Node>(nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(links).id(d => d.id).distance(isMobile ? 100 : 120))
      .force('charge', d3.forceManyBody().strength(isMobile ? -300 : -500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(isMobile ? 50 : 60));

    // 创建主容器
    const container = svg.append('g').attr('class', 'main-container');

    // 添加缩放功能
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    // 创建箭头标记
    svg.append('defs').selectAll('marker')
      .data(['arrow'])
      .enter().append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', isMobile ? 20 : 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    // 创建连接线，带动画
    const linkGroup = container.append('g').attr('class', 'links');
    const link = linkGroup.selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0)
      .attr('stroke-width', isMobile ? 1.5 : 2)
      .attr('marker-end', 'url(#arrow)');

    // 连接线的进入动画
    link.transition()
      .duration(500)
      .delay((d, i) => i * 100 + 400)
      .attr('stroke-opacity', 0.8);

    // 创建节点组
    const nodeGroup = container.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, D3Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // 添加像素风格方形节点，移动端使用更大的尺寸
    const getNodeSize = (category: string) => {
      if (isMobile) {
        return category === 'root' ? 70 : category === 'main' ? 55 : 40;
      }
      return category === 'root' ? 80 : category === 'main' ? 60 : 40;
    };

    const getHoverSize = (category: string) => {
      if (isMobile) {
        return category === 'root' ? 80 : category === 'main' ? 65 : 50;
      }
      return category === 'root' ? 90 : category === 'main' ? 70 : 50;
    };

    const rects = nodeGroup.append('rect')
      .attr('width', 0)
      .attr('height', 0)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', d => d.color)
      .attr('stroke', d => {
        if (d.originalData.children && d.originalData.children.length > 0 && !isNodeExpanded(d.id)) {
          return '#ffed4e';
        }
        return '#ffffff';
      })
      .attr('stroke-width', d => {
        if (d.originalData.children && d.originalData.children.length > 0 && !isNodeExpanded(d.id)) {
          return isMobile ? 3 : 4;
        }
        return isMobile ? 2 : 3;
      })
      .attr('stroke-dasharray', d => {
        if (d.originalData.children && d.originalData.children.length > 0 && !isNodeExpanded(d.id)) {
          return isMobile ? '6,3' : '8,4';
        }
        return 'none';
      })
      .style('shape-rendering', 'crispEdges')
      .style('filter', 'drop-shadow(4px 4px 0px rgba(0,0,0,0.5))')
      .style('opacity', 0);

    // 添加触摸和鼠标事件
    if (isMobile) {
      // 移动端触摸事件
      rects
        .on('touchstart', function(event, d) {
          event.preventDefault();
          const size = getHoverSize(d.category);
          d3.select(this).transition().duration(100)
            .attr('width', size)
            .attr('height', size)
            .attr('x', -size/2)
            .attr('y', -size/2);
          handleNodeClickEvent(event, d.originalData);
        })
        .on('touchend', function(event, d) {
          event.preventDefault();
          const size = getNodeSize(d.category);
          d3.select(this).transition().duration(100)
            .attr('width', size)
            .attr('height', size)
            .attr('x', -size/2)
            .attr('y', -size/2);
          handleNodeClickEvent(event, d.originalData);
        })
        .on('click', (event, d) => {
          event.preventDefault();
          handleNodeClickEvent(event, d.originalData);
        });
    } else {
      // 桌面端鼠标事件
      rects
        .on('mouseover', function(event, d) {
          const size = getHoverSize(d.category);
          d3.select(this).transition().duration(100)
            .attr('width', size)
            .attr('height', size)
            .attr('x', -size/2)
            .attr('y', -size/2);
        })
        .on('mouseout', function(event, d) {
          const size = getNodeSize(d.category);
          d3.select(this).transition().duration(100)
            .attr('width', size)
            .attr('height', size)
            .attr('x', -size/2)
            .attr('y', -size/2);
        })
        .on('click', (event, d) => {
          handleNodeClickEvent(event, d.originalData);
        });
    }

    // 添加进入动画
    rects.transition()
      .duration(600)
      .delay((d: D3Node, i: number) => i * 150)
      .ease(d3.easeElasticOut.amplitude(1).period(0.5))
      .attr('width', (d: D3Node) => getNodeSize(d.category))
      .attr('height', (d: D3Node) => getNodeSize(d.category))
      .attr('x', (d: D3Node) => -getNodeSize(d.category)/2)
      .attr('y', (d: D3Node) => -getNodeSize(d.category)/2)
      .style('opacity', 1);

    // 添加像素风格图标，移动端使用更大的字体
    const getFontSize = (category: string) => {
      if (isMobile) {
        return category === 'root' ? '20px' : category === 'main' ? '16px' : '12px';
      }
      return category === 'root' ? '24px' : category === 'main' ? '20px' : '16px';
    };

    const icons = nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-family', 'Press Start 2P, monospace')
      .attr('font-size', d => getFontSize(d.category))
      .text(d => d.icon || '█')
      .attr('fill', '#ffffff')
      .style('text-shadow', '2px 2px 0px rgba(0,0,0,0.8)')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .style('opacity', 0);

    // 添加像素风格节点标签，移动端使用更大的字体
    const getLabelFontSize = (category: string) => {
      if (isMobile) {
        return category === 'root' ? '16px' : '14px';
      }
      return category === 'root' ? '18px' : '16px';
    };

    const getLabelOffset = (category: string) => {
      if (isMobile) {
        return category === 'root' ? '55px' : category === 'main' ? '45px' : '35px';
      }
      return category === 'root' ? '70px' : category === 'main' ? '60px' : '50px';
    };

    const labels = nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => getLabelOffset(d.category))
      .attr('font-family', 'VT323, monospace')
      .attr('font-size', d => getLabelFontSize(d.category))
      .attr('font-weight', d => d.category === 'root' ? 'bold' : 'normal')
      .attr('fill', '#ffffff')
      .style('text-shadow', '1px 1px 0px rgba(0,0,0,0.8)')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .text(d => {
        // 移动端截断过长的文本
        if (isMobile && d.name.length > 8) {
          return d.name.substring(0, 6) + '...';
        }
        return d.name;
      })
      .style('opacity', 0);

    // 图标和标签的进入动画
    icons.transition()
      .duration(400)
      .delay((d, i) => i * 150 + 200)
      .style('opacity', 1);

    labels.transition()
      .duration(400)
      .delay((d, i) => i * 150 + 300)
      .style('opacity', 1);

    // 添加访问状态指示器
    const indicators = nodeGroup.append('circle')
      .attr('r', 0)
      .attr('cx', d => getNodeSize(d.category)/2 - 8)
      .attr('cy', d => -getNodeSize(d.category)/2 + 8)
      .attr('fill', 'var(--pixel-warning)')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1)
      .style('opacity', 0);

    indicators
      .filter(d => isNodeVisited(d.id))
      .transition()
      .duration(300)
      .delay((d, i) => i * 100 + 600)
      .attr('r', isMobile ? 4 : 5)
      .style('opacity', 1);

    // 更新模拟
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as D3Node).x!)
        .attr('y1', d => (d.source as D3Node).y!)
        .attr('x2', d => (d.target as D3Node).x!)
        .attr('y2', d => (d.target as D3Node).y!);

      nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // 移动端初始缩放调整
    if (isMobile && nodes.length > 5) {
      const initialScale = 0.7;
      svg.call(zoom.transform, d3.zoomIdentity.scale(initialScale).translate(
        (width * (1 - initialScale)) / 2 / initialScale,
        (height * (1 - initialScale)) / 2 / initialScale
      ));
    }

  }, [data, expandedNodes, visitedNodes, dimensions, isNodeExpanded, isNodeVisited, handleNodeClickEvent, isMobile]);

  return (
    <div className="w-full h-full relative">
      <svg
        ref={svgRef}
        className="w-full h-full mindmap-container"
        style={{ 
          background: 'var(--pixel-bg)',
          touchAction: isMobile ? 'manipulation' : 'auto'
        }}
      />
      
      {/* 移动端操作提示 */}
      {isMobile && (
        <div 
          className="absolute top-2 left-2 text-xs font-mono mobile-hint opacity-75"
          style={{ 
            color: 'var(--pixel-accent)',
            fontFamily: 'VT323, monospace',
            background: 'rgba(42, 42, 42, 0.8)',
            padding: '4px 8px',
            border: '1px solid var(--pixel-border)'
          }}
        >
          点击查看 • 长按展开
        </div>
      )}
    </div>
  );
};

export default MindMap; 
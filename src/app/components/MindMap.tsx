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
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 使用 useCallback 来稳定化检查函数
  const isNodeExpanded = useCallback((nodeId: string) => {
    return expandedNodes.has(nodeId);
  }, [expandedNodes]);

  // 检查节点是否已访问
  const isNodeVisited = useCallback((nodeId: string) => {
    return visitedNodes.has(nodeId);
  }, [visitedNodes]);

  // 智能点击处理函数，区分单击和双击
  const handleNodeClickEvent = useCallback((event: MouseEvent, node: TreeNode) => {
    event.stopPropagation();
    
    // 如果已经有待处理的单击，清除它（意味着这是双击）
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      // 处理双击
      onNodeDoubleClick(node);
    } else {
      // 设置延迟处理单击
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        // 处理单击
        onNodeClick(node);
      }, 250); // 250ms延迟
    }
  }, [onNodeClick, onNodeDoubleClick]);

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
      // 清理点击定时器
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

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

    // 创建力导向图
    const simulation = d3.forceSimulation<D3Node>(nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(links).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    // 创建容器
    const container = svg.append('g');

    // 添加缩放功能
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
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
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    // 创建连接线
    const link = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.8)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

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

    // 添加节点圆圈
    nodeGroup.append('circle')
      .attr('r', d => d.category === 'root' ? 40 : d.category === 'main' ? 30 : 20)
      .attr('fill', d => d.color)
      .attr('stroke', d => {
        // 如果节点有子节点但还没展开，用虚线边框提示
        if (d.originalData.children && d.originalData.children.length > 0 && !isNodeExpanded(d.id)) {
          return '#FFA500';
        }
        return '#fff';
      })
      .attr('stroke-width', d => {
        if (d.originalData.children && d.originalData.children.length > 0 && !isNodeExpanded(d.id)) {
          return 5;
        }
        return 3;
      })
      .attr('stroke-dasharray', d => {
        if (d.originalData.children && d.originalData.children.length > 0 && !isNodeExpanded(d.id)) {
          return '5,5';
        }
        return 'none';
      })
      .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))')
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(200).attr('r', 
          d.category === 'root' ? 45 : d.category === 'main' ? 35 : 25
        );
      })
      .on('mouseout', function(event, d) {
        d3.select(this).transition().duration(200).attr('r', 
          d.category === 'root' ? 40 : d.category === 'main' ? 30 : 20
        );
      })
      .on('click', (event, d) => {
        handleNodeClickEvent(event, d.originalData);
      });



    // 添加图标
    nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', d => d.category === 'root' ? '24px' : d.category === 'main' ? '20px' : '16px')
      .text(d => d.icon || '●')
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // 添加节点标签
    nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.category === 'root' ? '60px' : d.category === 'main' ? '50px' : '40px')
      .attr('font-size', d => d.category === 'root' ? '16px' : '14px')
      .attr('font-weight', d => d.category === 'root' ? 'bold' : 'normal')
      .attr('fill', '#333')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .text(d => d.name);

    // 更新位置
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as D3Node).x!)
        .attr('y1', d => (d.source as D3Node).y!)
        .attr('x2', d => (d.target as D3Node).x!)
        .attr('y2', d => (d.target as D3Node).y!);

      nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // 清理函数
    return () => {
      simulation.stop();
    };

  }, [data, dimensions, handleNodeClickEvent, isNodeExpanded, isNodeVisited]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50"
        style={{ minHeight: '600px' }}
      />
      
      {/* 探索提示 */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h3 className="font-bold text-gray-800 mb-2">🎯 探索我的转正历程</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>• 单击节点查看详细内容</p>
          <p>• 双击节点展开/收起子节点</p>
          <p>• 橙色虚线边框表示可展开</p>
        </div>
      </div>
    </div>
  );
};

export default MindMap; 
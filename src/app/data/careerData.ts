export interface TreeNode {
  id: string;
  name: string;
  description?: string;
  details?: string[];
  children?: TreeNode[];
  category: 'root' | 'main' | 'sub' | 'detail';
  color: string;
  icon?: string;
}

export const careerData: TreeNode = {
  id: 'root',
  name: '转正述职',
  category: 'root',
  color: '#00ff41',
  children: [
          {
        id: 'work-review',
        name: '1. 工作回顾',
        category: 'main',
        color: '#41b3ff',
        icon: '⚡',
      children: [
                  {
            id: 'works',
            name: 'Works',
            category: 'sub',
            color: '#00ff41',
          description: '后端技术调研、方案选型以及代码开发等工作',
          details: [
            '机器审核相关后端框架设计、开发，例如：相似图片识别、内容安全检测等',
            '全文搜索相关能力设计开发',
            '外部爬虫数据加工清洗，多个站点数据整合入 Works 商品库',
            '运营侧数据需求提供'
          ]
        },
                  {
            id: 'data',
            name: '数据',
            category: 'sub',
            color: '#ff6b35',
          description: '数据处理和基础设施建设',
          details: [
            'DataX 替代 Canal 做数仓数据同步，修改部分源码方便使用',
            '和 @姚子贤 一起做 Grafana 面板搭建，以及通过阅读 Grafana 源码，然后修改相关的存储数据来解决 Grafana 社区版无权限管理问题'
          ]
        },
                  {
            id: 'issue-analysis',
            name: '线上问题分析',
            category: 'sub',
            color: '#ffed4e',
          description: '问题定位和分析能力',
          details: [
            '一起定位分析 RocketMQ 出现多个消费者消费一个 TAG 的问题',
            '分析外部撞库攻击的始作俑者'
          ]
        }
      ]
    },
          {
        id: 'sharing',
        name: '2. 分享',
        category: 'main',
        color: '#ff6b35',
        icon: '▲',
      description: '技术分享和推广',
      details: [
        '组内推荐使用 AI 结合 PlantUML 实现流程图绘制自由',
        'AI 编辑器使用推荐：Cursor 使用指北'
      ]
    },
          {
        id: 'gains',
        name: '3. 收获',
        category: 'main',
        color: '#ff073a',
        icon: '★',
      children: [
                  {
            id: 'work-gains',
            name: '工作上',
            category: 'sub',
            color: '#ff073a',
          description: '技术和业务能力提升',
          details: [
            '快速熟悉了当前服务端使用的后端技术栈，比如：RocketMQ、Apache Doris等',
            '从零开始搭建了 Works 站点的后端相关能力，在过程中也学习到了很多新知识，比如：相似图识别等',
            '在产品和运营上也学习了挺多，之前做 ToC 产品的时候，对这一块了解不够。比如：转化率、推荐分析等'
          ]
        },
                  {
            id: 'life-gains',
            name: '生活中',
            category: 'sub',
            color: '#ffed4e',
          description: '生活和兴趣拓展',
          details: [
            '与新认识的小伙伴们一起去打🎱',
            '成立了《每周一山》小组（虽然现在的频率远远还没有达成）',
            '对 3D 建模、渲染领域有了一些基础了解，也许后面可以自己做自家的装修设计等'
          ]
        }
      ]
    },
          {
        id: 'thinking',
        name: '4. 思考与反思',
        category: 'main',
        color: '#41b3ff',
        icon: '?',
      description: '思考与反思',
      details: [
        '尽量减少出现忙碌中出错的问题',
        '如何更好的使用 AI 来提效'
      ]
    },
          {
        id: 'outlook',
        name: '5. 展望',
        category: 'main',
        color: '#00ff41',
        icon: '►',
      description: '未来规划和目标',
      details: [
        '打好基础，希望 Works 站点能够更好的发展，能给 D5 带来更多的用户以及盈利',
        '在 AI 大趋势下，始终保持持续学习的习惯，借助 AI 来加速知识边界的扩展'
      ]
    },
          {
        id: 'suggestions',
        name: '6. 建议',
        category: 'main',
        color: '#ffed4e',
        icon: '!',
      description: '改进建议和想法',
      details: [
        '在当前的相似图识别场景中，单体场景识别的误判较高，如果能利用公司的 AI 资源，对相关的行业图片做微调，可能会有更好的准确度。',
        'AI 编辑器有一些部分可以做项目级别的标准化，比如：Cursor 的 project rule加入 Git 管理。',
        '利用 AI 来做相关的代码质量检查和 Review。'
      ]
    }
  ]
}; 

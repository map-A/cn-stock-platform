import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Space, Typography, Tag, Select, Radio, Statistic } from 'antd';
import { PieChartOutlined, BarChartOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import './AssetAllocation.less';

const { Text, Title } = Typography;
const { Option } = Select;

interface AssetItem {
  /** 资产名称 */
  name: string;
  /** 资产代码 */
  code?: string;
  /** 资产价值 */
  value: number;
  /** 占比 */
  percentage: number;
  /** 分类 */
  category: string;
  /** 盈亏 */
  profitLoss?: number;
  /** 盈亏比例 */
  profitLossPercent?: number;
}

interface AssetAllocationProps {
  /** 资产数据 */
  assets?: AssetItem[];
  /** 总资产 */
  totalAssets?: number;
  /** 图表高度 */
  height?: number;
  /** 加载状态 */
  loading?: boolean;
}

type ChartType = 'pie' | 'bar' | 'treemap';
type GroupType = 'stock' | 'industry' | 'category';

const AssetAllocation: React.FC<AssetAllocationProps> = ({
  assets = [],
  totalAssets = 0,
  height = 400,
  loading = false,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [chartType, setChartType] = useState<ChartType>('pie');
  const [groupType, setGroupType] = useState<GroupType>('industry');

  // 初始化图表
  useEffect(() => {
    if (chartRef.current && !loading) {
      chartInstance.current = echarts.init(chartRef.current);
      updateChart();
      
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, [assets, chartType, groupType, loading]);

  // 数据分组处理
  const getGroupedData = () => {
    const grouped: { [key: string]: AssetItem[] } = {};
    
    assets.forEach(asset => {
      let key: string;
      switch (groupType) {
        case 'stock':
          key = asset.name;
          break;
        case 'industry':
          key = asset.category || '其他';
          break;
        case 'category':
          key = asset.category || '其他';
          break;
        default:
          key = asset.category || '其他';
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(asset);
    });

    // 计算分组汇总数据
    return Object.entries(grouped).map(([key, items]) => {
      const totalValue = items.reduce((sum, item) => sum + item.value, 0);
      const totalProfitLoss = items.reduce((sum, item) => sum + (item.profitLoss || 0), 0);
      const avgProfitLossPercent = items.length > 0 
        ? items.reduce((sum, item) => sum + (item.profitLossPercent || 0), 0) / items.length 
        : 0;
      
      return {
        name: key,
        value: totalValue,
        percentage: totalAssets > 0 ? (totalValue / totalAssets) * 100 : 0,
        count: items.length,
        profitLoss: totalProfitLoss,
        profitLossPercent: avgProfitLossPercent,
        items,
      };
    }).sort((a, b) => b.value - a.value);
  };

  // 更新图表
  const updateChart = () => {
    if (!chartInstance.current) return;

    const groupedData = getGroupedData();
    
    let option: echarts.EChartsOption = {};

    switch (chartType) {
      case 'pie':
        option = {
          title: {
            text: `资产配置分布 - 按${groupType === 'stock' ? '个股' : groupType === 'industry' ? '行业' : '类别'}`,
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
              const data = params.data;
              return `
                <div>
                  <strong>${data.name}</strong><br/>
                  金额: ¥${(data.value / 10000).toFixed(2)}万<br/>
                  占比: ${data.percentage.toFixed(2)}%<br/>
                  ${data.count ? `持股数: ${data.count}只<br/>` : ''}
                  ${data.profitLoss !== undefined ? 
                    `盈亏: ${data.profitLoss > 0 ? '+' : ''}¥${data.profitLoss.toFixed(2)}<br/>` : ''}
                  ${data.profitLossPercent !== undefined ? 
                    `收益率: ${data.profitLossPercent > 0 ? '+' : ''}${data.profitLossPercent.toFixed(2)}%` : ''}
                </div>
              `;
            },
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle',
            formatter: (name: string) => {
              const item = groupedData.find(d => d.name === name);
              return `${name} (${item?.percentage.toFixed(1)}%)`;
            },
          },
          series: [
            {
              name: '资产配置',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['60%', '55%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 4,
                borderColor: '#fff',
                borderWidth: 2,
              },
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 14,
                  fontWeight: 'bold',
                },
              },
              labelLine: {
                show: false,
              },
              data: groupedData.map(item => ({
                name: item.name,
                value: item.value,
                percentage: item.percentage,
                count: item.count,
                profitLoss: item.profitLoss,
                profitLossPercent: item.profitLossPercent,
              })),
            },
          ],
        };
        break;

      case 'bar':
        option = {
          title: {
            text: `资产配置分布 - 按${groupType === 'stock' ? '个股' : groupType === 'industry' ? '行业' : '类别'}`,
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: groupedData.map(item => item.name),
            axisLabel: {
              rotate: 45,
              interval: 0,
            },
          },
          yAxis: {
            type: 'value',
            name: '金额(万元)',
            axisLabel: {
              formatter: (value: number) => (value / 10000).toFixed(1),
            },
          },
          series: [
            {
              name: '资产价值',
              type: 'bar',
              data: groupedData.map(item => ({
                value: item.value,
                itemStyle: {
                  color: item.profitLoss && item.profitLoss > 0 ? '#52c41a' : 
                         item.profitLoss && item.profitLoss < 0 ? '#ff4d4f' : '#1890ff',
                },
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.3)',
                },
              },
            },
          ],
        };
        break;

      case 'treemap':
        option = {
          title: {
            text: `资产配置分布 - 按${groupType === 'stock' ? '个股' : groupType === 'industry' ? '行业' : '类别'}`,
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
              const data = params.data;
              return `
                <div>
                  <strong>${data.name}</strong><br/>
                  金额: ¥${(data.value / 10000).toFixed(2)}万<br/>
                  占比: ${((data.value / totalAssets) * 100).toFixed(2)}%
                </div>
              `;
            },
          },
          series: [
            {
              type: 'treemap',
              top: '15%',
              width: '100%',
              height: '80%',
              roam: false,
              nodeClick: false,
              data: groupedData.map(item => ({
                name: item.name,
                value: item.value,
                itemStyle: {
                  color: item.profitLoss && item.profitLoss > 0 ? '#52c41a' : 
                         item.profitLoss && item.profitLoss < 0 ? '#ff4d4f' : '#1890ff',
                },
                label: {
                  show: true,
                  formatter: '{b}\n{c}万',
                  fontSize: 12,
                },
              })),
            },
          ],
        };
        break;
    }

    chartInstance.current.setOption(option, true);
  };

  // 获取统计数据
  const getStatistics = () => {
    const groupedData = getGroupedData();
    const maxItem = groupedData[0];
    const diversification = groupedData.length;
    const concentration = maxItem ? (maxItem.percentage / 100) : 0;
    
    return {
      maxItem,
      diversification,
      concentration,
      totalGroups: groupedData.length,
    };
  };

  const statistics = getStatistics();

  return (
    <div className="asset-allocation">
      <Card
        title={
          <Space>
            <PieChartOutlined />
            <Text strong>资产配置分析</Text>
          </Space>
        }
        extra={
          <Space>
            <Radio.Group
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              size="small"
            >
              <Radio.Button value="pie">饼图</Radio.Button>
              <Radio.Button value="bar">柱图</Radio.Button>
              <Radio.Button value="treemap">矩形树图</Radio.Button>
            </Radio.Group>
            <Select
              value={groupType}
              onChange={setGroupType}
              size="small"
              style={{ width: 100 }}
            >
              <Option value="stock">个股</Option>
              <Option value="industry">行业</Option>
              <Option value="category">类别</Option>
            </Select>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          {/* 统计信息 */}
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="最大持仓"
                  value={statistics.maxItem?.name || '-'}
                  suffix={statistics.maxItem ? `(${statistics.maxItem.percentage.toFixed(1)}%)` : ''}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="分散程度"
                  value={statistics.diversification}
                  suffix="个分组"
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="集中度"
                  value={statistics.concentration}
                  precision={2}
                  suffix="%"
                  formatter={(value) => (Number(value) * 100).toFixed(1)}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="总资产"
                  value={totalAssets}
                  precision={2}
                  prefix="¥"
                  formatter={(value) => `${(Number(value) / 10000).toFixed(2)}万`}
                />
              </Col>
            </Row>
          </Col>

          {/* 图表区域 */}
          <Col span={24}>
            <div
              ref={chartRef}
              style={{ width: '100%', height }}
              className="allocation-chart"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AssetAllocation;
/**
 * 权益曲线图表
 */

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EquityChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
}

const EquityChart: React.FC<EquityChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!chartRef.current || !data || !Array.isArray(data) || data.length === 0) return;

    chartInstance.current = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const point = params[0];
          return `${point.axisValue}<br/>权益: ¥${point.value.toLocaleString()}`;
        },
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.date),
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `¥${(value / 1000).toFixed(0)}k`,
        },
      },
      series: [
        {
          name: '权益',
          type: 'line',
          data: data.map(item => item.value),
          smooth: true,
          lineStyle: {
            color: '#1890ff',
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
            ]),
          },
        },
      ],
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        top: '3%',
        containLabel: true,
      },
    };

    chartInstance.current.setOption(option);

    return () => {
      chartInstance.current?.dispose();
    };
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default EquityChart;

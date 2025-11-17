/**
 * 回撤分析图表
 */

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface DrawdownChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
}

const DrawdownChart: React.FC<DrawdownChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!chartRef.current || !data || !Array.isArray(data) || data.length === 0) return;

    chartInstance.current = echarts.init(chartRef.current);

    // 计算回撤
    let maxValue = data[0]?.value || 0;
    const drawdownData = data.map(item => {
      if (item.value > maxValue) {
        maxValue = item.value;
      }
      const drawdown = ((item.value - maxValue) / maxValue) * 100;
      return drawdown;
    });

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const point = params[0];
          return `${point.axisValue}<br/>回撤: ${point.value.toFixed(2)}%`;
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
          formatter: (value: number) => `${value.toFixed(0)}%`,
        },
      },
      series: [
        {
          name: '回撤',
          type: 'line',
          data: drawdownData,
          smooth: true,
          lineStyle: {
            color: '#ff4d4f',
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 77, 79, 0.3)' },
              { offset: 1, color: 'rgba(255, 77, 79, 0.05)' },
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

export default DrawdownChart;

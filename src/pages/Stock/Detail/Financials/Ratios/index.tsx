/**
 * 财务比率分析页面
 * 展示各类财务指标和比率分析
 */

import { useState } from 'react';
import { Card, Tabs, Row, Col, Progress, Tag, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useParams } from 'umi';
import { Radar, Column } from '@ant-design/plots';
import {
  getFinancialRatios,
  getIndustryAverageRatios,
  calculateFinancialHealthScore,
  compareWithIndustry,
  type FinancialRatios,
} from '@/services/financial/ratiosService';

const RatiosPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  
  const { data: ratiosData, loading } = useRequest(
    () => getFinancialRatios(code!),
    {
      ready: !!code,
    },
  );
  
  const latestRatios = ratiosData?.data?.[0];
  const healthScore = latestRatios ? calculateFinancialHealthScore(latestRatios) : null;
  
  // 盈利能力指标
  const renderProfitabilityRatios = () => {
    if (!latestRatios) return null;
    
    const { profitability } = latestRatios;
    
    return (
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card size="small">
            <Space>
              <span>净资产收益率(ROE)</span>
              <Tooltip title="衡量股东投资回报率，越高越好，一般15%以上为优秀">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={Math.min(profitability.roe, 30) / 30 * 100}
                strokeColor={profitability.roe > 15 ? '#52c41a' : '#faad14'}
                format={() => `${profitability.roe.toFixed(2)}%`}
              />
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card size="small">
            <Space>
              <span>总资产收益率(ROA)</span>
              <Tooltip title="衡量资产使用效率，越高越好">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={Math.min(profitability.roa, 20) / 20 * 100}
                strokeColor={profitability.roa > 10 ? '#52c41a' : '#faad14'}
                format={() => `${profitability.roa.toFixed(2)}%`}
              />
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card size="small">
            <Space>
              <span>净利率</span>
              <Tooltip title="每1元收入能产生多少净利润">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={Math.min(profitability.netProfitMargin, 30) / 30 * 100}
                strokeColor={profitability.netProfitMargin > 10 ? '#52c41a' : '#faad14'}
                format={() => `${profitability.netProfitMargin.toFixed(2)}%`}
              />
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card size="small">
            <Space>
              <span>毛利率</span>
              <Tooltip title="反映产品竞争力和定价能力">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={Math.min(profitability.grossProfitMargin, 80) / 80 * 100}
                strokeColor={profitability.grossProfitMargin > 30 ? '#52c41a' : '#faad14'}
                format={() => `${profitability.grossProfitMargin.toFixed(2)}%`}
              />
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card size="small">
            <Space>
              <span>营业利润率</span>
              <Tooltip title="核心业务盈利能力">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={Math.min(profitability.operatingProfitMargin, 30) / 30 * 100}
                format={() => `${profitability.operatingProfitMargin.toFixed(2)}%`}
              />
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card size="small">
            <Space>
              <span>投入资本回报率(ROIC)</span>
              <Tooltip title="衡量投入资本的回报效率">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={Math.min(profitability.roic, 25) / 25 * 100}
                strokeColor={profitability.roic > 12 ? '#52c41a' : '#faad14'}
                format={() => `${profitability.roic.toFixed(2)}%`}
              />
            </div>
          </Card>
        </Col>
      </Row>
    );
  };
  
  // 偿债能力指标
  const renderSolvencyRatios = () => {
    if (!latestRatios) return null;
    
    const { solvency } = latestRatios;
    
    return (
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card size="small">
            <Space>
              <span>流动比率</span>
              <Tooltip title="流动资产/流动负债，2以上为优秀，1以下需警惕">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
            <div style={{ marginTop: 16, fontSize: 24, fontWeight: 'bold' }}>
              {solvency.currentRatio.toFixed(2)}
              <Tag
                color={solvency.currentRatio >= 2 ? 'success' : solvency.currentRatio >= 1 ? 'warning' : 'error'}
                style={{ marginLeft: 8 }}
              >
                {solvency.currentRatio >= 2 ? '优秀' : solvency.currentRatio >= 1 ? '一般' : '较差'}
              </Tag>
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card size="small">
            <Space>
              <span>速动比率</span>
              <Tooltip title="(流动资产-存货)/流动负债，1以上为健康">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
            <div style={{ marginTop: 16, fontSize: 24, fontWeight: 'bold' }}>
              {solvency.quickRatio.toFixed(2)}
              <Tag
                color={solvency.quickRatio >= 1 ? 'success' : 'warning'}
                style={{ marginLeft: 8 }}
              >
                {solvency.quickRatio >= 1 ? '健康' : '需关注'}
              </Tag>
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card size="small">
            <Space>
              <span>现金比率</span>
              <Tooltip title="现金/流动负债，越高流动性越好">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
            <div style={{ marginTop: 16, fontSize: 24, fontWeight: 'bold' }}>
              {solvency.cashRatio.toFixed(2)}
            </div>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card size="small">
            <Space>
              <span>资产负债率</span>
              <Tooltip title="总负债/总资产，50%以下较安全，70%以上需警惕">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={Math.min(solvency.debtToAssets, 100)}
                strokeColor={
                  solvency.debtToAssets < 50 ? '#52c41a' :
                  solvency.debtToAssets < 70 ? '#faad14' : '#f5222d'
                }
                format={() => `${solvency.debtToAssets.toFixed(2)}%`}
              />
            </div>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card size="small">
            <Space>
              <span>利息保障倍数</span>
              <Tooltip title="息税前利润/利息费用，5倍以上为优秀">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Space>
            <div style={{ marginTop: 16, fontSize: 24, fontWeight: 'bold' }}>
              {solvency.interestCoverage.toFixed(2)}倍
              <Tag
                color={solvency.interestCoverage >= 5 ? 'success' : solvency.interestCoverage >= 2 ? 'warning' : 'error'}
                style={{ marginLeft: 8 }}
              >
                {solvency.interestCoverage >= 5 ? '优秀' : solvency.interestCoverage >= 2 ? '一般' : '风险'}
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>
    );
  };
  
  // 营运能力指标
  const renderEfficiencyRatios = () => {
    if (!latestRatios) return null;
    
    const { efficiency } = latestRatios;
    
    return (
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card size="small" title="总资产周转率">
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>
              {efficiency.assetTurnover.toFixed(2)}次
            </div>
            <div style={{ color: '#999', marginTop: 8 }}>越高越好，1次以上为良好</div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card size="small" title="存货周转率">
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>
              {efficiency.inventoryTurnover.toFixed(2)}次
            </div>
            <div style={{ color: '#999', marginTop: 8 }}>存货周转天数: {efficiency.daysInventoryOutstanding.toFixed(0)}天</div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card size="small" title="应收账款周转率">
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>
              {efficiency.receivablesTurnover.toFixed(2)}次
            </div>
            <div style={{ color: '#999', marginTop: 8 }}>回款天数: {efficiency.daysSalesOutstanding.toFixed(0)}天</div>
          </Card>
        </Col>
        
        <Col span={24}>
          <Card size="small" title="现金转换周期">
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>
              {efficiency.cashConversionCycle.toFixed(0)}天
              <Tag
                color={efficiency.cashConversionCycle < 60 ? 'success' : efficiency.cashConversionCycle < 120 ? 'warning' : 'error'}
                style={{ marginLeft: 8 }}
              >
                {efficiency.cashConversionCycle < 60 ? '快速' : efficiency.cashConversionCycle < 120 ? '正常' : '较慢'}
              </Tag>
            </div>
            <div style={{ color: '#999', marginTop: 8 }}>
              从采购到收回现金的时间，越短越好
            </div>
          </Card>
        </Col>
      </Row>
    );
  };
  
  return (
    <div className="ratios-page">
      {healthScore && (
        <Card title="财务健康度评分" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Progress
                  type="circle"
                  percent={healthScore.score}
                  format={() => (
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 'bold' }}>{healthScore.grade}</div>
                      <div style={{ fontSize: 14 }}>{healthScore.score}分</div>
                    </div>
                  )}
                  strokeColor={
                    healthScore.grade === 'A' ? '#52c41a' :
                    healthScore.grade === 'B' ? '#1890ff' :
                    healthScore.grade === 'C' ? '#faad14' : '#f5222d'
                  }
                />
              </div>
            </Col>
            <Col span={9}>
              <div style={{ padding: '0 16px' }}>
                <h4>优势</h4>
                {healthScore.strengths.map((s, i) => (
                  <Tag key={i} color="success" style={{ marginBottom: 8 }}>{s}</Tag>
                ))}
              </div>
            </Col>
            <Col span={9}>
              <div style={{ padding: '0 16px' }}>
                <h4>劣势</h4>
                {healthScore.weaknesses.map((w, i) => (
                  <Tag key={i} color="error" style={{ marginBottom: 8 }}>{w}</Tag>
                ))}
              </div>
            </Col>
          </Row>
        </Card>
      )}
      
      <Card loading={loading}>
        <Tabs defaultActiveKey="profitability">
          <Tabs.TabPane tab="盈利能力" key="profitability">
            {renderProfitabilityRatios()}
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="偿债能力" key="solvency">
            {renderSolvencyRatios()}
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="营运能力" key="efficiency">
            {renderEfficiencyRatios()}
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="成长能力" key="growth">
            {latestRatios && (
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" title="营收增长率">
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: latestRatios.growth.revenueGrowth >= 0 ? '#52c41a' : '#f5222d' }}>
                      {latestRatios.growth.revenueGrowth.toFixed(2)}%
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="净利润增长率">
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: latestRatios.growth.netIncomeGrowth >= 0 ? '#52c41a' : '#f5222d' }}>
                      {latestRatios.growth.netIncomeGrowth.toFixed(2)}%
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="EPS增长率">
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: latestRatios.growth.epsGrowth >= 0 ? '#52c41a' : '#f5222d' }}>
                      {latestRatios.growth.epsGrowth.toFixed(2)}%
                    </div>
                  </Card>
                </Col>
              </Row>
            )}
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="估值比率" key="valuation">
            {latestRatios && (
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Card size="small" title="市盈率(PE)">
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                      {latestRatios.valuation.pe.toFixed(2)}
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" title="市净率(PB)">
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                      {latestRatios.valuation.pb.toFixed(2)}
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" title="市销率(PS)">
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                      {latestRatios.valuation.ps.toFixed(2)}
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" title="PEG比率">
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                      {latestRatios.valuation.peg.toFixed(2)}
                    </div>
                  </Card>
                </Col>
              </Row>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default RatiosPage;

/**
 * DCF估值服务
 * 提供现金流折现模型计算功能
 */

import { request } from '@umijs/max';

export interface DCFInputs {
  // 自由现金流预测
  currentFCF: number;
  fcfGrowthRate: number[]; // 5年增长率
  terminalGrowthRate: number; // 永续增长率
  
  // 折现率计算
  riskFreeRate: number; // 无风险利率
  marketReturn: number; // 市场回报率
  beta: number; // 贝塔系数
  
  // 资本结构
  debtWeight: number; // 债务权重
  equityWeight: number; // 权益权重
  costOfDebt: number; // 债务成本
  taxRate: number; // 税率
  
  // 公司信息
  sharesOutstanding: number; // 流通股数
  cashAndEquivalents: number; // 现金及现金等价物
  totalDebt: number; // 总债务
}

export interface DCFResult {
  // 现金流预测
  projectedFCF: number[]; // 未来5年自由现金流
  terminalValue: number; // 终值
  
  // 折现计算
  wacc: number; // 加权平均资本成本
  discountedFCF: number[]; // 折现后的自由现金流
  discountedTerminalValue: number; // 折现后的终值
  
  // 估值结果
  enterpriseValue: number; // 企业价值
  equityValue: number; // 股权价值
  fairValuePerShare: number; // 每股合理价值
  
  // 安全边际
  currentPrice?: number;
  upside?: number; // 上涨空间 (%)
  marginOfSafety?: number; // 安全边际 (%)
}

export interface SensitivityAnalysis {
  wacc: number[];
  terminalGrowthRate: number[];
  matrix: number[][]; // 估值矩阵
}

/**
 * 计算WACC (加权平均资本成本)
 */
export function calculateWACC(inputs: DCFInputs): number {
  // CAPM: Cost of Equity = Risk-free rate + Beta × (Market return - Risk-free rate)
  const costOfEquity = inputs.riskFreeRate + inputs.beta * (inputs.marketReturn - inputs.riskFreeRate);
  
  // After-tax cost of debt
  const afterTaxCostOfDebt = inputs.costOfDebt * (1 - inputs.taxRate);
  
  // WACC = (E/V × Re) + (D/V × Rd × (1-Tc))
  const wacc =
    inputs.equityWeight * costOfEquity + inputs.debtWeight * afterTaxCostOfDebt;
  
  return wacc;
}

/**
 * 计算DCF估值
 */
export function calculateDCF(inputs: DCFInputs): DCFResult {
  const wacc = calculateWACC(inputs);
  
  // 预测未来5年自由现金流
  const projectedFCF: number[] = [];
  let fcf = inputs.currentFCF;
  
  for (let i = 0; i < 5; i++) {
    fcf = fcf * (1 + inputs.fcfGrowthRate[i]);
    projectedFCF.push(fcf);
  }
  
  // 计算终值 (Gordon Growth Model)
  const finalYearFCF = projectedFCF[4];
  const terminalValue = (finalYearFCF * (1 + inputs.terminalGrowthRate)) / (wacc - inputs.terminalGrowthRate);
  
  // 折现现金流
  const discountedFCF: number[] = [];
  for (let i = 0; i < 5; i++) {
    const discountFactor = Math.pow(1 + wacc, i + 1);
    discountedFCF.push(projectedFCF[i] / discountFactor);
  }
  
  // 折现终值
  const discountedTerminalValue = terminalValue / Math.pow(1 + wacc, 5);
  
  // 企业价值 = 折现现金流之和 + 折现终值
  const enterpriseValue =
    discountedFCF.reduce((sum, fcf) => sum + fcf, 0) + discountedTerminalValue;
  
  // 股权价值 = 企业价值 + 现金 - 债务
  const equityValue = enterpriseValue + inputs.cashAndEquivalents - inputs.totalDebt;
  
  // 每股合理价值
  const fairValuePerShare = equityValue / inputs.sharesOutstanding;
  
  return {
    projectedFCF,
    terminalValue,
    wacc,
    discountedFCF,
    discountedTerminalValue,
    enterpriseValue,
    equityValue,
    fairValuePerShare,
  };
}

/**
 * 敏感性分析
 */
export function performSensitivityAnalysis(
  inputs: DCFInputs,
  waccRange: [number, number, number], // [min, max, step]
  terminalGrowthRange: [number, number, number],
): SensitivityAnalysis {
  const waccValues: number[] = [];
  const terminalGrowthValues: number[] = [];
  const matrix: number[][] = [];
  
  // 生成WACC范围
  for (let w = waccRange[0]; w <= waccRange[1]; w += waccRange[2]) {
    waccValues.push(w);
  }
  
  // 生成终值增长率范围
  for (let g = terminalGrowthRange[0]; g <= terminalGrowthRange[1]; g += terminalGrowthRange[2]) {
    terminalGrowthValues.push(g);
  }
  
  // 计算估值矩阵
  for (const w of waccValues) {
    const row: number[] = [];
    for (const g of terminalGrowthValues) {
      const modifiedInputs = {
        ...inputs,
        terminalGrowthRate: g,
      };
      
      // 临时修改WACC计算
      const result = calculateDCF(modifiedInputs);
      // 使用指定的WACC重新计算
      const adjustedResult = recalculateWithWACC(modifiedInputs, w);
      row.push(adjustedResult.fairValuePerShare);
    }
    matrix.push(row);
  }
  
  return {
    wacc: waccValues,
    terminalGrowthRate: terminalGrowthValues,
    matrix,
  };
}

/**
 * 使用指定的WACC重新计算DCF
 */
function recalculateWithWACC(inputs: DCFInputs, wacc: number): DCFResult {
  // 预测未来5年自由现金流
  const projectedFCF: number[] = [];
  let fcf = inputs.currentFCF;
  
  for (let i = 0; i < 5; i++) {
    fcf = fcf * (1 + inputs.fcfGrowthRate[i]);
    projectedFCF.push(fcf);
  }
  
  // 计算终值
  const finalYearFCF = projectedFCF[4];
  const terminalValue = (finalYearFCF * (1 + inputs.terminalGrowthRate)) / (wacc - inputs.terminalGrowthRate);
  
  // 折现现金流
  const discountedFCF: number[] = [];
  for (let i = 0; i < 5; i++) {
    const discountFactor = Math.pow(1 + wacc, i + 1);
    discountedFCF.push(projectedFCF[i] / discountFactor);
  }
  
  // 折现终值
  const discountedTerminalValue = terminalValue / Math.pow(1 + wacc, 5);
  
  // 企业价值和股权价值
  const enterpriseValue =
    discountedFCF.reduce((sum, fcf) => sum + fcf, 0) + discountedTerminalValue;
  const equityValue = enterpriseValue + inputs.cashAndEquivalents - inputs.totalDebt;
  const fairValuePerShare = equityValue / inputs.sharesOutstanding;
  
  return {
    projectedFCF,
    terminalValue,
    wacc,
    discountedFCF,
    discountedTerminalValue,
    enterpriseValue,
    equityValue,
    fairValuePerShare,
  };
}

/**
 * 获取DCF估值数据
 */
export async function getDCFValuation(stockCode: string) {
  return request<API.Response<DCFResult>>('/api/financial/dcf', {
    method: 'GET',
    params: { stockCode },
  });
}

/**
 * 保存自定义DCF参数
 */
export async function saveDCFParameters(stockCode: string, inputs: DCFInputs) {
  return request<API.Response<void>>('/api/financial/dcf/save', {
    method: 'POST',
    data: {
      stockCode,
      inputs,
    },
  });
}

/**
 * 获取默认DCF参数
 */
export async function getDefaultDCFInputs(stockCode: string) {
  return request<API.Response<DCFInputs>>('/api/financial/dcf/defaults', {
    method: 'GET',
    params: { stockCode },
  });
}

/**
 * 计算安全边际
 */
export function calculateMarginOfSafety(fairValue: number, currentPrice: number): {
  upside: number;
  marginOfSafety: number;
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell';
} {
  const upside = ((fairValue - currentPrice) / currentPrice) * 100;
  const marginOfSafety = ((fairValue - currentPrice) / fairValue) * 100;
  
  let recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell';
  if (marginOfSafety > 30) recommendation = 'strong_buy';
  else if (marginOfSafety > 15) recommendation = 'buy';
  else if (marginOfSafety > -10) recommendation = 'hold';
  else recommendation = 'sell';
  
  return { upside, marginOfSafety, recommendation };
}

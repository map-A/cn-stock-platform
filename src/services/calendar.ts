import request from '@/utils/request';

export interface EarningsEvent {
  symbol: string;
  name: string;
  reportDate: string;
  fiscalYear: number;
  fiscalQuarter: number;
  estimatedEPS?: number;
  actualEPS?: number;
  estimatedRevenue?: number;
  actualRevenue?: number;
  surprise?: number;
  surprisePercent?: number;
  callTime?: 'before-market' | 'after-market' | 'during-market';
}

export interface DividendEvent {
  symbol: string;
  name: string;
  exDividendDate: string;
  paymentDate: string;
  recordDate: string;
  declarationDate: string;
  amount: number;
  dividendType: 'cash' | 'stock';
  frequency: 'annual' | 'semi-annual' | 'quarterly' | 'monthly';
  currency: string;
}

export interface EconomicEvent {
  id: string;
  name: string;
  country: string;
  category: string;
  releaseDate: string;
  importance: 'high' | 'medium' | 'low';
  actual?: number;
  forecast?: number;
  previous?: number;
  unit?: string;
  description?: string;
}

export interface IPOEvent {
  symbol: string;
  name: string;
  ipoDate: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
  shares?: number;
  expectedMarketCap?: number;
  exchange: string;
  industry: string;
  underwriters?: string[];
}

export interface CalendarParams {
  startDate: string;
  endDate: string;
  symbols?: string[];
  page?: number;
  pageSize?: number;
}

/**
 * 日历服务
 */
class CalendarService {
  /**
   * 获取财报日历
   */
  async getEarningsCalendar(
    params: CalendarParams,
  ): Promise<API.Response<API.PaginatedResponse<EarningsEvent>>> {
    return request('/api/calendar/earnings', {
      method: 'GET',
      params,
    });
  }

  /**
   * 获取分红日历
   */
  async getDividendsCalendar(
    params: CalendarParams,
  ): Promise<API.Response<API.PaginatedResponse<DividendEvent>>> {
    return request('/api/calendar/dividends', {
      method: 'GET',
      params,
    });
  }

  /**
   * 获取经济日历
   */
  async getEconomicCalendar(
    params: Omit<CalendarParams, 'symbols'> & {
      countries?: string[];
      categories?: string[];
      importance?: string[];
    },
  ): Promise<API.Response<API.PaginatedResponse<EconomicEvent>>> {
    return request('/api/calendar/economic', {
      method: 'GET',
      params,
    });
  }

  /**
   * 获取IPO日历
   */
  async getIPOCalendar(
    params: Omit<CalendarParams, 'symbols'>,
  ): Promise<API.Response<API.PaginatedResponse<IPOEvent>>> {
    return request('/api/calendar/ipo', {
      method: 'GET',
      params,
    });
  }

  /**
   * 订阅日历事件提醒
   */
  async subscribeEvent(eventType: string, eventId: string): Promise<API.Response<void>> {
    return request('/api/calendar/subscribe', {
      method: 'POST',
      data: { eventType, eventId },
    });
  }

  /**
   * 取消订阅日历事件
   */
  async unsubscribeEvent(eventType: string, eventId: string): Promise<API.Response<void>> {
    return request('/api/calendar/unsubscribe', {
      method: 'POST',
      data: { eventType, eventId },
    });
  }

  /**
   * 获取已订阅的事件
   */
  async getSubscribedEvents(): Promise<
    API.Response<{ eventType: string; eventId: string; createdAt: string }[]>
  > {
    return request('/api/calendar/subscriptions', {
      method: 'GET',
    });
  }

  /**
   * 导出日历数据
   */
  async exportCalendar(
    type: 'earnings' | 'dividends' | 'economic' | 'ipo',
    params: any,
  ): Promise<Blob> {
    return request(`/api/calendar/${type}/export`, {
      method: 'GET',
      params,
      responseType: 'blob',
    });
  }
}

export default new CalendarService();

import { getCategoryData, getBucketTotalAmount } from './AssetActions';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import prisma from '@/lib/db';

vi.mock('@/lib/db', () => ({
  default: {
    partnerCalendar: {
      findMany: vi.fn(),
    },
    budgetPlan: {
      findMany: vi.fn(),
    },
  }
}));

const mockPartnerCalendar = prisma.partnerCalendar.findMany as Mock;
const mockBudgetPlan = prisma.budgetPlan.findMany as Mock;

describe('getCategoryData ', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('return empty array if type is empty', async () => {
      mockPartnerCalendar.mockResolvedValue([]);

      const result = await getCategoryData(1);
      expect(result).toEqual({
        "error": "카테고리 데이터를 찾을 수 없습니다.",
        "isSuccess": false,
      });
  });
  
  it('return list of types within CATEGORIESs list', async () => {
      mockPartnerCalendar.mockResolvedValue([
        {
          PartnerService: {
            content: {가격: '80000000', 식사: '뷔페'},
            Partner: {
              PartnerCategory: {
                type: '예식',
              },
            },
          },
        },
        {
          PartnerService: {
            content: {가격: '5000000', 드레스: '벨형'},
            Partner: {
              PartnerCategory: {
                type: '스드메',
              },
            },
          },
        },
      ]);

      const result = await getCategoryData(1);
      expect(result).toEqual({
        "data": [{ "category": "스드메", "value": 5000000,
      },],
      "isSuccess": true,
      });
    });
});

describe('getBucketTotalAmount ', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('return amount price with highest price', async () => {
    mockBudgetPlan.mockResolvedValue([
        {
          PartnerService: {
            content: {가격: '80000000', 식사: '뷔페'},
            Partner: {
              PartnerCategory: {
                type: '예식장',
              },
            },
          },
        },
        {
          PartnerService: {
            content: {가격: '70000000', 식사: '도시락'},
            Partner: {
              PartnerCategory: {
                type: '예식',
              },
            },
          },
        },
        {
          PartnerService: {
            content: {가격: '5000000', 냉장고: '삼성냉장고'},
            Partner: {
              PartnerCategory: {
                type: '가전·가구',
              },
            },
          },
        }
      ]);
      const result = await getBucketTotalAmount(1);
      expect(result).toBe(85000000);
  })
});
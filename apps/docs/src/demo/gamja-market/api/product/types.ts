export interface ProductAPI {
  findAll: () => Promise<ProductSimple[]>;
  find: (id: string) => Promise<ProductDetail>;
}

export type ProductSimple = {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  /** "오늘 마감" / "5/21 마감" 등 */
  pickupLabel: string;
  /** "누적 판매 215" */
  soldCount: number;
  /** 재고 부족 표시용 (예: "1개 남음"). undefined면 미표시 */
  stockBadge?: string;
};

export type ProductDetail = ProductSimple & {
  description: string;
  images: string[];
  pickupDate: string;
  pickupPlace: string;
  notice: string;
};

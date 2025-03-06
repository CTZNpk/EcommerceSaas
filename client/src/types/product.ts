export interface IProduct {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  rating: number;
  ratingCount: number;
  purchaseCount: number;
  isActive: boolean;
}

export interface Order {
  id: number;
  total: number;
  createdAt: string;
}

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cart: undefined;
  OrderSummary: { order: Order };
};

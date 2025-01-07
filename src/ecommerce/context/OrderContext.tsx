import React, { createContext, useState, ReactNode } from 'react';

interface Order {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

interface OrderContextProps {
  addOrder: (order: Order) => void;
  orders: Order[];
}

export const OrderContext = createContext<OrderContextProps>({
  orders: [],
  addOrder: (order: Order) => {},
});

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Order) => {
    setOrders([...orders, order]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = React.useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}

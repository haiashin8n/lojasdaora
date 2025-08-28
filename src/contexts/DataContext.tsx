import React, { createContext, useContext, useState, ReactNode } from 'react';
import { faker } from '@faker-js/faker';

// Tipos de dados
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  creditLimit: number;
  currentDebt: number;
}

export interface Sale {
  id: string;
  customerId?: string;
  products: { productId: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: 'pix' | 'dinheiro' | 'cartao' | 'crediario';
  date: Date;
  cashierId: string;
}

export interface CreditPayment {
  id: string;
  customerId: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: Date;
  status: 'pendente' | 'vencido' | 'pago';
  installments: number;
  currentInstallment: number;
}

interface DataContextType {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  creditPayments: CreditPayment[];
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  addCreditPayment: (payment: Omit<CreditPayment, 'id'>) => void;
  processPayment: (paymentId: string, amount: number) => void;
  getCreditPaymentsByCustomer: (customerId: string) => CreditPayment[];
  searchCustomers: (query: string) => Customer[];
  cashStatus: { isOpen: boolean; openingAmount: number; currentAmount: number };
  openCash: (amount: number) => void;
  closeCash: () => void;
  makeCashWithdrawal: (amount: number) => void;
}

// Dados fictícios
const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const categories = ['Tênis', 'Celulares', 'Roupas', 'Acessórios'];
  
  for (let i = 0; i < 20; i++) {
    products.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: faker.number.float({ min: 50, max: 500, multipleOf: 0.01 }),
      image: `https://picsum.photos/300/300?random=${i}`,
      category: faker.helpers.arrayElement(categories),
      stock: faker.number.int({ min: 0, max: 100 })
    });
  }
  
  return products;
};

const generateCustomers = (): Customer[] => {
  const customers: Customer[] = [];
  
  for (let i = 0; i < 15; i++) {
    customers.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      creditLimit: faker.number.float({ min: 500, max: 2000, multipleOf: 0.01 }),
      currentDebt: faker.number.float({ min: 0, max: 800, multipleOf: 0.01 })
    });
  }
  
  return customers;
};

const generateCreditPayments = (customers: Customer[]): CreditPayment[] => {
  const payments: CreditPayment[] = [];
  
  customers.forEach(customer => {
    if (customer.currentDebt > 0) {
      payments.push({
        id: faker.string.uuid(),
        customerId: customer.id,
        totalAmount: customer.currentDebt,
        paidAmount: faker.number.float({ min: 0, max: customer.currentDebt * 0.7, multipleOf: 0.01 }),
        dueDate: faker.date.future(),
        status: faker.helpers.arrayElement(['pendente', 'vencido', 'pago']),
        installments: faker.number.int({ min: 3, max: 12 }),
        currentInstallment: faker.number.int({ min: 1, max: 5 })
      });
    }
  });
  
  return payments;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products] = useState<Product[]>(generateProducts());
  const [customers, setCustomers] = useState<Customer[]>(generateCustomers());
  const [sales, setSales] = useState<Sale[]>([]);
  const [creditPayments, setCreditPayments] = useState<CreditPayment[]>(() => 
    generateCreditPayments(customers)
  );
  const [cashStatus, setCashStatus] = useState({
    isOpen: false,
    openingAmount: 0,
    currentAmount: 0
  });

  const addSale = (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...sale,
      id: faker.string.uuid(),
      date: new Date()
    };
    setSales(prev => [...prev, newSale]);
    
    // Atualizar caixa
    setCashStatus(prev => ({
      ...prev,
      currentAmount: prev.currentAmount + sale.total
    }));
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: faker.string.uuid()
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const addCreditPayment = (payment: Omit<CreditPayment, 'id'>) => {
    const newPayment: CreditPayment = {
      ...payment,
      id: faker.string.uuid()
    };
    setCreditPayments(prev => [...prev, newPayment]);
  };

  const openCash = (amount: number) => {
    setCashStatus({
      isOpen: true,
      openingAmount: amount,
      currentAmount: amount
    });
  };

  const closeCash = () => {
    setCashStatus({
      isOpen: false,
      openingAmount: 0,
      currentAmount: 0
    });
  };

  const makeCashWithdrawal = (amount: number) => {
    setCashStatus(prev => ({
      ...prev,
      currentAmount: prev.currentAmount - amount
    }));
  };

  const processPayment = (paymentId: string, amount: number) => {
    const payment = creditPayments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    if (amount <= 0) {
      throw new Error('Valor do pagamento deve ser maior que zero');
    }

    const remaining = payment.totalAmount - payment.paidAmount;
    if (amount > remaining) {
      throw new Error('Valor do pagamento maior que o débito pendente');
    }

    setCreditPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        const newPaidAmount = p.paidAmount + amount;
        const newStatus = newPaidAmount >= p.totalAmount ? 'pago' : p.status;
        return {
          ...p,
          paidAmount: newPaidAmount,
          status: newStatus,
          currentInstallment: Math.ceil((newPaidAmount / p.totalAmount) * p.installments),
          lastPaymentDate: new Date()
        };
      }
      return p;
    }));

    // Atualizar saldo do cliente
    setCustomers(prev => prev.map(customer => {
      if (customer.id === payment.customerId) {
        return {
          ...customer,
          currentDebt: Math.max(0, customer.currentDebt - amount)
        };
      }
      return customer;
    }));

    // Atualizar caixa
    if (!cashStatus.isOpen) {
      throw new Error('O caixa precisa estar aberto para receber pagamentos');
    }

    setCashStatus(prev => ({
      ...prev,
      currentAmount: prev.currentAmount + amount
    }));
  };
  };

  const getCreditPaymentsByCustomer = (customerId: string) => {
    return creditPayments.filter(payment => 
      payment.customerId === customerId && payment.status !== 'pago'
    );
  };

  const searchCustomers = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(normalizedQuery) ||
      customer.phone.includes(query)
    );
  };

  return (
    <DataContext.Provider value={{
      products,
      customers,
      sales,
      creditPayments,
      addSale,
      addCustomer,
      addCreditPayment,
      processPayment,
      getCreditPaymentsByCustomer,
      searchCustomers,
      cashStatus,
      openCash,
      closeCash,
      makeCashWithdrawal
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

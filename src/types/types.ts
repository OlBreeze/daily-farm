export interface User {
    id: string;
    username: string;
    password: string;
    email: string | null;
    client: boolean;
    company: boolean;
    dateCreate: string; // ISO формат даты
    lastDateUpdate: string | null;
    address: string;
    phone: string;
    roles: Role[];
    products: Product[]; // предполагаем, что ты уже описал Product
}
export interface UserData {
    username: string;
    password: string;
    email: string;
    client: boolean;
    company: boolean;
}

export interface Role {
    id: string;
    name: string;
}

export interface Unit {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface PaginationProps {
    size: number;
    pageSize: number;
    currentPage: number;
    totalElements: number;
    totalPages: number;
    goToPage: (page: number) => void;
    setPageSize: (size: number) => void;
}

export interface Product {
    id: string;
    userId: string;
    categoryId: string;
    unitId: string;
    // user: {
    //     id: string;
    //     username?: string;
    // };
    // category: {
    //     id: string;
    //     name?: string;
    // };
    // unit: {
    //     id: string;
    //     name?: string;
    // };
    name: string;
    price: number;
    quantity: number;
    comment: string;
    imageSrc: string;
}


export interface OrderProduct {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    unitId: string;
    categoryId: string;
    userId: string;
    comment: string;
}
export type DeliveryStatus = "NEW" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";

export interface Order {
    id: string;
    user: User;
    totalSum: number;
    totalAmount: number;
    statusDelivery: DeliveryStatus;
    comment: string;
    dateOrder: string; // ISO формат даты и времени
    datePayment: string | null;
    products: OrderProduct[];
}

export type Product = {
    id: number;
    title: string;
    price: number;
    category: string;
    image: string;
    description: string;
};

export type ProductsPage = {
    items: Product[];
    total: number;
};

export type ProductsPaginationParams = {
    limit: number;
    offset: number;
};

export type ProductsSearchParams = ProductsPaginationParams & {
    query: string;
};

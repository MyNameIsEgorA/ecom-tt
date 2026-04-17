import type {
    Product,
    ProductsPage,
    ProductsPaginationParams,
    ProductsSearchParams,
} from '../types/product.ts';

const PRODUCTS_URL = '/api/products';

export class ProductsProxy {
    async getProducts(params: ProductsPaginationParams): Promise<ProductsPage> {
        return this.fetchProducts(
            new URLSearchParams({
                _start: String(params.offset),
                _limit: String(params.limit),
            }),
        );
    }

    async searchProducts(params: ProductsSearchParams): Promise<ProductsPage> {
        const query: string = params.query.trim();

        if (!query) {
            return this.getProducts(params);
        }

        return this.fetchProducts(
            new URLSearchParams({
                q: query,
                _start: String(params.offset),
                _limit: String(params.limit),
            }),
        );
    }

    private async fetchProducts(
        searchParams: URLSearchParams,
    ): Promise<ProductsPage> {
        const response = await fetch(
            `${PRODUCTS_URL}?${searchParams.toString()}`,
        );

        if (!response.ok) {
            throw new Error(`Products request failed: ${response.status}`);
        }

        const items = (await response.json()) as Product[];
        const total: string | null = response.headers.get('X-Total-Count');

        return {
            items,
            total: total === null ? items.length : Number(total),
        };
    }
}

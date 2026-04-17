import { createContext, useContext } from 'react';
import { makeAutoObservable, runInAction } from 'mobx';
import { ProductsProxy } from '../api/productsProxy.ts';
import type { Product, ProductsPage } from '../types/product.ts';

const DEFAULT_LIMIT = 10;

class ProductStore {
    public products: Product[] = [];
    public searchQuery = '';
    public total = 0;
    public isLoading = false;
    public error: string | null = null;
    public selectedProductId: number | null = null;

    private offset = 0;
    private requestId = 0;
    private readonly limit: number;
    private readonly productsProxy: ProductsProxy;

    public constructor(productsProxy: ProductsProxy, limit = DEFAULT_LIMIT) {
        this.limit = limit;
        this.productsProxy = productsProxy;

        makeAutoObservable<
            ProductStore,
            'offset' | 'requestId' | 'limit' | 'productsProxy'
        >(
            this,
            {
                offset: false,
                requestId: false,
                limit: false,
                productsProxy: false,
            },
            { autoBind: true },
        );
    }

    public get hasMore(): boolean {
        return this.products.length < this.total;
    }

    public get isInitialLoading(): boolean {
        return this.isLoading && this.products.length === 0;
    }

    public get selectedProduct(): Product | null {
        if (this.selectedProductId === null) {
            return null;
        }

        return (
            this.products.find(
                (product) => product.id === this.selectedProductId,
            ) ?? null
        );
    }

    public openProductModal(productId: number): void {
        this.selectedProductId = productId;
    }

    public closeProductModal(): void {
        this.selectedProductId = null;
    }

    public async loadProducts(reset = true): Promise<void> {
        const requestId: number = ++this.requestId;
        const offset: number = reset ? 0 : this.offset;
        const query: string = this.searchQuery.trim();

        this.isLoading = true;
        this.error = null;

        try {
            const page: ProductsPage = query
                ? await this.productsProxy.searchProducts({
                      query,
                      limit: this.limit,
                      offset,
                  })
                : await this.productsProxy.getProducts({
                      limit: this.limit,
                      offset,
                  });

            if (requestId !== this.requestId) {
                return;
            }

            runInAction(() => {
                this.products = reset
                    ? page.items
                    : [...this.products, ...page.items];
                this.total = page.total;
                this.offset = offset + page.items.length;
                this.isLoading = false;
            });
        } catch (error) {
            if (requestId !== this.requestId) {
                return;
            }

            runInAction(() => {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Products request failed';
                this.isLoading = false;
            });
        }
    }

    public async loadMore(): Promise<void> {
        if (this.isLoading || this.products.length >= this.total) {
            return;
        }

        await this.loadProducts(false);
    }

    public async search(query: string): Promise<void> {
        this.searchQuery = query;

        await this.loadProducts();
    }
}

const productStore = new ProductStore(new ProductsProxy());
export const ProductStoreContext = createContext(productStore);

export const useProductStore = (): ProductStore =>
    useContext(ProductStoreContext);

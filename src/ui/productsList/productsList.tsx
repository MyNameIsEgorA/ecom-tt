import { useEffect, useRef, type FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useProductStore } from '../../stores/productStore.ts';
import { ProductCard } from '../productCard';
import './styles.css';

export const ProductsList: FC = observer(() => {
    const productStore = useProductStore();
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (productStore.products.length === 0 && !productStore.isLoading) {
            void productStore.loadProducts();
        }
    }, [productStore]);

    useEffect(() => {
        const loader = loaderRef.current;

        if (!loader || !productStore.hasMore) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !productStore.isLoading) {
                    void productStore.loadMore();
                }
            },
            {
                rootMargin: '240px 0px',
            },
        );

        observer.observe(loader);

        return () => observer.disconnect();
    }, [
        productStore,
        productStore.hasMore,
        productStore.isLoading,
        productStore.products.length,
    ]);

    if (productStore.isInitialLoading) {
        return <p className="products-list__message">Загружаем товары...</p>;
    }

    if (productStore.error) {
        return (
            <div className="products-list__message products-list__message_error">
                <p>{productStore.error}</p>
                <button
                    className="products-list__retry"
                    type="button"
                    onClick={() => void productStore.loadProducts()}
                >
                    Повторить
                </button>
            </div>
        );
    }

    if (productStore.products.length === 0) {
        return <p className="products-list__message">Товары не найдены</p>;
    }

    return (
        <section className="products-list" aria-label="Список товаров">
            <div className="products-list__grid">
                {productStore.products.map((product, index) => {
                    const shouldLoadImmediately = index < 3;

                    return (
                        <ProductCard
                            key={product.id}
                            product={product}
                            imageFetchPriority={
                                shouldLoadImmediately ? 'high' : 'low'
                            }
                            imageLoading={
                                shouldLoadImmediately ? 'eager' : 'lazy'
                            }
                            onClick={() =>
                                productStore.openProductModal(product.id)
                            }
                        />
                    );
                })}
            </div>
            <div className="products-list__loader" ref={loaderRef}>
                {productStore.isLoading && 'Загружаем еще...'}
            </div>
        </section>
    );
});

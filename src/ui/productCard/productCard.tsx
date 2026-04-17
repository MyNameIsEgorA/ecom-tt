import type { ComponentPropsWithoutRef, FC, KeyboardEvent } from 'react';
import type { Product } from '../../types/product.ts';
import { cn } from '../../lib/utils/cn.ts';
import './styles.css';

interface ProductCardProps extends ComponentPropsWithoutRef<'article'> {
    product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({
    product,
    className,
    onKeyDown,
    role = 'button',
    tabIndex = 0,
    ...rest
}) => {
    const price = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(product.price);

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.currentTarget.click();
        }
    };

    return (
        <article
            {...rest}
            className={cn('product-card', className)}
            role={role}
            tabIndex={tabIndex}
            onKeyDown={handleKeyDown}
        >
            <div className="product-card__image-wrap">
                <img
                    className="product-card__image"
                    src={product.image}
                    alt={product.title}
                />
            </div>
            <div className="product-card__content">
                <span className="product-card__category">
                    {product.category}
                </span>
                <h3 className="product-card__title">{product.title}</h3>
                <p className="product-card__description">
                    {product.description}
                </p>
                <div className="product-card__footer">
                    <strong className="product-card__price">{price}</strong>
                    <span className="product-card__button">Подробнее</span>
                </div>
            </div>
        </article>
    );
};

import { useEffect, type FC, type MouseEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { useProductStore } from '../../stores/productStore.ts';
import './styles.css';

export const ProductModal: FC = observer(() => {
    const productStore = useProductStore();
    const product = productStore.selectedProduct;

    useEffect(() => {
        if (!product) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                productStore.closeProductModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [product, productStore]);

    if (!product) {
        return null;
    }

    const price = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(product.price);

    const handleModalClick = (event: MouseEvent<HTMLElement>): void => {
        event.stopPropagation();
    };

    return (
        <div
            className="product-modal"
            role="presentation"
            onClick={productStore.closeProductModal}
        >
            <article
                className="product-modal__content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-modal-title"
                onClick={handleModalClick}
            >
                <button
                    className="product-modal__close"
                    type="button"
                    aria-label="Закрыть"
                    onClick={productStore.closeProductModal}
                >
                    ×
                </button>
                <div className="product-modal__image-wrap">
                    <img
                        className="product-modal__image"
                        src={product.image}
                        alt={product.title}
                    />
                </div>
                <div className="product-modal__details">
                    <span className="product-modal__category">
                        {product.category}
                    </span>
                    <h2
                        className="product-modal__title"
                        id="product-modal-title"
                    >
                        {product.title}
                    </h2>
                    <p className="product-modal__description">
                        {product.description}
                    </p>
                    <strong className="product-modal__price">{price}</strong>
                    <button className="product-modal__buy" type="button">
                        Купить
                    </button>
                </div>
            </article>
        </div>
    );
});

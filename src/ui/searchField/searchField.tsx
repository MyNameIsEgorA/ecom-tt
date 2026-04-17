import type { FC, HTMLProps } from 'react';
import { observer } from 'mobx-react-lite';
import { cn } from '../../lib/utils/cn.ts';
import { useProductStore } from '../../stores/productStore.ts';
import './styles.css';

type SearchFieldProps = HTMLProps<HTMLDivElement>;

export const SearchField: FC<SearchFieldProps> = observer(({ className, ...rest }) => {
    const productStore = useProductStore();

    return (
        <>
            <h3>Поиск товаров</h3>
            <div {...rest} className={cn('input-container', className)}>
                <input
                    type="text"
                    className={'input'}
                    placeholder={'Введите название товара'}
                    value={productStore.searchQuery}
                    onChange={(event) =>
                        void productStore.search(event.target.value)
                    }
                />
            </div>
        </>
    );
});

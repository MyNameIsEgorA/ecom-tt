import { useEffect, useRef, useState, type FC, type HTMLProps } from 'react';
import { observer } from 'mobx-react-lite';
import { cn } from '../../lib/utils/cn.ts';
import { useProductStore } from '../../stores/productStore.ts';
import './styles.css';

type SearchFieldProps = HTMLProps<HTMLDivElement>;
const SEARCH_DEBOUNCE_MS = 100;

export const SearchField: FC<SearchFieldProps> = observer(({ className, ...rest }) => {
    const productStore = useProductStore();
    const [query, setQuery] = useState(productStore.searchQuery);
    const lastSubmittedQueryRef = useRef(productStore.searchQuery);

    useEffect(() => {
        if (query === lastSubmittedQueryRef.current) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            lastSubmittedQueryRef.current = query;
            void productStore.search(query);
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timeoutId);
    }, [productStore, query]);

    return (
        <>
            <h3>Поиск товаров</h3>
            <div {...rest} className={cn('input-container', className)}>
                <input
                    type="text"
                    className={'input'}
                    placeholder={'Введите название товара'}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>
        </>
    );
});

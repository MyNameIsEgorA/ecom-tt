import { ProductStoreContext, useProductStore } from './stores/productStore.ts';
import { SearchField } from './ui/searchField';
import { ProductsList } from './ui/productsList';
import { ProductModal } from './ui/productModal';
import './App.css';

export const App = () => {
    const productStore = useProductStore();

    return (
        <ProductStoreContext.Provider value={productStore}>
            <main className="app">
                <SearchField />
                <ProductsList />
                <ProductModal />
            </main>
        </ProductStoreContext.Provider>
    );
};

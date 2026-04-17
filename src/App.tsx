import { ProductStoreContext, useProductStore } from './stores/productStore.ts';

export const App = () => {
    const productStore = useProductStore();

    return (
        <ProductStoreContext.Provider value={productStore}>
            <div>Hello world</div>
        </ProductStoreContext.Provider>
    );
};

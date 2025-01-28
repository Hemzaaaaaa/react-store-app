import { useEffect, useReducer, useState } from "react";
import Product from "./Product";
import "./ProductList.scss";
import { INITIAL_VALUES, productReducer } from "./productReducer";

export default function ProductList() {
    const [categories, setCategoryList] = useState([]);
    const [searchInput, setSearchInput] = useState();
    const [currentCategory, setCurrentCategory] = useState();
    const [productValues, dispatch] = useReducer(productReducer, INITIAL_VALUES);

    const displayCategories = () => {
        return categories.map((category, key) => (
            <button
                key={key}
                className={`px-4 py-2 rounded-lg m-2 ${currentCategory === category
                        ? "bg-black text-white"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                onClick={(e) => {
                    e.preventDefault();
                    setCurrentCategory(category);
                }}
            >
                {category}
            </button>
        ));
    };

    const displayProducts = () => {
        let productsTemp = productValues.productList;
        if (searchInput !== undefined) {
            productsTemp = productValues.productList.filter(
                (product) =>
                    product.title.includes(searchInput) ||
                    product.id.toString().includes(searchInput) ||
                    product.description.includes(searchInput)
            );
        }
        if (currentCategory !== undefined) {
            productsTemp = productsTemp.filter(
                (product) => product.category === currentCategory
            );
        }

        if (productsTemp.length > 0) {
            return productsTemp.map((product, key) => {
                return <Product product={product} key={key} />;
            });
        }
        return (
            <tr>
                <td colSpan={7} className="text-center text-gray-500">
                    No Items
                </td>
            </tr>
        );
    };

    const getProducts = () => {
        dispatch({ type: "ERROR", payload: { hasError: undefined } });
        fetch("https://fakestoreapi.com/products")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject("Products fetch failed");
            })
            .then((response) =>
                dispatch({ type: "PRODUCTS", payload: { collection: response } })
            )
            .catch((apiError) =>
                dispatch({ type: "ERROR", payload: { hasError: apiError } })
            )
            .finally(() => dispatch({ type: "LOADING", payload: { isLoading: false } }));
    };

    const getCategories = () => {
        fetch("https://fakestoreapi.com/products/categories")
            .then((response) => response.json())
            .then((response) => setCategoryList(response));
    };

    useEffect(() => {
        getProducts();
        getCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = document.querySelector("#search").value;
        setSearchInput(searchValue);
    };

    return (
        <>
            {productValues.loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            )}
            <div className="container mx-auto p-6">
                {productValues.error && (
                    <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
                        <strong>Error!</strong> {productValues.error}.
                    </div>
                )}

                <h2 className="text-xl font-semibold mb-4">Search:</h2>
                <form className="mb-6">
                    <div className="flex items-center gap-4">
                        <label htmlFor="search" className="text-lg">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            className="border border-gray-300 rounded-lg p-2 w-64"
                        />
                        <button
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                            onClick={() => setSearchInput(undefined)}
                        >
                            Reset
                        </button>
                    </div>
                    <hr className="my-6" />
                    <h5 className="text-lg font-semibold mb-2">Categories:</h5>
                    <div className="flex flex-wrap">{displayCategories()}</div>
                </form>

                <hr className="my-6" />
                <h1 className="text-2xl font-bold mb-4">Products:</h1>
                <table className="w-full table-auto border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">#ID</th>
                            <th className="border border-gray-300 px-4 py-2">Title</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                            <th className="border border-gray-300 px-4 py-2">Description</th>
                            <th className="border border-gray-300 px-4 py-2">Category</th>
                            <th className="border border-gray-300 px-4 py-2">Image</th>
                            <th className="border border-gray-300 px-4 py-2">Rating</th>
                        </tr>
                    </thead>
                    <tbody>{displayProducts()}</tbody>
                </table>
            </div>
        </>
    );
}

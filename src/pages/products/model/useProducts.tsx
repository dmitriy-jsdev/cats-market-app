import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchProducts } from "../../../shared/api";
import type { Product } from "../../../entities/product/model/product";

export const useProducts = (page: number, sortKey: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchProducts(page);
      const { products, pages } = response.data;

      if (Array.isArray(products)) {
        setProducts(products);
        setTotalPages(pages ?? 1);
      } else {
        console.error("Invalid products data format", response.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки продуктов:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aValue = a[sortKey as keyof Product] ?? "";
      const bValue = b[sortKey as keyof Product] ?? "";

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return aValue - bValue;
      }

      return 0;
    });
  }, [products, sortKey]);

  return { sortedProducts, loading, totalPages };
};

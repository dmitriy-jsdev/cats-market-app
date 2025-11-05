import { useState, useEffect } from "react";
import { Select, Pagination, Typography, Flex } from "antd";
import { Spinner } from "../../../shared/ui/Spinner/Spinner";
import { ProductCard } from "../../../entities/product";
import { useProducts } from "../model/useProducts";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

const { Title } = Typography;
const { Option } = Select;

const ProductsContainer = styled.div`
  max-width: 700px;
  margin: 50px auto 0;
  text-align: center;
  padding-bottom: 30px;
`;

const SortContainer = styled.div`
  margin: 22px 0;
`;

const PaginationContainer = styled(Flex)`
  margin-top: 30px;

  .ant-pagination-item-active {
    background-color: #1677ff;
    border-color: #1677ff;
  }

  .ant-pagination-item-active a {
    color: #fff;
  }
`;

const SORT_FIELDS = [
  "name",
  "price",
  "stock",
  "brand",
  "rating",
  "reviews_count",
  "barcode",
] as const;

type SortKey = (typeof SORT_FIELDS)[number];

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page"));
  const initialPage =
    Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const sortParam = (searchParams.get("sort") || "name") as SortKey;
  const initialSort: SortKey = SORT_FIELDS.includes(sortParam)
    ? sortParam
    : "name";

  const [page, setPage] = useState<number>(initialPage);
  const [sortKey, setSortKey] = useState<SortKey>(initialSort);

  const { sortedProducts, loading, totalPages } = useProducts(page, sortKey);

  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [loading]);

  useEffect(() => {
    setSearchParams({
      page: page.toString(),
      sort: sortKey,
    });
  }, [page, sortKey, setSearchParams]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <ProductsContainer>
      <Title level={2}>Список товаров</Title>

      <SortContainer>
        <label>Сортировать по: </label>
        <Select<SortKey>
          value={sortKey}
          onChange={setSortKey}
          style={{ width: 122 }}
        >
          <Option value="name">Название</Option>
          <Option value="price">Цена</Option>
          <Option value="stock">На складе</Option>
          <Option value="brand">Бренд</Option>
          <Option value="rating">Рейтинг</Option>
          <Option value="reviews_count">Отзывы</Option>
          <Option value="barcode">Штрихкод</Option>
        </Select>
      </SortContainer>

      {sortedProducts.length === 0 ? (
        <p>Нет доступных товаров</p>
      ) : (
        sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}

      <PaginationContainer justify="center">
        <Pagination
          current={page}
          onChange={setPage}
          pageSize={5}
          total={totalPages * 5}
          showSizeChanger={false}
        />
      </PaginationContainer>
    </ProductsContainer>
  );
};

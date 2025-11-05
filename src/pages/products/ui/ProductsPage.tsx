import { useState, useEffect } from "react";
import { Select, Pagination, Typography, Flex, Button } from "antd";
import { Spinner } from "../../../shared/ui/Spinner/Spinner";
import { ProductCard } from "../../../entities/product";
import { useProducts } from "../model/useProducts";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { getCurrentUser, signOut } from "../../../shared/api";

const { Title } = Typography;
const { Option } = Select;

const PageLayout = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 88px 16px 30px;
`;

const TopBar = styled(Flex)`
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 20;

  @media (max-width: 576px) {
    top: 10px;
    right: 10px;
  }
`;

const UserName = styled.span`
  max-width: 260px;
  border-radius: 999px;
  border: 1px solid #d6e4ff;
  background-color: #f5f8ff;
  color: #1f1f1f;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductsContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userDisplayName, setUserDisplayName] = useState("Пользователь");
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    const loadCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (cancelled) {
          return;
        }

        const displayName =
          user.full_name?.trim() || user.username?.trim() || "Пользователь";
        setUserDisplayName(displayName);
      } catch {
        if (!cancelled) {
          setUserDisplayName("Пользователь");
        }
      }
    };

    loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    sessionStorage.setItem("just_logged_out", "1");

    try {
      await signOut();
    } catch {
      // Keep UX predictable even if backend logout endpoint is unavailable.
    } finally {
      navigate("/", { replace: true });
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageLayout>
      <TopBar justify="flex-end" align="center" gap="small" wrap>
        <UserName title={userDisplayName}>{userDisplayName}</UserName>
        <Button onClick={handleSignOut} loading={isSigningOut}>
          Выйти
        </Button>
      </TopBar>

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
    </PageLayout>
  );
};

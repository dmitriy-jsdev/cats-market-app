import type { FC } from "react";
import { Card, Typography } from "antd";
import styled from "styled-components";
import type { Product } from "../../../entities/product/model/product";

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 15px;
`;

const StyledTitle = styled(Title)`
  margin-bottom: 15px;
`;

const ProductImage = styled.img`
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const NoImage = styled.div`
  display: grid;
  place-items: center;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 5px;
  color: #666;
  font-size: 24px;
  line-height: 200px;
  margin-bottom: 20px;
`;

const StyledTextBlock = styled.div`
  margin-bottom: 10px;
`;

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => (
  <StyledCard>
    <StyledTitle level={3}>{product.name}</StyledTitle>

    {product.images?.length ? (
      <ProductImage src={product.images[0]} alt={product.name} />
    ) : (
      <NoImage>No Image</NoImage>
    )}

    <StyledTextBlock>
      <Text type="secondary">{product.description}</Text>
    </StyledTextBlock>

    <StyledTextBlock>
      <Text strong>Цена: </Text>
      <Text>{`${product.discount_price ?? product.price} $`}</Text>
    </StyledTextBlock>

    <StyledTextBlock>
      <Text strong>Бренд: </Text>
      <Text>{product.brand || "Не указан"}</Text>
    </StyledTextBlock>

    <StyledTextBlock>
      <Text strong>Остаток на складе: </Text>
      <Text>{product.stock}</Text>
    </StyledTextBlock>

    <StyledTextBlock>
      <Text strong>Рейтинг: </Text>
      <Text>{`${product.rating} / 5`}</Text>
    </StyledTextBlock>

    <StyledTextBlock>
      <Text strong>Отзывы: </Text>
      <Text>{product.reviews_count}</Text>
    </StyledTextBlock>

    <Text strong>Штрихкод: </Text>
    <Text>{product.barcode}</Text>
  </StyledCard>
);

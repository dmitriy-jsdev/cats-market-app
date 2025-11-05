import type { FC } from "react";
import { useEffect, useState } from "react";
import { Card, Typography } from "antd";
import styled, { keyframes } from "styled-components";
import type { Product } from "../../../entities/product/model/product";

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 15px;
`;

const StyledTitle = styled(Title)`
  margin-bottom: 15px;
`;

const ImageFrame = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
  background: #f5f5f5;
`;

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const SkeletonShimmer = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e4e4e4 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

const ProductImage = styled.img<{ $loaded: boolean }>`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
  border-radius: 5px;

  object-fit: cover;

  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  transition: opacity 0.25s ease;
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

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const src = product.images?.[0];

  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <StyledCard>
      <StyledTitle level={3}>{product.name}</StyledTitle>

      {src && !failed ? (
        <ImageFrame>
          {!loaded && <SkeletonShimmer />}

          <ProductImage
            src={src}
            alt={product.name}
            $loaded={loaded}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </ImageFrame>
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
};

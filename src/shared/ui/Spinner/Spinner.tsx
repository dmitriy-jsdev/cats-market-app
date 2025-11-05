import SpinnerSvg from "../../../assets/spinner.svg?react";
import styled from "styled-components";
import React from "react";

const SpinnerContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  svg {
    transform: scale(6);
  }
`;

export const Spinner: React.FC = () => {
  return (
    <SpinnerContainer>
      <SpinnerSvg />
    </SpinnerContainer>
  );
};

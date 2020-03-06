import React from "react";
import styled from "styled-components";

const StyledDice = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.fontColor || "#000000"};
  background-color: ${props => props.color};
  padding: 1rem 1.5rem;
`;

const Dice = ({ face, color, fontColor }) => (
  <StyledDice color={color} fontColor={fontColor}>
    {face}
  </StyledDice>
);

export default Dice;

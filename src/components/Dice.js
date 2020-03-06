import React from "react";
import styled from "styled-components";

const StyledDice = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: ${props => props.color};
  padding: 1rem 1.5rem;
`;

const Dice = ({ face, color }) => <StyledDice color={color}>{face}</StyledDice>;

export default Dice;

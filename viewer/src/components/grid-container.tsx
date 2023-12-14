import styled from "styled-components";

interface GridContainerProps {
  layout?: "row" | "column";
  orientation?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
}

const GridContainer = styled.div<GridContainerProps>`
  display: flex;
  height: 100%;
  width: 100%;
  font-family: "Playfair Display", serif;
  flex-direction: ${(props) => props.layout ?? "row"};
  justify-content: ${(props) => props.orientation ?? "flex-start"};
`;

export default GridContainer;

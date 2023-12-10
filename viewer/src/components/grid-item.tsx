import styled from "styled-components";

interface GridItem {
  flex?: number | string;
  display?: string;
  alignItems?: string;
  justifyContent?: string;
}

const GridItem = styled.div<GridItem>`
  flex: ${(props) => props.flex ?? 1};
  display: ${(props) => props.display ?? "inline-flex"};
  align-items: ${(props) => props.alignItems ?? "center"};
  justify-content: ${(props) => props.justifyContent ?? "center"};
  min-height: 0;
  min-width: 0;
`;

export default GridItem;

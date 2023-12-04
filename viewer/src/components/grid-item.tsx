import styled from "styled-components";

interface GridItem {
  flex?: number;
}

const GridItem = styled.div<GridItem>`
  flex: ${(props) => props.flex ?? 1};
  min-height: 0;
  min-width: 0;
`;

export default GridItem;

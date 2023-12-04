import styled from "styled-components";

const MenuButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.secondary};
  height: 100%;
  border: none;
  border-radius: 0;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.primary};
  }
`;

export default MenuButton;
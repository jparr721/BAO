import styled from "styled-components";

interface ButtonProps {
  selected?: boolean;
}

const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background-color: transparent;
  color: ${props => props.theme.colors.secondary};
  height: 100%;
  width: auto;
  border-radius: 0;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.primary};
  }

  ${props => props.selected && `
    background-color: ${props.theme.colors.secondary};
    color: ${props.theme.colors.primary};
  `}

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

export default Button;
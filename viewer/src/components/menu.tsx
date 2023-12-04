import styled from "styled-components";

const Menu = styled.nav`
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.secondary};
    border: 1px solid ${props => props.theme.colors.secondary};
    border-radius: 10;
    height: 100%;
    width: 100%;
    overflow: hidden;
    img {
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
    };
`;

export default Menu;
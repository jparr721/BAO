import styled from "styled-components";

const BaseContainer = styled.div`
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.secondary};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 10;
    height: 100%;
    width: 100%;
    overflow: auto;
`;

export default BaseContainer;
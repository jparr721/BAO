import styled from "styled-components";

const Select = styled.select`
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.secondary};
    border: 1px solid ${props => props.theme.colors.secondary};
    border-radius: 10;
    height: 100%;
    width: 100%;
    overflow: auto;
    text-align: left;
    padding: 0.6em 1.2em;
`;

export default Select;
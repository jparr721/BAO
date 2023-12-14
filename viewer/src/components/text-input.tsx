import styled from "styled-components";

const TextInput = styled.input`
    background-color: transparent;
    color: ${props => props.theme.colors.secondary};
    height: auto;
    width: auto;
    border-radius: 0;
    border: 1px solid ${props => props.theme.colors.secondary};
    padding: 0.6em 1.2em;
`;

export default TextInput;
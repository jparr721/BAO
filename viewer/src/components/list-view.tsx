import styled from 'styled-components';

const ListView = styled.ul`
    list-style: none;
    padding: 5px;
    overflow: auto;
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    color: ${props => props.theme.colors.secondary};
    background-color: ${props => props.theme.colors.primary};
    :hover {
        cursor: pointer;
        color: ${props => props.theme.colors.primary};
        background-color: ${props => props.theme.colors.secondary};
    }
`;

export default ListView;
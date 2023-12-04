import styled from "styled-components";
import React from "react";

interface SidePanelProps {
    title?: string;
    children?: React.ReactNode;
}

const StyledSidePanel = styled.div`
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.secondary};
    border: 1px solid ${props => props.theme.colors.secondary};
    border-radius: 10;
    height: 100%;
    width: 100%;
    text-align: center;
    overflow: auto;
`;

const SidePanel = ({ title, children }: SidePanelProps) => (
    <StyledSidePanel>
        <h2>{title}</h2>
        {children}
    </StyledSidePanel>
);

export default SidePanel;
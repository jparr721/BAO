import styled from "styled-components";
import React from "react";
import BaseContainer from "./base-contaner";

interface SidePanelProps {
    title?: string;
    children?: React.ReactNode;
}

const StyledSidePanel = styled(BaseContainer)`
    text-align: center;
`;

const SidePanel = ({ title, children }: SidePanelProps) => (
    <StyledSidePanel>
        <h2>{title}</h2>
        {children}
    </StyledSidePanel>
);

export default SidePanel;
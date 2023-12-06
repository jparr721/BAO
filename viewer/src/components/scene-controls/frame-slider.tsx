import styled from "styled-components";

const FrameSlider = styled.input.attrs({
    type: "range",
    min: 0,
    step: 1,
})`
    height: 100%;
    width: 100%;
`;

export default FrameSlider;
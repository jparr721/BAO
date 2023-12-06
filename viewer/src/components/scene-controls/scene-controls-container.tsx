import styled from 'styled-components';
import BaseContainer from '../base-contaner';
import SceneControls from './scene-controls';

interface SceneControlsContainerProps {
    // The number of simulation frames being controlled.
    frames: number;
}

const SceneControlsContainer = ({ frames }: SceneControlsContainerProps) => {
    return (
        <BaseContainer>
            <SceneControls frames={frames} />
        </BaseContainer>
    );
};

export default SceneControlsContainer;
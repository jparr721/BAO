import BaseContainer from '../base-contaner';
import { useEffect, useState } from 'react';
import GridContainer from '../grid-container';
import GridItem from '../grid-item';
import Select from '../select';
import FrameSlider from './frame-slider';
import Button from '../button';
import { useFrame } from '../scene/frame-context';


interface SceneControlsProps {
    // The number of simulation frames being controlled.
    frames: number;
}

const SceneControls = ({ frames }: SceneControlsProps) => {
    const { frame, setFrame } = useFrame();
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let interval: number | undefined;

        if (isPlaying && frame < frames) {
            interval = setInterval(() => {
                setFrame((frame) => (frame + 1) % frames);
            }, 8);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, frame, frames, setFrame]);


    return (
        <BaseContainer>
            <GridContainer layout="row">
                <GridItem>
                    <GridContainer layout="column">
                        <GridItem>
                            <Select>
                                <option value="24">24</option>
                                <option value="30">30</option>
                                <option value="60">60</option>
                            </Select>
                        </GridItem>
                        <GridItem>
                            <Button onClick={() => setIsPlaying(!isPlaying)}>
                                {isPlaying ? 'Pause' : 'Play'}
                            </Button>
                            <Button onClick={() => setFrame(0)}>
                                Reset
                            </Button>
                        </GridItem>
                    </GridContainer>
                </GridItem>
                <GridItem flex={4}>
                    <FrameSlider value={frame} max={frames - 1} onChange={(e) => setFrame(e.target.value)} />
                </GridItem>
                <GridItem>
                    <p>Frame {frame}</p>
                </GridItem>
            </GridContainer>
        </BaseContainer>
    );
};

export default SceneControls;
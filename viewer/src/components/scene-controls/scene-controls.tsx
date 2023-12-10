import BaseContainer from '../base-contaner';
import { useEffect, useState } from 'react';
import GridContainer from '../grid-container';
import GridItem from '../grid-item';
import Select from '../select';
import FrameSlider from './frame-slider';
import Button from '../button';
import { useFrame } from '../scene/frame-context';

const ONE_SECOND_MS = 1000;


interface SceneControlsProps {
    // The number of simulation frames being controlled.
    frames: number;
}

const SceneControls = ({ frames }: SceneControlsProps) => {
    const { frame, setFrame } = useFrame();
    const [isPlaying, setIsPlaying] = useState(false);
    const [fps, setFps] = useState(24);

    const setFpsFromString = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const fps = event.target.value;

        try {
            setFps(parseInt(fps));
        } catch (e) {
            console.error(`Caught error updating fps to ${fps}: ${e}`);

            // Default to this value
            setFps(24);
        }

    };

    useEffect(() => {
        let interval: number | undefined;

        if (isPlaying && frame < frames) {
            interval = setInterval(() => {
                setFrame((frame) => (frame + 1) % frames);
            }, ONE_SECOND_MS / fps);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, frame, frames, setFrame, fps]);


    return (
        <BaseContainer>
            <GridContainer>
                <GridItem>
                    <GridItem flex={"0 0 auto"}>
                        <GridContainer layout='row'>
                            <GridItem>
                                <GridContainer>
                                    <GridItem justifyContent="flex-start">
                                        <p>FPS</p>
                                    </GridItem>
                                    <GridItem>
                                        <Select onChange={setFpsFromString} value={fps}>
                                            <option value="24">24</option>
                                            <option value="30">30</option>
                                            <option value="60">60</option>
                                        </Select>
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                            <GridItem>
                                <Button onClick={() => setIsPlaying(!isPlaying)}>
                                    {isPlaying ? 'Pause' : 'Play'}
                                </Button>
                            </GridItem>
                            <GridItem>
                                <Button onClick={() => setFrame(0)}>
                                    Reset
                                </Button>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridItem>
                <GridItem flex={2}>
                    <FrameSlider value={frame} max={frames - 1} onChange={(e) => setFrame(parseInt(e.target.value))} />
                </GridItem>
                <GridItem>
                    <p>Frame {frame}</p>
                </GridItem>
            </GridContainer>
        </BaseContainer>
    );
};

export default SceneControls;
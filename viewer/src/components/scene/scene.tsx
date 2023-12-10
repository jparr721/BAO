import { Canvas, extend, useThree } from '@react-three/fiber';
import { ArcballControls, OrthographicCamera } from '@react-three/drei';
import TriangleMesh from '../triangle-mesh';
import GridContainer from '../grid-container';
import GridItem from '../grid-item';
import SceneControlsContainer from '../scene-controls/scene-controls-container';
import { useFrame } from './frame-context';
import theme from '../../theme';

interface SceneMesh {
    vertices: number[],
    indices: number[],
}

interface SceneProps {
    meshes?: SceneMesh[],
}


extend({ ArcballControls });

function CameraControls() {
    const {
        camera,
        gl: { domElement },
    } = useThree();

    return <ArcballControls args={[camera, domElement]} enableRotate={false} enablePan={true} />;
}

const Scene = ({ meshes }: SceneProps) => {
    const { frame } = useFrame();

    const mesh = meshes !== undefined ? meshes[frame] : { vertices: [], indices: [] };

    return (
        <GridContainer layout='column' style={{ background: theme.colors.canvas.background }}>
            <GridItem flex={10}>
                <Canvas>
                    <OrthographicCamera position={[0, 0, 5]} />
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    {
                        <TriangleMesh key={frame} vertices={mesh.vertices} indices={mesh.indices} />
                    }
                    <CameraControls />
                </Canvas>
            </GridItem>
            <GridItem>
                <SceneControlsContainer frames={meshes !== undefined ? meshes.length : 0} />
            </GridItem>
        </GridContainer>
    );
};

export default Scene;

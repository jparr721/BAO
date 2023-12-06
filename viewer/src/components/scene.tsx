import { Canvas, extend, useThree } from '@react-three/fiber';
import { ArcballControls, OrthographicCamera } from '@react-three/drei';
import TriangleMesh from './triangle-mesh';

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

const Scene = (meshes: SceneProps) => {
    return (
        <Canvas>
            <OrthographicCamera position={[0, 0, 5]} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {
                meshes.meshes?.map((mesh, index) => <TriangleMesh key={index} vertices={mesh.vertices} indices={mesh.indices} />)
            }
            <CameraControls />
        </Canvas>
    );
};

export default Scene;

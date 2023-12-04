import * as THREE from 'three';
import { useRef } from 'react';

export interface MeshProps {
    vertices: number[];
    faces: number[];
    position: number[];
}

export default function Mesh({ vertices, faces, position }: MeshProps) {
    const ref = useRef();

    const geometry = new THREE.BufferGeometry();
    const verticesArray = new Float32Array(vertices);
    geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 2));

    const facesArray = faces.flat();
    geometry.setIndex(facesArray);

    geometry.computeVertexNormals();

    return (
        <mesh
            ref={ref}
            geometry={geometry}
            position={position}
        >
            <meshStandardMaterial />
        </mesh>
    );
}
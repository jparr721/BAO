import { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';

interface TriangleMeshProps {
    vertices: number[],
    indices: number[]
}

const TriangleMesh = ({ vertices, indices }: TriangleMeshProps) => {
    const geometry = useMemo(() => {
        const geometry = new BufferGeometry();

        // Convert the flat array of vertices into an array of Vector2 objects
        const verticesFormatted = [];
        for (let i = 0; i < vertices.length; i += 2) {
            verticesFormatted.push(vertices[i], vertices[i + 1], 0); // Add Z = 0 for 2D vertices
        }

        // Set the vertices and indices to the geometry
        geometry.setAttribute('position', new Float32BufferAttribute(verticesFormatted, 3));
        geometry.setIndex(indices);

        return geometry;
    }, [vertices, indices]);

    return (
        <mesh geometry={geometry}>
            <meshBasicMaterial color={'orange'} />
        </mesh>
    );
};

export default TriangleMesh;
import './App.css';
import { Canvas, extend, useThree } from '@react-three/fiber';
import { ArcballControls, OrthographicCamera } from '@react-three/drei';
import GridContainer from './components/grid-container';
import GridItem from './components/grid-item';
import MenuButton from './components/menu-button';
import Menu from './components/menu';
import SidePanel from './components/side-panel';
import ListView from './components/list-view';
import ListItem from './components/list-item';
import DetailItem from './components/detail-item';
import Mesh from './components/mesh';
import { useQuery } from '@tanstack/react-query';
import { runSimulation } from './net/sim';
import { MouseEvent, useState } from 'react';

extend({ ArcballControls });

function CameraControls() {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  return <ArcballControls args={[camera, domElement]} enableRotate={false} enablePan={true} />;
}

export default function App() {
  const query = useQuery({
    queryKey: ['runSimBunny'], queryFn: runSimulation,
  });

  const [currentMesh, setCurrentMesh] = useState({ v: [], f: [] });

  if (query.isLoading) {
    return <h1>Loading...</h1>;
  }

  const setMesh = (e) => {
    console.log('loading frame', e.target.value);
    console.log(query.data?.data?.frames[e.target.value]);
    setCurrentMesh(query.data?.data?.frames[e.target.value]);
  };


  return (
    <div className='fullscreen'>
      <GridContainer layout="column">
        <GridItem flex={1}>
          <Menu>
            <GridContainer layout='row'>
              <GridItem>
                <MenuButton>File</MenuButton>
                <MenuButton>Other</MenuButton>
              </GridItem>
            </GridContainer>
          </Menu>
        </GridItem>
        <GridItem flex={15}>
          <GridContainer layout="row">
            <GridItem flex={1}>
              <SidePanel title="Meshes">
                <ListView>
                  <DetailItem>
                    <summary>Bunny</summary>
                    <p>Bunny Content</p>
                  </DetailItem>
                </ListView>
              </SidePanel>
            </GridItem>
            <GridItem flex={6}>
              <Canvas>
                <OrthographicCamera position={[0, 0, 5]} />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Mesh vertices={[
                  -0.5, -0.5,
                  0.5, -0.5,
                  0.0, 0.5]}
                  faces={[0, 1, 2]} />
                {currentMesh && currentMesh.v.length > 0 && <Mesh vertices={currentMesh.v}
                  faces={currentMesh.f}
                />}
                <CameraControls />
              </Canvas>
            </GridItem>
            <GridItem flex={1}>
              <SidePanel title="Frames">
                <ListView>
                  {[...Array(query.data?.data?.frames?.length)].map((_, i) => <ListItem onClick={e => setMesh(e)} key={i}>Frame {i}</ListItem>)}
                </ListView>
              </SidePanel>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </div>
  );
}

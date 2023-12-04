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

  if (query.isLoading) {
    return <h1>Loading...</h1>;
  } else {
    console.log(query.data);
  }

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
                {/* <Mesh vertices={[
                  -0.5, -0.5,
                  0.5, -0.5,
                  0.0, 0.5]}
                  faces={[0, 1, 2]}
                  position={[0, 0, 0]}
                /> */}
                <CameraControls />
              </Canvas>
            </GridItem>
            <GridItem flex={1}>
              <SidePanel title="Frames">
                <ListView>
                  {[...Array(query.data?.data?.frames?.length)].map((_, i) => <ListItem key={i}>Frame {i}</ListItem>)}
                </ListView>
              </SidePanel>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </div>
  );
}

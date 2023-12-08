import './App.css';
import GridContainer from './components/grid-container';
import GridItem from './components/grid-item';
import Button from './components/button';
import Menu from './components/menu';
import SidePanel from './components/side-panel';
import ListView from './components/list-view';
import DetailItem from './components/detail-item';
import { useQuery } from '@tanstack/react-query';
import { runSimulation } from './net/sim';
import Scene from './components/scene/scene';
import { FrameProvider } from './components/scene/frame-context';

export default function App() {
  const query = useQuery({
    queryKey: ['runSimBunny'], queryFn: runSimulation,
  });


  return (
    <FrameProvider>
      <div className='fullscreen'>
        <GridContainer layout="column">
          <GridItem flex={1}>
            <Menu>
              <GridContainer layout='row'>
                <GridItem>
                  <Button>File</Button>
                  <Button>Other</Button>
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
                {query.isLoading ? <h1>Loading Scene</h1> : <Scene meshes={query.data?.data?.frames} />}
              </GridItem>
              <GridItem flex={1}>
                <SidePanel title={query.isLoading ? "Loading" : "Frames"}>
                  {
                    !query.isLoading && <p>Total Frames {query.data.data.frames.length}</p>
                  }
                </SidePanel>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    </FrameProvider>
  );
}

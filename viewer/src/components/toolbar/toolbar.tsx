import IMAGES from "../../../public/images";
import BaseContainer from "../base-contaner";
import Button from "../button";
import GridContainer from "../grid-container";
import GridItem from "../grid-item";

const Toolbar = () => (
    <BaseContainer>
        <GridContainer>
            <GridItem flex={"0 0 auto"}>
                <Button>
                    <img src={IMAGES.LogoTiny} />
                </Button>
            </GridItem>
            <GridItem flex={"0 0 auto"}>
                <Button>File</Button>
            </GridItem>
            <GridItem flex={"0 0 auto"}>
                <Button>Other</Button>
            </GridItem>
        </GridContainer>
    </BaseContainer>
);

export default Toolbar;
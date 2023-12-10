import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IMAGES from "../../../public/images";
import BaseContainer from "../base-contaner";
import Button from "../button";
import GridContainer from "../grid-container";
import GridItem from "../grid-item";
import { faChevronCircleDown, faCoffee, faMouse, faMousePointer } from "@fortawesome/free-solid-svg-icons";
import DropdownButton from "../dropdown-button";

const Toolbar = () => {
    const handleSelect = (item) => {
        console.log('Selected item:', item.label);
    };
    return (
        <BaseContainer>
            <GridContainer>
                <GridItem justifyContent="flex-start">
                    <Button>
                        <img src={IMAGES.LogoTiny} />
                    </Button>
                    <Button>File</Button>
                    <Button>
                        <FontAwesomeIcon icon={faCoffee} />
                    </Button>
                    <DropdownButton
                        items={[{ label: 'Option 1' }, { label: 'Option 2' }]}
                        onSelectItem={handleSelect}
                    >
                        <FontAwesomeIcon icon={faMousePointer} />
                        <FontAwesomeIcon icon={faChevronCircleDown} />
                    </DropdownButton>
                </GridItem>
                <GridItem>
                    <p>Project Name</p>
                </GridItem>
                <GridItem justifyContent="flex-end">
                    <Button>Export</Button>
                </GridItem>
            </GridContainer>
        </BaseContainer>
    );
};

export default Toolbar;

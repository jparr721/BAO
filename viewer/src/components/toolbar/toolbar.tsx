import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IMAGES from "../../../public/images";
import BaseContainer from "../base-contaner";
import Button from "../button";
import GridContainer from "../grid-container";
import GridItem from "../grid-item";
import { faChevronDown, faSquare } from "@fortawesome/free-solid-svg-icons";
import DropdownButton from "../dropdown-button";
import { useState } from "react";
import Modal from "../modal/modal";
import SimulationForm from "./simulation-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateSimulation from "../../models/simulation/create-simulation.type";
import createSimulation from "../../net/simulation/create-simulation";

const Toolbar = () => {
    const queryClient = useQueryClient();

    const [collisionZoneButtonSelected, setCollisionZoneButtonSelected] = useState(false);
    const [showNewSimulationModal, setShowNewSimulationModal] = useState(false);

    const handleSelectFileMenu = (item) => {
        setShowNewSimulationModal(!showNewSimulationModal);
    };

    const createSimulationMutation = useMutation({
        mutationFn: (simulation: CreateSimulation) => {
            queryClient.invalidateQueries({ queryKey: ['loadSimulationCache'] });
            return createSimulation(simulation);
        },
    });

    return (
        <BaseContainer>
            <GridContainer>
                <GridItem justifycontent="flex-start">
                    <DropdownButton
                        items={[{ label: 'New' }]}
                        onSelectItem={handleSelectFileMenu}
                    >
                        <img src={IMAGES.LogoTiny} />
                        <FontAwesomeIcon icon={faChevronDown} />
                    </DropdownButton>
                    <Modal showModal={showNewSimulationModal} setShowModal={setShowNewSimulationModal}>
                        <SimulationForm meshOptions={['bunny']} energyTypeOptions={['snh', 'stvk']} createSimulationMutation={createSimulationMutation} closeModal={() => setShowNewSimulationModal(false)} />
                    </Modal>
                    <Button onClick={() => setCollisionZoneButtonSelected(!collisionZoneButtonSelected)} selected={collisionZoneButtonSelected}>
                        <FontAwesomeIcon icon={faSquare} />
                    </Button>
                </GridItem>
                <GridItem>
                    <p>Project Name</p>
                </GridItem>
                <GridItem justifycontent="flex-end">
                    <Button>Export</Button>
                </GridItem>
            </GridContainer>
        </BaseContainer>
    );
};

export default Toolbar;

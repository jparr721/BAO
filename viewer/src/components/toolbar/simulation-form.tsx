import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import GridContainer from '../grid-container';
import Button from '../button';
import GridItem from '../grid-item';
import TextInput from '../text-input';
import Select from '../select';
import CreateSimulationFormData from '../../models/simulation/create-simulation-form-data.type';
import CreateSimulation from '../../models/simulation/create-simulation.type';
import { omit } from 'lodash';
import { UseMutationResult } from '@tanstack/react-query';

const SimulationSchema = Yup.object<CreateSimulationFormData>().shape({
    simulationName: Yup.string().required('Required'),
    meshName: Yup.string().required('Required'),
    energyType: Yup.string().required('Required'),
    dt: Yup.number().required('Required'),
    youngsModulus: Yup.number().required('Required'),
    poissonsRatio: Yup.number().required('Required'),
    materialMass: Yup.number(),
    collisionEps: Yup.number(),
    rayleighAlpha: Yup.number(),
    rayleighBeta: Yup.number(),
    gravityx: Yup.number(),
    gravityy: Yup.number(),
});

interface SimulationFormProps {
    meshOptions: string[];
    energyTypeOptions: string[];
    createSimulationMutation: UseMutationResult<CreateSimulation, Error, CreateSimulation, unknown>;
    closeModal: () => void;
}

const SimulationForm = ({ meshOptions, energyTypeOptions, createSimulationMutation, closeModal }: SimulationFormProps) => {

    return (
        <Formik
            initialValues={{
                simulationName: '',
                meshName: meshOptions[0],
                energyType: energyTypeOptions[0],
                dt: 0.01,
                youngsModulus: 5,
                poissonsRatio: 0.4,
                materialMass: 5,
                collisionEps: 1e-3,
                rayleighAlpha: 1e-3,
                rayleighBeta: 1e-3,
                gravityx: 0,
                gravityy: -9.8,
            }}
            validationSchema={SimulationSchema}
            onSubmit={(values, { setSubmitting }) => {
                const gravity = [values.gravityx, values.gravityy];
                const simulation: CreateSimulation = {
                    ...omit(values, 'gravityx', 'gravityy'),
                    gravity
                };
                console.log('submitting', simulation);

                setSubmitting(true);

                createSimulationMutation.mutate(simulation, {
                    onSuccess: () => {
                        setSubmitting(false);
                        closeModal();
                    }
                });

            }}
        >
            {({ isSubmitting, errors }) => (
                <Form>
                    <GridContainer layout='column' orientation='space-between'>
                        <GridItem>
                            <h3>Create New Simulation</h3>
                        </GridItem>
                        <GridItem>
                            <Field type="text" name="simulationName" as={TextInput} placeholder={"Simulation Name"} />
                        </GridItem>
                        <GridItem >
                            <GridContainer layout='column'>
                                <label htmlFor="meshName">Mesh:</label>
                                <Field name="meshName" as={Select}>
                                    {meshOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </Field>
                                <p>{errors.meshName}</p>
                            </GridContainer>
                        </GridItem>
                        <GridItem>
                            <GridContainer layout='column'>
                                <label htmlFor='energy function'>Energy Function:</label>
                                <Field name="energyType" as={Select}>
                                    {energyTypeOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </Field>
                                <p>{errors.energyType}</p>
                            </GridContainer>
                        </GridItem>
                        <GridItem>
                            <GridContainer layout='column'>
                                <label htmlFor="dt">Time Step:</label>
                                <Field type="number" name="dt" as={TextInput} placeholder={"Time Step"} step={0.001} />
                                <p>{errors.dt}</p>
                            </GridContainer>
                        </GridItem>
                        <GridItem>
                            <GridContainer layout='column'>
                                <label htmlFor="youngsModulus">Young's Modulus (E):</label>
                                <Field type="number" name="youngsModulus" as={TextInput} placeholder={"Young's Modulus"} />
                                <p>{errors.youngsModulus}</p>
                            </GridContainer>
                        </GridItem>
                        <GridItem>
                            <GridContainer layout='column'>
                                <label htmlFor="poissonsRatio">Poisson's Ratio (nu):</label>
                                <Field type="number" name="poissonsRatio" as={TextInput} placeholder={"Poisson's Ratio"} />
                                <p>{errors.poissonsRatio}</p>
                            </GridContainer>
                        </GridItem>
                        <GridItem>
                            <GridContainer layout='column'>
                                <label htmlFor="materialMass">Material Mass:</label>
                                <Field type="number" name="materialMass" as={TextInput} placeholder={"Material Mass"} />
                                <p>{errors.materialMass}</p>
                            </GridContainer>
                        </GridItem>
                        <GridItem>
                            <GridContainer layout='column'>
                                <label htmlFor="collisionEps">Collision Epsilon:</label>
                                <Field type="number" name="collisionEps" as={TextInput} placeholder={"Collision Epsilon"} />
                                <p>{errors.collisionEps}</p>
                            </GridContainer>
                        </GridItem>
                        <GridItem>
                            <GridContainer layout='column'>
                                <label htmlFor="rayleighAlpha">Rayleigh Alpha:</label>
                                <Field type="number" name="rayleighAlpha" as={TextInput} placeholder={"Rayleigh Alpha"} />
                                <p>{errors.rayleighAlpha}</p>
                            </GridContainer>
                        </GridItem>
                        <GridItem>
                            <GridContainer layout='column'>
                                <label htmlFor="rayleighBeta">Rayleigh Beta:</label>
                                <Field type="number" name="rayleighBeta" as={TextInput} placeholder={"Rayleigh Beta"} />
                                <p>{errors.rayleighBeta}</p>
                            </GridContainer>
                        </GridItem>
                        <GridItem>
                            <GridContainer layout="row">
                                <GridContainer layout='column'>
                                    <label htmlFor="gravity">Gravity X:</label>
                                    <Field type="text" name="gravityx" as={TextInput} placeholder={"Gravity"} />
                                    <p>{errors.gravityx}</p>
                                </GridContainer>
                                <GridContainer layout='column'>
                                    <label htmlFor="gravity">Gravity Y:</label>
                                    <Field type="text" name="gravityy" as={TextInput} placeholder={"Gravity"} />
                                    <p>{errors.gravityy}</p>
                                </GridContainer>
                            </GridContainer>
                        </GridItem>
                        <GridItem>
                            <Button type="submit" disabled={isSubmitting}>
                                Submit
                            </Button>
                        </GridItem>
                    </GridContainer>
                </Form>
            )}
        </Formik>
    );
};

export default SimulationForm;
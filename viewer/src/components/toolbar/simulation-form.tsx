import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import GridContainer from '../grid-container';
import Button from '../button';
import GridItem from '../grid-item';
import TextInput from '../text-input';
import Select from '../select';

const SimulationSchema = Yup.object().shape({
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
}

const SimulationForm = ({ meshOptions, energyTypeOptions }: SimulationFormProps) => (
    <Formik
        initialValues={{
            simulationName: '',
            meshName: '',
            energyType: '',
            dt: 0,
            youngsModulus: 0,
            poissonsRatio: 0,
            materialMass: 0,
            collisionEps: 0,
            rayleighAlpha: 0,
            rayleighBeta: 0,
            gravityx: 0,
            gravityy: 0,
        }}
        validationSchema={SimulationSchema}
        onSubmit={(values, { setSubmitting }) => {
            // Handle form submission
            setSubmitting(false);
        }}
    >
        {({ isSubmitting }) => (
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
                        </GridContainer>
                    </GridItem>
                    <GridItem>
                        <GridContainer layout='column'>
                            <label htmlFor="dt">Time Step:</label>
                            <Field type="number" name="dt" as={TextInput} placeholder={"Time Step"} />
                        </GridContainer>
                    </GridItem>
                    <GridItem>
                        <GridContainer layout='column'>
                            <label htmlFor="youngsModulus">Young's Modulus (E):</label>
                            <Field type="number" name="youngsModulus" as={TextInput} placeholder={"Young's Modulus"} />
                        </GridContainer>
                    </GridItem>
                    <GridItem>
                        <GridContainer layout='column'>
                            <label htmlFor="poissonsRatio">Poisson's Ratio (nu):</label>
                            <Field type="number" name="poissonsRatio" as={TextInput} placeholder={"Poisson's Ratio"} />
                        </GridContainer>
                    </GridItem>
                    <GridItem>
                        <GridContainer layout='column'>
                            <label htmlFor="materialMass">Material Mass:</label>
                            <Field type="number" name="materialMass" as={TextInput} placeholder={"Material Mass"} />
                        </GridContainer>
                    </GridItem>
                    <GridItem>
                        <GridContainer layout='column'>
                            <label htmlFor="collisionEps">Collision Epsilon:</label>
                            <Field type="number" name="collisionEps" as={TextInput} placeholder={"Collision Epsilon"} />
                        </GridContainer>
                    </GridItem>
                    <GridItem>
                        <GridContainer layout='column'>
                            <label htmlFor="rayleighAlpha">Rayleigh Alpha:</label>
                            <Field type="number" name="rayleighAlpha" as={TextInput} placeholder={"Rayleigh Alpha"} />
                        </GridContainer>
                    </GridItem>
                    <GridItem>
                        <GridContainer layout='column'>
                            <label htmlFor="rayleighBeta">Rayleigh Beta:</label>
                            <Field type="number" name="rayleighBeta" as={TextInput} placeholder={"Rayleigh Beta"} />
                        </GridContainer>
                    </GridItem>
                    <GridItem>
                        <GridContainer layout="row">
                            <GridContainer layout='column'>
                                <label htmlFor="gravity">Gravity X:</label>
                                <Field type="text" name="gravityx" as={TextInput} placeholder={"Gravity"} />
                            </GridContainer>
                            <GridContainer layout='column'>
                                <label htmlFor="gravity">Gravity Y:</label>
                                <Field type="text" name="gravityy" as={TextInput} placeholder={"Gravity"} />
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

export default SimulationForm;
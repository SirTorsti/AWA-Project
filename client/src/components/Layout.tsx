import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

interface ICard {
    id: number,
    title: string,
    body: string
}

interface IColumn {
    id: number,
    name: string
}
const Layout = () => {
    const [columns, setColumns] = useState<IColumn[]>([{ id: 1, name: 'Column 1'}])
    //using nextId to avoid duplicate IDs
    const [nextId, setNextId] = useState<number>(2) // Initialize nextId to 2 since the first column has id 1

    const addColumn = () => {
        const newColumn = { id: nextId, name: `Column ${nextId}`}
        setColumns([...columns, newColumn])
        setNextId(nextId + 1)
    }

    const removeColumn = (id: number) => {
        setColumns(columns.filter(col => col.id !== id))
    }

    //ok something interesting is going on here, col.id -1 for whatever reason returns the correct col id.
    const renameColumn = (id: number, newName: string) => {
        const updatedColumns = columns.map(col => col.id -1 === id ? {...col, name: newName} : col)
        setColumns(updatedColumns)
    }

    const addCard = (id: number) => {
        //TODO: implement card adding functionality
    }

    const removeCard = (id: number) => {
        //TODO: implement card remove functionality
    }

    /* Using react-bootstrap to display a Container with the Columns, each Column has a DropdownButton (hamburger menu),
    unique id based on number of columns and a title
    How many columns fit into a row is also determined by the screensize of user
    */
    return (
        <Container>
            <Row>
                {columns.map((col, index) => (
                    <Col key={col.id} xs={12} sm={6} md={4} lg={3}>
                        <div className="column">
                            <div className ="appBar">
                                <h5>{col.name}</h5>
                                <DropdownButton id="dropdown-basic-button" title="☰">
                                    <Dropdown.Item onClick={() => {
                                        const newName = prompt('Enter new column name: ', col.name)
                                        if(newName) renameColumn(index, newName)
                                    }}>Rename column</Dropdown.Item>
                                    <Dropdown.Item onClick={() => addCard(col.id)}>Add card</Dropdown.Item>
                                    <Dropdown.Item onClick= {() => removeColumn(col.id)}>Delete column</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <div className ="cards">
                                {/* Render the cards here */}
                            </div>
                            <Button variant="primary" onClick={() => addCard(col.id)}>Add card</Button>
                        </div>
                        
                    </Col>
                ))}
            </Row>
            <Button variant="primary" onClick={addColumn}>Add column</Button>
        </Container>
    )
}

export default Layout

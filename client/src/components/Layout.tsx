import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { IColumn } from "../../../server/src/models/Column"

import { Form } from 'react-bootstrap'



const Layout = () => {
    const [columns, setColumns] = useState<IColumn[]>([])
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null)
    const [newColumnName, setNewColumnName] = useState<string>("")

    useEffect(() => {
        fetchColumns();
    }, [])

    const fetchColumns = async () => {
        try {
            const response = await fetch("http://localhost:8000/columns", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }
            const data = await response.json()
            setColumns(data)
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when trying to fetch columns ${error.message}`)
            }
        }
    }
   

    const addColumn = async () => {
        try {
            const response = await fetch("http://localhost:8000/columns", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: `Column ${columns.length +1}`,
                })
            })
            const data = await response.json()
            setColumns([...columns, data])
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when adding column: ${error.message}`)
            }
        }
    }

    const removeColumn = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8000/columns/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                setColumns(columns.filter(col => col._id !== id))
            }
            } catch (error) {
            if(error instanceof Error) {
                console.log(`Error when trying to remove columns: ${error.message}`)
            }
        }
    }

    const renameColumn = async (id: string, newName: string) => {
        try{
            const response = await fetch(`http://localhost:8000/columns/${id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: newName
                })
            })
            if (!response.ok) {
                throw new Error(`Error renaming column ${response.status}`);
            }
            const updatedColumn = await response.json()
            setColumns(columns.map(col => col._id === id ? updatedColumn : col))
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when renaming column ${error.message}`)
            }
        }
    }

    const addCard = async (columnId: string, title: string, body: string) => {
        try {
            const response = await fetch(`http://localhost:8000/columns/${columnId}/cards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    body
                })
            })
            const data = await response.json()
            const updatedColumns = columns.map(col => col._id === columnId ? data : col)
            setColumns(updatedColumns)
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when adding card to column: ${error.message}`)
            }
        }
    }

    const removeCard = async (columnId: string, cardId: string) => {
        try {
            const response = await fetch(`http://localhost:8000/columns/${columnId}/cards/${cardId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }
            const data = await response.json()
            console.log("Removing card from column:", columnId, "Card ID:", cardId);
            setColumns(columns.map(col => col._id === columnId ? data : col));
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when trying to remove card ${error.message}`)
            }
        }
    }

    const handleRename = (_id: string, name: string) => {
        setEditingColumnId(_id)
        setNewColumnName(name)
    }

    const handleSave = (event: React.KeyboardEvent, _id: string) => {
            if (event.key === 'Enter') {
                renameColumn(_id, newColumnName);
                setEditingColumnId(null);
            }
        };
    /* Using react-bootstrap to display a Container with the Columns, each Column has a DropdownButton (hamburger menu),
    unique id from mongoDB
    How many columns fit into a row is also determined by the screensize of user
    */
    return (
            <Container>
                <Row className="row">
                    {columns.map((col) => ( 
                        <Col key={col._id} className="column">
                            
                                <div className="appBar">
                                    {editingColumnId === col._id ? (
                                        <Form.Control
                                            type="text"
                                            value={newColumnName}
                                            onChange={(e) => setNewColumnName(e.target.value)}
                                            onKeyDown={(e) => handleSave(e, col._id)}
                                            onBlur={() => setEditingColumnId(null)}
                                            autoFocus
                                        />
                                    ) : (
                                        <h5 onClick={() => handleRename(col._id, col.name)}>{col.name}</h5>
                                    )}
                                    
                                    <DropdownButton id="dropdown-basic-button" title="☰" variant="light">
                                        <Dropdown.Item onClick={() => addCard(col._id, 'New Card', 'Click to start editing')}>Add card</Dropdown.Item>
                                        <Dropdown.Item onClick={() => removeColumn(col._id)}>Delete column</Dropdown.Item>
                                    </DropdownButton>
                                </div>

                                <div className="cards">
                                    {col.cards.map(card => (
                                        <div key={card._id} className="card">
                                            <h6>{card.title}</h6>
                                            <p>{card.body}</p>
                                            <Button variant="danger" onClick={() => removeCard(col._id, card._id)}>Remove</Button>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="primary" className="add-card-button" onClick={() => addCard(col._id, "New Card", "Click to start editing")}>Add card</Button>
                            
                        </Col>
                    ))}
                </Row>
                <Button style={{ marginTop: 10 }} onClick={addColumn}>Add column</Button>
            </Container>
    )
}

export default Layout

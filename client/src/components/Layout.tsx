import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton' 
import { IColumn } from "../../../server/src/models/Column"
import { Form } from 'react-bootstrap' 
import { closestCenter, DndContext } from '@dnd-kit/core' 
import { arrayMove, SortableContext } from '@dnd-kit/sortable' 
import { useSortable } from '@dnd-kit/sortable' 
import { CSS } from '@dnd-kit/utilities' 
import CardModal from './CardModal' 

const Layout = () => {
    const [columns, setColumns] = useState<IColumn[]>([]) 
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null) 
    const [newColumnName, setNewColumnName] = useState<string>("") 
    const [modalShow, setModalShow] = useState<boolean>(false) 
    const [currentColumnId, setCurrentColumnId] = useState<string | null>(null) 
    const [currentCardId, setCurrentCardId] = useState<string | null>(null) 
    const [initialTitle, setInitialTitle] = useState<string>("") 
    const [initialBody, setInitialBody] = useState<string>("") 
    const [editingCardId, setEditingCardId] = useState<string | null>(null)
    const [newCardTitle, setNewCardTitle] = useState<string>("")
    const [newCardBody, setNewCardBody] = useState<string>("")

    useEffect(() => {
        fetchColumns() 
    }, []) 

    //jwt token fetch
    const getToken = (): string | null => {
        return localStorage.getItem('token')
    }
    //if token expires, redirect user back to login
    const handleTokenExpiration = () => {
        window.location.href = '/login'
    }
    const fetchColumns = async () => {
        try {
            const token = getToken()
                const response = await fetch("http://localhost:8000/columns", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }) 
            //check for response and token expiration
            if (!response.ok) {
                if(response.status === 401) {
                    handleTokenExpiration()
                    return
                }
                throw new Error(`Error ${response.status}`) 
            }
            const data: IColumn[] = await response.json() 
            setColumns(data) 
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when trying to fetch columns ${error.message}`) 
            }
        }
    } 

    const addColumn = async () => {
        try {
            const token = getToken()
            const response = await fetch("http://localhost:8000/columns", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                //automatic naming system according to number of existing columns
                body: JSON.stringify({
                    name: `Column ${columns.length + 1}`,
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
            const token = getToken()
            const response = await fetch(`http://localhost:8000/columns/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }) 
            if (response.ok) {
                setColumns(columns.filter(col => col._id !== id)) 
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when trying to remove columns: ${error.message}`) 
            }
        }
    } 

    const renameColumn = async (id: string, newName: string) => {
        try {
            const token = getToken()
            const response = await fetch(`http://localhost:8000/columns/${id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newName
                })
            }) 
            if (!response.ok) {
                if(response.status === 401) {
                    handleTokenExpiration()
                    return
                }
                throw new Error(`Error renaming column ${response.status}`) 
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
            const token = getToken()
            const response = await fetch(`http://localhost:8000/columns/${columnId}/cards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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

    const editCard = async (columnId: string, cardId: string, title: string, body: string) => {
        try {
            const token = getToken()
            const response = await fetch(`http://localhost:8000/columns/${columnId}/cards/${cardId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    body
                })
            }) 
            const data = await response.json() 

            if(!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            const updatedColumns = columns.map(col => col._id === columnId ? data : col) 
            setColumns(updatedColumns) 
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when editing card: ${error.message}`) 
            }
        }
    } 
    //when user drags the cards or moves them around and the order changes, update the columns
    const updateCardOrder = async (columnId: string, cards: any[]) => {
        try {
            const token = getToken()
            const response = await fetch(`http://localhost:8000/columns/${columnId}/cards/reorder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ cards })
            }) 

            if(!response.ok){
                if(response.status === 401) {
                    handleTokenExpiration()
                    return
                }
                console.log(`Failed to update card order: ${response.status} ${response.statusText}`)
                throw new Error("Error updating card order")
            }

            const data = await response.json() 
            const updatedColumns = columns.map(col => col._id === columnId ? data : col) 
            setColumns(updatedColumns) 
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when updating card order: ${error}`) 
            }
        }
    } 

    const moveCard = async (currentColumnId: string, targetColumnId: string, cardId: string) => {
        try {
            const token = getToken()
            // Remove card from the current column
            const updatedCurrentColumn = await fetch(`http://localhost:8000/columns/${currentColumnId}/cards/${cardId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }) 

            if (!updatedCurrentColumn.ok) {
                throw new Error(`Error deleting card from column: ${updatedCurrentColumn.status}`) 
            }

            // Add card to the target column
            const cardToMove = columns.find(col => col._id === currentColumnId)?.cards.find(card => card._id === cardId) 
            if (cardToMove) {
                await addCard(targetColumnId, cardToMove.title, cardToMove.body) 

                setColumns(prevColumns => {
                    return prevColumns.map(col => {
                        if (col._id === currentColumnId) {
                            return {
                                ...col,
                                cards: col.cards.filter(card => card._id !== cardId),
                            } as IColumn 
                        }
                        return col 
                    }) 
                }) 
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when moving card: ${error.message}`) 
            }
        }
    }

    const removeCard = async (columnId: string, cardId: string) => {
        try {
            const token = getToken()
            const response = await fetch(`http://localhost:8000/columns/${columnId}/cards/${cardId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }) 
            if (!response.ok) {
                if(response.status === 401) {
                    handleTokenExpiration()
                    return
                }
                throw new Error(`Error ${response.status}`) 
            }
            const data = await response.json() 
            setColumns(columns.map(col => col._id === columnId ? data : col)) 
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when trying to remove card ${error.message}`) 
            }
        }
    } 
    //simple renaming functions and save functions when user is done editing and presses enter
    const handleColumnRename = (id: string, name: string) => {
        setEditingColumnId(id) 
        setNewColumnName(name) 
    } 

    const handleCardRename = (id: string, title: string) => {
        setEditingCardId(id)
        setNewCardTitle(title)
    }

    const handleCardNewBody = (id: string, body: string) => {
        setEditingCardId(id)
        setNewCardBody(body)
    }

    const handleSave = (event: React.KeyboardEvent, id: string) => {
        if (event.key === 'Enter') {
            renameColumn(id, newColumnName) 
            setEditingColumnId(null) 
        }
    } 

    const handleCardSave = (event: React.KeyboardEvent, columnId: string, cardId: string) => {
        if (event.key === 'Enter') {
            editCard(columnId, cardId, newCardTitle, newCardBody)
            setEditingCardId(null)
        }
        
    }

    //Check if the drag ends in the same column where it started, if yes, just reorder
    //the logic works even though I did not have time to implement drag and drop to other columns.
    const handleDragEnd = (event: any) => {
            const { active, over } = event 
        
            if (!over) return 
        
            const activeId = active.id 
            const overId = over.id 
        
            let sourceColumn = columns.find(col => col.cards.some(card => card._id === activeId)) 
            let destinationColumn = columns.find(col => col.cards.some(card => card._id === overId)) 
        
            //check that cols exist
            if (!sourceColumn || !destinationColumn) return 
        
            // If card is dropped in the same column, reorder
            if (sourceColumn._id === destinationColumn._id) {
                const updatedCards = arrayMove(
                    sourceColumn.cards,
                    sourceColumn.cards.findIndex(card => card._id === activeId),
                    destinationColumn.cards.findIndex(card => card._id === overId)
                ) 
        
                setColumns((prevColumns) =>
                    prevColumns.map(col =>
                        col._id === sourceColumn._id
                            ? { ...col, cards: updatedCards }
                            : col
                    ) as IColumn[]
                ) 
        
                updateCardOrder(sourceColumn._id, updatedCards) 
            }
        } 
    

    //useDroppable and useDraggable hooks, style and the drag handle
    const SortableItem = ({ id, children }: { id: string;  children: React.ReactNode }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id }) 

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        } 

        return (
            <div ref={setNodeRef} style={style} className="card">
                {/* Drag Handle - Only this element triggers dragging */}
                <div className="drag-handle" {...attributes} {...listeners}>
                    ⋮
                </div>
                {children}
            </div>
        ) 
    } 


    //the card is empty when it is first added
    const openAddCardModal = (columnId: string) => {
        setCurrentColumnId(columnId) 
        setCurrentCardId(null) 
        setInitialTitle('') 
        setInitialBody('') 
        setModalShow(true) 
    } 
    //card has previous attributes when editing
    const openEditCardModal = (columnId: string, cardId: string, title: string, body: string) => {
        setCurrentColumnId(columnId) 
        setCurrentCardId(cardId) 
        setInitialTitle(title) 
        setInitialBody(body) 
        setModalShow(true) 
    } 

    //as a fallback create a new card with the title and body if currentCardId is not found
    const handleModalSave = (title: string, body: string) => {
        if (currentColumnId) {
            if (currentCardId) {
                editCard(currentColumnId, currentCardId, title, body) 
            } else {
                addCard(currentColumnId, title, body) 
            }
        }
    } 

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                                    <h5 onDoubleClick={() => handleColumnRename(col._id, col.name)}>{col.name}</h5>
                                )}
                                <DropdownButton id="dropdown-basic-button" title="☰" variant="light">
                                    <Dropdown.Item onClick={() => openAddCardModal(col._id)}>Add card</Dropdown.Item>
                                    <Dropdown.Item onClick={() => removeColumn(col._id)}>Delete column</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <SortableContext items={col.cards.length > 0 ? col.cards.map(card => card._id) : [col._id]}>
                                <div className="cards">
                                    {col.cards.map(card => (
                                        <SortableItem key={card._id} id={card._id}>
                                            <div className="card-content">
                                            {editingCardId === card._id ? (
                                                    <>
                                                        <Form.Control
                                                            type="text"
                                                            value={newCardTitle}
                                                            onChange={(e) => setNewCardTitle(e.target.value)}
                                                            onKeyDown={(e) => handleCardSave(e, col._id, card._id)}
                                                            onBlur={() => setEditingCardId(null)}
                                                            autoFocus
                                                        />
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={3}
                                                            value={newCardBody}
                                                            onChange={(e) => setNewCardBody(e.target.value)}
                                                            onKeyDown={(e) => handleCardSave(e, col._id, card._id)}
                                                            onBlur={() => setEditingCardId(null)}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <h6 onDoubleClick={() => handleCardRename(card._id, card.title)}>{card.title}</h6>
                                                        <p onDoubleClick={() => handleCardNewBody(card._id, card.body)}>{card.body}</p>
                                                    </>
                                                )}
                                                <Button variant="danger" onClick={() => removeCard(col._id, card._id)}>Remove</Button>
                                                <Button variant="secondary" onClick={() => openEditCardModal(col._id, card._id, card.title, card.body)}>Edit</Button>
                                                <Button variant="primary" onClick={() => moveCard(col._id, columns[columns.indexOf(col) - 1]?._id, card._id)} disabled={columns.indexOf(col) === 0}>Move Left</Button>
                                                <Button variant="primary" onClick={() => moveCard(col._id, columns[columns.indexOf(col) + 1]?._id, card._id)} disabled={columns.indexOf(col) === columns.length - 1}>Move Right</Button>
                                            </div>
                                        </SortableItem>
                                    ))}
                                </div>
                            </SortableContext>
                            <Button variant="primary" className="add-card-button" onClick={() => openAddCardModal(col._id)}>Add card</Button>
                        </Col>
                    ))}
                </Row>
                <Button style={{ marginTop: 10 }} onClick={addColumn}>Add column</Button>
                <CardModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    onSave={handleModalSave}
                    initialTitle={initialTitle}
                    initialBody={initialBody}
                />
            </Container>
        </DndContext>
    ) 
} 

export default Layout 
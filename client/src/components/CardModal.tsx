import React, { useState, useEffect} from 'react'
import { Modal, Button, Form} from 'react-bootstrap'

interface CardModalProps {
    show: boolean
    onHide: () => void
    onSave: (title: string, body: string) => void
    initialTitle?: string
    initialBody?: string
}

const CardModal: React.FC<CardModalProps> = ({ show, onHide, onSave, initialTitle = '', initialBody = ''}) => {

    const [title, setTitle] = useState(initialTitle)
    const [body, setBody] = useState(initialBody)

    useEffect (() => {
        setTitle(initialTitle)
        setBody(initialBody)
    }, [initialTitle, initialBody])


const handleSave = () => {
    onSave(title, body)
    onHide()
}

return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>{initialTitle ? 'Edit Card' : 'Add Card'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="formCardTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formCardBody" className="mt-3">
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
                Save
            </Button>
        </Modal.Footer>
    </Modal>
    );
};

export default CardModal
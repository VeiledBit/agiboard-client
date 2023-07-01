import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Draggable } from "react-beautiful-dnd"
import { Input } from "@mui/material";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "react-bootstrap";
import styles from "./Card.module.css";

export default function Card({ key, card, index, columnId, updateCard, deleteCard }) {
    const [isModalShowed, setIsModalShowed] = useState(false);
    const [newCardName, setNewCardName] = useState(card.name);

    const {
        register,
        handleSubmit,
        setValue
    } = useForm();

    const changeModalState = (isModalShowed) => {
        setIsModalShowed(isModalShowed);
    };

    const showModal = () => {
        changeModalState(true);
        setValue("newCardName", card.name);
    };

    const hideModal = () => {
        changeModalState(false);
    };

    const submit = (formData) => {
        if (!newCardName || newCardName.length === 0) {
            alert("Please enter card name.");
            return
        }
        updateCard(formData.newCardName, card.id);
        hideModal();
    }

    const handleDeletion = () => {
        deleteCard(card.id);
        hideModal();
    };

    return (
        <React.Fragment>
            <Draggable draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                    <div className={styles.container}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        isDragging={snapshot.isDragging}
                        onClick={showModal}>
                        {card.name}
                    </div>
                )}
            </Draggable>
            <Modal onHide={hideModal} show={isModalShowed} centered>
                <form className="form" onSubmit={handleSubmit(submit)}>
                    <Modal.Body>
                        <Input
                            type="text"
                            name="newCardName"
                            placeholder="Enter card name..."
                            inputProps={{ "aria-label": "description", maxLength: 30 }}
                            style={{ width: "100%" }}
                            {...register("newCardName", { required: true })}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">Submit</Button>
                        <Button variant="secondary" onClick={hideModal}>Close</Button>
                        <Button variant="danger" onClick={handleDeletion}>DELETE CARD</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </React.Fragment>
    );
}

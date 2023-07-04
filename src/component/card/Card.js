import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Draggable } from "react-beautiful-dnd"
import { Input, Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
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
            <Dialog open={isModalShowed} onClose={hideModal}>
                <DialogContent style={{ width: "550px" }}>
                    <form id="formNewCard" onSubmit={handleSubmit(submit)}>
                        <Input
                            type="text"
                            name="newCardName"
                            placeholder="Enter card name..."
                            inputProps={{ "aria-label": "description", maxLength: 30 }}
                            style={{ width: "100%" }}
                            {...register("newCardName", { required: true })}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button form="formNewCard" variant="contained" color="primary" type="submit">Submit</Button>
                    <Button variant="contained" color="error" onClick={handleDeletion}>DELETE CARD</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

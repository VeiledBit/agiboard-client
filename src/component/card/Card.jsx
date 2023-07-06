import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Draggable } from "react-beautiful-dnd";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import styles from "./Card.module.css";

// eslint-disable-next-line object-curly-newline
export default function Card({ card, index, updateCard, deleteCard }) {
    const [isModalShowed, setIsModalShowed] = useState(false);

    const validationSchema = Yup.object().shape({
        newCardName: Yup.string().required("Card name is required").max(30, "Maximum length is 30 characters")
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({ resolver: yupResolver(validationSchema) });

    const changeModalState = (isModalShowedParam) => {
        setIsModalShowed(isModalShowedParam);
    };

    const showModal = () => {
        changeModalState(true);
        setValue("newCardName", card.name);
    };

    const hideModal = () => {
        changeModalState(false);
    };

    const submit = (formData) => {
        if (!formData.newCardName || formData.newCardName.length === 0) {
            return;
        }
        updateCard(formData.newCardName, card.id);
        hideModal();
    };

    const handleDeletion = () => {
        deleteCard(card.id);
        hideModal();
    };

    return (
        <>
            <Draggable draggableId={card.id} index={index}>
                {(provided) => (
                    <div
                        className={styles.container}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        // eslint-disable-next-line react/no-unknown-property
                        onClick={showModal}
                    >
                        {card.name}
                    </div>
                )}
            </Draggable>
            <Dialog open={isModalShowed} onClose={hideModal}>
                <DialogContent style={{ width: "550px" }}>
                    <form id="formNewCard" onSubmit={handleSubmit(submit)}>
                        <TextField
                            type="text"
                            variant="standard"
                            name="newCardName"
                            placeholder="Enter card name..."
                            inputProps={{ maxLength: 30 }}
                            style={{ width: "100%" }}
                            {...register("newCardName", { required: true })}
                            error={!!errors.newCardName}
                            helperText={errors.newCardName?.message}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button form="formNewCard" variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDeletion}>
                        DELETE CARD
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

/* eslint-disable no-shadow */
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import BtnAdd from "../btnAdd/BtnAdd";
import Card from "../card/Card";
import ConfirmDialog from "../confirmDialog/ConfirmDialog";
import styles from "./Column.module.css";

// eslint-disable-next-line object-curly-newline
export default function Column({ column, cards, index, updateColumn, deleteColumn, saveCard, updateCard, deleteCard }) {
    const [isModalShowed, setIsModalShowed] = useState(false);
    const [isConfirmDialogShowed, setIsConfirmDialogShowed] = useState(false);

    const validationSchema = Yup.object().shape({
        newColumnName: Yup.string().required("Column name is required").max(30, "Maximum length is 30 characters")
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const changeModalState = (isModalShowedParam, isConfirmDialogShowedParam) => {
        setIsModalShowed(isModalShowedParam);
        setIsConfirmDialogShowed(isConfirmDialogShowedParam);
    };

    const showModal = () => {
        changeModalState(true, false);
        setValue("newColumnName", column.name);
    };

    const hideModal = () => {
        changeModalState(false, false);
    };

    const showConfirmDialog = () => {
        changeModalState(true, true);
    };

    const hideConfirmDialog = () => {
        changeModalState(true, false);
    };

    const submit = (formData) => {
        if (!formData.newColumnName || formData.newColumnName.length === 0) {
            return;
        }
        updateColumn(column.id, formData.newColumnName);
        hideModal();
    };

    const handleDeletion = () => {
        deleteColumn(column.id);
    };

    return (
        <>
            <Draggable draggableId={column.id} index={index}>
                {(provided) => (
                    <div className={styles.container} {...provided.draggableProps} ref={provided.innerRef}>
                        <h3 className={styles.title} {...provided.dragHandleProps} onClick={showModal}>
                            <div style={{ wordBreak: "break-all" }}>{column.name}</div>
                        </h3>
                        <Droppable droppableId={column.id} type="card">
                            {(provided) => (
                                <div
                                    className={styles.cardList}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    // eslint-disable-next-line react/no-unknown-property
                                >
                                    {cards.map((card, index) => (
                                        <Card
                                            key={card.id}
                                            card={card}
                                            index={index}
                                            updateCard={updateCard}
                                            deleteCard={deleteCard}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <BtnAdd columnId={column.id} saveCard={saveCard} />
                    </div>
                )}
            </Draggable>
            <Dialog open={isModalShowed} onClose={hideModal}>
                <DialogContent style={{ width: "550px" }}>
                    <form id="formNewColumn" onSubmit={handleSubmit(submit)}>
                        <TextField
                            type="text"
                            variant="standard"
                            name="newColumnName"
                            placeholder="Enter column name..."
                            inputProps={{ maxLength: 30 }}
                            style={{ width: "100%" }}
                            {...register("newColumnName")}
                            error={!!errors.newColumnName}
                            helperText={errors.newColumnName?.message}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button form="formNewColumn" variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="contained" color="error" onClick={showConfirmDialog}>
                        DELETE COLUMN
                    </Button>
                </DialogActions>
            </Dialog>
            <ConfirmDialog
                open={isConfirmDialogShowed}
                onClose={hideConfirmDialog}
                DialogTitleProp="Column Deletion"
                DialogContentProp="Are you sure you want to delete this column?"
                onClickConfirm={handleDeletion}
            />
        </>
    );
}

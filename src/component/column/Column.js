import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd"
import { useForm } from "react-hook-form";
import Card from "../card/Card";
import BtnAdd from "../btnAdd/BtnAdd";
import { Input } from "@mui/material";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ConfirmDialog from "../confirmDialog/ConfirmDialog";
import "react-bootstrap";
import styles from "./Column.module.css";

export default function Column({ key, column, cards, index, updateColumn, deleteColumn, saveCard, updateCard, deleteCard }) {
    const [newColumnName, setColumnName] = useState(column.name);
    const [isModalShowed, setIsModalShowed] = useState(false);
    const [isConfirmDialogShowed, setIsConfirmDialogShowed] = useState(false);

    const {
        register,
        handleSubmit,
        setValue
    } = useForm();

    const changeModalState = (isModalShowed, isConfirmDialogShowed) => {
        setIsModalShowed(isModalShowed);
        setIsConfirmDialogShowed(isConfirmDialogShowed);
    };

    const showModal = () => {
        changeModalState(true, false)
        setValue("newColumnName", column.name);
    };

    const hideModal = () => {
        changeModalState(false, false)
    };

    const showConfirmDialog = () => {
        changeModalState(true, true)
    };

    const hideConfirmDialog = () => {
        changeModalState(true, false)
    };

    const submit = (formData) => {
        if (!formData.newColumnName || formData.newColumnName.length === 0) {
            alert("Please enter column name.");
            return;
        }
        updateColumn(column.id, formData.newColumnName);
        hideModal()
    }

    const handleDeletion = () => {
        deleteColumn(column.id);
    };

    return (
        <React.Fragment>
            <Draggable draggableId={column.id} index={index}>
                {provided => (
                    <div className={styles.container} {...provided.draggableProps} ref={provided.innerRef}>
                        <h3 className={styles.title} {...provided.dragHandleProps} onClick={showModal}>
                            <div style={{ wordBreak: "break-all" }}>
                                {column.name}
                            </div>
                        </h3>
                        <Droppable droppableId={column.id} type="card">
                            {(provided, snapshot) => (
                                <div className={styles.cardList}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    isDraggingOver={snapshot.isDraggingOver}>

                                    {cards.map((card, index) =>
                                        <Card key={card.id}
                                            card={card}
                                            index={index}
                                            columnId={column.id}
                                            updateCard={updateCard}
                                            deleteCard={deleteCard} />)}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <BtnAdd columnId={column.id} saveCard={saveCard} />
                    </div>
                )}
            </Draggable>
            <Modal onHide={hideModal} show={isModalShowed}
                aria-labelledby="contained-modal-title-vcenter" centered>
                <form className="form" onSubmit={handleSubmit(submit)}>
                    <Modal.Body>
                        <Input
                            name="newColumnName"
                            placeholder="Enter column name..."
                            inputProps={{ "aria-label": "description", maxLength: 30 }}
                            style={{ width: "100%" }}
                            {...register("newColumnName", { required: true })}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">Submit</Button>
                        <Button variant="secondary" onClick={hideModal}>Close</Button>
                        <Button variant="danger" onClick={showConfirmDialog}>DELETE COLUMN</Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <ConfirmDialog open={isConfirmDialogShowed}
                onClose={hideConfirmDialog}
                DialogTitleProp={"Column Deletion"}
                DialogContentProp={"re you sure you want to delete this column?"}
                onClickCancel={hideConfirmDialog}
                onClickConfirm={handleDeletion} />
        </React.Fragment>
    );
}

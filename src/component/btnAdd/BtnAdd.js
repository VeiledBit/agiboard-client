import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card as MaterialCard, Icon } from "@mui/material";
import Textarea from "react-textarea-autosize";
import styles from "./BtnAdd.module.css";

export default function BtnAdd({ column, columnId, saveColumn, saveCard }) {
    const [name, setName] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue
    } = useForm();

    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setValue("name", "");
    };

    const renderAddButton = () => {
        const buttonText = column ? "Add another column" : "Add another card";
        const buttonTextOpacity = column ? 1 : 0.5;
        const buttonBorderTop = column ? "none" : "border-top: 1px solid lightgrey";
        const buttonMarginTop = column ? "0.5em" : "0em";

        return (
            <div onClick={openForm}
                className={styles.openFormButtonGroup}
                style={{ opacity: buttonTextOpacity, borderTop: buttonBorderTop, marginTop: buttonMarginTop }}>
                <Icon style={{ marginRight: "0.5em", marginTop: "1em" }}>add</Icon>
                <p className={styles.buttonText}>{buttonText}</p>
            </div>
        )
    };

    const handleSaving = (formData) => {
        console.log("handling");
        if (!formData.name || formData.name.length === 0) {
            alert("Please enter new name.");
            return
        }
        column ? saveColumn(formData.name) : saveCard(columnId, formData.name);
        closeForm();
    };

    const renderForm = () => {
        const placeholder = column ? "Enter column name..." : "Enter card name...";
        const buttonTitle = column ? "Add column" : "Add card";

        return (
            <div style={{ marginTop: "0.500em" }}>
                <form className="form" onSubmit={handleSubmit(handleSaving)}>
                    <MaterialCard className={styles.materialCard}>
                        <Textarea className={`${styles.materialCard} ${styles.textArea} `}
                            placeholder={placeholder}
                            autoFocus
                            maxLength="50"
                            {...register("name", { required: true })}
                        />
                    </MaterialCard>
                    <div className={styles.openFormButtonGroup}>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ color: "white", backgroundColor: "#5aac44" }}>
                            {buttonTitle}
                        </Button>
                    </div>
                </form>
            </div>
        )
    };

    return isFormOpen ? renderForm() : renderAddButton();
}

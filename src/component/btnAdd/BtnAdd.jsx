import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button, Card as MaterialCard, Icon } from "@mui/material";
import Textarea from "react-textarea-autosize";
import styles from "./BtnAdd.module.css";

// eslint-disable-next-line object-curly-newline
export default function BtnAdd({ column, columnId, saveColumn, saveCard }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const divFormWrapperRef = useRef(null);

    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        const closeOpenMenus = (e) => {
            if (divFormWrapperRef.current && isFormOpen && !divFormWrapperRef.current.contains(e.target)) {
                setIsFormOpen(false);
                setValue("name", "");
            }
        };

        document.addEventListener("mousedown", closeOpenMenus);
        return () => {
            document.removeEventListener("mousedown", closeOpenMenus);
        };
    }, [isFormOpen, setValue]);

    const renderAddButton = () => {
        const buttonText = column ? "Add another column" : "Add another card";
        const buttonTextOpacity = column ? 1 : 0.5;
        const buttonBorderTop = column ? "none" : "border-top: 1px solid lightgrey";
        const buttonMarginTop = column ? "0.5em" : "0em";

        return (
            <div
                onClick={() => setIsFormOpen(true)}
                className={styles.openFormButtonGroup}
                style={{ opacity: buttonTextOpacity, borderTop: buttonBorderTop, marginTop: buttonMarginTop }}
            >
                <Icon style={{ marginRight: "0.5em", marginTop: "1em" }}>add</Icon>
                <p className={styles.buttonText}>{buttonText}</p>
            </div>
        );
    };

    const handleSaving = (formData) => {
        if (!formData.name || formData.name.length === 0) {
            return;
        }
        // eslint-disable-next-line no-unused-expressions
        column ? saveColumn(formData.name) : saveCard(columnId, formData.name);
        setIsFormOpen(false);
        setValue("name", "");
    };

    const renderForm = () => {
        const placeholder = column ? "Enter column name..." : "Enter card name...";
        const buttonTitle = column ? "Add column" : "Add card";
        const buttonBorderTop = column ? "none" : "none";

        return (
            <div style={{ marginTop: "0.500em" }} ref={divFormWrapperRef}>
                <form className="form" onSubmit={handleSubmit(handleSaving)}>
                    <MaterialCard className={styles.materialCard}>
                        <Textarea
                            className={`${styles.materialCard} ${styles.textArea} `}
                            placeholder={placeholder}
                            autoFocus
                            maxLength="50"
                            {...register("name", { required: true })}
                        />
                    </MaterialCard>
                    <div className={styles.openFormButtonGroup} style={{ borderTop: buttonBorderTop }}>
                        <Button type="submit" variant="contained" color="success">
                            {buttonTitle}
                        </Button>
                    </div>
                </form>
            </div>
        );
    };

    return isFormOpen ? renderForm() : renderAddButton();
}

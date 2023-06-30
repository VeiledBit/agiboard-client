import React from "react"
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "react-bootstrap/Button";

export default function ConfirmDialog({open, onClose, DialogTitleProp, DialogContentProp, onClickCancel, onClickConfirm}) {
    return (
        <Dialog open={open} onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{DialogTitleProp}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {DialogContentProp}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClickCancel} variant="secondary" autoFocus>
                    Cancel
                </Button>
                <Button onClick={onClickConfirm} variant="danger">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

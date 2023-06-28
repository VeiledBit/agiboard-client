import React from "react"
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "react-bootstrap/Button";

class ConfirmDialog extends React.Component {
    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{this.props.DialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.props.DialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClickCancel} variant="secondary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={this.props.onClickConfirm} variant="danger">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default ConfirmDialog;

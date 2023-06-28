import React from "react"
import {Button, Card as MaterialCard, Icon} from "@material-ui/core";
import Textarea from "react-textarea-autosize";
import "./btnAdd.css"

class BtnAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            isFormOpen: false
        };
    }

    openForm = () => {
        this.setState({
            isFormOpen: true
        })
    };

    closeForm = () => {
        this.setState({
            name: "",
            isFormOpen: false
        })
    };

    handleInputChange = (event) => {
        this.setState({
            name: event.target.value
        })
    };

    renderAddButton = () => {
        const {column} = this.props;
        const buttonText = column ? "Add another column" : "Add another card";
        const buttonTextOpacity = column ? 1 : 0.5;
        const buttonBorderTop = column ? "none" : "border-top: 1px solid lightgrey";
        const buttonMarginTop = column ? "0.5em" : "0em";

        return (
            <div onClick={this.openForm}
                 className="openFormButtonGroup"
                 style={{opacity: buttonTextOpacity, borderTop: buttonBorderTop, marginTop: buttonMarginTop}}>
                <Icon style={{marginRight: "5px", marginTop: "12px"}}>add</Icon>
                <p>{buttonText}</p>
            </div>
        )
    };

    handleSaving = () => {
        if (!this.state.name || this.state.name.length === 0) {
            alert("Please enter new name.");
            return
        }
        const {column} = this.props;
        column ? this.props.saveColumn(this.state.name) : this.props.saveCard(this.props.columnId, this.state.name);
        this.setState({
            name: "",
            isFormOpen: false
        })
    };

    renderForm = () => {
        const {column} = this.props;
        const placeholder = column ? "Enter column name..." : "Enter card name...";
        const buttonTitle = column ? "Add column" : "Add card";

        return (
            <div style={{marginTop: "0.500em"}} onBlur={this.closeForm}>
                <MaterialCard className="materialCard">
                    <Textarea className="materialCard textArea"
                              placeholder={placeholder}
                              autoFocus
                              value={this.state.name}
                              maxLength="50"
                              onChange={this.handleInputChange}/>
                </MaterialCard>
                <div className="formButtonGroup">
                    <Button onMouseDown={this.handleSaving}
                            variant="contained"
                            style={{color: "white", backgroundColor: "#5aac44"}}>
                        {buttonTitle}
                    </Button>
                </div>
            </div>
        )
    };

    render() {
        return this.state.isFormOpen ? this.renderForm() : this.renderAddButton()
    }
}

export default BtnAdd;

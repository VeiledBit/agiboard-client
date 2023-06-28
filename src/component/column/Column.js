import React from "react"
import styled from "styled-components"
import {Draggable, Droppable} from "react-beautiful-dnd"
import Card from "../card/Card";
import BtnAdd from "../btnAdd/BtnAdd";
import {Input} from "@material-ui/core";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ConfirmDialog from "../confirmDialog/ConfirmDialog";
import "react-bootstrap";

const Container = styled.div`
  margin: 0.500em;
  border: 0.063em solid lightgrey;
  background-color: white;
  border-radius: 0.125em;
  width: 17em;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 0.500em;
`;

const CardList = styled.div`
  padding: 0.500em;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? "skyblue" : "inherit")}
  flex-grow: 1;
  min-height: 6.250em;
`;

class Column extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newColumnName: this.props.column.name,
            isModalShowed: false,
            isConfirmDialogShowed: false
        };
    }

    changeModalState = (isModalShowed, isConfirmDialogShowed) => {
        this.setState({
            newColumnName: this.props.column.name,
            isModalShowed: isModalShowed,
            isConfirmDialogShowed: isConfirmDialogShowed
        })
    };

    showModal = () => {
        this.changeModalState(true, false)
    };

    hideModal = () => {
        this.changeModalState(false, false)
    };

    showConfirmDialog = () => {
        this.changeModalState(true, true)
    };

    hideConfirmDialog = () => {
        this.changeModalState(true, false)
    };

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    handleSubmit = () => {
        if (!this.state.newColumnName || this.state.newColumnName.length === 0) {
            alert("Please enter column name.");
            return;
        }
        this.props.updateColumn(this.props.column.id, this.state.newColumnName);
        this.hideModal()
    }

    handleDeletion = () => {
        this.props.deleteColumn(this.props.column.id);
    };

    render() {
        return (
            <React.Fragment>
                <Draggable draggableId={this.props.column.id} index={this.props.index}>
                    {provided => (
                        <Container {...provided.draggableProps} ref={provided.innerRef}>
                            <Title {...provided.dragHandleProps} onClick={this.showModal}>
                                <div style={{wordBreak: "break-all"}}>
                                    {this.props.column.name}
                                </div>
                            </Title>
                            <Droppable droppableId={this.props.column.id} type="card">
                                {(provided, snapshot) => (
                                    <CardList
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        isDraggingOver={snapshot.isDraggingOver}>

                                        {this.props.cards.map((card, index) =>
                                            <Card key={card.id}
                                                  card={card}
                                                  index={index}
                                                  columnId={this.props.column.id}
                                                  updateCard={this.props.updateCard}
                                                  deleteCard={this.props.deleteCard}/>)}
                                        {provided.placeholder}
                                    </CardList>
                                )}
                            </Droppable>
                            <BtnAdd columnId={this.props.column.id} saveCard={this.props.saveCard}/>
                        </Container>
                    )}
                </Draggable>
                <Modal onHide={this.hideModal} show={this.state.isModalShowed}
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Body>
                        <Input value={this.state.newColumnName}
                               name="newColumnName"
                               placeholder="Enter column name..."
                               inputProps={{"aria-label": "description", maxLength: 30}}
                               style={{width: "100%"}}
                               onChange={this.handleChange}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleSubmit}>Submit</Button>
                        <Button variant="secondary" onClick={this.hideModal}>Close</Button>
                        <Button variant="danger" onClick={this.showConfirmDialog}>DELETE COLUMN</Button>
                    </Modal.Footer>
                </Modal>
                <ConfirmDialog open={this.state.isConfirmDialogShowed}
                               onClose={this.hideConfirmDialog}
                               DialogTitle={"Column Deletion"}
                               DialogContent={"re you sure you want to delete this column?"}
                               onClickCancel={this.hideConfirmDialog}
                               onClickConfirm={this.handleDeletion}/>
            </React.Fragment>
        );
    }
}

export default Column;

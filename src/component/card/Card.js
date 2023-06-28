import React from "react"
import styled from "styled-components"
import {Draggable} from "react-beautiful-dnd"
import {Input} from "@material-ui/core";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "react-bootstrap";

const Container = styled.div`
  border: 0.063em solid lightgrey;
  border-radius: 0.125em;
  padding: 0.500em;
  margin-bottom: 0.500em;
  background-color: ${props => (props.isDragging ? "lightgreen" : "white")};
  display: flex;
  word-break: break-all;
`;

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalShowed: false,
            newCardName: this.props.card.name
        };
    }

    changeModalState = (isModalShowed) => {
        this.setState({
            isModalShowed: isModalShowed,
            newCardName: this.props.card.name
        })
    };

    showModal = () => {
        this.changeModalState(true)
    };

    hideModal = () => {
        this.changeModalState(false)
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
        if (!this.state.newCardName || this.state.newCardName.length === 0) {
            alert("Please enter card name.");
            return
        }
        this.props.updateCard(this.state.newCardName, this.props.card.id);
        this.hideModal()
    }

    handleDeletion = () => {
        this.props.deleteCard(this.props.card.id);
        this.hideModal()
    };

    render() {
        return (
            <React.Fragment>
                <Draggable draggableId={this.props.card.id} index={this.props.index}>
                    {(provided, snapshot) => (
                        <Container
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            isDragging={snapshot.isDragging}
                            onClick={this.showModal}>
                            {this.props.card.name}
                        </Container>
                    )}
                </Draggable>
                <Modal onHide={this.hideModal} show={this.state.isModalShowed} centered>
                    <Modal.Body>
                        <Input value={this.state.newCardName}
                               name="newCardName"
                               placeholder="Enter card name..."
                               inputProps={{"aria-label": "description", maxLength: 30}}
                               style={{width: "100%"}}
                               onChange={this.handleChange}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleSubmit}>Submit</Button>
                        <Button variant="secondary" onClick={this.hideModal}>Close</Button>
                        <Button variant="danger" onClick={this.handleDeletion}>DELETE CARD</Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}

export default Card;

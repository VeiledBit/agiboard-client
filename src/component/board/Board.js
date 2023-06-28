import React from "react";
import styled from "styled-components";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import Column from "../column/Column";
import ColumnService from "../../service/ColumnService"
import BtnAdd from "../btnAdd/BtnAdd";
import CardService from "../../service/CardService";
import NavBar from "../navBar/NavBar";
import UserService from "../../service/UserService";
import AuthService from "../../service/AuthService";
import ConfirmDialog from "../confirmDialog/ConfirmDialog";

const Container = styled.div`
  display: flex;
`;

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: {},
            cards: {},
            columnOrder: {},
            boardName: ""
        };
        this.modalState = {
            isModalConfirmAccountDeletionShowed: false
        };
    }

    componentDidMount() {
        this.makeRequest(ColumnService.getColumnById, this.props.match.params.id)
    }

    onDragEnd = result => {
        const {destination, source, draggableId, type} = result;

        if (!destination) {
            return;
        }

        // Same column, same spot
        if (destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === "column") {
            const newColumnOrder = Array.from(this.state.columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);

            const newState = {
                ...this.state,
                columnOrder: newColumnOrder,
            };
            this.setState(newState);

            ColumnService.saveColumnOrder({
                boardId: this.props.match.params.id,
                columnOrder: newColumnOrder
            }).then();
            return;
        }

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];
        const newCardIds = Array.from(start.cards);
        newCardIds.splice(source.index, 1);
        newCardIds.splice(destination.index, 0, draggableId);

        // Same Column but different spot
        if (start === finish) {
            const newColumn = {
                ...start,
                cards: newCardIds
            };

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                },
            };

            this.setState(newState);
            return;
        }

        const startCardIds = Array.from(start.cards);
        startCardIds.splice(source.index, 1);
        const newStart = {
            ...start,
            cards: startCardIds
        };

        const finishCardIds = Array.from(finish.cards);
        finishCardIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            cards: finishCardIds
        };

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        this.setState(newState);
        ColumnService.saveCardToColumn(newState.columns).then();
    };

    updateState = (response) => {
        this.setState({
            columns: response.data[0].columns,
            cards: response.data[1].cards,
            columnOrder: response.data[2].columnOrder,
            boardName: response.data[3]
        });
    };

    changeModalState = (isModalConfirmAccountDeletionShowed) => {
        this.setState(this.modalState = {
            isModalConfirmAccountDeletionShowed: isModalConfirmAccountDeletionShowed
        })
    };

    showModalConfirmAccountDeletion = () => {
        this.changeModalState(true)
    };

    hideModalConfirmAccountDeletion = () => {
        this.changeModalState(false)
    };

    makeRequest = (methodToCall, data) => {
        methodToCall(data).then(response => {
            this.handleResponse(response)
        }).catch(error => {
            this.handleError(error)
        });
    }

    handleResponse = (response) => {
        if (response.status === 200 || response.status === 201) {
            this.updateState(response)
        }
    };

    handleError = (error) => {
        if (error.response.status === 401) {
            localStorage.clear(); // Prevent infinite loop
            this.props.history.push("");
        }
    };

    saveColumn = (columnName) => {
        const data = {
            boardId: this.props.match.params.id,
            columnName: columnName
        }
        this.makeRequest(ColumnService.saveColumn, data)
    };

    updateColumn = (columnId, columnName) => {
        const data = {
            boardId: this.props.match.params.id,
            columnId: columnId,
            columnName: columnName
        }
        this.makeRequest(ColumnService.updateColumn, data)
    };

    deleteColumn = (columnId) => {
        const data = {
            boardId: this.props.match.params.id,
            columnId: columnId
        }
        this.makeRequest(ColumnService.deleteColumn, data)
    };

    saveCard = (columnId, cardName) => {
        const data = {
            boardId: this.props.match.params.id,
            columnId: columnId,
            cardName: cardName
        }
        this.makeRequest(CardService.saveCard, data)
    };

    updateCard = (cardName, cardId) => {
        const data = {
            boardId: this.props.match.params.id,
            cardId: cardId,
            cardName: cardName
        }
        this.makeRequest(CardService.updateCard, data)
    };

    deleteCard = (cardId) => {
        const data = {
            boardId: this.props.match.params.id,
            cardId: cardId
        }
        this.makeRequest(CardService.deleteCard, data)
    };

    deleteAccount = () => {
        UserService.deleteUser({
            username: AuthService.getUsername()
        }).then(() => {
            localStorage.clear(); // Prevent infinite loop
            this.props.history.push("");
        });
    };

    logout = () => {
        localStorage.removeItem("userInfo");
        this.props.history.push("");
    };

    dashboard = () => {
        this.props.history.push("");
    }

    render() {
        if (Object.entries(this.state.columnOrder).length === 0 && this.state.columnOrder.constructor === Object) {
            return <React.Fragment/>
        }
        return (
            <React.Fragment>
                <NavBar boardName={this.state.boardName} dashboard={this.dashboard} logout={this.logout}
                        deleteAccount={this.showModalConfirmAccountDeletion}/>
                <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="all-columns" direction="horizontal" type="column">
                        {provided => (
                            <Container {...provided.droppableProps} ref={provided.innerRef}>
                                {this.state.columnOrder.map((columnId, index) => {
                                    const column = this.state.columns[columnId];
                                    const cards = column.cards.map(cardId => this.state.cards[cardId]);

                                    return <Column key={column.id} column={column} cards={cards} index={index}
                                                   updateColumn={this.updateColumn}
                                                   deleteColumn={this.deleteColumn}
                                                   saveCard={this.saveCard}
                                                   updateCard={this.updateCard}
                                                   deleteCard={this.deleteCard}/>
                                })}
                                {provided.placeholder}
                                <BtnAdd column saveColumn={this.saveColumn} saveCard={this.saveCard}/>
                            </Container>
                        )}
                    </Droppable>
                </DragDropContext>
                <ConfirmDialog open={this.modalState.isModalConfirmAccountDeletionShowed}
                               onClose={this.hideModalConfirmAccountDeletion}
                               DialogTitle={"Account deletion"}
                               DialogContent={`This account, and all of the data associated with it, will be deleted. 
                               This action is irreversible. Are you sure you want to proceed?`}
                               onClickCancel={this.hideModalConfirmAccountDeletion}
                               onClickConfirm={this.deleteAccount}/>
            </React.Fragment>
        );
    }
}

export default Board;

import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "../column/Column";
import ColumnService from "../../service/ColumnService";
import BtnAdd from "../btnAdd/BtnAdd";
import CardService from "../../service/CardService";
import NavBar from "../navBar/NavBar";
import UserService from "../../service/UserService";
import AuthService from "../../service/AuthService";
import ConfirmDialog from "../confirmDialog/ConfirmDialog";
import styles from "./Board.module.css";

export default function Board() {
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    // const newKey = props.key;
    // eslint-disable-next-line no-unused-vars
    const [key, setKey] = useState(window.location.pathname.split("/")[2]);
    const [columns, setColumns] = useState({});
    const [cards, setCards] = useState({});
    const [columnOrder, setColumnOrder] = useState({});
    const [boardName, setBoardName] = useState("");
    const [isModalConfirmAccountDeletionShowed, setIsModalConfirmAccountDeletionShowed] = useState(false);

    const onDragEnd = (result) => {
        // eslint-disable-next-line object-curly-newline
        const { destination, source, draggableId, type } = result;

        if (!destination) {
            return;
        }

        // Same column, same spot
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (type === "column") {
            const newColumnOrder = Array.from(columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);

            setColumnOrder(newColumnOrder);

            ColumnService.saveColumnOrder({
                boardId: key,
                columnOrder: newColumnOrder
            }).then();
            return;
        }

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];
        const newCardIds = Array.from(start.cards);
        newCardIds.splice(source.index, 1);
        newCardIds.splice(destination.index, 0, draggableId);

        // Same Column but different spot
        if (start === finish) {
            const newColumn = {
                ...start,
                cards: newCardIds
            };

            setColumns({
                ...columns,
                [newColumn.id]: newColumn
            });

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
            ...columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
        };

        setColumns(newState);
        ColumnService.saveCardToColumn(newState).then();
    };

    const updateState = (response) => {
        setColumns(response.data[0].columns);
        setCards(response.data[1].cards);
        setColumnOrder(response.data[2].columnOrder);
        setBoardName(response.data[3]);
    };

    const changeModalState = (isModalConfirmAccountDeletionShowedParam) => {
        setIsModalConfirmAccountDeletionShowed(isModalConfirmAccountDeletionShowedParam);
    };

    const showModalConfirmAccountDeletion = () => {
        changeModalState(true);
    };

    const hideModalConfirmAccountDeletion = () => {
        changeModalState(false);
    };

    const handleResponse = (response) => {
        if (response.status === 200 || response.status === 201) {
            updateState(response);
        }
    };

    const handleError = (error) => {
        if (error.response.status === 401) {
            localStorage.clear(); // Prevent infinite loop
            navigate("/");
        }
    };

    const makeRequest = (methodToCall, data) => {
        methodToCall(data)
            .then((response) => {
                handleResponse(response);
            })
            .catch((error) => {
                handleError(error);
            });
    };

    useEffect(() => {
        makeRequest(ColumnService.getColumnById, key);
    }, []);

    const saveColumn = (columnName) => {
        const data = {
            boardId: key,
            columnName
        };
        makeRequest(ColumnService.saveColumn, data);
    };

    const updateColumn = (columnId, columnName) => {
        const data = {
            boardId: key,
            columnId,
            columnName
        };
        makeRequest(ColumnService.updateColumn, data);
    };

    const deleteColumn = (columnId) => {
        const data = {
            boardId: key,
            columnId
        };
        makeRequest(ColumnService.deleteColumn, data);
    };

    const saveCard = (columnId, cardName) => {
        const data = {
            boardId: key,
            columnId,
            cardName
        };
        makeRequest(CardService.saveCard, data);
    };

    const updateCard = (cardName, cardId) => {
        const data = {
            boardId: key,
            cardId,
            cardName
        };
        makeRequest(CardService.updateCard, data);
    };

    const deleteCard = (cardId) => {
        const data = {
            boardId: key,
            cardId
        };
        makeRequest(CardService.deleteCard, data);
    };

    const deleteAccount = () => {
        UserService.deleteUser({
            username: AuthService.getUsername()
        }).then(() => {
            localStorage.clear(); // Prevent infinite loop
            navigate("/");
        });
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const dashboard = () => {
        navigate("/");
    };

    if (Object.entries(columnOrder).length === 0 && columnOrder.constructor === Object) {
        // eslint-disable-next-line react/jsx-no-useless-fragment, react/jsx-fragments
        return <React.Fragment />;
    }
    return (
        <>
            <NavBar
                boardName={boardName}
                dashboard={dashboard}
                logout={logout}
                deleteAccount={showModalConfirmAccountDeletion}
            />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="column">
                    {(provided) => (
                        <div className={styles.container} {...provided.droppableProps} ref={provided.innerRef}>
                            {columnOrder.map((columnId, index) => {
                                const column = columns[columnId];
                                const mappedCards = column.cards.map((cardId) => cards[cardId]);

                                return (
                                    <Column
                                        key={column.id}
                                        column={column}
                                        cards={mappedCards}
                                        index={index}
                                        updateColumn={updateColumn}
                                        deleteColumn={deleteColumn}
                                        saveCard={saveCard}
                                        updateCard={updateCard}
                                        deleteCard={deleteCard}
                                    />
                                );
                            })}
                            {provided.placeholder}
                            <BtnAdd column saveColumn={saveColumn} saveCard={saveCard} />
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <ConfirmDialog
                open={isModalConfirmAccountDeletionShowed}
                onClose={hideModalConfirmAccountDeletion}
                DialogTitleProp="Account deletion"
                DialogContentProp={`This account, and all of the data associated with it, will be deleted. 
                           This action is irreversible. Are you sure you want to proceed?`}
                onClickConfirm={deleteAccount}
            />
        </>
    );
}

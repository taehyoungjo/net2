import { Droppable, Draggable } from 'react-beautiful-dnd'
import Card from './Card'
import ColumnHeader from './ColumnHeader'
import ColumnFooter from './ColumnFooter'
import emptyState from '../assets/undraw_No_data_re_kwbl.svg'

import './Column.css'

import { CARD, COLUMN, OPTIONS } from '../types'

const Column: React.VFC<{
    column: COLUMN
    cards: Array<CARD>
    index: number
    options: OPTIONS
    showSelection: boolean
    selected: boolean
    setShowSelection: React.Dispatch<React.SetStateAction<boolean>>

    createCardHandler: (columnId: string) => (url: string) => Promise<void>
    removeCardHandler: (cardId: string) => void

    updateColumnHandler: (title: string) => void
    removeColumnHandler: (columnId: string) => Promise<void>

    clipboardHandler: (columnId: string) => void
    openAllCardsHandler: (columnId: string) => void
    collapseHandler: (collapsed: boolean) => void
    selectionHandler: (columnId: string) => void
}> = (props) => {
    const {
        column,
        cards,
        index,
        options,
        showSelection,
        selected,
        setShowSelection,

        createCardHandler,
        removeCardHandler,

        updateColumnHandler,
        removeColumnHandler,

        clipboardHandler,
        openAllCardsHandler,
        collapseHandler,
        selectionHandler,
    } = props

    return (
        <Draggable draggableId={column.id} index={index}>
            {(provided, containerProvided) => (
                <div
                    className={`rounded-lg ${
                        selected ? 'bg-blue-100' : 'bg-none'
                    }`}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <div
                        className={`${
                            containerProvided.isDragging &&
                            'ring-blue-500 ring-opacity-50'
                        } w-80 flex-none m-4 rounded-md shadow-md ring-2 ring-black ring-opacity-5 bg-white`}
                    >
                        <ColumnHeader
                            column={column}
                            removeColumnHandler={removeColumnHandler}
                            clipboardHandler={clipboardHandler}
                            updateColumnHandler={updateColumnHandler}
                            openAllCardsHandler={openAllCardsHandler}
                            collapse={false}
                            showSelection={showSelection}
                            setShowSelection={setShowSelection}
                            selected={selected}
                            selectionHandler={selectionHandler}
                            collapseHandler={collapseHandler}
                            dragHandleProps={provided.dragHandleProps}
                        />

                        <Droppable droppableId={column.id} type="card">
                            {(droppableProvided, snapshot) => (
                                <div
                                    id="scrollDiv"
                                    /* This doesn't actually do anything atm. What design do I want? */
                                    className={`${
                                        snapshot.isDraggingOver && `bg-gray-100`
                                    } p-4 space-y-4 transition max-h-80 overflow-y-auto shadow-inner`}
                                    ref={droppableProvided.innerRef}
                                    {...droppableProvided.droppableProps}
                                >
                                    {cards.length === 0 &&
                                    !snapshot.isDraggingOver ? (
                                        <div>
                                            <img
                                                className="w-12 m-auto"
                                                src={emptyState}
                                                alt="Empty State"
                                            />{' '}
                                        </div>
                                    ) : (
                                        cards.map((c, cardIndex) => (
                                            <Card
                                                key={c.id}
                                                card={c}
                                                index={cardIndex}
                                                removeCardHandler={
                                                    removeCardHandler
                                                }
                                            />
                                        ))
                                    )}
                                    {droppableProvided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <ColumnFooter
                            options={options}
                            createCardHandler={createCardHandler(column.id)}
                        />
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default Column

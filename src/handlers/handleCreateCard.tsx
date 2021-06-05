import { CARD, CARDS, COLUMNS, OPTIONS } from '../types'
import retrieveTitle from './retrieveTitle'
import retrieveCardId from './retrieveCardId'

const handleCreateCard = async (
    columnId: string,
    url: string,
    cards: CARDS,
    columns: COLUMNS,
    options: OPTIONS,
    setCards: (cards: CARDS) => any,
    setColumns: (columns: COLUMNS) => any
) => {
    // Find available card id
    let newCardId = await retrieveCardId(cards)

    // Check if markdown link
    if (options.markdownLinks) {
        // https://davidwells.io/snippets/regex-match-markdown-links
        const regex = /^\[([\w\s\d]+)\]\(((?:\/|https?:\/\/)[\w\d./?=#]+)\)$/
        const match = url.match(regex)

        // Check if URL
        let newCard: { id: string; text: string; url: string }
        if (match) {
            // Update cards
            newCard = {
                id: newCardId,
                text: match[1],
                url: match[2],
            }
            await setCards({
                ...cards,
                [newCard.id]: newCard,
            })
            // Update column
            let newColumn = columns[columnId]
            newColumn.cardIds.push(newCardId)
            await setColumns({
                ...columns,
                [newColumn.id]: newColumn,
            })
            return
        }
    }

    // SELF HOSTING SHOULD SPEED THIS UP (BUT BY HOW MUCH?)
    let res = await retrieveTitle(url)
    let newCard: CARD
    newCard = {
        id: newCardId,
        text: res,
        url: url,
    }
    await setCards({
        ...cards,
        [newCard.id]: newCard,
    })
    // Update column
    let newColumn = columns[columnId]
    newColumn.cardIds.push(newCardId)
    await setColumns({
        ...columns,
        [newColumn.id]: newColumn,
    })
    return
}

export default handleCreateCard

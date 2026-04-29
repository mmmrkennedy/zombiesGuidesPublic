import { useState } from "preact/hooks";

type Words = "default" | "CRAB" | "MOTH" | "WORM" | "YETI";
type BoardIDS = "default" | "board_1" | "board_2" | "board_3" | "board_4";

const boards: string[][] = [
    ["OSTUHJLD", "QPGAFR", "YZKWX", "NI", "ECVB", "M"],
    ["E", "BCDSTVWXZ", "KLMNPQR", "OUY", "FGHJ", "AI"],
    ["AIOUY", "QX", "BCDEFGH", "S", "LMNPRTVW", "JKZ"],
    ["BCDEF", "XYZ", "GHILNO", "M", "JKQU", "APRSTVW"],
];

function find_letterboard(boards: string[][], word: Words, board: BoardIDS): string {
    const board_num: number = Number(board.split("_")[1]) - 1;
    const found_board: string[] = boards[board_num];
    let number_str = "";

    for (let j = 0; j < word.length; j++) {
        for (let i = 0; i < found_board.length; i++) {
            const board_str = found_board[i].toUpperCase();
            const letter = word[j].toUpperCase();

            if (board_str.includes(letter)) {
                number_str += String(found_board[i].length);
                break;
            }
        }
    }

    if (number_str.length !== 4) {
        return "Unable to calculate number, number is not 4 digits";
    } else {
        return "Code: " + number_str;
    }
}

export default function BO6LetterboardSolver({ title }: { title?: string }) {
    const [selectedWord, setSelectedWord] = useState<Words>("default");
    const [boardID, setboardID] = useState<BoardIDS>("default");
    const [result, setResult] = useState<string>("Select a Word and Board to continue...");

    function handleWordChange(e: Event) {
        const word: Words = (e.currentTarget as HTMLSelectElement).value as Words;
        setSelectedWord(word);

        if (word !== "default" && boardID !== "default") {
            setResult(find_letterboard(boards, word, boardID));
        }
    }

    function handleBoardChange(e: Event) {
        const board_ids: BoardIDS = (e.currentTarget as HTMLSelectElement).value as BoardIDS;
        setboardID(board_ids);

        if (board_ids !== "default" && selectedWord !== "default") {
            setResult(find_letterboard(boards, selectedWord, board_ids));
        }
    }

    return (
        <div className="solver-container">
            {title && <h2 className="solver-title">{title}</h2>}
            <form onSubmit={(e) => e.preventDefault()}>
                <p className="solver-instructions">
                    Select the word and board found in-game to calculate the correct code. The code will be
                    calculated automatically once both are entered.
                </p>

                <div className="form-row">
                    <label htmlFor="word">Select your word:</label>
                    <select id="word" className="spacing" value={selectedWord} onChange={handleWordChange}>
                        <option value="default" disabled>
                            Select your word
                        </option>
                        <option value="CRAB">CRAB</option>
                        <option value="MOTH">MOTH</option>
                        <option value="WORM">WORM</option>
                        <option value="YETI">YETI</option>
                    </select>
                </div>

                <div className="form-row">
                    <label htmlFor="board">Select the letter(s) on the bottom left of the Board:</label>
                    <select id="board" className="spacing" value={boardID} onChange={handleBoardChange}>
                        <option value="default" disabled>
                            Select your letter(s)
                        </option>
                        <option value="board_1">NI</option>
                        <option value="board_2">OUY</option>
                        <option value="board_3">S</option>
                        <option value="board_4">M</option>
                    </select>
                </div>

                <div className="solver-output" id="codeOutput" role="status" aria-live="polite">
                    <p>{result}</p>
                </div>
            </form>
        </div>
    );
}


/**
 * @fileOverview A service for interacting with board data.
 *
 * - createBoard - A function that creates a new board.
 */

import { boards, type Board } from '@/lib/boards';

interface CreateBoardInput {
    name: string;
    description?: string;
}

/**
 * Creates a new board and adds it to the list.
 * @param input The details of the board to create.
 * @returns A promise that resolves with the new board object.
 */
export async function createBoard(input: CreateBoardInput): Promise<Board> {
    const newId = `board-${String(boards.length + 1).padStart(3, '0')}`;
    
    const newBoard: Board = {
        id: newId,
        name: input.name,
        description: input.description || '',
        statuses: ['To Do', 'In Progress', 'Done'],
    };

    boards.push(newBoard);
    return newBoard;
}

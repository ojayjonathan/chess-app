import { Attacks } from "./attacks"

const b = [
    'wR', 'bN', 'wB', 'wK', 'wQ', 'wB', 'wN', 'wR',
    'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',
    '-', '-', '-', '-', '-', '-', '-', '-',
    '-', '-', '-', '-', '-', '-', '-', '-',
    '-', '-', '-', '-', '-', '-', '-', '-',
    '-', '-', '-', 'wQ', 'wQ', '-', '-', '-',
    'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',
    'bR', 'bN', 'bB', 'bK', 'bQ', 'bB', 'bN', 'bR'

]
const EMPTY_BOARD = [
    "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "-",
]


//attacks rook xrays
test("rook on square 0 xray attack on 2 trough 1  ",
    () => { expect(Attacks.xrayRookAttacks(0, 2, 1, b)).toBe(true) })
test("rook on square 0 xray attack on 16 trough 8  ",
    () => { expect(Attacks.xrayRookAttacks(0, 16, 8, b)).toBe(true) })
test("rook on square 8 xray attack on 56 trough 48  ",
    () => { expect(Attacks.xrayRookAttacks(8, 56, 48, b)).toBe(true) })
test("rook on square 0 xray attack on 56 trough 48  ",
    () => { expect(Attacks.xrayRookAttacks(0, 56, 48, b)).toBe(false) })
test("rook on square 0 xray attack on 7 trough 6 ",
    () => { expect(Attacks.xrayRookAttacks(0, 7, 6, b)).toBe(false) })
//bishop xrays
test("bishop on square 0 xray on 18 though 9",
    () => { expect(Attacks.xrayBishopAttacks(0, 18, 9, b)).toBe(true) })
test("bishop on square 0 xray on 63 though 9",
    () => { expect(Attacks.xrayBishopAttacks(0, 63, 9, b)).toBe(false) })
test("bishop on square 63 xray on 45 though 54",
    () => { expect(Attacks.xrayBishopAttacks(63, 45, 54, b)).toBe(true) })
test("bishop on square 63 xray on 0 though 9",
    () => { expect(Attacks.xrayBishopAttacks(5, 23, 14, b)).toBe(true) })

test("queen pin",
    () => { expect(Attacks.pinned(11, 'w', b)).toBe(false) })



//pawn move
test("white pawn move from 8",
    () => expect(Attacks.pawnMove(8, 'w', b)).toEqual(expect.arrayContaining([16])))
test("white pawn move from 9",
    () => expect(Attacks.pawnMove(9, 'w', b)).toEqual(expect.arrayContaining([17])))



//attack by
test("attacks on empty board ",
    () => { expect(Attacks.isSquareAttackedBy(1, "w", EMPTY_BOARD)).toBe(false) })
test("attacks on empty board ",
    () => { expect(Attacks.isSquareAttackedBy(1, "b", EMPTY_BOARD)).toBe(false) })
test("attacks on square 8 by white",
    () => { expect(typeof Attacks.isSquareAttackedBy(8, "w", b)).toBe("number") })

test("attacks on square 8 by black",
    () => { expect(typeof Attacks.isSquareAttackedBy(8, "b", b)).toBe("boolean") })

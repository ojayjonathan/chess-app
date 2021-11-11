export class Attacks {
    checks = {
        attackers: []
    };
    attacks;
    static knight(pieceSq) {
        const attacks = []
        const file = pieceSq % 8
        const rank = parseInt(pieceSq / 8)
        //up
        attacks.push([file + 1, rank + 2])
        attacks.push([file - 1, rank + 2])
        //down
        attacks.push([file + 1, rank - 2])
        attacks.push([file - 1, rank - 2])
        //right
        attacks.push([file + 2, rank + 1])
        attacks.push([file + 2, rank - 1])
        //left
        attacks.push([file - 2, rank + 1])
        attacks.push([file - 2, rank - 1])
        return attacks.filter(e => e[0] >= 0 && e[0] < 8 && e[1] >= 0 && e[1] < 8).map(e => e[0] + e[1] * 8)
    }
    static king(pieceSq) {
        const file = pieceSq % 8
        const rank = parseInt(pieceSq / 8)
        const coords = []
        coords.push([file, rank + 1])
        coords.push([file, rank - 1])
        coords.push([file - 1, rank])
        coords.push([file + 1, rank])
        coords.push([file + 1, rank + 1])
        coords.push([file - 1, rank + 1])
        coords.push([file - 1, rank - 1])
        coords.push([file + 1, rank - 1])
        return coords.filter(e => e[0] >= 0 && e[0] < 8 && e[1] >= 0 && e[1] < 8).map(e => e[0] + e[1] * 8)

    }
    static rook(pieceSq, board_state) {
        const attacks = []
        const rank = parseInt(pieceSq / 8)
        const file = pieceSq % 8
        /**
         * calculate rook attacks along rank and file
         * check empty square for piece piece movement
         */
        for (let i = file + 1; i < 8; ++i) {
            if (board_state[i + rank * 8]==="-") {
                attacks.push(i + rank * 8);
            }
            else {
                attacks.push(i + rank * 8);
                break;
            }
        }
        for (let i = file - 1; i >= 0; --i) {
            if (board_state[i + rank * 8]==="-") {
                attacks.push(i + rank * 8);
            }
            else {
                attacks.push(i + rank * 8);
                break;
            }
        }
        for (let i = rank + 1; i < 8; ++i) {
            if (board_state[file + i * 8]==="-") {
                attacks.push(file + i * 8);
            }
            else {
                attacks.push(file + i * 8);
                break;
            }
        }
        for (let i = rank - 1; i >= 0; --i) {
            if (board_state[file + i * 8]==="-") {
                attacks.push(file + i * 8);
            }
            else {
                attacks.push(file + i * 8);
                break;
            }
        }
        return attacks
    }
    static bishop(pieceSq, board_state) {
        const attacks = []
        const rank = parseInt(pieceSq / 8)
        const file = pieceSq % 8
        for (let i = file + 1, j = rank + 1; j < 8 && i < 8; ++i, j++) {
            if (board_state[i + j * 8]==="-") {
                attacks.push(i + j * 8);
            }
            else {
                attacks.push(i + j * 8);
                break;
            }

        }
        for (let i = file - 1, j = rank - 1; j >= 0 && i >= 0; --i, j--) {
            if (board_state[i + j * 8]==="-") {
                attacks.push(i + j * 8);
            }
            else {
                attacks.push(i + j * 8);
                break;
            }

        }
        for (let i = file - 1, j = rank + 1; j < 8 && i >= 0; --i, j++) {
            if (board_state[i + j * 8]==="-") {
                attacks.push(i + j * 8);
            }
            else {
                attacks.push(i + j * 8);
                break;
            }
        }
        for (let i = file + 1, j = rank - 1; j >= 0 && i < 8; ++i, j--) {
            if (board_state[i + j * 8]==="-") {
                attacks.push(i + j * 8);
            }
            else {
                attacks.push(i + j * 8);
                break;
            }
        }
        return attacks
    }
    static queen(pieceSq, board_state) {
        return this.rook(pieceSq, board_state).concat(this.bishop(pieceSq, board_state))
    }
    static pawnMove(pieceSq, color, board_state) {
        const rank = parseInt(pieceSq / 8);
        const file = pieceSq % 8;
        const a = color === "w" ? 1 : -1;
        let moves = [[(rank + a), file], [(rank + a), file]]
        moves = moves.filter(e => e[0] < 8 && e[1] < 8 && e[1] >= 0 && e[1] >= 0 && board_state[e[0] * 8 + e[1]] === "-").map(e => e[0] * 8 + e[1])
        const attacks = this.pawn(pieceSq, color)
        for (let i = 0; i < attacks.length; ++i) {
            if (board_state[attacks[i]] !== "-" && board_state[attacks[i]][0] !== color) {
                moves.push(attacks[i])
            }
        }
        if (color === "w" && rank === 1) {
            moves.push((rank + 2) * 8 + file)
        }
        else if (color === 'b' && rank === 6) {
            moves.push((rank - 2) * 8 + file)
        }

        return moves
    }
    static pawn(pieceSq, color) {
        const rank = parseInt(pieceSq / 8);
        const file = pieceSq % 8;
        const a = color === "w" ? 1 : -1;
        const attacks = [[(rank + a), file + 1], [(rank + a), file - 1]]
        return attacks.filter(e => e[0] < 8 && e[1] < 8 && e[0] >= 0 && e[1] >= 0).map(e => e[0] * 8 + e[1])
    }
    static legalKingMove(pieceSq, color, board_state) {
        return this.king(pieceSq).filter(s => !Attacks.isSquareAttackedBy(s, color, board_state))
    }
    /**
     * calculate xray attacks an pins  
     */
    static xrayAttacks() {


    }
    //rook pins
    static xrayRookAttacks(rookSq, occSq, blockerSq, board_state) {
        const rookFile = rookSq % 8
        const rookRank = Math.floor(rookSq / 8)
        const occFile = occSq % 8
        const occRank = Math.floor(occSq / 8)
        const blockerSqFile = blockerSq % 8
        const blockerSqRank = Math.floor(blockerSq / 8)
        // check if the 3 pieces are in same file
        if (rookFile === occFile && rookFile === blockerSqFile) {
            if (Math.max(rookRank, occRank) > blockerSqRank && Math.min(rookRank, occRank) < blockerSqRank) {
                for (let i = Math.min(rookRank, occRank) + 1; i < Math.max(rookRank, occRank); ++i) {
                    if (i === blockerSqRank) { }
                    else if (board_state[i * 8 + rookFile] !== "-") {
                        return []
                    }

                }
                return []
            }
        }
        let xray = []
        //check if pieces are in same rank
        if (rookRank === occRank && rookRank === blockerSqRank) {
            if (Math.max(rookFile, occFile) > blockerSqFile && Math.min(rookFile, occFile) < blockerSqFile) {
                for (let i = Math.min(rookFile, occFile) + 1; i < Math.max(rookFile, occFile); ++i) {
                    if (i === blockerSqFile) { }
                    else if (board_state[rookRank * 8 + i] !== "-") {
                        return []
                    }
                    xray.push(rookRank * 8 + i)
                }
                return xray
            }
        }
        return []
    }
    static xrayBishopAttacks(bishopSq, occSq, blockerSq, board_state) {
        const bFile = bishopSq % 8
        const bRank = Math.floor(bishopSq / 8)
        const cFile = occSq % 8
        const cRank = Math.floor(occSq / 8)
        const aFile = blockerSq % 8
        const aRank = Math.floor(blockerSq / 8)
        //check if the pieces are in same diagonal
        let xray = []
        if ((bFile - bRank === aFile - aRank || bFile + bRank === aFile + aRank) &&
            (bFile - bRank === cFile - cRank || bFile + bRank === cFile + cRank) &&
            (cFile - cRank === aFile - aRank || cFile + cRank === aFile + aRank)) {
            const min = Math.min(bishopSq, occSq)
            const max = Math.max(bishopSq, occSq)
            if (max > blockerSq && min < blockerSq) {
                let minRank = Math.floor(min / 8)
                let minFile = min % 8
                let maxRank = Math.floor(max / 8)
                let maxFile = max % 8
                let xinc = minRank < maxRank ? 1 : -1
                let yinc = minFile < maxFile ? 1 : -1
                const incr = xinc * yinc === 1 ? 9 : 7
                for (let i = min; i <= max; i += incr) {
                    if (i === blockerSq || i === occSq || i === bishopSq) { }
                    else if (board_state[i] !== "-") {
                        return []
                    }
                    xray.push(i)
                }
                return xray
            }
        }
        return []
    }
    //check if a piece is pinned by opponent
    static pinned(pieceSq, color, board_state) {
        const kingSq = board_state.indexOf(`${color}K`)
        let xray;
        for (let i = 0; i < 64; i++) {
            if (board_state[i][0] !== color && board_state[i][0] !== "-") {
                if (board_state[i][1] === "Q") {
                    xray = this.xrayBishopAttacks(i, kingSq, pieceSq, board_state).concat(this.xrayRookAttacks(i, kingSq, pieceSq, board_state))
                    if (xray.length > 0) {
                        return xray
                    }
                }
                if (board_state[i][1] === "B") {
                    xray = this.xrayBishopAttacks(i, kingSq, pieceSq, board_state)
                    if (xray.length > 0) {
                        return xray
                    }
                }
                if (board_state[i][1] === "R") {
                    xray = this.xrayRookAttacks(i, kingSq, pieceSq, board_state)
                    if (xray.length > 0) {
                        return xray
                    }
                }
            }
        }
        return false
    }
    static isSquareAttackedBy(pieceSq, color, board_state) {
        let attacks = []
        const attackers = new Set()
        for (let i = 0; i < board_state.length; ++i) {
            if (board_state[i][0] === color) {
                switch (board_state[i][1]) {
                    case "P":
                        attacks = this.pawn(i, board_state[i][0])
                        if (attacks.includes(pieceSq)) {
                            attackers.add(i)
                            return attackers
                        }
                        break;
                    case "N":
                        attacks = this.knight(i)
                        if (attacks.includes(pieceSq)) {
                            attackers.add(i)
                        }
                        break;
                    case "K":
                        attacks = this.king(i)
                        if (attacks.includes(pieceSq)) {
                            attackers.add(i)
                        }
                        break;
                    case "Q":
                        attacks = this.queen(i, board_state)
                        if (attacks.includes(pieceSq)) {
                            attackers.add(i)
                        }
                        break;
                    case "R":
                        attacks = this.rook(i, board_state)
                        if (attacks.includes(pieceSq)) {
                            attackers.add(i)
                        }
                        break;
                    case "B":
                        attacks = this.bishop(i, board_state)
                        if (attacks.includes(pieceSq)) {
                            attackers.add(i)
                        }
                        break;
                }
            }
        }
        return attackers
    }
    static xrayBishopSquares(bishopSq, occSq) {
        const bFile = bishopSq % 8
        const bRank = Math.floor(bishopSq / 8)
        const cFile = occSq % 8
        const cRank = Math.floor(occSq / 8)
        let xray = []
        const min = Math.min(bishopSq, occSq)
        const max = Math.max(bishopSq, occSq)
        let minRank = Math.floor(min / 8)
        let minFile = min % 8
        let maxRank = Math.floor(max / 8)
        let maxFile = max % 8
        let xinc = minRank < maxRank ? 1 : -1
        let yinc = minFile < maxFile ? 1 : -1
        const incr = xinc * yinc === 1 ? 9 : 7
        //return all diagonal  squares for a bishop 
        for (let i = min; i <= max; i += incr) {
            xray.push(i)
        }
        return xray
    }
    static attackedSquares(pieceSq, occSq, board_state) {
        switch (board_state[pieceSq][1]) {
            case 'Q':
                return this.xrayBishopSquares(pieceSq, occSq)
            case 'B':
                return this.xrayBishopSquares(pieceSq, occSq)
            case "R":
                return []
        }

    }
}




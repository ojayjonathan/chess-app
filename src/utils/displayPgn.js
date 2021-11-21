export const pieceToUnicode = (p) => {
  if (!p) return "";
  if (!typeof p === "string") return "";
  // ♔♕♖♗♘♙ ♚♛♜♝♞♟
  p = p.replace(/\d+\./g, "<span class='text_muted'>$&</span>");
  return p
    .replace(/N/g, "♞")
    .replace(/Q/g, "♛")
    .replace(/B/g, "♝")
    .replace(/R/g, "♜")
    .replace(/K/g, "♚");
};

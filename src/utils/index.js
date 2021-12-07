

export const squareToIndex = (square) => {
  const file = square.substr(0, 1).charCodeAt(0) - 97;
  const rank = square.substr(1, 1) - 1;
  return 8 * rank + file;
};

export const drawArrow = (parent, p1, p2, sqSize) => {
  let x1 = p1.x,
    x2 = p2.x,
    y1 = p1.y,
    y2 = p2.y;
  if (x1 === x2) {
    x1 += sqSize / 2;
    x2 += sqSize / 2;
    y1 += sqSize / 2;
    y2 += y1 > y2 ? sqSize : 0;
  } else {
    x1 += sqSize / 2;
    x2 += x1 > x2 ? sqSize : 0;
    y1 += sqSize / 2;
    y2 += sqSize / 2;
  }
  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("id", "line2");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "#e8353566 ");
  line.setAttribute("marker-end", "url(#arrowhead)");
  line.setAttribute("stroke-width", "10");
  line.setAttribute("stroke-linecap", "round");
  parent.appendChild(line);
};

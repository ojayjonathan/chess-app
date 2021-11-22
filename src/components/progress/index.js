import "./index.css";

export const Progress = (props) => {
  let { radius, stroke, progress, showPercentage, outlineColor } = props;
  progress = Math.round(progress);
  let normalizedRadius = radius - stroke * 2;
  let circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const color =
    outlineColor ||
    (progress < 50 ? "#e83535" : progress > 90 ? "#1ec65b" : "#f99927");
  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        className="progress-ring__circle"
        stroke={color}
        fill="transparent"
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="rgba(255,255,255,.3)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      {showPercentage && (
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
          {progress}%
        </text>
      )}
    </svg>
  );
};

export const TextIndicator = (props) => {
  let { radius, stroke, text, outlineColor } = props;
  let normalizedRadius = radius - stroke * 2;
  const color = outlineColor || "rgba(255,255,255,.3)";
  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
        {text}
      </text>
    </svg>
  );
};

export const ProgressBar = ({ width, height, progress, outlineColor }) => {
  const color =
    outlineColor || (progress < 50 ? "var(--text-denger)" : "#1ec65b");
  return (
    <svg height={height} width={width}>
      <line
        strokeLinecap="round"
        x1={height / 2}
        y1={height / 2}
        y2={height / 2}
        stroke={color}
        strokeWidth={height}
        x2={Math.max((progress / 100) * width - height / 2,height/2)}
      ></line>
      <line
        strokeLinecap="round"
        x1={height / 2}
        y1={height / 2}
        y2={height / 2}
        stroke={"rgba(255,255,255,.3)"}
        strokeWidth={height}
        x2={width - height / 2}
      ></line>
      <text
        className="w-text"
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {Math.floor(progress)}%
      </text>
    </svg>
  );
};

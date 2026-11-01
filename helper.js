// Splits "a, b(1,2), c" on the commas that are not inside brackets.
const splitTopLevel = (str) => {
  const parts = [];
  let depth = 0,
    current = "";
  for (const ch of str) {
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim() !== "") parts.push(current.trim());
  return parts;
};

// "red 10%" -> { color: "red", position: 10 }; "rgba(0, 0, 0, .5)" -> position null
const parseColorStop = (stop) => {
  const m = stop.match(/^(.*?)\s+(-?\d+(?:\.\d+)?)%\s*$/);
  return m
    ? { color: m[1].trim(), position: parseFloat(m[2]) }
    : { color: stop.trim(), position: null };
};

// Parses the gradient color string. Never throws: an empty or unreadable value
// gives the same defaults the control starts with.
export const parseGradientColor = (gradientColor) => {
  const result = {
    gradientType: "linear",
    angle: 45,
    colorOne: "#0000",
    colorTwo: "#0000",
    colorOnePosition: 0,
    colorTwoPosition: 100,
    radialShape: "ellipse",
    radialX: 50,
    radialY: 50,
  };

  const m =
    typeof gradientColor === "string" &&
    gradientColor.trim().match(/^(linear|radial)-gradient\((.*)\)$/is);
  if (!m) return result;

  result.gradientType = m[1].toLowerCase();
  const args = splitTopLevel(m[2]);
  let first = args[0] || "";

  // The first argument is the angle / shape; if it is already a colour stop, there is none.
  const looksLikeSetup =
    result.gradientType === "linear"
      ? /^(-?[\d.]+(deg|turn|rad|grad)|to\s)/i.test(first)
      : /^(circle|ellipse|closest|farthest|at\s|\d)/i.test(first);

  if (looksLikeSetup) {
    args.shift();
    if (result.gradientType === "linear") {
      const a = first.match(/(-?[\d.]+)deg/i);
      if (a) result.angle = Math.round(parseFloat(a[1]));
    } else {
      const shape = first.match(/\b(circle|ellipse)\b/i);
      if (shape) result.radialShape = shape[1].toLowerCase();
      const at = first.match(/at\s+(-?[\d.]+)%\s+(-?[\d.]+)%/i);
      if (at) {
        result.radialX = Math.round(parseFloat(at[1]));
        result.radialY = Math.round(parseFloat(at[2]));
      }
    }
  }

  const [one, two] = args.map(parseColorStop);
  if (one) {
    result.colorOne = one.color;
    if (one.position !== null) result.colorOnePosition = Math.round(one.position);
  }
  if (two) {
    result.colorTwo = two.color;
    if (two.position !== null) result.colorTwoPosition = Math.round(two.position);
  }
  return result;
};

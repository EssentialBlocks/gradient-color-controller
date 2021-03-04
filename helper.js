// Parses the gradient color string
export const parseGradientColor = (gradientColor) => {
	let angle = 45,
		colorOnePosition = 0,
		colorTwoPosition = 100,
		radialShape = "ellipse",
		radialX = 50,
		radialY = 50;

	const [colorOne, colorTwo] = gradientColor.match(
		/\#[a-f\d]{6}|rgba?\([\d\,\.]{3,16}\)/gi
	);

	const [gradientType] = gradientColor.match(/\w{6}(?=-)/i);

	if (gradientType == "linear") {
		angle = gradientColor.match(/\d{1,3}(?=deg)/i)[0];
		[colorOnePosition, colorTwoPosition] = gradientColor.match(
			/\d{1,3}(?=\%)/gi
		) || [0, 100];
	} else {
		radialShape = gradientColor.match(/\w+(?= at)/i)[0];
		radialX = gradientColor.match(/(?<=at )\d{1,3}/i)[0];
		radialY = gradientColor.match(/(?<=% )\d{1,3}/i)[0];
		colorOnePosition = gradientColor.match(/\d{1,3}(?=% ,)/gi)[0];
		colorTwoPosition = gradientColor.match(/\d{1,3}(?=%\))/gi)[0];
	}

	return {
		gradientType,
		angle: parseInt(angle),
		colorOne,
		colorTwo,
		colorOnePosition: parseInt(colorOnePosition),
		colorTwoPosition: parseInt(colorTwoPosition),
		radialShape,
		radialX: parseInt(radialX),
		radialY: parseInt(radialY),
	};
};

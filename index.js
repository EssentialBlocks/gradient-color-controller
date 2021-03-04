/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RangeControl, BaseControl } = wp.components;

/**
 * Internal dependencies
 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ColorControl from "../color-control";
import ToggleButton from "../toggle-button";
import { GRADIENT_TYPE, RADIAL_TYPES, FOCUS_COLOR } from "./constants";
import { parseGradientColor } from "./helper";

const GradientColorControl = ({ gradientColor, onChange }) => {
	const [gradientType, setGradientType] = useState("linear");
	const [colorOne, setColorOne] = useState("transparent");
	const [colorOnePosition, setColorOnePosition] = useState(0);
	const [colorTwo, setColorTwo] = useState("transparent");
	const [colorTwoPosition, setColorTwoPosition] = useState(100);
	const [angle, setAngle] = useState(0);
	const [radialShape, setRadialShape] = useState("ellipse");
	const [radialX, setRadialX] = useState(50);
	const [radialY, setRadialY] = useState(50);

	useEffect(() => {
		let {
			gradientType,
			angle,
			colorOne,
			colorTwo,
			colorOnePosition,
			colorTwoPosition,
			radialShape,
			radialX,
			radialY,
		} = parseGradientColor(gradientColor);

		setGradientType(gradientType);
		setAngle(angle);
		setColorOne(colorOne);
		setColorTwo(colorTwo);
		setColorOnePosition(colorOnePosition);
		setColorTwoPosition(colorTwoPosition);
		setRadialShape(radialShape);
		setRadialX(radialX);
		setRadialY(radialY);
	}, []);

	useEffect(() => {
		onChange(
			gradientType === "linear" ? getLinearGradient() : getRadialGradient()
		);
	}, [
		gradientType,
		colorOne,
		colorOnePosition,
		colorTwo,
		colorTwoPosition,
		angle,
		radialShape,
		radialX,
		radialY,
	]);

	const getColorString = () =>
		`${colorOne} ${colorOnePosition}% , ${colorTwo} ${colorTwoPosition}%`;

	const getRadialGradient = () =>
		`radial-gradient(${radialShape} at ${radialX}% ${radialY}%, ${getColorString()})`;

	const getLinearGradient = () =>
		`linear-gradient(${angle}deg, ${getColorString()})`;

	return (
		<div className="eb-gradient-control">
			<BaseControl
				label={__("Gradient Type")}
				className="eb-gradient-toggle-label"
			>
				<ToggleButton
					defaultSelected={
						gradientType === "ellipse" ? GRADIENT_TYPE[0] : GRADIENT_TYPE[1]
					}
					options={GRADIENT_TYPE}
					onChange={(gradientType) => setGradientType(gradientType)}
					focusColor={FOCUS_COLOR}
				/>
			</BaseControl>

			{gradientType === "radial" && (
				<BaseControl
					label={__("Radial Type")}
					className="eb-gradient-toggle-label"
				>
					<ToggleButton
						defaultSelected={
							radialShape === "linear" ? RADIAL_TYPES[0] : RADIAL_TYPES[1]
						}
						options={RADIAL_TYPES}
						onChange={(radialShape) => setRadialShape(radialShape)}
						focusColor={FOCUS_COLOR}
					/>
				</BaseControl>
			)}

			<ColorControl
				label={__("First Color")}
				color={colorOne}
				onChange={(colorOne) => setColorOne(colorOne)}
			/>

			<ColorControl
				label={__("Second Color")}
				color={colorTwo}
				onChange={(colorTwo) => setColorTwo(colorTwo)}
			/>

			<RangeControl
				label={__("First Color Position")}
				value={colorOnePosition}
				onChange={(colorOnePosition) => setColorOnePosition(colorOnePosition)}
				min={0}
				max={100}
			/>

			<RangeControl
				label={__("Second Color Position")}
				value={colorTwoPosition}
				onChange={(colorTwoPosition) => setColorTwoPosition(colorTwoPosition)}
				min={0}
				max={100}
			/>

			{gradientType === "linear" && (
				<RangeControl
					label={__("Angle")}
					value={angle}
					onChange={(angle) => setAngle(angle)}
					min={0}
					max={360}
				/>
			)}

			{gradientType === "radial" && (
				<>
					<RangeControl
						label={__("Center X Position")}
						value={radialX}
						onChange={(radialX) => setRadialX(radialX)}
						min={0}
						max={100}
					/>

					<RangeControl
						label={__("Center Y Position")}
						value={radialY}
						onChange={(radialY) => setRadialY(radialY)}
						min={0}
						max={100}
					/>
				</>
			)}
		</div>
	);
};

GradientColorControl.propTypes = {
	gradientColor: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default GradientColorControl;

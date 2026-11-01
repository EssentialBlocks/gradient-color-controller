/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RangeControl, BaseControl } = wp.components;

/**
 * Internal dependencies
 */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ColorControl from "../color-control";
import ToggleButton from "../toggle-button";
import { GRADIENT_TYPE, RADIAL_TYPES } from "./constants";
import { parseGradientColor } from "./helper";

const GradientColorControl = ({ gradientColor, onChange }) => {
  // Start from the saved value. (They used to start as "transparent" and be filled
  // in by an effect, while a second effect already called onChange with the
  // transparent defaults, so just opening the control could overwrite the saved gradient.)
  const initial = parseGradientColor(gradientColor);
  const [gradientType, setGradientType] = useState(initial.gradientType);
  const [colorOne, setColorOne] = useState(initial.colorOne);
  const [colorOnePosition, setColorOnePosition] = useState(initial.colorOnePosition);
  const [colorTwo, setColorTwo] = useState(initial.colorTwo);
  const [colorTwoPosition, setColorTwoPosition] = useState(initial.colorTwoPosition);
  const [angle, setAngle] = useState(initial.angle);
  const [radialShape, setRadialShape] = useState(initial.radialShape);
  const [radialX, setRadialX] = useState(initial.radialX);
  const [radialY, setRadialY] = useState(initial.radialY);

  // Report changes made by the user, not the values the control started with.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
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
            gradientType === "linear" ? GRADIENT_TYPE[0] : GRADIENT_TYPE[1]
          }
          options={GRADIENT_TYPE}
          onChange={(gradientType) => setGradientType(gradientType)}
        />
      </BaseControl>

      {gradientType === "radial" && (
        <BaseControl
          label={__("Radial Type")}
          className="eb-gradient-toggle-label"
        >
          <ToggleButton
            defaultSelected={
              radialShape === "ellipse" ? RADIAL_TYPES[0] : RADIAL_TYPES[1]
            }
            options={RADIAL_TYPES}
            onChange={(radialShape) => setRadialShape(radialShape)}
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

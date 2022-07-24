import { high, low } from "./formatters";
import { isUpperCase } from "./utils";
import tinycolor from "tinycolor2";

export const gradientParser = (input: string = "") => {
  var tokens = {
    linearGradient: /^(\-(webkit|o|ms|moz)\-)?(linear\-gradient)/i,
    repeatingLinearGradient:
      /^(\-(webkit|o|ms|moz)\-)?(repeating\-linear\-gradient)/i,
    radialGradient: /^(\-(webkit|o|ms|moz)\-)?(radial\-gradient)/i,
    repeatingRadialGradient:
      /^(\-(webkit|o|ms|moz)\-)?(repeating\-radial\-gradient)/i,
    sideOrCorner:
      /^to (left (top|bottom)|right (top|bottom)|top (left|right)|bottom (left|right)|left|right|top|bottom)/i,
    extentKeywords:
      /^(closest\-side|closest\-corner|farthest\-side|farthest\-corner|contain|cover)/,
    positionKeywords: /^(left|center|right|top|bottom)/i,
    pixelValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))px/,
    percentageValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))\%/,
    emValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))em/,
    angleValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))deg/,
    startCall: /^\(/,
    endCall: /^\)/,
    comma: /^,/,
    hexColor: /^\#([0-9a-fA-F]+)/,
    literalColor: /^([a-zA-Z]+)/,
    rgbColor: /^rgb/i,
    rgbaColor: /^rgba/i,
    hslColor: /^hsl/i,
    hsvColor: /^hsv/i,
    number: /^(([0-9]*\.[0-9]+)|([0-9]+\.?))/,
  };

  function error(msg: string) {
    var err = new Error(input + ": " + msg);
    // err.source = input;
    throw err;
  }

  function getAST() {
    var ast = matchListDefinitions();

    if (input.length > 0) {
      error("Invalid input not EOF");
    }

    const ast0 = ast[0];
    // @ts-ignore
    const checkSelected = ast0?.colorStops?.filter((c) =>
      isUpperCase(c.value)
    ).length;

    const getGradientObj = () => {
      if (checkSelected > 0) {
        return ast0;
      } else {
        // @ts-ignore
        let val = (c, i) => (i === 0 ? high(c) : low(c));
        return {
          ...ast0,
          // @ts-ignore
          colorStops: ast0.colorStops.map((c, i) => ({
            ...c,
            value: val(c, i),
          })),
        };
      }
    };

    return getGradientObj();
  }

  function matchListDefinitions() {
    return matchListing(matchDefinition);
  }

  function matchDefinition() {
    return (
      matchGradient(
        "linear-gradient",
        tokens.linearGradient,
        matchLinearOrientation
      ) ||
      matchGradient(
        "repeating-linear-gradient",
        tokens.repeatingLinearGradient,
        matchLinearOrientation
      ) ||
      matchGradient(
        "radial-gradient",
        tokens.radialGradient,
        matchListRadialOrientations
      ) ||
      matchGradient(
        "repeating-radial-gradient",
        tokens.repeatingRadialGradient,
        matchListRadialOrientations
      )
    );
  }

  // @ts-ignore
  function matchGradient(gradientType, pattern, orientationMatcher) {
    // @ts-ignore
    return matchCall(pattern, function (captures) {
      var orientation = orientationMatcher();
      if (orientation) {
        if (!scan(tokens.comma)) {
          error("Missing comma before color stops");
        }
      }

      return {
        type: gradientType,
        orientation: orientation,
        colorStops: matchListing(matchColorStop),
      };
    });
  }

  // @ts-ignore
  function matchCall(pattern, callback) {
    var captures = scan(pattern);

    if (captures) {
      if (!scan(tokens.startCall)) {
        error("Missing (");
      }

      var result = callback(captures);

      if (!scan(tokens.endCall)) {
        error("Missing )");
      }

      return result;
    }
  }

  function matchLinearOrientation() {
    return matchSideOrCorner() || matchAngle();
  }

  function matchSideOrCorner() {
    return match("directional", tokens.sideOrCorner, 1);
  }

  function matchAngle() {
    return match("angular", tokens.angleValue, 1);
  }

  function matchListRadialOrientations() {
    var radialOrientations,
      radialOrientation = matchRadialOrientation(),
      lookaheadCache;

    if (radialOrientation) {
      radialOrientations = [];
      radialOrientations.push(radialOrientation);

      lookaheadCache = input;
      if (scan(tokens.comma)) {
        radialOrientation = matchRadialOrientation();
        if (radialOrientation) {
          radialOrientations.push(radialOrientation);
        } else {
          input = lookaheadCache;
        }
      }
    }

    return radialOrientations;
  }

  function matchRadialOrientation() {
    var radialType = matchCircle() || matchEllipse();

    if (radialType) {
      // @ts-ignore
      radialType.at = matchAtPosition();
    } else {
      var extent = matchExtentKeyword();
      if (extent) {
        radialType = extent;
        var positionAt = matchAtPosition();
        if (positionAt) {
          // @ts-ignore
          radialType.at = positionAt;
        }
      } else {
        var defaultPosition = matchPositioning();
        if (defaultPosition) {
          radialType = {
            type: "default-radial",
            // @ts-ignore
            at: defaultPosition,
          };
        }
      }
    }

    return radialType;
  }

  function matchCircle() {
    var circle = match("shape", /^(circle)/i, 0);

    if (circle) {
      // @ts-ignore
      circle.style = matchLength() || matchExtentKeyword();
    }

    return circle;
  }

  function matchEllipse() {
    var ellipse = match("shape", /^(ellipse)/i, 0);

    if (ellipse) {
      // @ts-ignore
      ellipse.style = matchDistance() || matchExtentKeyword();
    }

    return ellipse;
  }

  function matchExtentKeyword() {
    return match("extent-keyword", tokens.extentKeywords, 1);
  }

  function matchAtPosition() {
    if (match("position", /^at/, 0)) {
      var positioning = matchPositioning();

      if (!positioning) {
        error("Missing positioning value");
      }

      return positioning;
    }
  }

  function matchPositioning() {
    var location = matchCoordinates();

    if (location.x || location.y) {
      return {
        type: "position",
        value: location,
      };
    }
  }

  function matchCoordinates() {
    return {
      x: matchDistance(),
      y: matchDistance(),
    };
  }

  // @ts-ignore
  function matchListing(matcher) {
    var captures = matcher(),
      result = [];

    if (captures) {
      result.push(captures);
      while (scan(tokens.comma)) {
        captures = matcher();
        if (captures) {
          result.push(captures);
        } else {
          error("One extra comma");
        }
      }
    }

    return result;
  }

  function matchColorStop() {
    var color = matchColor();

    if (!color) {
      error("Expected color definition");
    }

    color.left = parseInt(matchDistance()?.value as string);
    return color;
  }

  function matchColor() {
    return (
      matchHexColor() ||
      matchHSLColor() ||
      matchRGBAColor() ||
      matchRGBColor() ||
      matchLiteralColor() ||
      matchHSVColor()
    );
  }

  function matchLiteralColor() {
    return match("literal", tokens.literalColor, 0);
  }

  function matchHexColor() {
    return match("hex", tokens.hexColor, 1);
  }

  const convertHsl = (val: string) => {
    let capIt = isUpperCase(val?.[0]);
    let hsl = matchListing(matchNumber);
    let { r, g, b, a } = tinycolor({
      h: hsl[0],
      s: hsl[1],
      l: hsl[2],
      a: hsl[3] || 1,
    }).toRgb();
    return {
      value: `${capIt ? "RGBA" : "rgba"}(${r}, ${g}, ${b}, ${a})`,
    };
  };

  function matchHSLColor() {
    return matchCall(tokens.hslColor, convertHsl);
  }

  const convertHsv = (val: string) => {
    let capIt = isUpperCase(val?.[0]);
    let hsv = matchListing(matchNumber);
    let { r, g, b, a } = tinycolor({
      h: hsv[0],
      s: hsv[1],
      v: hsv[2],
      a: hsv[3] || 1,
    }).toRgb();
    return {
      value: `${capIt ? "RGBA" : "rgba"}(${r}, ${g}, ${b}, ${a})`,
    };
  };

  function matchHSVColor() {
    return matchCall(tokens.hsvColor, convertHsv);
  }

  const convertRgb = (val: string) => {
    let capIt = isUpperCase(val?.[0]);
    let rgb = matchListing(matchNumber);
    return {
      value: `${capIt ? "RGBA" : "rgba"}(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`,
    };
  };

  function matchRGBColor() {
    return matchCall(tokens.rgbColor, convertRgb);
  }

  const checkCaps = (val: string) => {
    let capIt = isUpperCase(val?.[0]);
    return {
      value: `${capIt ? "RGBA" : "rgba"}(${matchListing(matchNumber)})`,
    };
  };

  function matchRGBAColor() {
    return matchCall(tokens.rgbaColor, checkCaps);
  }

  function matchNumber() {
    // @ts-ignore
    return scan(tokens.number)[1];
  }

  function matchDistance() {
    return (
      match("%", tokens.percentageValue, 1) ||
      matchPositionKeyword() ||
      matchLength()
    );
  }

  function matchPositionKeyword() {
    return match("position-keyword", tokens.positionKeywords, 1);
  }

  function matchLength() {
    return match("px", tokens.pixelValue, 1) || match("em", tokens.emValue, 1);
  }

  function match(type: string, pattern: RegExp, captureIndex: number) {
    var captures = scan(pattern);
    if (captures) {
      return {
        type: type,
        value: captures[captureIndex],
      };
    }
  }

  function scan(regexp: RegExp): RegExpExecArray | null {
    var captures, blankCaptures;

    blankCaptures = /^[\n\r\t\s]+/.exec(input);
    if (blankCaptures) {
      consume(blankCaptures[0].length);
    }

    captures = regexp.exec(input);
    if (captures) {
      consume(captures[0].length);
    }

    return captures;
  }

  function consume(size: number): void {
    input = input.substr(size);
  }

  return getAST();
};

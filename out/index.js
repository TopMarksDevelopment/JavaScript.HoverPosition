"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionCollision = exports.HoverPosition = void 0;
class HoverPosition {
    constructor(options) {
        const originalDisplay = options.hoverBox.style.display;
        options.hoverBox.style.display = "none";
        this._bodyDims = {
            height: document.body.offsetHeight,
            width: document.body.offsetWidth,
            top: 0,
            left: 0,
        };
        this._anchorDims = {
            height: options.anchor.offsetHeight,
            width: options.anchor.offsetWidth,
            top: options.anchor.offsetTop,
            left: options.anchor.offsetLeft,
        };
        options.hoverBox.style.display = "block";
        this._hoverBoxDims = {
            height: options.hoverBox.offsetHeight,
            width: options.hoverBox.offsetWidth,
            top: 0,
            left: 0,
        };
        options.hoverBox.style.display = originalDisplay;
        const myPos = HoverPosition.parse(options.my, options.defaults
            ? HoverPosition.parse(options.defaults.my)
            : { vertical: "top", horizontal: "center" }, true), atPos = HoverPosition.parse(options.at, options.defaults
            ? HoverPosition.parse(options.defaults.at)
            : { vertical: "bottom", horizontal: "center" }, true);
        if (options.collision === PositionCollision.ignore ||
            (options.collision === PositionCollision.flipfit &&
                myPos === "center center" &&
                atPos === "center center")) {
            this.left = this.calculateLeft(myPos, atPos).value.toString() + "px";
            this.top = this.calculateTop(myPos, atPos).value.toString() + "px";
        }
        else {
            const pos = this.calculatePosition(myPos, atPos, options);
            this.top = pos.top.toString() + "px";
            this.left = pos.left.toString() + "px";
        }
    }
    // eslint-disable-next-line complexity
    calculatePosition(my, at, options) {
        const fitDataArray = this.getFitPositions();
        const fitData = fitDataArray.filter((f) => f.my === my && f.at === at)[0];
        if (options.collision === PositionCollision.ignore ||
            (!fitData.top.willCollide && !fitData.left.willCollide)) {
            return { top: fitData.top.value, left: fitData.left.value };
        }
        if (options.collision === PositionCollision.flipfit) {
            const newOptions = Object.assign(options, { collision: PositionCollision.ignore });
            return this.calculatePosition(HoverPosition.flip(my), HoverPosition.flip(at), newOptions);
        }
        let myFits = fitDataArray.filter((f) => !f.top.willCollide && !f.left.willCollide);
        if (myFits.length === 0) {
            return { top: fitData.top.value, left: fitData.left.value };
        }
        else if (myFits.length === 1) {
            return { top: myFits[0].top.value, left: myFits[0].left.value };
        }
        const parsedMy = HoverPosition.parse(my), parsedAt = HoverPosition.parse(at);
        const bestAltHorizFits = myFits.filter((f) => f.my.startsWith(parsedMy.vertical + " ") && f.at.startsWith(parsedAt.vertical + " "));
        const bestAltVertFits = myFits.filter((f) => f.my.endsWith(" " + parsedMy.horizontal) && f.at.endsWith(" " + parsedAt.horizontal));
        if (bestAltVertFits.length > 0 && bestAltHorizFits.length > 0) {
            myFits = options.bestFitPreference === "vertical" ? bestAltVertFits : bestAltHorizFits;
        }
        else if (bestAltVertFits.length > 0) {
            myFits = bestAltVertFits;
        }
        else if (bestAltHorizFits.length > 0) {
            myFits = bestAltHorizFits;
        }
        else {
            let tempFits;
            if (options.bestFitPreference === "vertical") {
                // If it's center then we don't care about overlay. Infact, it's prefered!
                const bothCenter = parsedMy.horizontal === "center" && parsedAt.horizontal === "center";
                const flippedMy = bothCenter
                    ? "left" // <= Does pushing to the left fit?
                    : HoverPosition.flipAlignment(parsedMy.horizontal);
                const flippedAt = bothCenter
                    ? "left" // <= Does pushing to the left fit?
                    : HoverPosition.flipAlignment(parsedMy.horizontal);
                tempFits = myFits.filter((f) => f.my.endsWith(" " + flippedMy) && f.at.endsWith(" " + flippedAt));
                if (tempFits.length === 0 && bothCenter) {
                    // What about to the right?
                    tempFits = myFits.filter((f) => f.my.endsWith(" " + HoverPosition.flipAlignment(flippedMy)) &&
                        f.at.endsWith(" " + HoverPosition.flipAlignment(flippedAt)));
                }
            }
            else {
                const bothCenter = parsedMy.vertical === "center" && parsedAt.vertical === "center";
                const flippedMy = bothCenter
                    ? "top"
                    : HoverPosition.flipAlignment(parsedMy.vertical);
                const flippedAt = bothCenter
                    ? "top"
                    : HoverPosition.flipAlignment(parsedMy.vertical);
                tempFits = myFits.filter((f) => f.my.endsWith(" " + flippedMy) && f.at.endsWith(" " + flippedAt));
                if (tempFits.length === 0 && bothCenter) {
                    tempFits = myFits.filter((f) => f.my.endsWith(" " + HoverPosition.flipAlignment(flippedMy)) &&
                        f.at.endsWith(" " + HoverPosition.flipAlignment(flippedAt)));
                }
            }
            myFits = tempFits;
        }
        if (myFits.length === 0) {
            return { top: fitData.top.value, left: fitData.left.value };
        }
        else if (myFits.length === 1) {
            return { top: myFits[0].top.value, left: myFits[0].left.value };
        }
        let tempFits = myFits.filter((f) => f.my === my);
        if (tempFits.length > 0) {
            myFits = tempFits;
        }
        tempFits = myFits.filter((f) => f.at === at);
        if (tempFits.length > 0) {
            myFits = tempFits;
        }
        return { top: myFits[0].top.value, left: myFits[0].left.value };
    }
    static flipAlignment(old) {
        switch (old) {
            case "top":
                return "bottom";
            case "bottom":
                return "top";
            case "left":
                return "right";
            case "right":
                return "left";
            default:
                return "center";
        }
    }
    static flip(old) {
        var parsedOld = HoverPosition.parse(old);
        return `${HoverPosition.flipAlignment(parsedOld.vertical)} ${HoverPosition.flipAlignment(parsedOld.horizontal)}`;
    }
    calculateTop(my, at) {
        let top = 0;
        let myV, atV;
        if (my === "top" || my === "bottom" || my === "center") {
            myV = my;
        }
        else {
            myV = my.split(" ")[1];
        }
        if (at === "top" || at === "bottom" || at === "center") {
            atV = at;
        }
        else {
            atV = at.split(" ")[1];
        }
        // First get the adjustment
        if (myV === "top") {
            top = 0;
        }
        else if (myV === "bottom") {
            top = this._hoverBoxDims.height * -1;
        }
        else {
            top = (this._hoverBoxDims.height / 2) * -1;
        }
        // Then add the position
        if (atV === "top") {
            top += this._anchorDims.top;
        }
        else if (atV === "bottom") {
            top += this._anchorDims.top + this._anchorDims.height;
        }
        else {
            top += this._anchorDims.top + this._anchorDims.height / 2;
        }
        const willCollide = top < 0 || top + this._hoverBoxDims.height > this._bodyDims.height;
        return { value: top, willCollide: willCollide };
    }
    calculateLeft(my, at) {
        let left = 0;
        let myH, atH;
        if (my === "left" || my === "right" || my === "center") {
            myH = my;
        }
        else {
            myH = my.split(" ")[1];
        }
        if (at === "left" || at === "right" || at === "center") {
            atH = at;
        }
        else {
            atH = at.split(" ")[1];
        }
        // First get the adjustment
        if (myH === "left") {
            left = 0;
        }
        else if (myH === "right") {
            left = this._hoverBoxDims.width * -1;
        }
        else {
            left = (this._hoverBoxDims.width / 2) * -1;
        }
        // Then add the position
        if (atH === "left") {
            left += this._anchorDims.left;
        }
        else if (atH === "right") {
            left += this._anchorDims.left + this._anchorDims.width;
        }
        else {
            left += this._anchorDims.left + this._anchorDims.width / 2;
        }
        const willCollide = left < 0 || left + this._hoverBoxDims.width > this._bodyDims.width;
        return { value: left, willCollide: willCollide };
    }
    getFitPositions() {
        const data = [];
        ["top", "bottom", "center"].forEach((myV) => {
            ["left", "right", "center"].forEach((myH) => {
                ["top", "bottom", "center"].forEach((atV) => {
                    ["left", "right", "center"].forEach((atH) => {
                        data.push({
                            my: `${myV} ${myH}`,
                            at: `${atV} ${atH}`,
                            top: this.calculateTop(myV, atV),
                            left: this.calculateLeft(myH, atH),
                        });
                    });
                });
            });
        });
        return data;
    }
    static parse(alignment, defaults, asCombined) {
        var _a, _b;
        let vert = (_a = defaults === null || defaults === void 0 ? void 0 : defaults.vertical) !== null && _a !== void 0 ? _a : "center", horiz = (_b = defaults === null || defaults === void 0 ? void 0 : defaults.horizontal) !== null && _b !== void 0 ? _b : "center";
        if (alignment.indexOf(" ") < 0) {
            const vertOrHoriz = alignment;
            if (vertOrHoriz === "center") {
                vert = vertOrHoriz;
                horiz = vertOrHoriz;
            }
            else if (vertOrHoriz === "top" || vertOrHoriz === "bottom") {
                vert = vertOrHoriz;
            }
            else {
                horiz = vertOrHoriz;
            }
        }
        else {
            vert = alignment.split(" ")[0];
            horiz = alignment.split(" ")[1];
        }
        return asCombined === true
            ? `${vert} ${horiz}`
            : { vertical: vert, horizontal: horiz };
    }
}
exports.HoverPosition = HoverPosition;
var PositionCollision;
(function (PositionCollision) {
    PositionCollision[PositionCollision["bestFit"] = 0] = "bestFit";
    PositionCollision[PositionCollision["flipfit"] = 1] = "flipfit";
    PositionCollision[PositionCollision["ignore"] = 2] = "ignore";
})(PositionCollision = exports.PositionCollision || (exports.PositionCollision = {}));
//# sourceMappingURL=index.js.map
import * as types from './Types/AlignmentTypes';
import Alignments from './Interfaces/Alignments';
import CalculationOutcome from './Interfaces/CalculationOutcome';
import Collision from './Enumerators/PositionCollision';
import ElementDimensions from './Interfaces/ElementDimensions';
import FitPosition from './Interfaces/FitPosition';
import FitPositionData from './Interfaces/FitPositionData';
import Options from './Interfaces/PositionOptions';

export class HoverPosition {
	private _bodyDims: ElementDimensions;
	private _anchorDims: ElementDimensions;
	private _hoverBoxDims: ElementDimensions;

	/**
	 * The top to be applied to the element
	 */
	top: string;

	/**
	 * The left to be applied to the element
	 */
	left: string;

	/**
	 * Get the position placement for one element relative to another
	 * @param options The options to help attain the `top` & `left`
	 */
	constructor(options: Options) {
		this.initialisePrivateFields(options);

		const myPos = HoverPosition.parse(
				options.my,
				options.defaults ? HoverPosition.parse(options.defaults.my) : { vertical: 'top', horizontal: 'center' },
				true,
			),
			atPos = HoverPosition.parse(
				options.at,
				options.defaults
					? HoverPosition.parse(options.defaults.at)
					: { vertical: 'bottom', horizontal: 'center' },
				true,
			);

		if (
			options.collision === Collision.ignore ||
			(options.collision === Collision.flipfit && myPos === 'center center' && atPos === 'center center')
		) {
			this.left = this.calculateLeft(myPos, atPos).value.toString() + 'px';
			this.top = this.calculateTop(myPos, atPos).value.toString() + 'px';
		} else {
			const pos = this.calculatePosition(myPos, atPos, options);

			this.top = pos.top.toString() + 'px';
			this.left = pos.left.toString() + 'px';
		}
	}

	private initialisePrivateFields(options: Options) {
		this._bodyDims = {
			height: document.body.offsetHeight,
			width: document.body.offsetWidth,
			top: 0,
			left: 0,
		};
		this._anchorDims =
			options.anchor instanceof MouseEvent
				? {
						height: 10,
						width: 10,
						top: options.anchor.pageY,
						left: options.anchor.pageX,
				  }
				: {
						height: options.anchor.offsetHeight,
						width: options.anchor.offsetWidth,
						top: options.anchor.offsetTop,
						left: options.anchor.offsetLeft,
				  };

		const originalDisplay = options.target.style.display;
		options.target.style.display = 'block';

		if (options.anchor instanceof HTMLElement) {
			let parent = options.anchor.parentElement;

			while (parent !== null && parent.tagName !== "BODY") {
				this._anchorDims.top -= parent.scrollTop;
				this._anchorDims.left -= parent.scrollLeft;
				
				parent = parent.parentElement;
			}
		}

		this._hoverBoxDims = {
			height: options.target.offsetHeight,
			width: options.target.offsetWidth,
			top: 0,
			left: 0,
		};

		options.target.style.display = originalDisplay;
	}

	private calculatePosition(my: CombinedAlignment, at: CombinedAlignment, options: Options): FitPosition {
		const fitDataArray = this.getFitPositions(),
			fitData = fitDataArray.filter((f) => f.my === my && f.at === at)[0];

		if (options.collision === Collision.ignore || (!fitData.top.willCollide && !fitData.left.willCollide)) {
			return { top: fitData.top.value, left: fitData.left.value };
		}

		if (options.collision === Collision.flipfit) {
			return this.calculatePosition(
				HoverPosition.flip(my),
				HoverPosition.flip(at),
				Object.assign(options, { collision: Collision.ignore }),
			);
		}

		let myFits = fitDataArray.filter((f) => (!f.top.willCollide || f.top.mayOverflow) && !f.left.willCollide);

		if (myFits.length === 0) {
			return { top: fitData.top.value, left: fitData.left.value };
		} else if (myFits.length === 1) {
			return { top: myFits[0].top.value, left: myFits[0].left.value };
		}

		myFits = HoverPosition.findBestFits(my, at, options, myFits);

		if (myFits.length === 0) {
			return { top: fitData.top.value, left: fitData.left.value };
		} else if (myFits.length === 1) {
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

	private calculateTop(
		my: CombinedAlignment | VerticalAlignment,
		at: CombinedAlignment | VerticalAlignment,
	): CalculationOutcome {
		let top = 0;
		let myV: VerticalAlignment, atV: VerticalAlignment;

		if (my === 'top' || my === 'bottom' || my === 'center') {
			myV = my;
		} else {
			myV = my.split(' ')[1] as VerticalAlignment;
		}

		if (at === 'top' || at === 'bottom' || at === 'center') {
			atV = at;
		} else {
			atV = at.split(' ')[1] as VerticalAlignment;
		}

		// First get the adjustment
		if (myV === 'top') {
			top = 0;
		} else if (myV === 'bottom') {
			top = this._hoverBoxDims.height * -1;
		} else {
			top = (this._hoverBoxDims.height / 2) * -1;
		}

		// Then add the position
		if (atV === 'top') {
			top += this._anchorDims.top;
		} else if (atV === 'bottom') {
			top += this._anchorDims.top + this._anchorDims.height;
		} else {
			top += this._anchorDims.top + this._anchorDims.height / 2;
		}

		const willCollide = top < 0 || top + this._hoverBoxDims.height > this._bodyDims.height;

		return { value: top, willCollide: willCollide, mayOverflow: myV === 'top' };
	}

	private calculateLeft(
		my: CombinedAlignment | HorizontalAlignment,
		at: CombinedAlignment | HorizontalAlignment,
	): CalculationOutcome {
		let left = 0;
		let myH: HorizontalAlignment, atH: HorizontalAlignment;

		if (my === 'left' || my === 'right' || my === 'center') {
			myH = my;
		} else {
			myH = my.split(' ')[1] as HorizontalAlignment;
		}

		if (at === 'left' || at === 'right' || at === 'center') {
			atH = at;
		} else {
			atH = at.split(' ')[1] as HorizontalAlignment;
		}

		// First get the adjustment
		if (myH === 'left') {
			left = 0;
		} else if (myH === 'right') {
			left = this._hoverBoxDims.width * -1;
		} else {
			left = (this._hoverBoxDims.width / 2) * -1;
		}

		// Then add the position
		if (atH === 'left') {
			left += this._anchorDims.left;
		} else if (atH === 'right') {
			left += this._anchorDims.left + this._anchorDims.width;
		} else {
			left += this._anchorDims.left + this._anchorDims.width / 2;
		}

		const willCollide = left < 0 || left + this._hoverBoxDims.width > this._bodyDims.width;

		return { value: left, willCollide: willCollide };
	}

	private getFitPositions(): FitPositionData[] {
		const data: FitPositionData[] = [];

		(<VerticalAlignment[]>['top', 'bottom', 'center']).forEach((myV) => {
			(<HorizontalAlignment[]>['left', 'right', 'center']).forEach((myH) => {
				(<VerticalAlignment[]>['top', 'bottom', 'center']).forEach((atV) => {
					(<HorizontalAlignment[]>['left', 'right', 'center']).forEach((atH) => {
						data.push({
							my: `${myV} ${myH}` as CombinedAlignment,
							at: `${atV} ${atH}` as CombinedAlignment,
							top: this.calculateTop(myV, atV),
							left: this.calculateLeft(myH, atH),
						});
					});
				});
			});
		});

		return data;
	}

	/**
	 * Parse an alignment string to it's `vertical` and `horizontal` alignments
	 * @param alignment The alignment data to parse
	 */
	public static parse(alignment: CombinedAlignment): Alignments;
	public static parse(alignment: PositionAlignment, defaults: Alignments): Alignments;
	public static parse(alignment: PositionAlignment, defaults: Alignments, asCombined: true): CombinedAlignment;
	public static parse(
		alignment: PositionAlignment,
		defaults?: Alignments,
		asCombined?: boolean,
	): Alignments | CombinedAlignment {
		let vert = defaults?.vertical ?? 'center',
			horiz: HorizontalAlignment = defaults?.horizontal ?? 'center';

		if (alignment.indexOf(' ') < 0) {
			const vertOrHoriz = alignment as VerticalAlignment | HorizontalAlignment;

			if (vertOrHoriz === 'center') {
				vert = vertOrHoriz;
				horiz = vertOrHoriz;
			} else if (vertOrHoriz === 'top' || vertOrHoriz === 'bottom') {
				vert = vertOrHoriz;
			} else {
				horiz = vertOrHoriz;
			}
		} else {
			vert = alignment.split(' ')[0] as VerticalAlignment;
			horiz = alignment.split(' ')[1] as HorizontalAlignment;
		}

		return asCombined === true ? (`${vert} ${horiz}` as CombinedAlignment) : { vertical: vert, horizontal: horiz };
	}

	private static flipAlignment(old: VerticalAlignment): VerticalAlignment;
	private static flipAlignment(old: HorizontalAlignment): HorizontalAlignment;
	private static flipAlignment(
		old: VerticalAlignment | HorizontalAlignment,
	): VerticalAlignment | HorizontalAlignment {
		switch (old) {
			case 'top':
				return 'bottom';

			case 'bottom':
				return 'top';

			case 'left':
				return 'right';

			case 'right':
				return 'left';

			default:
				return 'center';
		}
	}

	private static flip(old: CombinedAlignment): CombinedAlignment {
		const parsedOld = HoverPosition.parse(old);

		return `${HoverPosition.flipAlignment(parsedOld.vertical)} ${HoverPosition.flipAlignment(
			parsedOld.horizontal,
		)}` as CombinedAlignment;
	}

	private static findBestFits(my: CombinedAlignment, at: CombinedAlignment, options: Options, inFitData: FitPositionData[]): FitPositionData[] {
		const parsedMy = HoverPosition.parse(my),
			parsedAt = HoverPosition.parse(at);

		let bestFits: FitPositionData[];

		const bestAltHorizFits = inFitData.filter(
			(f) => f.my.startsWith(parsedMy.vertical + ' ') && f.at.startsWith(parsedAt.vertical + ' '),
		);

		const bestAltVertFits = inFitData.filter(
			(f) => f.my.endsWith(' ' + parsedMy.horizontal) && f.at.endsWith(' ' + parsedAt.horizontal),
		);

		if (bestAltVertFits.length > 0 && bestAltHorizFits.length > 0) {
			bestFits = options.bestFitPreference === 'vertical' ? bestAltVertFits : bestAltHorizFits;
		} else if (bestAltVertFits.length > 0) {
			bestFits = bestAltVertFits;
		} else if (bestAltHorizFits.length > 0) {
			bestFits = bestAltHorizFits;
		} else {
			if (options.bestFitPreference === 'vertical') {
				// If it's center then we don't care about overlay. Infact, it's prefered!
				const bothCenter = parsedMy.horizontal === 'center' && parsedAt.horizontal === 'center',
					flippedMy = bothCenter
						? 'left' // <= Does pushing to the left fit?
						: HoverPosition.flipAlignment(parsedMy.horizontal),
					flippedAt = bothCenter
						? 'left' // <= Does pushing to the left fit?
						: HoverPosition.flipAlignment(parsedMy.horizontal);

				bestFits = inFitData.filter((f) => f.my.endsWith(' ' + flippedMy) && f.at.endsWith(' ' + flippedAt));

				if (bestFits.length === 0 && bothCenter) {
					// What about to the right?
					bestFits = inFitData.filter(
						(f) =>
							f.my.endsWith(' ' + HoverPosition.flipAlignment(flippedMy)) &&
							f.at.endsWith(' ' + HoverPosition.flipAlignment(flippedAt)),
					);
				}
			} else {
				// If it's center then we don't care about overlay. Infact, it's prefered!
				const bothCenter = parsedMy.vertical === 'center' && parsedAt.vertical === 'center',
					flippedMy = bothCenter
						? 'top' // <= Does pushing to the top fit?
						: HoverPosition.flipAlignment(parsedMy.vertical),
					flippedAt = bothCenter
						? 'top' // <= Does pushing to the top fit?
						: HoverPosition.flipAlignment(parsedMy.vertical);

				bestFits = inFitData.filter((f) => f.my.startsWith(flippedMy + ' ') && f.at.startsWith(flippedAt + ' '));

				if (bestFits.length === 0 && bothCenter) {
					// What about to the bottom?
					bestFits = inFitData.filter(
						(f) =>
							f.my.startsWith(HoverPosition.flipAlignment(flippedMy) + ' ') &&
							f.at.startsWith(HoverPosition.flipAlignment(flippedAt) + ' '),
					);
				}
			}
		}

		return bestFits;
	}
}

export type PositionAlignment = types.PositionAlignment;
export type CombinedAlignment = types.CombinedAlignment;
export type VerticalAlignment = types.VerticalAlignment;
export type HorizontalAlignment = types.HorizontalAlignment;

export { default as PositionCollision } from './Enumerators/PositionCollision';

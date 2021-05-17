export declare class HoverPosition {
    private _bodyDims;
    private _anchorDims;
    private _hoverBoxDims;
    top: string;
    left: string;
    constructor(options: PositionOptions);
    private calculatePosition;
    private static flipAlignment;
    private static flip;
    private calculateTop;
    private calculateLeft;
    private getFitPositions;
    static parse(alignment: CombinedAlignment): Alignments;
    static parse(alignment: PositionAlignment, defaults: Alignments): Alignments;
    static parse(alignment: PositionAlignment, defaults: Alignments, asCombined: true): CombinedAlignment;
}
interface Alignments {
    vertical: VerticalAlignment;
    horizontal: HorizontalAlignment;
}
interface CalculationOutcome {
    value: number;
    willCollide: boolean;
}
export interface PositionOptions {
    my: PositionAlignment;
    at: PositionAlignment;
    anchor: HTMLElement;
    hoverBox: HTMLElement;
    collision?: PositionCollision;
    bestFitPreference?: "horizontal" | "vertical";
    defaults?: {
        my: CombinedAlignment;
        at: CombinedAlignment;
    };
}
export declare enum PositionCollision {
    bestFit = 0,
    flipfit = 1,
    ignore = 2
}
export interface FitPositionData {
    my: CombinedAlignment;
    at: CombinedAlignment;
    top: CalculationOutcome;
    left: CalculationOutcome;
}
export declare type PositionAlignment = VerticalAlignment | HorizontalAlignment | CombinedAlignment;
export declare type CombinedAlignment = `${VerticalAlignment} ${HorizontalAlignment}`;
export declare type VerticalAlignment = "top" | "center" | "bottom";
export declare type HorizontalAlignment = "left" | "center" | "right";
export {};
//# sourceMappingURL=index.d.ts.map
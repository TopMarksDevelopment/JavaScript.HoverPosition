import { CombinedAlignment } from "../Types/AlignmentTypes";

export default interface FitPositionData {
    my: CombinedAlignment;
    at: CombinedAlignment;
    top: CalculationOutcome;
    left: CalculationOutcome;
}
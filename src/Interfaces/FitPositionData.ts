import { CombinedAlignment } from '../Types/AlignmentTypes';
import CalculationOutcome from './CalculationOutcome';

export default interface FitPositionData {
	my: CombinedAlignment;
	at: CombinedAlignment;
	top: CalculationOutcome;
	left: CalculationOutcome;
}

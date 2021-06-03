import PositionCollision from '../Enumerators/PositionCollision';
import { CombinedAlignment, PositionAlignment } from '../Types/AlignmentTypes';

export default interface PositionOptions {
	my: PositionAlignment;
	at: PositionAlignment;
	anchor: HTMLElement | MouseEvent;
	target: HTMLElement;
	collision?: PositionCollision;
	bestFitPreference?: 'horizontal' | 'vertical';
	defaults?: { my: CombinedAlignment; at: CombinedAlignment };
}

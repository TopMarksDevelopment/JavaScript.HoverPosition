export default interface CalculationOutcome {
	value: number;
	willCollide: boolean;
	mayOverflow?: boolean;
}

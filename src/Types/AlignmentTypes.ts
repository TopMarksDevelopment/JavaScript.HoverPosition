export type PositionAlignment = VerticalAlignment | HorizontalAlignment | CombinedAlignment;
export type CombinedAlignment = `${VerticalAlignment} ${HorizontalAlignment}`;
export type VerticalAlignment = 'top' | 'center' | 'bottom';
export type HorizontalAlignment = 'left' | 'center' | 'right';

export type TimeRange = 'Week' | 'Month' | 'Year';
export type FilterType = 'Simple' | 'Detailed';

export interface DataPoint {
    label: string;
    value: number;
}

export interface DetailedTimeRangeData {
    [year: string]: {
        Year: DataPoint[];
        Month: DataPoint[];
        Week: DataPoint[];
    };
}

export interface SimpleTimeRangeData {
    Week: DataPoint[];
    Month: DataPoint[];
    Year: DataPoint[];
}
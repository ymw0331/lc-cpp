interface CSVData {
    [key: string]: string | number | boolean | null | undefined;
}

interface CSVOptions {
    filename?: string;
    headers?: string[];
    excludeFields?: string[];
}

/**
 * Exports data to CSV file
 * @param data Array of objects to export
 * @param options Configuration options for the export
 * @param options.filename Custom filename for the exported file (default: 'export-[date].csv')
 * @param options.headers Custom headers for the CSV (default: uses object keys)
 * @param options.excludeFields Fields to exclude from the export
 */
export const exportToCSV = (
    data: CSVData[],
    options: CSVOptions = {}
): void => {
    const {
        filename = `export-${new Date().toISOString().split('T')[0]}.csv`,
        headers,
        excludeFields = []
    } = options;

    if (!data || data.length === 0) {
        console.warn('No data provided for CSV export');
        return;
    }

    // Get all unique keys from the data objects
    const allKeys = Array.from(
        new Set(data.flatMap(obj => Object.keys(obj)))
    ).filter(key => !excludeFields.includes(key));

    // Use provided headers or generate from keys
    const csvHeaders = headers || allKeys;

    // Transform data to CSV format
    const csvData = data.map(item => {
        return csvHeaders.map(header => {
            const value = item[header];
            // Handle different value types
            if (value === null || value === undefined) {
                return '';
            }
            if (typeof value === 'string') {
                // Escape quotes and wrap in quotes if contains comma or quote
                const escapedValue = value.replace(/"/g, '""');
                return value.includes(',') || value.includes('"') 
                    ? `"${escapedValue}"` 
                    : escapedValue;
            }
            return String(value);
        });
    });

    // Combine headers and data
    const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}; 
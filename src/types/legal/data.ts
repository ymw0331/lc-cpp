export interface LegalContent {
    title: string;
    lastUpdated: string;
    sections: {
        heading?: string;
        content: string[];
    }[];
}

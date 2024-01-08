declare global {
    interface ProjectData {
        name: string;
        statistics: {
            keys_total: number;
            languages: {
                language_iso: string;
            }[]
        }
    }
}

export {};
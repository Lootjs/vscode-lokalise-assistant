import axios from 'axios';
import * as vscode from 'vscode';
import { getLokaliseToken } from '../utils/getLokaliseToken';
import { KEYS_LIMIT } from '../utils/contants';

export const getTranslations = (projectId: string, page: number) => {
    return axios.get(`https://api.lokalise.com/api2/projects/${projectId}/keys`, {
        params: {
            include_translations: 1,
            page,
            limit: KEYS_LIMIT,
            filter_archived: 'exclude'
        },
        headers: {
            'X-Api-Token': getLokaliseToken(),
        }
    }).then(({ data }: { data: object }) => {

        return data;
    }).catch(console.error);
};
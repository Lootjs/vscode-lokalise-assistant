import * as vscode from 'vscode';
import axios from 'axios';
import { PROJECT_ID_KEY } from '../utils/getWorkspace';
import { SET_PROJECT_COMMAND } from '../utils/contants';
import { getLokaliseToken } from '../utils/getLokaliseToken';

export const getProjectCommand = (context: vscode.ExtensionContext) => {
    return vscode.commands.registerCommand(SET_PROJECT_COMMAND, async (projectId) => {
        return axios.get(`https://api.lokalise.com/api2/projects/${projectId}`, {
            headers: {
                'X-Api-Token': getLokaliseToken(),
            }
        }).then(({ data }: { data: object }) => {
            context.workspaceState.update(PROJECT_ID_KEY, projectId);
            vscode.window.showInformationMessage('Project id is updated!');

            return data;
        }).catch(() => {
            vscode.window.showErrorMessage(`Project [${projectId}] not found!`);
        });
    });
};
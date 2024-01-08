import * as vscode from 'vscode';
import { TOKEN_CONFIG_KEY } from './contants';

export function getLokaliseToken(): string {
    return vscode.workspace.getConfiguration().get(TOKEN_CONFIG_KEY) as string;
}
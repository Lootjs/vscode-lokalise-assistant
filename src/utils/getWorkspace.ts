import * as vscode from 'vscode';

let workspaceFolders = vscode.workspace.workspaceFolders!;

export const ws = workspaceFolders[0];
export const WORKSPACE_PREFIX = btoa(ws.uri.toString());
export const PROJECT_ID_KEY = `PROJECT_ID:${WORKSPACE_PREFIX}`;
export const PROJECT_ID_CHECK_KEY = (file: string) => `PROJECT_ID:${WORKSPACE_PREFIX}:lastCheck-${file}`;
export const PROJECT_ID_RES_KEY = `PROJECT_ID:${WORKSPACE_PREFIX}:res`;
export const PROJECT_FILE_KEY = `${PROJECT_ID_KEY}:file`;
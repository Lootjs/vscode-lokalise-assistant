// @ts-nocheck
import * as vscode from 'vscode';
import { PROJECT_ID_CHECK_KEY, PROJECT_FILE_KEY, PROJECT_ID_KEY, PROJECT_ID_RES_KEY } from '../utils/getWorkspace';
import { FETCH_TRANSLATIONS_COMMAND, KEYS_LIMIT } from '../utils/contants';
import { getDateAsString } from '../utils/getDate';
import { getTranslations } from '../requests/getTranslations';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type ProgressReport = {
    report: (params: { message: string; increment: number }) => void;
};

type Translation = {
    language_iso: string
};

export const getFetchTranslationsCommand = (context: vscode.ExtensionContext) => {
    return vscode.commands.registerCommand(FETCH_TRANSLATIONS_COMMAND, async (file: any) => {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            cancellable: false,
        }, (progress, token) => {
            token.onCancellationRequested(() => {
                vscode.window.showInformationMessage('Cancelled!');
            });

            return new Promise(async (resolve) => {
                const remoteJsonUri = await fetchTranslations(context, progress, file);
                const localJsonUri = vscode.Uri.file(file);
                await vscode.commands.executeCommand('vscode.diff', remoteJsonUri, localJsonUri, 'Compare Locales');
                
                const currentDateTime = getDateAsString();
                const fileName = context.workspaceState.get(PROJECT_FILE_KEY) as string;
                context.globalState.update(PROJECT_ID_CHECK_KEY(fileName), currentDateTime);
                // vscode.window.showInformationMessage('Updated at: ' + currentDateTime);
                resolve(1);
            });
        });
    });
};


async function fetchTranslations(context: vscode.ExtensionContext, progress: ProgressReport, filepath: string) {
    const projectId = context.workspaceState.get(PROJECT_ID_KEY) as string;
    const projectData = context.workspaceState.get(PROJECT_ID_RES_KEY) as object;
    const fileName = filepath.split('\\').pop()!;
    const [lang] = fileName.split('.');

    progress.report({ increment: 10, message: `Requesting to Lokalise API...$` });
    const pagesCount = getPagesCount(projectData.statistics.keys_total);
    const promises = [];
    for (let i = 1; i <= pagesCount; i++) {
        promises.push(getTranslations(projectId, i));
    }
    const keys = (await Promise.all(promises)).map(({ keys }) => keys).flat(2);
    let skippedKeysCount = 0;
    
    progress.report({ increment: 30, message: `All requests are done.` });
    const excludedTags = getExcludedTags();
    if (excludedTags.length) {
        keys.filter(translation => {
            const shouldExclude = translation.tags.some(tag => excludedTags.includes(tag));

            if (shouldExclude) {
                skippedKeysCount += 1 ;
            }
            return shouldExclude;
        });
    }
    const mapping = transformKeys(keys, lang);
    progress.report({ increment: 70, message: `Translations were collected.` });
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${lang}-lokalise.json`);

    if (skippedKeysCount > 0) {
        vscode.window.showInformationMessage(
            `${skippedKeysCount} keys were skipped due to the excluded tags: ${excludedTags.join(', ')}`
        );
    }

    const jsonString = JSON.stringify(mapping, null, 2);//.replace(/\u2028|\u2029/g, '\n');
    fs.writeFileSync(tempFilePath, jsonString, 'utf8');
    
    progress.report({ increment: 100, message: `Starting diff.` });
    return vscode.Uri.file(tempFilePath);
}

function getPagesCount(items: number) {
    return Math.ceil(items / KEYS_LIMIT);
}

function transformKeys(keys: unknown, lang: string) {
    const result = {};

    keys.forEach(item => {
        const keyPath: string[] = item.key_name.web.split("::")!;
        let currentLevel = result;

        keyPath.slice(0, -1).forEach((key: string | object) => {
            if (!currentLevel[key]) {
                currentLevel[key] = {};
            }
            currentLevel = currentLevel[key];
        });

        const value = item.translations.find((t: Translation) => t.language_iso === lang).translation;
        currentLevel[keyPath[keyPath.length - 1]] = value;
    });

    return result;
}

function getExcludedTags() {
    const config = vscode.workspace.getConfiguration();
    const tagsString = config.get('vscode-lokalise-assistant.excludeTags', '');
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
}
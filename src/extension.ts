import * as vscode from 'vscode';
import { LokaliseAssistantView } from './LokaliseAssistantView';
import { getProjectCommand } from './commands/SetProject';
import { getFetchTranslationsCommand } from './commands/FetchTranslations';

function activate(context: vscode.ExtensionContext) {

    // webview registration
    const webView = new LokaliseAssistantView(context.extensionUri.toString(), context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider("vscode-lokalise-assistant.lokaliseAssistant", webView, {
            webviewOptions: {
                retainContextWhenHidden: true
            }
        })
    );
    context.subscriptions.push(getFetchTranslationsCommand(context));
    context.subscriptions.push(getProjectCommand(context));
}

function deactivate() {
    // if (fs.existsSync(tempFilePath)) {
        // fs.unlinkSync(tempFilePath);
    // }
}

module.exports = {
    activate,
    deactivate
};

import * as vscode from 'vscode';
import { webviewUi } from './ui/WebviewUi';
import { onboardingUi } from './ui/OnboardingUi';
import { setApiToken } from './ui/SetApiTokenUi';
import { PROJECT_ID_RES_KEY, PROJECT_ID_CHECK_KEY, PROJECT_ID_KEY, PROJECT_FILE_KEY } from './utils/getWorkspace';
import {
    FETCH_TRANSLATIONS_COMMAND,
    SET_PROJECT_COMMAND,
    TOKEN_CONFIG_KEY,
    LOCALE_SIGNATURE
} from './utils/contants';
import { getDateAsString } from './utils/getDate';

const defaultText = 'Open a locale file';

export class LokaliseAssistantView implements vscode.WebviewViewProvider {
    extensionUri: string;
    context: vscode.ExtensionContext;

    constructor(extensionUri: string, context: vscode.ExtensionContext) {
      this.extensionUri = extensionUri;
      this.context = context;
    }

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext) {
        webviewView.webview.options = {
          enableScripts: true
        };
        vscode.window.onDidChangeActiveTextEditor(() => {
            const activeEditor = vscode.window.activeTextEditor;
            const fileName = activeEditor?.document.fileName;

            if (activeEditor) {
                this.context.workspaceState.update(PROJECT_FILE_KEY, fileName);
                this.getActualContent(webviewView);
            }
        });
        

        webviewView.webview.onDidReceiveMessage(async message => {
            switch (message.command) {
                case 'merge':
                case 'pull':
                    const fileName = this.context.workspaceState.get(PROJECT_FILE_KEY) as string;
                    const currentDateTime = getDateAsString();
                    await vscode.commands.executeCommand(FETCH_TRANSLATIONS_COMMAND, fileName);
                    this.context.workspaceState.update(PROJECT_ID_CHECK_KEY(fileName), currentDateTime);
                    webviewView.webview.postMessage({ command: 'update', lastCheck: currentDateTime });
                    break;

                case 'setProject':
                    const res = await vscode.commands.executeCommand(SET_PROJECT_COMMAND, message.projectId) as ProjectData;
                    if (res) {
                        const currentDateTime = getDateAsString();
                        const fileName = this.context.workspaceState.get(PROJECT_FILE_KEY) as string;
                        this.context.workspaceState.update(PROJECT_ID_RES_KEY, res);
                        this.context.workspaceState.update(PROJECT_ID_CHECK_KEY(fileName), currentDateTime);
                        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview, res, currentDateTime);
                    }
                break;

                case 'detach':
                    this.context.workspaceState.keys().forEach(key => this.context.workspaceState.update(key, undefined));
                    webviewView.webview.html = this.getHtmlForOnboarding(webviewView.webview);
                    break;

                case 'openSettings':
                    vscode.commands.executeCommand('workbench.action.openSettings', TOKEN_CONFIG_KEY);
                    break;

                case 'refreshPanel':
                    this.getActualContent(webviewView);
                    break;
            }
        });

        this.getActualContent(webviewView);
      }

      getActualContent(webviewView: vscode.WebviewView) {
        const token = vscode.workspace.getConfiguration().get(TOKEN_CONFIG_KEY) as string;
        if (token.length === 0) {
            webviewView.webview.html = setApiToken;
            return;
        }

        const workspaceState = this.context.workspaceState;
        // workspaceState.update(PROJECT_ID_KEY, undefined);
        // console.log(workspaceState.get(PROJECT_ID_KEY));

        if (!workspaceState.get(PROJECT_ID_KEY)) {
            webviewView.webview.html = this.getHtmlForOnboarding(webviewView.webview);
            return;
        }

        if (!vscode.window.activeTextEditor?.document.uri.path.includes(LOCALE_SIGNATURE)) {
            webviewView.webview.html = defaultText;
            return;
        }
        
        const fileName = vscode.window.activeTextEditor?.document.fileName;
        this.context.workspaceState.update(PROJECT_FILE_KEY, fileName);

        webviewView.webview.html = this.getHtmlForWebview(
            webviewView.webview,
            workspaceState.get(PROJECT_ID_RES_KEY) as ProjectData,
            workspaceState.get(PROJECT_ID_CHECK_KEY(fileName)) as string
        );
      }
    
      getHtmlForWebview(webview: vscode.Webview, res: ProjectData, lastCheck: string = 'never') {
        return webviewUi(res, lastCheck);
      }
    
      getHtmlForOnboarding(webview: vscode.Webview) {
        return onboardingUi;
      }
}
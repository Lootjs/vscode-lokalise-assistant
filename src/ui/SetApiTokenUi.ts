import stylesFragment from "./_stylesFragment";

export const setApiToken = `
${stylesFragment}
<h4>First of all, set Api Token in the extension\'s configuration.</h4>
<div class="buttons">
    <button id="openSettings" class="vscode-style-button">Open Settings</button>
    <button id="refreshPanel" class="vscode-style-button">Refresh Panel</button>
</div>

<script>
const vscode = acquireVsCodeApi();
document.getElementById('openSettings').addEventListener('click', () => {
    vscode.postMessage({ command: 'openSettings' });
});
document.getElementById('refreshPanel').addEventListener('click', () => {
    vscode.postMessage({ command: 'refreshPanel' });
});
</script>
`;
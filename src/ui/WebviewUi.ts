import stylesFragment from "./_stylesFragment";

export const webviewUi = (res: ProjectData, lastCheck: string = 'never') => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>lokalise-assistant</title>
${stylesFragment}
</head>
<body>
<h3 id="projectName"></h3>
<div class="widgets">
    <div class="widget">
        <div class="widget__hightlight" id="keysCount"></div>
        <span class="widget__label">Keys count</span>
    </div>

    <div class="widget">
        <div class="widget__hightlight" id="langList"></div>
        <span class="widget__label">Languages</span>
    </div>
</div>

<div class="divider"></div>

<h3>Update translations</h3>

<div class="update-buttons">
    <div class="widget widget--actionable">
        <div class="widget__label">Fetch and show a&nbsp;diff dialog</div>
        <button id="pull" class="vscode-style-button">Pull</button>
    </div>
    <div class="widget widget--actionable">
        <div class="widget__label">Fetch and merge changes</div>
        <button id="merge" class="vscode-style-button">Merge</button>
    </div>
</div>

<div class="divider"></div>

<div class="text-row">
    <span class="text-row__label">Last update:</span>
    <span id="lastCheck"></span>
</div>

<div class="divider"></div>


<div class="buttons">
    <button id="detach" class="vscode-style-button">Detech Project</button>
</div>

<div id="debug"></div>

<script>
const vscode = acquireVsCodeApi();

document.getElementById('lastCheck').textContent = "${lastCheck}";
document.getElementById('projectName').textContent = "${res.name}";
document.getElementById('keysCount').textContent = "${res.statistics.keys_total}";
document.getElementById('langList').textContent = "${res.statistics.languages.map(l => l.language_iso).join(', ')}";

document.getElementById('pull').addEventListener('click', () => {
    vscode.postMessage({ command: 'pull' });
});

document.getElementById('merge').addEventListener('click', () => {
    vscode.postMessage({ command: 'merge' });
});

document.getElementById('detach').addEventListener('click', () => {
    vscode.postMessage({ command: 'detach' });
});

window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
    case 'update':
        document.getElementById('lastCheck').textContent = message.lastCheck;
        break;
    }
});
</script>
</body>
</html>`;
import stylesFragment from "./_stylesFragment";

export const onboardingUi = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>lokalise-assistant</title>
${stylesFragment}
</head>
<body>
<h3>Set project's ID</h3>
<div class="form">
    <input type="text" id="projectId" placeholder="Enter project ID" class="vscode-style-input">
    <button id="find" class="vscode-style-button">Find project</button>
</div>


<script>
const vscode = acquireVsCodeApi();

document.getElementById('find').addEventListener('click', () => {
    const projectId = document.getElementById('projectId');

    if (projectId.value.length > 10) {
        vscode.postMessage({ command: 'setProject', projectId: projectId.value });
    }
});

/*
window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
    case 'update':
        debugger;
        document.getElementById('lastCheck').textContent = message.lastCheck;
        break;
    }
});
*/
</script>
</body>
</html>
`;
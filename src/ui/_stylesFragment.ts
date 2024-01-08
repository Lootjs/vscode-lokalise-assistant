export default `
<style>
    body { padding: 20px; }
    .vscode-style-button {
        color: var(--vscode-button-foreground);
        background-color: var(--vscode-button-background);
        padding: 5px 10px;
        border: none;
        border-radius: 2px;
        cursor: pointer;
        outline: none;
        transition: background-color 0.3s ease;
        font-size: var(--vscode-font-size);
    }
    
    .vscode-style-button:hover {
        background-color: var(--vscode-button-hoverBackground);
    }
    
    .vscode-style-button:active {
        background-color: var(--vscode-button-secondaryBackground);
    }
    
    body.vscode-dark .vscode-style-button {
    }
    
    body.vscode-light .vscode-style-button {
    }

    .buttons {
        margin: 20px auto 10px;
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    
    .vscode-style-input {
        color: var(--vscode-input-foreground);
        background-color: var(--vscode-input-background);
        border: 1px solid var(--vscode-input-border);
        padding: 5px 10px;
        border-radius: 2px;
        font-size: var(--vscode-font-size);
        font-family: var(--vscode-font-family);
        box-shadow: var(--vscode-inputBox-shadow);
        transition: border-color 0.2s ease;
    }

    .vscode-style-input:focus {
        outline: none;
        border-color: var(--vscode-focusBorder);
    }
    
    .form { 
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    .form input {
        max-width: 50%;
    }

    h3 { user-select: none; margin: 0 0 8px; }

    .divider {
        height: 1px;
        background-color: var(--vscode-descriptionForeground);
        margin: 16px 0;
    }

    .widgets {
        display: flex;
        gap: 10px;
        align-items: strech;
    }

    .widget {
        border: 1px solid var(--vscode-descriptionForeground);
        padding: 5px 10px;
        border-radius: 2px;
        flex: 1;
        user-select: none;
    }

    .widget--actionable {
        border: 0;
        display: flex;
        justify-content: space-between;
        padding: 0;
        gap: 10px;
    }

    .widget--actionable + .widget--actionable {
        margin-top: 10px;
    }

    .widget__hightlight {
        font-weight: 500;
        color: var(--vscode-editor-descriptionForeground);
    }

    .widget__label {
        flex-basis: 100%;
        color: var(--vscode-descriptionForeground);
        text-align: center;
    }

    .widget--actionable .widget__label {
        color: var(--vscode-editor-descriptionForeground);
    }

    .widget--actionable button {
        flex-basis: 65%;
    }

    .update-buttons {
        margin-top: 16px;
    }
    
    .update-buttons button + button {
        margin-top: 10px;
    }

    .text-row {
        margin-top: 5px;
        text-align: right;
        color: var(--vscode-editor-foreground);
    }

    .text-row__label {
        color: var(--vscode-descriptionForeground);
    }
</style>
`;
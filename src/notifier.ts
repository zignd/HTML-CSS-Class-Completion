import * as vscode from 'vscode';

class Notifier {
    private _timeoutId: NodeJS.Timer;

    public statusBarItem: vscode.StatusBarItem;

    constructor(command?: string, alignment?: vscode.StatusBarAlignment, priority?: number) {
        this.statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
        this.statusBarItem.command = command;
        this.statusBarItem.show();
    }

    public notify(icon: string, text: string): void {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
        }

        this.statusBarItem.text = `$(${icon}) ${text}`;
        this.statusBarItem.tooltip = null;

        this._timeoutId = setTimeout(() => {
            this.statusBarItem.text = `$(${icon})`;
            this.statusBarItem.tooltip = text;
        }, 5000);
    }
}

export default Notifier;
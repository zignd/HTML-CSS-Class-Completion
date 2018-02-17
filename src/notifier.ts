import * as vscode from "vscode";

class Notifier {
    public statusBarItem: vscode.StatusBarItem;
    private timeoutId: NodeJS.Timer;

    constructor(command?: string, alignment?: vscode.StatusBarAlignment, priority?: number) {
        this.statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
        this.statusBarItem.command = command;
        this.statusBarItem.show();
    }

    public notify(icon: string, text: string, autoHide: boolean = true): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.statusBarItem.text = `$(${icon}) ${text}`;
        this.statusBarItem.tooltip = null;

        if (autoHide) {
            this.timeoutId = setTimeout(() => {
                this.statusBarItem.text = `$(${icon})`;
                this.statusBarItem.tooltip = text;
            }, 5000);
        }
    }
}

export default Notifier;

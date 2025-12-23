/**
 * Creates and opens the default Folio workspace on first launch.
 * 
 * This contribution:
 * 1. Checks if no workspace is currently open
 * 2. Creates ~/Folio with template files if it doesn't exist
 * 3. Opens it as the initial workspace
 */
import { injectable, inject } from '@theia/core/shared/inversify';
import { FrontendApplicationContribution, FrontendApplication } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import URI from '@theia/core/lib/common/uri';

const DEFAULT_FOLDER_NAME = 'Folio';

// Template file contents
const CLAUDE_MD_CONTENT = `# Welcome to Folio

This is your workspace. I'm Claude, and I can read and edit any file in this folder.

## How we work together

- **Chat with me** in the sidebar on the left
- **Your files** are visible in the file explorer on the right
- Everything I do happens in plain sight—you can see and edit my work

## What I know about this folder

- This is your personal Folio workspace
- You can create notes, documents, research, or any other files here
- I'll remember our conversations and learn how you like to work

## Tips

- Press \`⌘O\` to open a different folder anytime
- Use \`⌘⇧P\` for the command palette
- Ask me anything—I'm here to help
`;

const README_MD_CONTENT = `# Your Folio

Welcome! This folder is where you and Claude collaborate.

## Getting Started

1. **Say hello to Claude** in the sidebar on the left
2. **Create a file** — try writing a note or a document
3. **Ask Claude to help** — edit, organize, explain, or anything else

## What's here

- \`CLAUDE.md\` — Claude reads this to understand your workspace
- \`notes/\` — A place for your notes and documents
- \`.claude/skills/\` — Teach Claude new abilities (advanced)

## Learn more

- Press \`⌘⇧P\` and type "Folio" to see available commands
- Visit [folio.deepfates.com](https://folio.deepfates.com) for docs

Happy writing!
`;

@injectable()
export class DefaultWorkspaceContribution implements FrontendApplicationContribution {

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(FileService)
    protected readonly fileService: FileService;

    @inject(EnvVariablesServer)
    protected readonly envServer: EnvVariablesServer;

    async onStart(_app: FrontendApplication): Promise<void> {
        console.log('[Folio] DefaultWorkspaceContribution.onStart called');

        // Wait for workspace service to be ready
        console.log('[Folio] Waiting for workspace service to be ready...');
        await this.workspaceService.ready;
        console.log('[Folio] Workspace service ready');

        // Check if a workspace is already open by looking at actual roots
        const roots = await this.workspaceService.roots;
        console.log(`[Folio] Current workspace roots: ${roots.length}`, roots.map(r => r.resource.toString()));
        
        if (roots.length > 0) {
            // User already has a workspace open, don't interfere
            console.log('[Folio] Workspace already has roots, skipping default workspace');
            return;
        }

        try {
            // Get the user's home directory
            const homeDir = await this.getHomeDirectory();
            console.log(`[Folio] Home directory: ${homeDir}`);
            if (!homeDir) {
                console.log('[Folio] Could not determine home directory');
                return;
            }

            const folioPath = `${homeDir}/${DEFAULT_FOLDER_NAME}`;
            const folioUri = new URI(`file://${folioPath}`);
            console.log(`[Folio] Target folder URI: ${folioUri.toString()}`);

            // Check if the default folder already exists
            const folderExists = await this.fileService.exists(folioUri);
            console.log(`[Folio] Folder exists: ${folderExists}`);
            
            if (!folderExists) {
                // First time: create the folder structure
                console.log('[Folio] Creating default folder structure...');
                await this.createDefaultFolder(folioUri);
            }

            // Open the default folder as workspace
            console.log(`[Folio] Opening default workspace: ${folioPath}`);
            this.workspaceService.open(folioUri, { preserveWindow: true });
            console.log('[Folio] Workspace open initiated');

        } catch (error) {
            console.error('[Folio] Error setting up default workspace:', error);
        }
    }

    protected async getHomeDirectory(): Promise<string | undefined> {
        try {
            const homeVar = await this.envServer.getValue('HOME');
            if (homeVar?.value) {
                return homeVar.value;
            }
            // Fallback for Windows
            const userprofileVar = await this.envServer.getValue('USERPROFILE');
            return userprofileVar?.value;
        } catch (error) {
            console.error('[Folio] Error getting home directory:', error);
            return undefined;
        }
    }

    protected async createDefaultFolder(folioUri: URI): Promise<void> {
        // Create the main Folio directory
        await this.fileService.createFolder(folioUri);

        // Create CLAUDE.md
        const claudeMdUri = folioUri.resolve('CLAUDE.md');
        await this.fileService.writeFile(claudeMdUri, this.stringToBuffer(CLAUDE_MD_CONTENT));

        // Create README.md
        const readmeMdUri = folioUri.resolve('README.md');
        await this.fileService.writeFile(readmeMdUri, this.stringToBuffer(README_MD_CONTENT));

        // Create notes/ directory
        const notesUri = folioUri.resolve('notes');
        await this.fileService.createFolder(notesUri);

        // Create .claude/skills/ directory
        const claudeDir = folioUri.resolve('.claude');
        await this.fileService.createFolder(claudeDir);
        const skillsDir = claudeDir.resolve('skills');
        await this.fileService.createFolder(skillsDir);

        console.log('[Folio] Default folder structure created successfully');
    }

    protected stringToBuffer(content: string): BinaryBuffer {
        const encoder = new TextEncoder();
        return BinaryBuffer.wrap(encoder.encode(content));
    }
}

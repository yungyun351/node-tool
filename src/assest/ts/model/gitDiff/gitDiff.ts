export class CeateDiffFileOption {
    commitBefore: string;
    commitAfter: string;
    repoDir: string;
    branchBefore?: string;
    branchAfter?: string;

    constructor(commitBefore: string, commitAfter: string, repoDir: string) {
        this.commitBefore = commitBefore;
        this.commitAfter = commitAfter;
        this.repoDir = repoDir;
    }

}
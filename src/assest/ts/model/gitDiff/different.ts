import Status from "./status.ts";

class Different {
    file: string;
    status?: Status;
    content?: string;

    constructor(file: string, status?: Status, content?: string) {
        this.file = file;
        this.status = status;
        this.content = content;
    }
    
}

export default Different;
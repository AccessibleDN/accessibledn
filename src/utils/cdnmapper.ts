import fs from "fs";
import path from "path";

export interface IMapper<Directory extends boolean> {
    isDirectory: Directory;
    children: Directory extends true ? IMapper<true>[] : undefined;
    content: Directory extends false ? string | Buffer : undefined;
    name: string;
    path?: string; // Add path for better navigation
    size: number; // File size in bytes
}

export function mapper<T extends boolean>(basePath: string): IMapper<T>[] {
    try {
        const arr: IMapper<T>[] = [];
        const dirPath = path.join(process.cwd(), basePath);
        
        // Check if directory exists
        if (!fs.existsSync(dirPath)) {
            throw new Error(`Directory ${dirPath} does not exist`);
        }

        const dirContents = fs.readdirSync(dirPath);

        for (const content of dirContents) {
            try {
                const elementPath = path.join(basePath, content);
                const stats = fs.statSync(elementPath);
                const isDirectory = stats.isDirectory();
                
                const relativePath = path.relative(process.cwd(), elementPath);
                
                const mapperObject: IMapper<typeof isDirectory> = {
                    name: content,
                    isDirectory,
                    path: relativePath,
                    size: stats.size,
                    children: isDirectory ? mapper<true>(elementPath) : undefined,
                    content: isDirectory ? undefined : fs.readFileSync(elementPath)
                };
                
                arr.push(mapperObject as IMapper<T>); // Type assertion to fix type error
            } catch (err) {
                console.error(`Error processing ${content}:`, err);
                // Skip failed items but continue processing others
                continue;
            }
        }
        
        return arr;
    } catch (err) {
        console.error("Error in mapper function:", err);
        throw err; // Re-throw to let caller handle
    }
}
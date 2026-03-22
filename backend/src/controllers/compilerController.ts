import { Request, Response } from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export const runCode = async (req: Request, res: Response) => {
    const { language, code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const fileId = Date.now();
    let fileName = '';
    let command = '';
    let executeCommand = '';

    try {
        switch (language) {
            case 'cpp':
                fileName = `temp_${fileId}.cpp`;
                const exeName = `temp_${fileId}.exe`;
                const filePath = path.join(tempDir, fileName);
                const exePath = path.join(tempDir, exeName);
                fs.writeFileSync(filePath, code);
                
                command = `g++ "${filePath}" -o "${exePath}"`;
                executeCommand = `"${exePath}"`;

                exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
                    if (error) {
                        return res.status(200).json({ 
                            success: false, 
                            error: stderr || error.message,
                            type: 'Compilation Error'
                        });
                    }

                    exec(executeCommand, { timeout: 5000 }, (runError, runStdout, runStderr) => {
                        // Cleanup
                        try {
                            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                            if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
                        } catch (e) {}

                        if (runError) {
                            return res.status(200).json({ 
                                success: false, 
                                error: runStderr || runError.message,
                                type: 'Runtime Error'
                            });
                        }
                        res.json({ success: true, output: runStdout });
                    });
                });
                return;

            case 'java':
                fileName = `Main_${fileId}.java`;
                const javaPath = path.join(tempDir, fileName);
                // Simple Main class wrapper if user didn't provide one, but we assume they provide full class for professional use
                fs.writeFileSync(javaPath, code);
                
                command = `javac "${javaPath}"`;
                // Java needs the class name, we find it or assume Main if not specified
                const classMatch = code.match(/class\s+(\w+)/);
                const className = classMatch ? classMatch[1] : 'Main';
                executeCommand = `java -cp "${tempDir}" ${className}`;

                exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
                    if (error) {
                        return res.status(200).json({ 
                            success: false, 
                            error: stderr || error.message,
                            type: 'Compilation Error'
                        });
                    }

                    exec(executeCommand, { timeout: 5000 }, (runError, runStdout, runStderr) => {
                        // Cleanup .class files
                        try {
                            if (fs.existsSync(javaPath)) fs.unlinkSync(javaPath);
                            const classFile = path.join(tempDir, `${className}.class`);
                            if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
                        } catch (e) {}

                        if (runError) {
                            return res.status(200).json({ 
                                success: false, 
                                error: runStderr || runError.message,
                                type: 'Runtime Error'
                            });
                        }
                        res.json({ success: true, output: runStdout });
                    });
                });
                return;

            case 'python':
                fileName = `temp_${fileId}.py`;
                const pyPath = path.join(tempDir, fileName);
                fs.writeFileSync(pyPath, code);
                command = `python "${pyPath}"`;
                break;

            case 'javascript':
                fileName = `temp_${fileId}.js`;
                const jsPath = path.join(tempDir, fileName);
                fs.writeFileSync(jsPath, code);
                command = `node "${jsPath}"`;
                break;

            default:
                return res.status(400).json({ error: 'Unsupported language' });
        }

        if (command) {
            exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
                // Cleanup
                const filePath = path.join(tempDir, fileName);
                try {
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                } catch (e) {}

                if (error) {
                    return res.status(200).json({ 
                        success: false, 
                        error: stderr || error.message,
                        type: 'Runtime Error'
                    });
                }
                res.json({ success: true, output: stdout });
            });
        }

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

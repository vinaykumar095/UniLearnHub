"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCode = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const runCode = async (req, res) => {
    const { language, code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }
    const tempDir = path_1.default.join(__dirname, '../../temp');
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir);
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
                const filePath = path_1.default.join(tempDir, fileName);
                const exePath = path_1.default.join(tempDir, exeName);
                fs_1.default.writeFileSync(filePath, code);
                command = `g++ "${filePath}" -o "${exePath}"`;
                executeCommand = `"${exePath}"`;
                (0, child_process_1.exec)(command, { timeout: 10000 }, (error, stdout, stderr) => {
                    if (error) {
                        return res.status(200).json({
                            success: false,
                            error: stderr || error.message,
                            type: 'Compilation Error'
                        });
                    }
                    (0, child_process_1.exec)(executeCommand, { timeout: 5000 }, (runError, runStdout, runStderr) => {
                        try {
                            if (fs_1.default.existsSync(filePath))
                                fs_1.default.unlinkSync(filePath);
                            if (fs_1.default.existsSync(exePath))
                                fs_1.default.unlinkSync(exePath);
                        }
                        catch (e) { }
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
                const javaPath = path_1.default.join(tempDir, fileName);
                fs_1.default.writeFileSync(javaPath, code);
                command = `javac "${javaPath}"`;
                const classMatch = code.match(/class\s+(\w+)/);
                const className = classMatch ? classMatch[1] : 'Main';
                executeCommand = `java -cp "${tempDir}" ${className}`;
                (0, child_process_1.exec)(command, { timeout: 10000 }, (error, stdout, stderr) => {
                    if (error) {
                        return res.status(200).json({
                            success: false,
                            error: stderr || error.message,
                            type: 'Compilation Error'
                        });
                    }
                    (0, child_process_1.exec)(executeCommand, { timeout: 5000 }, (runError, runStdout, runStderr) => {
                        try {
                            if (fs_1.default.existsSync(javaPath))
                                fs_1.default.unlinkSync(javaPath);
                            const classFile = path_1.default.join(tempDir, `${className}.class`);
                            if (fs_1.default.existsSync(classFile))
                                fs_1.default.unlinkSync(classFile);
                        }
                        catch (e) { }
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
                const pyPath = path_1.default.join(tempDir, fileName);
                fs_1.default.writeFileSync(pyPath, code);
                command = `python "${pyPath}"`;
                break;
            case 'javascript':
                fileName = `temp_${fileId}.js`;
                const jsPath = path_1.default.join(tempDir, fileName);
                fs_1.default.writeFileSync(jsPath, code);
                command = `node "${jsPath}"`;
                break;
            default:
                return res.status(400).json({ error: 'Unsupported language' });
        }
        if (command) {
            (0, child_process_1.exec)(command, { timeout: 5000 }, (error, stdout, stderr) => {
                const filePath = path_1.default.join(tempDir, fileName);
                try {
                    if (fs_1.default.existsSync(filePath))
                        fs_1.default.unlinkSync(filePath);
                }
                catch (e) { }
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
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.runCode = runCode;

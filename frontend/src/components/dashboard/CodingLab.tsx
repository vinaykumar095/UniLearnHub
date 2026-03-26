import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Play, X, Loader2, 
    Settings, Code2, Copy, Trash2,
    AlertCircle, Beaker, ShieldCheck
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import api from '../../api/client';

import type { DSAProblem } from '../../data/dsaProblems';

interface CodingLabProps {
    problem?: DSAProblem;
    onClose: (solved?: boolean) => void;
}

const LANGUAGES = [
    { id: 'python', label: 'Python 3', default: 'print("Hello World!")' },
    { id: 'cpp', label: 'C++ (GCC)', default: '#include <iostream>\n\nint main() {\n    std::cout << "Hello Universe!" << std::endl;\n    return 0;\n}' },
    { id: 'javascript', label: 'Node.js', default: 'console.log("Hello Node!");' },
    { id: 'java', label: 'Java 17', default: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Java!");\n    }\n}' }
];

const getStarterCode = (problem: DSAProblem | undefined, langId: string) => {
    if (problem?.starterCode?.[langId]) return problem.starterCode[langId];
    
    // Auto-detect parameters from first example input
    // Input format example: "nums = [2,7], target = 9" -> ["nums", "target"]
    let params: string[] = [];
    if (problem?.examples?.[0]?.input) {
        const inputStr = problem.examples[0].input;
        // Split by comma and then by equals, taking the key side
        params = inputStr.split(',').map(part => part.split('=')[0].trim().toLowerCase());
    }

    // Fallback if no params detected
    if (params.length === 0) params = ["input"];

    const funcName = problem?.functionName || problem?.title?.replace(/[^a-zA-Z0-9]/g, '')
        .replace(/^[A-Z]/, c => c.toLowerCase()) || "solve";
        
    const paramStr = params.join(', ');
    const cppParamStr = params.map(p => {
        if (p === 'nums' || p.includes('arr')) return 'vector<int>& ' + p;
        if (p === 'target' || p === 'n' || p === 'k') return 'int ' + p;
        if (p === 's' || p === 'str') return 'string ' + p;
        return 'auto ' + p;
    }).join(', ');
    
    const javaParamStr = params.map(p => {
        if (p === 'nums' || p.includes('arr')) return 'int[] ' + p;
        if (p === 'target' || p === 'n' || p === 'k') return 'int ' + p;
        if (p === 's' || p === 'str') return 'String ' + p;
        return 'Object ' + p;
    }).join(', ');

    switch (langId) {
        case 'python':
            return `class Solution:\n    def ${funcName}(self, ${paramStr}):\n        # Write your code here\n        pass`;
        case 'cpp':
            const returnType = problem?.title?.toLowerCase().includes('sum') || problem?.title?.toLowerCase().includes('factorial') ? 'long long' : 'int';
            return `class Solution {\npublic:\n    ${returnType} ${funcName}(${cppParamStr}) {\n        
        case 'java':
            const jReturnType = problem?.title?.toLowerCase().includes('sum') || problem?.title?.toLowerCase().includes('factorial') ? 'long' : 'int';
            return `class Solution {\n    public ${jReturnType} ${funcName}(${javaParamStr}) {\n        
        case 'javascript':
            return `\nvar ${funcName} = function(${paramStr}) {\n    
        default:
            const lang = LANGUAGES.find(l => l.id === langId);
            return lang?.default || "";
    }
};

const getDefaultTests = (problem: DSAProblem | undefined) => {
    if (problem?.testCases && problem.testCases.length > 0) return problem.testCases;
    
    
    
    if (problem?.examples && problem.examples.length > 0) {
        return problem.examples.map((ex, idx) => ({
            input: ex.input,
            expected: ex.output,
            label: `Example ${idx + 1}`
        }));
    }

    return [
        { input: "Sample Input", expected: "Expected Output", label: "Example 1" }
    ];
};

const CodingLab = ({ problem, onClose }: CodingLabProps) => {
    const [language, setLanguage] = useState(LANGUAGES[0]);
    const [code, setCode] = useState(() => getStarterCode(problem, LANGUAGES[0].id));
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
    const [activeTab, setActiveTab] = useState<'console' | 'tests'>('console');
    const [testResults, setTestResults] = useState<any[]>([]);
    const [isSolved, setIsSolved] = useState(false);

    const handleLanguageChange = (langId: string) => {
        const lang = LANGUAGES.find(l => l.id === langId);
        if (lang) {
            setLanguage(lang);
            setCode(getStarterCode(problem, lang.id));
        }
    };

    const handleRun = async (mode: 'execute' | 'test' = 'execute') => {
        setIsRunning(true);
        setError(null);
        if (mode === 'test') {
            setActiveTab('tests');
            setTestResults([]);
        } else {
            setActiveTab('console');
            setOutput('Executing...');
        }
        
        try {
            let finalCode = code;
            if (mode === 'test') {
                const activeTests = getDefaultTests(problem);
                const activeFuncName = problem?.functionName || problem?.title?.replace(/[^a-zA-Z0-9]/g, '')
                    .replace(/^[A-Z]/, c => c.toLowerCase()) || "solve";

                if (language.id === 'python') {
                    finalCode += `\n\nimport json\ntest_cases = ${JSON.stringify(activeTests)}\nresults = []\nsol = Solution()\nfor i, tc in enumerate(test_cases):\n    try:\n        if isinstance(tc['input'], dict):\n            res = sol.${activeFuncName}(**tc['input'])\n        else:\n            res = sol.${activeFuncName}(tc['input'])\n        is_pass = json.dumps(res, sort_keys=True) == json.dumps(tc['expected'], sort_keys=True)\n        results.append({"case": i, "status": "pass" if is_pass else "fail", "actual": res})\n    except Exception as e:\n        results.append({"case": i, "status": "error", "actual": str(e)})\nprint("TEST_RESULTS:" + json.dumps(results))`;
                } else if (language.id === 'javascript') {
                    finalCode += `\n\nconst testCases = ${JSON.stringify(activeTests)};\nconst results = [];\nconst sol = new Solution();\ntestCases.forEach((tc, i) => {\n    try {\n        let res;\n        if (typeof tc.input === 'object' && !Array.isArray(tc.input)) {\n            res = sol.${activeFuncName}(...Object.values(tc.input));\n        } else {\n            res = sol.${activeFuncName}(tc.input);\n        }\n        const isPass = JSON.stringify(res) === JSON.stringify(tc.expected);\n        results.push({ case: i, status: isPass ? 'pass' : 'fail', actual: res });\n    } catch (e) {\n        results.push({ case: i, status: 'error', actual: e.message });\n    }\n});\nconsole.log("TEST_RESULTS:" + JSON.stringify(results));`;
                } else if (language.id === 'cpp') {
                    // Universal C++ Driver
                    let cppDriver = `\n\n#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    Solution sol;\n    cout << "TEST_RESULTS:[";\n`;
                    
                    activeTests.forEach((tc, i) => {
                        const inputStr = String(tc.input);
                        const paramParts = inputStr.split(',');
                        const argCalls = paramParts.map(part => {
                            const val = part.split('=')[1]?.trim() || part.trim();
                            if (!isNaN(parseInt(val))) return val;
                            return `"${val}"`;
                        }).join(', ');

                        cppDriver += `    {\n        auto res = sol.${activeFuncName}(${argCalls});\n`;
                        cppDriver += `        string expected = "${String(tc.expected)}";\n`; // Use direct string instead of stringified json to avoid double quotes
                        cppDriver += `        bool isPass = to_string(res) == expected;\n`;
                        cppDriver += `        cout << "{\\"case\\":${i}, \\"status\\":\\"" << (isPass ? "pass" : "fail") << "\\", \\"actual\\":" << res << "}";\n`;
                        cppDriver += `        ${i < activeTests.length - 1 ? 'cout << ",";' : ''}\n    }\n`;
                    });
                    
                    cppDriver += `    cout << "]" << endl;\n    return 0;\n}`;
                    finalCode += cppDriver;
                } else if (language.id === 'java') {
                    // Universal Java Driver
                    let javaDriver = `\n\nclass Driver {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.print("TEST_RESULTS:[");\n`;
                    activeTests.forEach((tc, i) => {
                        const inputStr = String(tc.input);
                        const paramParts = inputStr.split(',');
                        const argCalls = paramParts.map(part => {
                            const val = part.split('=')[1]?.trim() || part.trim();
                            if (!isNaN(parseInt(val))) return val;
                            return `"${val}"`;
                        }).join(', ');
                        
                        javaDriver += `        try {\n            Object res = sol.${activeFuncName}(${argCalls});\n`;
                        javaDriver += `            String expected = "${String(tc.expected)}";\n`;
                        javaDriver += `            String status = String.valueOf(res).equals(expected) ? "pass" : "fail";\n`;
                        javaDriver += `            System.out.print("{\\"case\\":${i},\\"status\\":\\"" + status + "\\",\\"actual\\":\\"" + res + "\\"}" + (${i < activeTests.length - 1 ? '","' : '""'}) );\n`;
                        javaDriver += `        } catch(Exception e) { System.out.print("{\\"case\\":${i},\\"status\\":\\"error\\"}" + (${i < activeTests.length - 1 ? '","' : '""'}) ); }\n`;
                    });
                    javaDriver += `        System.out.println("]");\n    }\n}`;
                    finalCode += javaDriver;
                }
            } else if (language.id === 'cpp' && !code.includes('int main')) {
                finalCode += `\n\n#include <iostream>\nusing namespace std;\nint main() { Solution sol; cout << "Code compiled successfully. Click 'Submit' to run test cases." << endl; return 0; }`;
            } else if (language.id === 'java' && !code.includes('public static void main')) {
                finalCode += `\n\nclass Main { public static void main(String[] args) { System.out.println("Code compiled successfully. Click 'Submit' to run test cases."); } }`;
            }

            const res = await api.post('/compiler/run', { 
                language: language.id, 
                code: finalCode 
            });

            if (res.data.success) {
                const rawOutput = res.data.output || '';
                if (mode === 'test' && rawOutput.includes('TEST_RESULTS:')) {
                    const parts = rawOutput.split('TEST_RESULTS:');
                    const resultsJson = JSON.parse(parts[1]);
                    setTestResults(resultsJson);
                    setOutput(parts[0]);
                    const allPass = resultsJson.length > 0 && resultsJson.every((r: any) => r.status === 'pass');
                    if (allPass && problem?.id) {
                        try {
                            await api.post('/dsa/submit', { problemId: problem.id });
                            setIsSolved(true);
                        } catch (err) {
                            console.error('Failed to record submission:', err);
                        }
                    }
                } else {
                    setOutput(rawOutput || 'No output.');
                }
            } else {
                setError(res.data.type || 'Error');
                setOutput(res.data.error || 'Unknown error occurred.');
            }
        } catch (err: any) {
            setError('Server Error');
            setOutput(err.response?.data?.error || 'Failed to connect to execution engine.');
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-slate-900"
        >
            {/* Header */}
            <div className="h-16 px-6 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary-600 rounded-lg text-white">
                        <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white tracking-tight">{problem?.title || 'Coding Lab'}</h2>
                        <div className="flex items-center gap-2">
                             <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                problem?.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : 
                                problem?.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                                {problem?.difficulty || 'Medium'}
                            </span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{problem?.category}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <select 
                        value={language.id} 
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/40"
                    >
                        {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                    </select>

                    <button 
                        onClick={() => setTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark')}
                        className="p-2 text-slate-400 hover:text-white transition-all"
                    >
                        <Settings className="w-4 h-4" />
                    </button>

                    <div className="h-6 w-[1px] bg-slate-800 mx-2" />

                    <button onClick={() => onClose()} className="p-2 text-slate-400 hover:text-rose-400 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Panel 1: Description */}
                <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900 text-slate-300 overflow-y-auto custom-scrollbar">
                    <div className="p-6 space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-white mb-4">Description</h3>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-400">
                                {problem?.description}
                            </div>
                        </div>

                        {problem?.examples && problem.examples.length > 0 && (
                            <div className="space-y-6">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Examples</h4>
                                {problem.examples.map((ex, i) => (
                                    <div key={i} className="space-y-3">
                                        <p className="text-xs font-black text-primary-400">Example {i + 1}:</p>
                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-2 font-mono text-xs">
                                            <div><span className="text-slate-500">Input:</span> {ex.input}</div>
                                            <div><span className="text-slate-500">Output:</span> {ex.output}</div>
                                            {ex.explanation && (
                                                <div className="pt-2 italic text-slate-500"><span className="text-slate-400 not-italic font-bold">Explanation:</span> {ex.explanation}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {problem?.constraints && problem.constraints.length > 0 && (
                            <div>
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Constraints</h4>
                                <ul className="list-disc list-inside space-y-2 text-xs text-slate-500 font-medium">
                                    {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel 2 & 3: Editor and Console */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            language={language.id === 'cpp' ? 'cpp' : language.id}
                            theme={theme}
                            value={code}
                            onChange={(val) => setCode(val || '')}
                            options={{
                                fontSize: 13,
                                fontFamily: "'Fira Code', 'Monaco', monospace",
                                minimap: { enabled: false },
                                padding: { top: 20 },
                                smoothScrolling: true,
                                lineNumbersMinChars: 3,
                                scrollBeyondLastLine: false,
                            }}
                        />
                        <div className="absolute top-4 right-6 flex gap-2">
                             <button 
                                onClick={() => { navigator.clipboard.writeText(code); }}
                                className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                                title="Copy Code"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setCode(getStarterCode(problem, language.id))}
                                className="p-2 bg-slate-800/80 hover:bg-rose-900/50 text-slate-300 rounded-lg transition-all"
                                title="Reset Code"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Resizeable console/tests panel */}
                    <div className="h-1/3 border-t border-slate-800 bg-slate-900 flex flex-col">
                        <div className="px-6 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex">
                                <button 
                                    onClick={() => setActiveTab('console')}
                                    className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'console' ? 'border-primary-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                >
                                    Console
                                </button>
                                <button 
                                    onClick={() => setActiveTab('tests')}
                                    className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'tests' ? 'border-primary-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                >
                                    Test Cases
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => handleRun('execute')}
                                    disabled={isRunning}
                                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Play className="w-3 h-3" /> Run
                                </button>
                                <button 
                                    onClick={() => handleRun('test')}
                                    disabled={isRunning}
                                    className="px-4 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Beaker className="w-3 h-3" />} Submit
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 font-mono text-xs">
                            {activeTab === 'console' ? (
                                <div className={error ? 'text-rose-400' : 'text-slate-400'}>
                                    {error && <div className="font-black mb-2 uppercase text-[9px] tracking-widest text-rose-500 flex items-center gap-2"><AlertCircle className="w-3 h-3" /> {error}</div>}
                                    <pre className="whitespace-pre-wrap">{output || 'Execute code to see output...'}</pre>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {isSolved && (
                                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                            <div>
                                                <p className="font-black text-[10px] uppercase tracking-widest leading-none mb-1">Solution Recorded!</p>
                                                <p className="text-[9px] font-medium opacity-80 uppercase">Progress synced with your roadmap.</p>
                                            </div>
                                        </div>
                                    )}

                                    {getDefaultTests(problem).map((tc, idx) => {
                                        const result = testResults[idx];
                                        return (
                                            <div key={idx} className={`p-4 rounded-xl border ${
                                                !result ? 'bg-slate-800/30 border-slate-700/50' :
                                                result.status === 'pass' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
                                            }`}>
                                                <div className="flex items-center justify-between mb-3 text-[9px] font-black uppercase tracking-widest">
                                                    <span className="text-slate-500">Case {idx + 1}</span>
                                                    {result && (
                                                        <span className={result.status === 'pass' ? 'text-emerald-400' : 'text-rose-400'}>
                                                            {result.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-slate-600 uppercase">Input</p>
                                                        <p className="text-slate-400 truncate">{JSON.stringify(tc.input)}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-slate-600 uppercase">Expected</p>
                                                        <p className="text-slate-400 truncate">{JSON.stringify(tc.expected)}</p>
                                                    </div>
                                                </div>
                                                {result && result.status !== 'pass' && (
                                                    <div className="mt-3 pt-3 border-t border-slate-800/50 space-y-1">
                                                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Actual</p>
                                                        <p className="text-rose-400/80">{JSON.stringify(result.actual)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div className="h-8 px-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-600">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online</span>
                    <span>|</span>
                    <span>Local Runtime</span>
                </div>
                <div>v1.2.0 • Monaco Editor</div>
            </div>
        </motion.div>
    );
};

export default CodingLab;

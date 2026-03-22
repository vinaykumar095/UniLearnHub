import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, Circle, Loader2,
    ExternalLink, Code, Database, Target, GraduationCap,
    ChevronDown, Trophy, Rocket, Brain, Globe, Lock
} from 'lucide-react';
import api from '../../api/client';

// Detailed Stage-based Roadmaps for various roles
const roadmapTemplates: Record<string, any[]> = {
    'Software Engineer': [
        {
            stageNumber: 1,
            title: 'Stage 1: Programming Foundation & DSA',
            milestones: [
                { title: 'Programming Basics (Java/C++/Python)', description: 'Master logic, loops, and data types.', resources: [{ label: 'roadmap.sh', link: 'https://roadmap.sh/' }] },
                { title: 'Data Structures Fundamentals', description: 'Arrays, Linked Lists, Stacks, and Queues.', resources: [{ label: 'GeeksforGeeks', link: 'https://www.geeksforgeeks.org/' }] },
                { title: 'Complete 100 DSA Problems', description: 'Solve problems on LeetCode/Hackerrank concentrating on basics.', resources: [{ label: 'LeetCode', link: 'https://leetcode.com/' }] },
            ]
        },
        {
            stageNumber: 2,
            title: 'Stage 2: Advanced Algorithms & OOPs',
            milestones: [
                { title: 'Advanced Algorithms', description: 'Trees, Graphs, and Dynamic Programming.', resources: [{ label: 'Blind 75', link: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions' }] },
                { title: 'Object-Oriented Programming (OOPs)', description: 'Classes, Inheritance, Polymorphism, and Encapsulation.', resources: [{ label: 'OOP Concepts', link: 'https://www.tutorialspoint.com/object_oriented_analysis_design/ooad_object_oriented_principles.htm' }] },
                { title: 'Build 3 Portfolio Projects', description: 'Consolidation of skills into tangible projects.', resources: [{ label: 'Project Ideas', link: 'https://github.com/florinpop17/app-ideas' }] },
            ]
        },
        {
            stageNumber: 3,
            title: 'Stage 3: System Design & Backend',
            milestones: [
                { title: 'System Design Basics', description: 'Scalability, Load Balancers, and Caching basics.', resources: [{ label: 'System Design Primer', link: 'https://github.com/donnemartin/system-design-primer' }] },
                { title: 'Backend Development (Node/Spring)', description: 'Building robust server-side applications and APIs.', resources: [{ label: 'Backend Roadmap', link: 'https://roadmap.sh/backend' }] },
            ]
        }
    ],
    'Web Developer': [
        {
            stageNumber: 1,
            title: 'Stage 1: Frontend Excellence',
            milestones: [
                { title: 'Modern HTML5 & CSS3', description: 'Semantic HTML, Flexbox, and CSS Grid.', resources: [{ label: 'W3Schools', link: 'https://www.w3schools.com/' }] },
                { title: 'JavaScript Essentials', description: 'ES6+ features, Async/Await, and DOM APIs.', resources: [{ label: 'JavaScript.info', link: 'https://javascript.info/' }] },
                { title: 'Responsive Portfolio Site', description: 'Build and deploy your personal brand site.', resources: [{ label: 'Github Pages', link: 'https://pages.github.com/' }] },
            ]
        },
        {
            stageNumber: 2,
            title: 'Stage 2: Frameworks & State',
            milestones: [
                { title: 'React.js Mastery', description: 'Hooks, Context API, and Virtual DOM.', resources: [{ label: 'React Docs', link: 'https://react.dev/' }] },
                { title: 'Tailwind CSS', description: 'Utility-first CSS for rapid UI development.', resources: [{ label: 'Tailwind Docs', link: 'https://tailwindcss.com/' }] },
                { title: 'State Management (Redux/Zustand)', description: 'Handle complex application state.', resources: [{ label: 'Zustand Docs', link: 'https://github.com/pmndrs/zustand' }] },
            ]
        },
        {
            stageNumber: 3,
            title: 'Stage 3: Fullstack Integration',
            milestones: [
                { title: 'Fullstack MERN Application', description: 'Connect React with Node, Express, and MongoDB.', resources: [{ label: 'Full Stack Open', link: 'https://fullstackopen.com/' }] },
                { title: 'Authentication & Security', description: 'Implement JWT, OAuth, and protect routes.', resources: [{ label: 'Auth0 Blog', link: 'https://auth0.com/blog/' }] },
            ]
        }
    ],
    'Data Scientist': [
        {
            stageNumber: 1,
            title: 'Stage 1: Data Analytics Base',
            milestones: [
                { title: 'Python for Data Science', description: 'NumPy, Pandas, and data cleaning basics.', resources: [{ label: 'Pandas Docs', link: 'https://pandas.pydata.org/' }] },
                { title: 'Statistics & Probability', description: 'Core math for data distribution and analysis.', resources: [{ label: 'StatQuest', link: 'https://statquest.org/' }] },
                { title: 'Data Visualization (Matplotlib/Seaborn)', description: 'Create insight-driven charts.', resources: [{ label: 'Seaborn Gallery', link: 'https://seaborn.pydata.org/examples/index.html' }] },
            ]
        },
        {
            stageNumber: 2,
            title: 'Stage 2: Machine Learning',
            milestones: [
                { title: 'Supervised Learning', description: 'Regression, Classification, and Decision Trees.', resources: [{ label: 'Scikit-learn', link: 'https://scikit-learn.org/' }] },
                { title: 'Unsupervised Learning & Clustering', description: 'K-Means, PCA, and Association Rules.', resources: [{ label: 'ML Mastery', link: 'https://machinelearningmastery.com/' }] },
                { title: 'Kaggle Competition Entry', description: 'Test your skills on real-world datasets.', resources: [{ label: 'Kaggle', link: 'https://www.kaggle.com/' }] },
            ]
        },
        {
            stageNumber: 3,
            title: 'Stage 3: Advanced DS & Deployment',
            milestones: [
                { title: 'Big Data Tools (Spark/SQL)', description: 'Handle datasets that don\'t fit in memory.', resources: [{ label: 'Apache Spark', link: 'https://spark.apache.org/' }] },
                { title: 'ML Model Deployment (Streamlit/Flask)', description: 'Turn your models into web apps.', resources: [{ label: 'Streamlit', link: 'https://streamlit.io/' }] },
            ]
        }
    ],
    'AI Engineer': [
        {
            stageNumber: 1,
            title: 'Stage 1: Neural Networks Base',
            milestones: [
                { title: 'Deep Learning Basics', description: 'Understand backpropagation and activation functions.', resources: [{ label: 'DeepLearning.AI', link: 'https://www.deeplearning.ai/' }] },
                { title: 'PyTorch/TensorFlow Fundamentals', description: 'Building tensors and simple networks.', resources: [{ label: 'PyTorch Tutorials', link: 'https://pytorch.org/tutorials' }] },
            ]
        },
        {
            stageNumber: 2,
            title: 'Stage 2: Computer Vision & NLP',
            milestones: [
                { title: 'Computer Vision (CNNs)', description: 'Object detection, segmentation, and image processing.', resources: [{ label: 'OpenCV', link: 'https://opencv.org/' }] },
                { title: 'Natural Language Processing (Transformers)', description: 'BERT, GPT-2, and Attention mechanisms.', resources: [{ label: 'Hugging Face Docs', link: 'https://huggingface.co/docs' }] },
            ]
        },
        {
            stageNumber: 3,
            title: 'Stage 3: Generative AI & LLMs',
            milestones: [
                { title: 'Prompt Engineering & RAG', description: 'Optimize LLM outputs with retrieved data.', resources: [{ label: 'LangChain', link: 'https://www.langchain.com/' }] },
                { title: 'Fine-tuning Large Models', description: 'Adapt pre-trained models for specific tasks.', resources: [{ label: 'Weights & Biases', link: 'https://wandb.ai/' }] },
            ]
        }
    ],
    'Cybersecurity Engineer': [
        {
            stageNumber: 1,
            title: 'Stage 1: Networking & Linux',
            milestones: [
                { title: 'Networking (TCP/IP)', description: 'Understand how the internet works at a packet level.', resources: [{ label: 'Cisco Networking', link: 'https://www.netacad.com/' }] },
                { title: 'Linux Administration', description: 'Command line mastery and system security.', resources: [{ label: 'Linux Journey', link: 'https://linuxjourney.com/' }] },
            ]
        },
        {
            stageNumber: 2,
            title: 'Stage 2: Pentesting & Offense',
            milestones: [
                { title: 'Web Vulnerability Assessment', description: 'Learn OWASP Top 10 injection, XSS, etc.', resources: [{ label: 'OWASP', link: 'https://owasp.org/' }] },
                { title: 'TryHackMe/HackTheBox Challenges', description: 'Practice hacking in legal lab environments.', resources: [{ label: 'TryHackMe', link: 'https://tryhackme.com/' }] },
            ]
        },
        {
            stageNumber: 3,
            title: 'Stage 3: Defensive Security (SOC)',
            milestones: [
                { title: 'SIEM & Log Analysis', description: 'Identify threats using Splunk or ELK.', resources: [{ label: 'Splunk Training', link: 'https://www.splunk.com/en_us/training.html' }] },
                { title: 'Security+ / CEH Prep', description: 'Focus on getting professional certifications.', resources: [{ label: 'CompTIA', link: 'https://www.comptia.org/' }] },
            ]
        }
    ],
    'Cloud Engineer': [
        {
            stageNumber: 1,
            title: 'Stage 1: Linux, Networking & Scripting',
            milestones: [
                { title: 'Linux Command Line Mastery', description: 'Permissions, processes, and shell scripting.', resources: [{ label: 'Linux Journey', link: 'https://linuxjourney.com/' }] },
                { title: 'Networking Fundamentals', description: 'DNS, HTTP/S, TCP/IP, and Load Balancing.', resources: [{ label: 'roadmap.sh/networking', link: 'https://roadmap.sh/networking' }] },
                { title: 'Python for Automation', description: 'Write scripts to automate infrastructure tasks.', resources: [{ label: 'Real Python', link: 'https://realpython.com/' }] },
            ]
        },
        {
            stageNumber: 2,
            title: 'Stage 2: Cloud Providers & Containers',
            milestones: [
                { title: 'AWS/Azure/GCP Essentials', description: 'EC2, S3, IAM, and Networking in the cloud.', resources: [{ label: 'AWS Training', link: 'https://explore.skillbuilder.aws/' }] },
                { title: 'Docker & Containerization', description: 'Building, shipping, and running containers.', resources: [{ label: 'Docker Docs', link: 'https://docs.docker.com/' }] },
                { title: 'Infrastructure as Code (Terraform)', description: 'Provising infrastructure using code.', resources: [{ label: 'Terraform Learn', link: 'https://developer.hashicorp.com/terraform/tutorials' }] },
            ]
        },
        {
            stageNumber: 3,
            title: 'Stage 3: DevOps & Kubernetes',
            milestones: [
                { title: 'Kubernetes Orchestration', description: 'Deploying and managing containerized apps at scale.', resources: [{ label: 'Kubernetes Basics', link: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/' }] },
                { title: 'CI/CD Pipelines', description: 'Automate deployments using GitHub Actions or Jenkins.', resources: [{ label: 'CI/CD Guide', link: 'https://www.redhat.com/en/topics/devops/what-is-ci-cd' }] },
                { title: 'Monitoring & Logging', description: 'Using Prometheus, Grafana, and ELK stack.', resources: [{ label: 'DevOps Roadmap', link: 'https://roadmap.sh/devops' }] },
            ]
        }
    ],
    'IoT Developer': [
        {
            stageNumber: 1,
            title: 'Stage 1: Electronics & Embedded C',
            milestones: [
                { title: 'Basic Electronics', description: 'Understanding circuits, sensors, and microcontrollers.', resources: [{ label: 'SparkFun Learn', link: 'https://learn.sparkfun.com/' }] },
                { title: 'Embedded C/C++ Programming', description: 'Writing efficient code for hardware.', resources: [{ label: 'Arduino Docs', link: 'https://www.arduino.cc/en/Guide' }] },
                { title: 'Raspberry Pi / ESP32 Basics', description: 'Setting up and controlled GPIO pins.', resources: [{ label: 'Random Nerd Tutorials', link: 'https://randomnerdtutorials.com/' }] },
            ]
        },
        {
            stageNumber: 2,
            title: 'Stage 2: Protocols & Connectivity',
            milestones: [
                { title: 'Communication Protocols', description: 'Mastering MQTT, HTTP, I2C, SPI, and UART.', resources: [{ label: 'IoT Protocols', link: 'https://www.postman.com/state-of-the-api/what-is-mqtt/' }] },
                { title: 'Wireless Tech (LoRa/Zigbee/BLE)', description: 'Low power wide area network technologies.', resources: [{ label: 'The Things Network', link: 'https://www.thethingsnetwork.org/docs/' }] },
            ]
        },
        {
            stageNumber: 3,
            title: 'Stage 3: IoT Cloud & Analytics',
            milestones: [
                { title: 'IoT Cloud Platforms', description: 'AWS IoT Core or Azure IoT Hub integration.', resources: [{ label: 'AWS IoT Core', link: 'https://aws.amazon.com/iot-core/' }] },
                { title: 'Edge Computing', description: 'Processing data locally before sending to cloud.', resources: [{ label: 'Edge Computing Prep', link: 'https://www.ibm.com/topics/edge-computing' }] },
            ]
        }
    ],
    'Blockchain Developer': [
        {
            stageNumber: 1,
            title: 'Stage 1: Blockchain Fundamentals',
            milestones: [
                { title: 'Cryptography & Hashing', description: 'Public/Private keys and consensus mechanisms.', resources: [{ label: 'Blockchain Basics', link: 'https://www.coindesk.com/learn/blockchain-basics/' }] },
                { title: 'Bitcoin vs Ethereum Architecture', description: 'Understanding distributed ledgers and VMs.', resources: [{ label: 'Ethereum.org', link: 'https://ethereum.org/en/developers/' }] },
            ]
        },
        {
            stageNumber: 2,
            title: 'Stage 2: Smart Contracts',
            milestones: [
                { title: 'Solidity Programming', description: 'Writing smart contracts on Ethereum.', resources: [{ label: 'CryptoZombies', link: 'https://cryptozombies.io/' }] },
                { title: 'Hardhat/Foundry Frameworks', description: 'Testing and deploying contracts.', resources: [{ label: 'Hardhat Docs', link: 'https://hardhat.org/' }] },
                { title: 'Web3.js / Ethers.js', description: 'Connecting frontend to blockchain.', resources: [{ label: 'Ethers.js Docs', link: 'https://docs.ethers.org/' }] },
            ]
        },
        {
            stageNumber: 3,
            title: 'Stage 3: DeFi & dApps',
            milestones: [
                { title: 'Building a dApp', description: 'Fullstack decentralized application development.', resources: [{ label: 'Fullstack Web3', link: 'https://web3.career/learn-web3' }] },
                { title: 'Smart Contract Security', description: 'Auditing and common vulnerability patterns.', resources: [{ label: 'OpenZeppelin', link: 'https://docs.openzeppelin.com/' }] },
            ]
        }
    ]
};

const goalMapping: Record<string, string[]> = {
    'CSE (Core)': ['Software Engineer', 'Web Developer', 'Data Scientist', 'AI Engineer', 'Cybersecurity Engineer', 'Cloud Engineer', 'IoT Developer', 'Blockchain Developer'],
    'CSE (AI & ML)': ['AI Engineer', 'Data Scientist', 'Software Engineer', 'Cloud Engineer'],
    'CSE (Data Science)': ['Data Scientist', 'AI Engineer', 'Software Engineer', 'Cloud Engineer'],
    'CSE (Cyber Security)': ['Cybersecurity Engineer', 'Cloud Engineer', 'Software Engineer', 'Blockchain Developer'],
    'CSE (IoT)': ['IoT Developer', 'Cloud Engineer', 'Software Engineer', 'Web Developer'],
    'CSE (Cloud)': ['Cloud Engineer', 'Web Developer', 'Software Engineer', 'Cybersecurity Engineer'],
    'IT': ['Software Engineer', 'Web Developer', 'Cloud Engineer', 'Cybersecurity Engineer', 'Blockchain Developer'],
    'Other': ['Software Engineer', 'Web Developer', 'Data Scientist', 'AI Engineer', 'Cybersecurity Engineer', 'Cloud Engineer', 'IoT Developer', 'Blockchain Developer']
};

const CareerRoadmap = () => {
    const [roadmap, setRoadmap] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [togglingTitle, setTogglingTitle] = useState<string | null>(null);
    const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({ 1: true });

    const [branch, setBranch] = useState('');
    const [goal, setGoal] = useState('');

    useEffect(() => {
        setGoal('');
    }, [branch]);

    useEffect(() => {
        loadRoadmap();
    }, []);

    const loadRoadmap = async () => {
        try {
            const res = await api.get('/career/roadmap');
            if (res.data) setRoadmap(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleCreateRoadmap = async () => {
        if (!branch || !goal) return;
        setCreating(true);
        try {
            const stages = (roadmapTemplates[goal] || []).map(s => ({
                ...s,
                milestones: s.milestones.map((m: any) => ({ ...m, status: 'pending' }))
            }));

            const res = await api.post('/career/roadmap', {
                branch,
                goal,
                interests: [goal],
                stages
            });
            setRoadmap(res.data);
        } catch (e) { console.error(e); }
        finally { setCreating(false); }
    };

    const toggleMilestone = async (milestoneTitle: string, currentStatus: string) => {
        setTogglingTitle(milestoneTitle);
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        try {
            const res = await api.patch(`/career/roadmap/${roadmap._id}/step`, { milestoneTitle, status: newStatus });
            setRoadmap(res.data);
        } catch (e) { console.error(e); }
        finally { setTogglingTitle(null); }
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

    const allMilestones = roadmap?.stages?.flatMap((s: any) => s.milestones) || [];
    const completed = allMilestones.filter((m: any) => m.status === 'completed').length;
    const total = allMilestones.length;
    const progress = total ? Math.round((completed / total) * 100) : 0;

    const toggleStage = (stageNum: number) => {
        setExpandedStages(prev => ({ ...prev, [stageNum]: !prev[stageNum] }));
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20 px-4">
            <header className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Career Journey</h1>
                <p className="text-slate-500 font-medium text-lg">A structured, stage-based plan to transform your ambition into expertise.</p>
            </header>

            {!roadmap ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden">
                    <div className="p-12 text-center bg-gradient-to-b from-primary-50/50 to-white">
                        <div className="w-20 h-20 bg-primary-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-200">
                            <Rocket className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Initialize Your Path</h2>
                        <p className="text-slate-500 font-medium max-w-md mx-auto">Select your foundations and target goal. We'll generate a 3-stage roadmap tailored to modern industry standards.</p>
                    </div>

                    <div className="p-12 space-y-10">
                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                <GraduationCap className="w-4 h-4 text-primary-500" /> Academic Background
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {[
                                    'CSE (Core)', 'CSE (AI & ML)', 'CSE (Data Science)', 
                                    'CSE (Cyber Security)', 'CSE (IoT)', 'CSE (Cloud)',
                                    'IT', 'Other'
                                ].map(b => (
                                    <button key={b} onClick={() => setBranch(b)}
                                        className={`px-4 py-3 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all border-2 text-center ${branch === b ? 'border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-200' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}>
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                <Target className="w-4 h-4 text-indigo-500" /> Choose Your Destiny
                            </label>
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={branch || 'all'}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                >
                                    {Object.keys(roadmapTemplates)
                                        .filter(g => !branch || (goalMapping[branch] || goalMapping['Other']).includes(g))
                                        .map(g => {
                                            const Icon = g.includes('Dev') || g.includes('Web') ? Globe : 
                                                        g.includes('Data') ? Database : 
                                                        g.includes('Engineer') && g.includes('AI') ? Brain : 
                                                        g.includes('Cyber') || g.includes('Blockchain') ? Lock : 
                                                        g.includes('Cloud') ? Rocket : Code;
                                            return (
                                                <button key={g} onClick={() => setGoal(g)}
                                                    className={`p-6 rounded-[2rem] font-black text-sm transition-all border-2 text-left flex flex-col gap-4 group ${goal === g ? 'border-primary-600 bg-primary-50 text-primary-900 shadow-xl shadow-primary-100' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}>
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${goal === g ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white text-slate-400 group-hover:text-primary-500'}`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black mb-1">{g}</div>
                                                        <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest leading-none">3 Stages • 8+ Milestones</div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                </motion.div>
                            </AnimatePresence>

                        </div>

                        <button onClick={handleCreateRoadmap} disabled={creating || !branch || !goal}
                            className="group relative w-full bg-slate-900 text-white py-6 rounded-3xl font-black hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 text-xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/0 via-white/10 to-primary-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            {creating ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Rocket className="w-6 h-6" /> Launch My Roadmap</>}
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="space-y-10">
                    {/* Status Header */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 blur-3xl rounded-full" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-20 h-20 bg-primary-600 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-primary-200">
                                    <Trophy className="w-10 h-10" />
                                </div>
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-primary-100">
                                        Level: Apprentice
                                    </div>
                                    <h2 className="font-black text-slate-900 text-3xl leading-none">{roadmap.goal}</h2>
                                    <p className="text-slate-400 font-bold text-sm mt-2">{roadmap.branch} • {total} Strategic Milestones</p>
                                </div>
                            </div>
                            <button onClick={() => { if (window.confirm('Reset this roadmap? You will lose all progress.')) { api.delete(`/career/roadmap/${roadmap._id}`).then(() => setRoadmap(null)); } }}
                                className="px-6 py-3 bg-red-50 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                Reset Journey
                            </button>
                        </div>

                        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-black">Mastery</h3>
                                    <div className="text-3xl font-black text-primary-400">{progress}%</div>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-4 relative overflow-hidden mb-4">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5 }}
                                        className="h-full bg-gradient-to-r from-primary-500 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                    {completed} steps conquered • {total - completed} remaining
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stage Timeline */}
                    <div className="space-y-6">
                        {roadmap.stages.map((stage: any) => {
                            const isExpanded = expandedStages[stage.stageNumber];
                            const stageCompleted = stage.milestones.filter((m: any) => m.status === 'completed').length;
                            const stageTotal = stage.milestones.length;
                            const stagePercent = Math.round((stageCompleted / stageTotal) * 100);

                            return (
                                <div key={stage.stageNumber} className="group">
                                    <div onClick={() => toggleStage(stage.stageNumber)}
                                        className={`cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-between shadow-sm hover:shadow-xl ${isExpanded ? 'bg-white border-primary-100 mb-6' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'}`}>
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl transition-all duration-500 ${stagePercent === 100 ? 'bg-green-500 text-white shadow-lg shadow-green-100' : isExpanded ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                                {stagePercent === 100 ? <CheckCircle2 className="w-8 h-8" /> : stage.stageNumber}
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-black transition-colors ${isExpanded ? 'text-primary-600' : 'text-slate-800'}`}>{stage.title}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className={`h-full transition-all duration-1000 ${stagePercent === 100 ? 'bg-green-500' : 'bg-primary-500'}`} style={{ width: `${stagePercent}%` }} />
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stageCompleted}/{stageTotal} Milestones</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                                            <ChevronDown className="w-5 h-5 text-slate-500" />
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4 md:ml-12 overflow-hidden pb-1">
                                                {stage.milestones.map((milestone: any, idx: number) => (
                                                    <motion.div key={milestone.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                                                        onClick={(e) => { e.stopPropagation(); toggleMilestone(milestone.title, milestone.status); }}
                                                        className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer group/card flex gap-4 ${milestone.status === 'completed' ? 'bg-green-50/30 border-green-100' : 'bg-white border-slate-50 hover:border-primary-200 hover:shadow-xl hover:-translate-y-1'}`}>

                                                        <div className={`w-12 h-12 rounded-2xl border-4 flex items-center justify-center flex-shrink-0 transition-all ${milestone.status === 'completed' ? 'bg-green-500 border-green-50 text-white' : 'bg-white border-slate-50 text-slate-200 group-hover/card:border-primary-50 group-hover/card:text-primary-400'}`}>
                                                            {togglingTitle === milestone.title ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                                                milestone.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h4 className={`text-base font-black leading-tight mb-2 transition-all ${milestone.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                                {milestone.title}
                                                            </h4>
                                                            <p className={`text-xs font-medium leading-relaxed mb-4 ${milestone.status === 'completed' ? 'text-slate-300' : 'text-slate-500'}`}>
                                                                {milestone.description}
                                                            </p>

                                                            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50 mt-auto">
                                                                {milestone.resources?.map((res: any) => (
                                                                    <a key={res.label} href={res.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                                                                        <ExternalLink className="w-3 h-3" /> {res.label}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* Final CTA */}
                    <div className="bg-indigo-900 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl mt-12">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px]" />
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-2xl font-black text-white">Keep Pushing, Apprentice!</h3>
                            <p className="text-indigo-300 font-medium max-w-md mx-auto">Consistency is the key to mastery. Complete your daily milestones and watch your progress soar.</p>
                            <div className="flex flex-wrap justify-center gap-4 pt-6">
                                <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/10 text-white font-bold text-sm">
                                    💡 Tip: Master patterns, not just syntax.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerRoadmap;

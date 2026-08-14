import fs from 'fs';

let code = fs.readFileSync('src/components/dashboard/DashboardView.tsx', 'utf8');

// Import Edit3
code = code.replace(/Trash2, Pin, Sparkles,/, 'Trash2, Pin, Sparkles, Edit3,');

// Insert states
const stateInsertionPoint = "const [showAddTaskInput, setShowAddTaskInput] = useState(false);";
const stateCode = `const [showAddTaskInput, setShowAddTaskInput] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTaskInput, setEditTaskInput] = useState('');`;
code = code.replace(stateInsertionPoint, stateCode);

// Insert handlers
const handlerInsertionPoint = "const deleteTask = (id: number, e: React.MouseEvent) => {";
const handlerCode = `const startEditTask = (task: { id: number; text: string; completed: boolean }, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTaskId(task.id);
    setEditTaskInput(task.text);
  };

  const saveEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTaskInput.trim() || editingTaskId === null) {
      setEditingTaskId(null);
      return;
    }
    setTasks(prev => prev.map(t => t.id === editingTaskId ? { ...t, text: editTaskInput.trim() } : t));
    setEditingTaskId(null);
    setEditTaskInput('');
  };

  const deleteTask = (id: number, e: React.MouseEvent) => {`;
code = code.replace(handlerInsertionPoint, handlerCode);

// Modify rendering
const renderRegex = /\{tasks\.map\(t => \(\s*<div\s*key=\{t\.id\}\s*onClick=\{\(\) => toggleTask\(t\.id\)\}\s*className="flex items-center justify-between cursor-pointer group"\s*>\s*<div className="flex items-center space-x-3 min-w-0 pr-2">([\s\S]*?)<\/button>\s*<\/div>\s*\)\)\}/m;

const replacementRender = `{tasks.map(t => (
                <div 
                  key={t.id}
                  onClick={() => { if (editingTaskId !== t.id) toggleTask(t.id); }}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  {editingTaskId === t.id ? (
                    <form onSubmit={saveEditTask} className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={editTaskInput}
                        onChange={(e) => setEditTaskInput(e.target.value)}
                        className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#a855f7]"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onBlur={saveEditTask}
                      />
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        <div className={\`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 \${
                          t.completed 
                            ? 'bg-[#a855f7] border-[#a855f7] text-black' 
                            : 'border-[#222222] group-hover:border-[#a855f7]'
                        }\`}>
                          {t.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className={\`text-xs truncate \${
                          t.completed ? 'line-through text-[#707085]' : 'text-white'
                        }\`}>
                          {t.text}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => startEditTask(t, e)}
                          className="opacity-0 group-hover:opacity-100 text-[#707085] hover:text-[#a855f7] p-1 transition-opacity"
                          title="Edit task"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => deleteTask(t.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-[#707085] hover:text-red-400 p-1 transition-opacity"
                          title="Delete task"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}`;

code = code.replace(renderRegex, replacementRender);

fs.writeFileSync('src/components/dashboard/DashboardView.tsx', code);
console.log('Modified DashboardView');

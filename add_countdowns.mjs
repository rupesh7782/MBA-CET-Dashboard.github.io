import fs from 'fs';

let code = fs.readFileSync('src/components/dashboard/DashboardView.tsx', 'utf8');

// 1. Add states for countdown
const stateInsertionPoint = "const [newTaskInput, setNewTaskInput] = useState('');";
const stateCode = `const [countdowns, setCountdowns] = useState<{ id: number; examName: string; examDate: string; color: string }[]>(() => {
    try {
      const saved = localStorage.getItem('mba_cet_prep_v1_dashboard_countdowns');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, examName: 'MBA CET 2027', examDate: '2027-03-15', color: '#4ade80' },
      { id: 2, examName: 'SNAP 2026', examDate: '2026-12-10', color: '#c084fc' },
      { id: 3, examName: 'CAT 2026', examDate: '2026-11-29', color: '#38bdf8' },
      { id: 4, examName: 'CMAT 2026', examDate: '2026-05-04', color: '#a3e635' },
      { id: 5, examName: 'NMAT 2026', examDate: '2026-10-10', color: '#facc15' },
    ];
  });
  const [showEditCountdownsModal, setShowEditCountdownsModal] = useState(false);
  const [editingCountdowns, setEditingCountdowns] = useState<{ id: number; examName: string; examDate: string; color: string }[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('mba_cet_prep_v1_dashboard_countdowns', JSON.stringify(countdowns));
    } catch (e) {}
  }, [countdowns]);

  const getDaysRemaining = (targetDateStr: string) => {
    const target = new Date(targetDateStr);
    const today = new Date();
    target.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const [newTaskInput, setNewTaskInput] = useState('');`;

code = code.replace(stateInsertionPoint, stateCode);

// 2. Add Widget rendering above Widget 1
const widgetInsertionPoint = "{/* Widget 1: Today's Tasks */}";
const widgetCode = `{/* Widget 0: Exam Countdown */}
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <h3 className="text-[13px] font-bold text-white tracking-widest uppercase">Exam Countdown</h3>
              <button
                onClick={() => {
                  setEditingCountdowns([...countdowns]);
                  setShowEditCountdownsModal(true);
                }}
                className="text-[#707085] hover:text-white transition-colors"
                title="Edit Countdowns"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-0 text-xs">
              {countdowns.map(c => {
                const days = getDaysRemaining(c.examDate);
                return (
                  <div key={c.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="font-bold text-[#e5e5e5]">{c.examName}</span>
                    <div className="text-right flex items-end space-x-1">
                      <span className="text-sm font-black tracking-tight" style={{ color: c.color }}>
                        D- {days > 0 ? days : 0}
                      </span>
                      <span className="text-[10px] text-[#707085] leading-loose">Days</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 1: Today's Tasks */}`;

code = code.replace(widgetInsertionPoint, widgetCode);

// 3. Add Modal rendering at the bottom
const modalInsertionPoint = "{/* Edit Metrics Modal */}";
const modalCode = `{/* Edit Countdowns Modal */}
      <Modal
        isOpen={showEditCountdownsModal}
        onClose={() => setShowEditCountdownsModal(false)}
        title="Edit Exam Countdowns"
        subtitle="Add, remove, or modify your target exams"
      >
        <div className="space-y-4">
          {editingCountdowns.map((c, i) => (
            <div key={c.id} className="flex items-center space-x-2 bg-[#121212] p-2 rounded-xl border border-white/10">
              <input
                type="text"
                value={c.examName}
                onChange={e => {
                  const newArr = [...editingCountdowns];
                  newArr[i].examName = e.target.value;
                  setEditingCountdowns(newArr);
                }}
                className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none"
                placeholder="Exam Name"
              />
              <input
                type="date"
                value={c.examDate}
                onChange={e => {
                  const newArr = [...editingCountdowns];
                  newArr[i].examDate = e.target.value;
                  setEditingCountdowns(newArr);
                }}
                className="w-32 bg-transparent border-none text-xs text-[#707085] focus:outline-none [color-scheme:dark]"
              />
              <input
                type="color"
                value={c.color}
                onChange={e => {
                  const newArr = [...editingCountdowns];
                  newArr[i].color = e.target.value;
                  setEditingCountdowns(newArr);
                }}
                className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer rounded-full overflow-hidden"
              />
              <button
                onClick={() => {
                  setEditingCountdowns(editingCountdowns.filter(item => item.id !== c.id));
                }}
                className="p-1.5 text-[#707085] hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          <button
            onClick={() => {
              setEditingCountdowns([
                ...editingCountdowns, 
                { id: Date.now(), examName: 'New Exam', examDate: new Date().toISOString().split('T')[0], color: '#ffffff' }
              ]);
            }}
            className="w-full py-2 border border-dashed border-white/20 rounded-xl text-xs text-[#707085] hover:text-white hover:border-white/40 transition-colors flex items-center justify-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Exam</span>
          </button>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowEditCountdownsModal(false)}
              className="flex-1 py-2.5 bg-[#1a1a1a] text-white font-bold rounded-[14px] hover:bg-[#222222] transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setCountdowns(editingCountdowns);
                setShowEditCountdownsModal(false);
              }}
              className="flex-1 py-2.5 bg-[#a855f7] text-white font-bold rounded-[14px] hover:bg-[#9333ea] transition-all text-xs shadow-lg shadow-[#a855f7]/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Metrics Modal */}`;

code = code.replace(modalInsertionPoint, modalCode);

fs.writeFileSync('src/components/dashboard/DashboardView.tsx', code);
console.log('updated dashboard view with countdowns');

import { useEffect, useRef, useState } from "react";

const MODES = {
  dyslexia: {
    label: "Dyslexia Mode", emoji: "📖", bg: "#1a1a2e", card: "#16213e",
    accent: "#e94560", text: "#f5f0e8", secondary: "#a8a0c0",
    fontFamily: "'Lexie Readable', 'Comic Sans MS', cursive",
    fontSize: "1.35rem", lineHeight: "2.2", letterSpacing: "0.05em", wordSpacing: "0.2em",
    description: "High contrast · Wide spacing · Audio support", color: "#ff6b9d",
  },
  adhd: {
    label: "ADHD Mode", emoji: "⚡", bg: "#0d0d0d", card: "#111",
    accent: "#00ff88", text: "#ffffff", secondary: "#888",
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    fontSize: "1.1rem", lineHeight: "1.8", letterSpacing: "0.02em", wordSpacing: "0.05em",
    description: "Micro-lessons · XP points · Progress bars", color: "#00ff88",
  },
  autism: {
    label: "Autism Spectrum", emoji: "🧩", bg: "#f0f4ff", card: "#ffffff",
    accent: "#3b82f6", text: "#1e293b", secondary: "#64748b",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: "1.05rem", lineHeight: "1.9", letterSpacing: "0.03em", wordSpacing: "0.05em",
    description: "Structured steps · No surprises · Predictable", color: "#3b82f6",
  },
};

const TOPICS = ["Fractions", "Water Cycle", "Photosynthesis", "Gravity", "Parts of Speech"];

function LoadingDots({ color }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:color, animation:`bounce 1s ease-in-out ${i*0.2}s infinite` }} />
      ))}
    </div>
  );
}

function DyslexiaLesson({ lesson, topic }) {
  const m = MODES.dyslexia;
  const [speaking, setSpeaking] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const sentences = lesson ? lesson.split(/(?<=[.!?])\s+/) : [];
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    }
  };
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <div style={{ color:m.accent, fontSize:"0.75rem", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:4 }}>Today's Lesson</div>
          <div style={{ color:m.text, fontSize:"1.5rem", fontWeight:700 }}>{topic}</div>
        </div>
        <button onClick={() => speak(lesson)} style={{ background:speaking?m.accent:"transparent", border:`2px solid ${m.accent}`, borderRadius:12, padding:"10px 16px", color:speaking?"#fff":m.accent, cursor:"pointer", fontSize:"1rem", display:"flex", alignItems:"center", gap:6, transition:"all 0.2s" }}>
          {speaking ? "🔊 Reading..." : "🔊 Read Aloud"}
        </button>
      </div>
      <div style={{ background:"rgba(233,69,96,0.08)", borderLeft:`4px solid ${m.accent}`, borderRadius:12, padding:"20px 24px", marginBottom:20 }}>
        <div style={{ fontFamily:m.fontFamily, fontSize:m.fontSize, lineHeight:m.lineHeight, letterSpacing:m.letterSpacing, wordSpacing:m.wordSpacing, color:m.text }}>
          {sentences.map((s,i) => (
            <span key={i} onClick={() => { setHighlighted(i); speak(s); }} style={{ background:highlighted===i?"rgba(233,69,96,0.2)":"transparent", borderRadius:4, padding:"2px 4px", cursor:"pointer", display:"inline", transition:"background 0.2s" }}>
              {s}{" "}
            </span>
          ))}
        </div>
      </div>
      <div style={{ color:m.secondary, fontSize:"0.8rem", textAlign:"center" }}>👆 Tap any sentence to hear it read aloud</div>
      <div style={{ display:"flex", gap:10, marginTop:20 }}>
        {["A+","Aa","🎨"].map((tool,i) => (
          <div key={i} style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:10, textAlign:"center", cursor:"pointer", color:m.secondary, fontSize:"0.85rem" }}>
            <div style={{ fontSize:"1.2rem" }}>{tool}</div>
            <div>{["Larger","Spacing","Tint"][i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ADHDLesson({ lesson, topic }) {
  const m = MODES.adhd;
  const [current, setCurrent] = useState(0);
  const [xp, setXp] = useState(0);
  const [timer, setTimer] = useState(180);
  const [done, setDone] = useState([]);
  const timerRef = useRef(null);
  const chunks = lesson ? lesson.match(/[^.!?]+[.!?]+/g)?.filter(Boolean).slice(0,5) || [lesson] : [];
  useEffect(() => {
    timerRef.current = setInterval(() => setTimer(t => t > 0 ? t-1 : 0), 1000);
    return () => clearInterval(timerRef.current);
  }, []);
  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const progress = chunks.length > 0 ? ((current+1)/chunks.length)*100 : 0;
  const handleNext = () => {
    if (!done.includes(current)) { setDone([...done,current]); setXp(x => x+25); }
    if (current < chunks.length-1) setCurrent(c => c+1);
  };
  const funs = ["🌟 You're doing amazing!","🔥 On a roll!","💪 Keep going champ!","✨ Level up incoming!","🚀 You're a star!"];
  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        {[["⚡ XP POINTS", xp, m.accent],["⏱ TIME LEFT", fmt(timer), timer<30?"#ff4444":"#fff"],["📚 CHUNK", `${current+1}/${chunks.length}`, "#fff"]].map(([label,val,color],i) => (
          <div key={i} style={{ flex:1, background:"#1a1a1a", borderRadius:12, padding:"12px 16px", border:"1px solid #222" }}>
            <div style={{ color:"#888", fontSize:"0.7rem", marginBottom:2 }}>{label}</div>
            <div style={{ color, fontSize:"1.4rem", fontWeight:800 }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"#222", borderRadius:99, height:8, marginBottom:20, overflow:"hidden" }}>
        <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${m.accent},#00d4ff)`, borderRadius:99, transition:"width 0.5s ease" }} />
      </div>
      <div style={{ display:"inline-block", background:"rgba(0,255,136,0.1)", border:`1px solid ${m.accent}`, borderRadius:99, padding:"4px 14px", color:m.accent, fontSize:"0.75rem", fontWeight:700, marginBottom:16, letterSpacing:"0.1em", textTransform:"uppercase" }}>
        {topic} · Micro-lesson {current+1}
      </div>
      {chunks[current] && (
        <div style={{ background:"#1a1a1a", border:`1px solid ${done.includes(current)?m.accent:"#2a2a2a"}`, borderRadius:16, padding:"20px 22px", marginBottom:16, transition:"border 0.3s", position:"relative" }}>
          {done.includes(current) && <div style={{ position:"absolute", top:10, right:14, color:m.accent, fontSize:"1.3rem" }}>✓</div>}
          <div style={{ fontFamily:m.fontFamily, fontSize:m.fontSize, lineHeight:m.lineHeight, color:m.text }}>{chunks[current]}</div>
        </div>
      )}
      <div style={{ background:"rgba(0,255,136,0.06)", border:"1px dashed rgba(0,255,136,0.3)", borderRadius:12, padding:"10px 16px", color:"#aaa", fontSize:"0.85rem", marginBottom:20 }}>
        {funs[current % funs.length]}
      </div>
      <button onClick={handleNext} style={{ width:"100%", background:m.accent, border:"none", borderRadius:14, padding:16, color:"#000", fontWeight:800, fontSize:"1rem", cursor:"pointer", letterSpacing:"0.05em", boxShadow:`0 0 20px rgba(0,255,136,0.3)` }}>
        {current < chunks.length-1 ? "✓ Got it! Next chunk →" : "🏆 Complete Lesson!"}
      </button>
    </div>
  );
}

function AutismLesson({ lesson, topic }) {
  const m = MODES.autism;
  const [checked, setChecked] = useState([]);
  const [current, setCurrent] = useState(0);
  const steps = lesson ? lesson.match(/[^.!?]+[.!?]+/g)?.filter(Boolean).map((s,i) => ({ id:i, text:s.trim(), label:`Step ${i+1}` })) || [] : [];
  const toggle = (id) => {
    if (checked.includes(id)) { setChecked(checked.filter(c => c!==id)); }
    else { setChecked([...checked,id]); if(id===current && current<steps.length-1) setTimeout(()=>setCurrent(c=>c+1),300); }
  };
  const allDone = steps.length > 0 && checked.length === steps.length;
  return (
    <div>
      <div style={{ background:"#e8f0ff", borderRadius:12, padding:"14px 18px", marginBottom:20, border:"2px solid #c7d7ff" }}>
        <div style={{ color:m.accent, fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.1em", marginBottom:4 }}>TODAY'S LESSON</div>
        <div style={{ color:m.text, fontSize:"1.2rem", fontWeight:700 }}>📘 {topic}</div>
        <div style={{ color:m.secondary, fontSize:"0.8rem", marginTop:4 }}>{steps.length} steps · Read each step · Check when done</div>
      </div>
      <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"10px 14px", marginBottom:20, fontSize:"0.82rem", color:"#92400e" }}>
        📌 <strong>What will happen:</strong> You will read {steps.length} steps. After reading, you check the box. When all boxes are checked, the lesson is done.
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {steps.map((step,i) => {
          const isDone = checked.includes(step.id);
          const isActive = i === current;
          const isLocked = i > current+1;
          return (
            <div key={step.id} onClick={() => !isLocked && toggle(step.id)} style={{ background:isDone?"#f0fdf4":isActive?"#fff":"#f8fafc", border:`2px solid ${isDone?"#22c55e":isActive?m.accent:"#e2e8f0"}`, borderRadius:12, padding:"14px 16px", opacity:isLocked?0.4:1, transition:"all 0.3s", cursor:isLocked?"default":"pointer" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <div style={{ minWidth:32, height:32, background:isDone?"#22c55e":isActive?m.accent:"#e2e8f0", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:(isDone||isActive)?"#fff":"#94a3b8", fontWeight:700, fontSize:"0.85rem", flexShrink:0 }}>
                  {isDone?"✓":i+1}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ color:"#94a3b8", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>{step.label}</div>
                  <div style={{ fontFamily:m.fontFamily, fontSize:m.fontSize, lineHeight:m.lineHeight, color:isDone?"#64748b":m.text, textDecoration:isDone?"line-through":"none" }}>{step.text}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {allDone ? (
        <div style={{ marginTop:20, background:"#f0fdf4", border:"2px solid #22c55e", borderRadius:14, padding:18, textAlign:"center" }}>
          <div style={{ fontSize:"2rem", marginBottom:6 }}>🎉</div>
          <div style={{ color:"#166534", fontWeight:700 }}>Lesson Complete!</div>
          <div style={{ color:"#4ade80", fontSize:"0.85rem", marginTop:4 }}>You completed all {steps.length} steps. Well done!</div>
        </div>
      ) : (
        <div style={{ marginTop:16, textAlign:"center", color:m.secondary, fontSize:"0.8rem" }}>{checked.length} of {steps.length} steps completed</div>
      )}
    </div>
  );
}

export default function AdaptiveLessonScreen() {
  const [mode, setMode] = useState("adhd");
  const [topic, setTopic] = useState("Fractions");
  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const m = MODES[mode];

  const fetchLesson = async () => {
    setLoading(true); setLesson(""); setError("");
    const prompts = {
      dyslexia: `You are a teacher for a child with dyslexia, aged 9-12. Explain "${topic}" in 4-5 clear sentences. Use short, simple words. Avoid passive voice. No jargon. Respond with only the lesson text, no headings.`,
      adhd: `You are a teacher for a child with ADHD, aged 9-12. Explain "${topic}" in exactly 5 short, energetic sentences. Each sentence should be punchy and end with a period. Include one surprising fun fact. Respond with only the lesson text.`,
      autism: `You are a teacher for a child on the autism spectrum, aged 9-12. Explain "${topic}" as a sequence of 5 clear, literal steps. Write them as complete sentences without numbers. No metaphors. Predictable structure. Respond with only the lesson text.`,
    };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:400, messages:[{role:"user",content:prompts[mode]}] }),
      });
      const data = await res.json();
      setLesson(data.content?.find(b=>b.type==="text")?.text || "");
    } catch(e) { setError("Could not load lesson. Please try again."); }
    setLoading(false);
  };

  useEffect(() => { fetchLesson(); }, [mode, topic]);

  return (
    <div style={{ minHeight:"100vh", background:m.bg, fontFamily:"'DM Sans','Segoe UI',sans-serif", color:m.text, transition:"background 0.4s,color 0.4s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=DM+Mono&family=Nunito:wght@400;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Navbar */}
      <div style={{ background:mode==="autism"?"#fff":"rgba(0,0,0,0.4)", backdropFilter:"blur(10px)", borderBottom:`1px solid ${mode==="autism"?"#e2e8f0":"rgba(255,255,255,0.05)"}`, padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, background:m.accent, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>🧠</div>
          <div>
            <div style={{ fontSize:"0.65rem", color:m.secondary, letterSpacing:"0.1em" }}>TEAM BYTE MESH · PS-26</div>
            <div style={{ fontWeight:700, fontSize:"0.95rem", color:m.text }}>LearnCompanion AI</div>
          </div>
        </div>
        <div style={{ background:mode==="autism"?"#f1f5f9":"rgba(255,255,255,0.08)", borderRadius:10, padding:"6px 12px", fontSize:"0.75rem", color:m.secondary }}>{m.emoji} {m.label}</div>
      </div>

      <div style={{ padding:"20px 20px 100px" }}>
        {/* Mode switcher */}
        <div style={{ display:"flex", gap:8, marginBottom:24, background:mode==="autism"?"#f1f5f9":"rgba(255,255,255,0.04)", borderRadius:16, padding:6 }}>
          {Object.entries(MODES).map(([key,val]) => (
            <button key={key} onClick={() => setMode(key)} style={{ flex:1, border:"none", cursor:"pointer", borderRadius:12, padding:"10px 6px", background:mode===key?val.color:"transparent", color:mode===key?"#fff":m.secondary, fontWeight:mode===key?700:500, fontSize:"0.72rem", transition:"all 0.25s", fontFamily:"inherit" }}>
              <div style={{ fontSize:"1.1rem", marginBottom:2 }}>{val.emoji}</div>
              {key==="dyslexia"?"Dyslexia":key==="adhd"?"ADHD":"Autism"}
            </button>
          ))}
        </div>

        {/* Topics */}
        <div style={{ marginBottom:24 }}>
          <div style={{ color:m.secondary, fontSize:"0.75rem", letterSpacing:"0.08em", marginBottom:10, textTransform:"uppercase" }}>Choose Topic</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {TOPICS.map(t => (
              <button key={t} onClick={() => setTopic(t)} style={{ background:topic===t?m.accent:mode==="autism"?"#f1f5f9":"rgba(255,255,255,0.05)", border:`1px solid ${topic===t?m.accent:mode==="autism"?"#e2e8f0":"rgba(255,255,255,0.08)"}`, borderRadius:99, padding:"7px 16px", color:topic===t?(mode==="adhd"?"#000":"#fff"):m.text, cursor:"pointer", fontSize:"0.82rem", fontWeight:topic===t?700:400, transition:"all 0.2s", fontFamily:"inherit" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Mode hint */}
        <div style={{ background:mode==="autism"?"rgba(59,130,246,0.08)":`rgba(${mode==="dyslexia"?"233,69,96":"0,255,136"},0.08)`, borderLeft:`3px solid ${m.accent}`, borderRadius:"0 10px 10px 0", padding:"10px 14px", marginBottom:24, fontSize:"0.8rem", color:m.secondary }}>
          <strong style={{ color:m.accent }}>{m.emoji} {m.label}:</strong> {m.description}
        </div>

        {/* Lesson card */}
        <div style={{ background:mode==="autism"?"#fff":m.card, borderRadius:20, padding:20, border:mode==="autism"?"2px solid #e2e8f0":"1px solid rgba(255,255,255,0.06)", animation:"fadeIn 0.4s ease", minHeight:300 }}>
          {loading ? (
            <div>
              <div style={{ textAlign:"center", color:m.secondary, fontSize:"0.85rem", marginBottom:8 }}>Adapting lesson for {m.label}...</div>
              <LoadingDots color={m.accent} />
            </div>
          ) : error ? (
            <div style={{ textAlign:"center", color:"#ef4444", padding:"2rem" }}>
              <div style={{ fontSize:"2rem", marginBottom:8 }}>⚠️</div>
              {error}
              <button onClick={fetchLesson} style={{ display:"block", margin:"12px auto 0", background:m.accent, border:"none", borderRadius:8, padding:"8px 20px", cursor:"pointer", fontWeight:700, fontFamily:"inherit", color:mode==="adhd"?"#000":"#fff" }}>Retry</button>
            </div>
          ) : lesson ? (
            mode==="dyslexia" ? <DyslexiaLesson lesson={lesson} topic={topic} /> :
            mode==="adhd"     ? <ADHDLesson lesson={lesson} topic={topic} /> :
                                <AutismLesson lesson={lesson} topic={topic} />
          ) : null}
        </div>

        <button onClick={fetchLesson} style={{ display:"flex", alignItems:"center", gap:6, margin:"16px auto 0", background:"transparent", border:`1px solid ${mode==="autism"?"#e2e8f0":"rgba(255,255,255,0.1)"}`, borderRadius:10, padding:"9px 20px", color:m.secondary, cursor:"pointer", fontSize:"0.82rem", fontFamily:"inherit" }}>
          🔄 Regenerate Lesson
        </button>
      </div>
    </div>
  );
}
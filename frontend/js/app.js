/* Mini Alexa browser demonstration. This JavaScript is separate from main.py. */
(() => {
  const $ = (id) => document.getElementById(id);
  const panels = ["chat", "calculator", "entertainment", "game", "concepts"];
  const titles = {chat:"Conversation",calculator:"Calculator",entertainment:"Entertainment",game:"Number game",concepts:"AI concepts"};
  const quotes = ["Great things are done by a series of small things brought together. — Vincent van Gogh","It always seems impossible until it's done. — Nelson Mandela","The secret of getting ahead is getting started. — Mark Twain","Success is the sum of small efforts, repeated day in and day out. — Robert Collier"];
  const jokes = ["Why did the developer go broke? Because they used up all their cache.","Why do programmers prefer dark mode? Because light attracts bugs.","Why was the computer cold? It left its Windows open.","What do you call 8 hobbits? A hobbyte."];
  const facts = ["Octopuses have three hearts.","A day on Venus is longer than its year.","Honey can remain edible for a very long time when stored properly.","The Eiffel Tower can grow slightly taller in hot weather because metal expands."];
  let userName = "", gameTarget = 0, gameTries = 5, gameOver = false;
  const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];
  function showPanel(name) {
    panels.forEach(p => { $("panel-"+p).classList.toggle("active", p===name); });
    document.querySelectorAll(".side-link").forEach(b => b.classList.toggle("active", b.dataset.panel===name));
    $("panelTitle").textContent = titles[name] || "Workspace";
    if (window.innerWidth <= 650) $("sidebar").classList.remove("open");
  }
  document.querySelectorAll(".side-link").forEach(b => b.addEventListener("click",()=>showPanel(b.dataset.panel)));
  $("menuToggle").addEventListener("click",()=> $("sidebar").classList.toggle("open"));
  document.querySelectorAll('a[href="#workspace"]').forEach(a=>a.addEventListener("click",()=>showPanel("chat")));
  $("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("light");$("themeToggle").textContent=document.body.classList.contains("light")?"☾":"☼";});
  function updateClock(){ $("clock").textContent=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"}); }
  updateClock();setInterval(updateClock,1000);
  function addMessage(text, who="assistant") {
    const row=document.createElement("div");row.className=`message ${who==="user"?"user-message":"assistant-message"}`;
    const avatar=document.createElement("span");avatar.className="message-avatar";avatar.textContent=who==="user"?"●":"✦";
    const bubble=document.createElement("div");bubble.className="bubble";
    const label=document.createElement("small");label.textContent=who==="user"?(userName||"YOU").toUpperCase():"MINI ALEXA";
    const p=document.createElement("p");p.textContent=text;bubble.append(label,p);row.append(avatar,bubble);$("chatLog").append(row);$("chatLog").scrollTop=$("chatLog").scrollHeight;
  }
  function recommendation(hour=new Date().getHours()){
    if(hour>=5&&hour<11)return "Based on the current hour, I recommend having breakfast or planning your day.";
    if(hour>=11&&hour<14)return "Based on the current hour, I recommend taking a lunch break.";
    if(hour>=14&&hour<18)return "Based on the current hour, I recommend focusing on a learning task.";
    if(hour>=18&&hour<22)return "Based on the current hour, I recommend relaxing, exercising, or enjoying a hobby.";
    return "Based on the current hour, I recommend winding down and getting some rest.";
  }
  function calculateExpression(expr){
    const m=expr.match(/^\s*(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)\s*$/);
    if(!m) throw new Error("Use a format like: calculate 12 + 8");
    const a=Number(m[1]),op=m[2],b=Number(m[3]);let r;
    if(op==="+")r=a+b;else if(op==="-")r=a-b;else if(op==="*")r=a*b;else{if(b===0)throw new Error("Division by zero is not allowed.");r=a/b;}
    return Number.isInteger(r)?String(r):String(Number(r.toFixed(6)));
  }
  function respond(raw){
    const t=raw.trim().toLowerCase();if(!t)return "Type a command or choose a suggestion below.";
    if(!userName && /^(hi|hello|hey)?\s*([a-z][a-z '-]{0,30})$/i.test(raw.trim()) && !["time","date","help","joke","quote","fact","game","recommend","perceptron","calculator"].includes(t)){
      userName=raw.trim().replace(/^(hi|hello|hey)\s+/i,"").trim();if(!userName)userName="friend";$("welcome").textContent=`Hello, ${userName}. Ready to explore?`;return `Nice to meet you, ${userName}! Type 'help' or try a quick action.`;
    }
    if(["help","commands","what can you do"].includes(t))return "I can show the date and time, calculate (+, -, *, /), share quotes, jokes and facts, play a number game, recommend an activity, and demonstrate a perceptron. Try: calculate 12 + 8.";
    if(t==="time"||t.includes("what time"))return `It's currently ${new Date().toLocaleTimeString()}.`;
    if(t==="date"||t.includes("today"))return `Today's date is ${new Date().toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"})}.`;
    if(t.startsWith("calculate ")||t.startsWith("calc ")){try{return `The result is ${calculateExpression(t.replace(/^(calculate|calc)\s+/,""))}.`;}catch(e){return e.message;}}
    if(t==="calculate"||t==="calculator"||t==="calc"){showPanel("calculator");return "I've opened the calculator panel. Enter two numbers and choose an operator.";}
    if(t.includes("quote")||t.includes("motivat"))return pick(quotes);
    if(t.includes("joke")||t.includes("funny"))return pick(jokes);
    if(t.includes("fact"))return pick(facts);
    if(t==="game"||t.includes("guessing game")){showPanel("game");return "Let's play! I'm thinking of a number from 1 to 20. You have five attempts.";}
    if(t.includes("recommend")||t.includes("activity"))return recommendation();
    if(t.includes("perceptron")||t.includes("neuron")){showPanel("concepts");return "A perceptron multiplies inputs by fixed weights, adds a bias, then applies a step activation. Try changing the inputs in AI concepts.";}
    if(t==="exit"||t==="quit"||t==="bye")return `Goodbye${userName?", "+userName:""}! You can close this tab whenever you're ready.`;
    if(t.includes("hello")||t==="hi"||t==="hey")return `Hello${userName?", "+userName:""}! What would you like to explore?`;
    return "I'm not sure I understood that — type 'help' to see what I can do.";
  }
  let aiEnabled = false;
  const conversationHistory = [];
  function setEngineStatus(enabled) {
    aiEnabled = enabled;
    const chip = $("aiStatus"), label = $("engineLabel"), status = $("engineStatus"), hint = $("inputHint");
    if (chip) { chip.textContent = enabled ? "AI CONNECTED" : "LOCAL MODE"; chip.classList.toggle("connected", enabled); }
    if (label) label.textContent = enabled ? "AI + local engine" : "Local rule engine";
    if (status) status.textContent = enabled ? "AI chat is ready" : "Ready to respond";
    if (hint) hint.innerHTML = enabled ? 'AI CHAT ENABLED <span>•</span> YOUR API KEY STAYS ON THE LOCAL SERVER' : 'LOCAL COMMANDS READY <span>•</span> START SERVER FOR OPTIONAL AI CHAT';
    const hs = $("heroStatus"); if (hs) hs.textContent = enabled ? "AI CHAT CONNECTED" : "VOICE + LOCAL ENGINE";
  }
  async function checkAiStatus() {
    try { const r = await fetch("/api/status", {cache:"no-store"}); if (!r.ok) throw new Error("not running"); const d = await r.json(); setEngineStatus(Boolean(d.ai_enabled)); }
    catch (_) { setEngineStatus(false); }
  }
  async function getReply(message) {
    // Keep deterministic local tools local; use the AI for open-ended questions.
    const t = message.trim().toLowerCase();
    const localIntent = /^(hi|hello|hey|help|commands|what can you do|time|date|calculator|calculate|calc|quote|joke|fact|game|exit|quit|bye)$/.test(t)
      || /^(calculate|calc)\s+/.test(t)
      || /what time|\b(today|date)\b|\bquote\b|motivat|\bjoke\b|\bfunny\b|\bfact\b|guessing game|\brecommend\b|\bactivity\b|perceptron|\bneuron\b|who are you|tell me your name/.test(t);
    if (localIntent || !aiEnabled) return respond(message);
    try {
      const response = await fetch("/api/chat", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({message, history:conversationHistory})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request failed.");
      if (data.reply) {
        conversationHistory.push({role:"user", content:message}, {role:"assistant", content:data.reply});
        while (conversationHistory.length > 12) conversationHistory.shift();
        return data.reply;
      }
      return respond(message);
    } catch (err) { return `AI connection issue: ${err.message}. Local commands still work — try 'help'.`; }
  }
  function speak(text) {
    if (!$("speakToggle")?.checked || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; utterance.pitch = 1; utterance.lang = navigator.language || "en-US";
    window.speechSynthesis.speak(utterance);
  }
  let recognition = null, listening = false;
  const micButton = $("micButton");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition && micButton) {
    recognition = new SpeechRecognition(); recognition.lang = navigator.language || "en-US"; recognition.interimResults = false; recognition.maxAlternatives = 1;
    recognition.onstart = () => { listening = true; micButton.classList.add("listening"); micButton.textContent = "◼"; micButton.title = "Listening… click to stop"; };
    recognition.onend = () => { listening = false; micButton.classList.remove("listening"); micButton.textContent = "🎙"; micButton.title = "Speak to Mini Alexa"; };
    recognition.onerror = (event) => { addMessage(`Voice input issue: ${event.error}. You can type your message instead.`); };
    recognition.onresult = (event) => { const text = event.results[0][0].transcript; $("chatInput").value = text; $("chatForm").requestSubmit(); };
    micButton.addEventListener("click", () => { try { if (listening) recognition.stop(); else recognition.start(); } catch (_) {} });
  } else if (micButton) {
    micButton.disabled = true; micButton.title = "Voice input is not supported in this browser. Try the latest Chrome or Edge.";
    if ($("inputHint")) $("inputHint").innerHTML = 'VOICE INPUT NOT SUPPORTED HERE <span>•</span> TRY CURRENT CHROME OR EDGE';
  }
  $("stopSpeaking")?.addEventListener("click", () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); });
  $("chatForm").addEventListener("submit", async e => {
    e.preventDefault(); const val = $("chatInput").value.trim(); if (!val) return;
    addMessage(val,"user"); $("chatInput").value = "";
    const pending = document.createElement("div"); pending.className = "message assistant-message pending-message"; pending.innerHTML = '<span class="message-avatar">✦</span><div class="bubble"><small>MINI ALEXA</small><p>Thinking<span class="typing-dots">…</span></p></div>'; $("chatLog").append(pending); $("chatLog").scrollTop = $("chatLog").scrollHeight;
    const reply = await getReply(val); pending.remove(); addMessage(reply); speak(reply);
  });
  checkAiStatus();
  document.querySelectorAll(".suggestion").forEach(b=>b.addEventListener("click",()=>{const c=b.dataset.command;addMessage(c,"user");addMessage(respond(c));}));
  $("clearChat").addEventListener("click",()=>{$("chatLog").replaceChildren();addMessage("Conversation cleared. Hi! I'm Mini Alexa. What's your name.");userName="";$("welcome").textContent="Hello there. I'm Mini Alexa.";});
  $("calculateBtn").addEventListener("click",()=>{const a=$("numA").value,b=$("numB").value,op=$("operator").value;try{if(a===""||b==="")throw new Error("Please enter both numbers.");const result=calculateExpression(`${a} ${op} ${b}`);$("calcResult").textContent=result;$("calcMessage").textContent="Calculation completed successfully.";}catch(e){$("calcResult").textContent="—";$("calcMessage").textContent=e.message;}});
  document.querySelectorAll(".refresh-content").forEach(b=>b.addEventListener("click",()=>{const kind=b.dataset.kind;const arr=kind==="quote"?quotes:kind==="joke"?jokes:facts;const id=kind==="quote"?"quoteOutput":kind==="joke"?"jokeOutput":"factOutput";$(id).textContent=pick(arr);}));
  function newGame(){gameTarget=Math.floor(Math.random()*20)+1;gameTries=5;gameOver=false;$("gameNumber").textContent="?";$("attempts").textContent="● ● ● ● ●";$("gameFeedback").textContent="Make your first guess to begin.";$("guessInput").disabled=false;}
  $("guessForm").addEventListener("submit",e=>{e.preventDefault();if(gameOver)return;const val=Number($("guessInput").value);if(!Number.isInteger(val)||val<1||val>20){$("gameFeedback").textContent="Enter a whole number from 1 to 20.";return;}gameTries--;$("attempts").textContent=Array.from({length:5},(_,i)=>i<gameTries?"●":"○").join(" ");if(val===gameTarget){$("gameNumber").textContent=gameTarget;$("gameFeedback").textContent="Correct! You found the number. 🎉";gameOver=true;}else if(gameTries===0){$("gameNumber").textContent=gameTarget;$("gameFeedback").textContent=`Out of attempts — the number was ${gameTarget}.`;gameOver=true;}else $("gameFeedback").textContent=val<gameTarget?"Too low — try higher.":"Too high — try lower.";if(gameOver)$("guessInput").disabled=true;$("guessInput").value="";});
  $("restartGame").addEventListener("click",newGame);newGame();
  function runNeuron(){const x1=Number($("input1").value),x2=Number($("input2").value);if($("input1").value===""||$("input2").value===""){ $("neuronFormula").textContent="Please enter both inputs.";return;}const sum=x1*.7+x2*(-.4)+.1;const output=sum>0?1:0;$("neuronOutput").textContent=output;$("neuronFormula").textContent=`(${x1} × 0.7) + (${x2} × -0.4) + 0.1 = ${sum.toFixed(2)} → output ${output}`;}
  $("runNeuron").addEventListener("click",runNeuron);
  // Reveal elements when supported; visible fallback keeps content available without IntersectionObserver.
  if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("seen");observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll(".feature-card,.section-heading,.metrics,.concept-banner").forEach(el=>observer.observe(el));}
})();

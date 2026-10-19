const CHARACTERS = [
  {
    id: "alex", name: "Alex", initial: "A", vibe: "Mysterious & caring", tag: "SLOW BURN",
    colors: ["#362640", "#d4a3b1", "#29202f"],
    story: "You and Alex have been paired for a campus project. He seems distant, but he notices more than he says.",
    greeting: "You finally showed up. I was starting to think I'd have to do this whole project alone. ...How was your day, really?",
    replies: [
      "Hmm. I was going to pretend I didn't care, but I'm actually glad you told me that.",
      "You know, you don't have to act like everything is fine around me. I can listen.",
      "That's an interesting way to look at it. Tell me more — I'm listening.",
      "I don't say this often, but talking with you makes this day a little less ordinary.",
      "You caught me off guard with that one. Give me a second... okay, I'm curious now."
    ]
  },
  {
    id: "noah", name: "Noah", initial: "N", vibe: "Playful & charming", tag: "FLIRTY",
    colors: ["#3c2a34", "#e0b59a", "#583329"],
    story: "Noah is the confident new neighbour who always seems to have a clever comeback.",
    greeting: "Well, well. My favourite notification finally arrived. So, what kind of trouble are we getting into today?",
    replies: [
      "Oh, you're making this way too easy for me to tease you. Keep going.",
      "Okay, that actually made me smile. Don't let it go to your head.",
      "I had a witty reply ready, but you distracted me. Happy now?",
      "Challenge accepted. But if I win, you owe me the most dramatic story ever.",
      "You're fun to talk to. I was trying to play it cool, but there, I said it."
    ]
  },
  {
    id: "luna", name: "Luna", initial: "L", vibe: "Dreamy & magical", tag: "FANTASY",
    colors: ["#242746", "#c99cb9", "#201d39"],
    story: "Luna is a mysterious traveller who found a glowing doorway between worlds — and somehow, it led to you.",
    greeting: "The stars whispered that you'd arrive tonight. I hoped they were right. Tell me, what does your world look like?",
    replies: [
      "In my world, every feeling leaves a little light in the sky. What colour would yours be tonight?",
      "Perhaps the universe is stranger and kinder than we think. Shall we find out together?",
      "I have crossed a thousand dream paths, yet this conversation feels like a new kind of magic.",
      "Then let us make a tiny adventure of it. Imagine a silver forest beneath two moons...",
      "I shall remember that in our story. Every good tale begins with one honest moment."
    ]
  }
];

const $ = (id) => document.getElementById(id);
const state = {
  current: null,
  conversations: loadConversations(),
  apiKey: sessionStorage.getItem("dreammate_api_key") || "",
  model: localStorage.getItem("dreammate_model") || "gemini-2.5-flash",
  useAI: localStorage.getItem("dreammate_use_ai") === "true"
};

function loadConversations() {
  try { return JSON.parse(localStorage.getItem("dreammate_conversations") || "{}"); }
  catch { return {}; }
}
function saveConversations() {
  try { localStorage.setItem("dreammate_conversations", JSON.stringify(state.conversations)); }
  catch { toast("Storage is full; some chat history may not save."); }
}
function character(id) { return CHARACTERS.find(c => c.id === id) || CHARACTERS[0]; }
function convo(id) {
  if (!state.conversations[id]) state.conversations[id] = [];
  return state.conversations[id];
}
function toast(message) {
  const el = $("toast"); el.textContent = message; el.classList.remove("hidden");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.add("hidden"), 2600);
}
function initialsAvatar(el, c) {
  el.textContent = c.initial;
  el.style.background = `linear-gradient(145deg, ${c.colors[1]}, ${c.colors[0]})`;
}
function renderCharacters() {
  $("characterGrid").innerHTML = CHARACTERS.map(c => `
    <button class="character-card" data-chat="${c.id}">
      <div class="portrait" style="background:linear-gradient(145deg,${c.colors[0]},#181525);--skin:${c.colors[1]};--hair:${c.colors[2]}">
        <span class="initial">${c.initial}</span><span class="sparkle">✦</span>
      </div>
      <div class="card-info"><span class="card-tag">${c.tag}</span><strong>${c.name}</strong><span>${c.vibe}</span></div>
    </button>`).join("");
  document.querySelectorAll("[data-chat]").forEach(btn => btn.addEventListener("click", () => openChat(btn.dataset.chat)));
}
function renderRecent() {
  const list = CHARACTERS.filter(c => (state.conversations[c.id] || []).length > 0);
  $("recentChats").innerHTML = list.length ? list.map(c => {
    const msgs = convo(c.id); const last = msgs[msgs.length - 1];
    return `<button class="recent-item" data-recent="${c.id}">
      <div class="avatar" style="background:linear-gradient(145deg,${c.colors[1]},${c.colors[0]})">${c.initial}</div>
      <div class="recent-copy"><strong>${c.name}</strong><span>${escapeHtml(last.text)}</span></div><span class="recent-arrow">↗</span>
    </button>`;
  }).join("") : '<div class="empty-state">Your story starts with a hello. Choose a character above ✦</div>';
  document.querySelectorAll("[data-recent]").forEach(btn => btn.addEventListener("click", () => openChat(btn.dataset.recent)));
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function showHome(tab = "home") {
  $("homeView").classList.remove("hidden"); $("chatView").classList.add("hidden");
  $("bottomNav").classList.remove("hidden");
  $("homeNav").classList.toggle("active", tab === "home");
  $("chatsNav").classList.toggle("active", tab === "chats");
  renderRecent();
}
function openChat(id) {
  state.current = character(id);
  const c = state.current;
  $("homeView").classList.add("hidden"); $("chatView").classList.remove("hidden"); $("bottomNav").classList.add("hidden");
  $("chatName").textContent = c.name; initialsAvatar($("chatAvatar"), c);
  $("storyNote").textContent = c.story;
  if (!convo(id).length) {
    convo(id).push({ role: "character", text: c.greeting, time: Date.now() });
    saveConversations();
  }
  renderMessages();
}
function renderMessages() {
  if (!state.current) return;
  const msgs = convo(state.current.id);
  $("messages").innerHTML = msgs.map(m => `<div class="message ${m.role === 'user' ? 'user' : 'character'}">${m.role !== 'user' ? `<div class="sender">${escapeHtml(state.current.name.toUpperCase())}</div>` : ""}${escapeHtml(m.text)}</div>`).join("");
  $("messages").scrollTop = $("messages").scrollHeight;
}
function demoReply(c, text) {
  const low = text.toLowerCase();
  if (/\b(hi|hello|hey|hii|namaste|hlo)\b/.test(low)) return c.id === "luna" ? "Greetings, traveller. ✨ I was hoping our paths would cross again. How are you feeling beneath all those stars?" : `Hey, you. 😊 ${c.replies[0]}`;
  if (/\b(sad|upset|lonely|bad|cry|tired|dukhi|udaas|pareshan)\b/.test(low)) return "I'm sorry today feels heavy. You don't have to solve everything this minute. Want to tell me what happened? I'm here to listen in our story.";
  if (/\b(love|miss you|like you|pyaar|yaad)\b/.test(low)) return c.id === "luna" ? "Perhaps some bonds are written between the stars. ✨ Tell me what your heart is trying to say." : "That's unexpectedly sweet of you. 💜 Let's take our story one moment at a time — what made you feel that way?";
  if (/\b(who are you|your name|kaun ho)\b/.test(low)) return `I'm ${c.name}, of course. ${c.story} What would you like to know about me?`;
  return c.replies[Math.floor(Math.random() * c.replies.length)];
}
async function getAIReply(c, userText) {
  const prompt = `You are ${c.name}, a fictional character. Personality: ${c.vibe}. Backstory: ${c.story}
Speak naturally in the same language/style as the user's latest message; Hinglish is welcome. Be warm, engaging and concise (usually 1-4 sentences). Keep the fictional roleplay clear and do not claim to be a real human. Avoid explicit sexual content and never sexualize minors.
Conversation so far:
${convo(c.id).slice(-12).map(m => `${m.role === "user" ? "User" : c.name}: ${m.text}`).join("\n")}
${c.name}:`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(state.model)}:generateContent?key=${encodeURIComponent(state.apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.9, maxOutputTokens: 220 } })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || `API error ${response.status}`);
  const answer = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
  if (!answer) throw new Error("No text was returned by the model.");
  return answer;
}
async function sendMessage(text) {
  if (!state.current || !text.trim()) return;
  const c = state.current;
  convo(c.id).push({ role: "user", text: text.trim(), time: Date.now() });
  saveConversations(); renderMessages();
  $("typing").classList.remove("hidden");
  $("messageInput").disabled = true;
  document.querySelector(".send-button").disabled = true;
  try {
    let answer;
    if (state.useAI && state.apiKey) answer = await getAIReply(c, text.trim());
    else {
      await new Promise(resolve => setTimeout(resolve, 550));
      answer = demoReply(c, text.trim());
    }
    convo(c.id).push({ role: "character", text: answer, time: Date.now() });
  } catch (err) {
    convo(c.id).push({ role: "character", text: `Live AI couldn't reply: ${err.message}. Check your API key, model name and quota in Settings. You can turn off Live AI to use offline demo replies.`, time: Date.now() });
  } finally {
    saveConversations();
    $("typing").classList.add("hidden");
    $("messageInput").disabled = false;
    document.querySelector(".send-button").disabled = false;
    renderMessages();
    $("messageInput").focus();
  }
}
function openSettings() {
  $("apiKeyInput").value = state.apiKey;
  $("modelInput").value = state.model;
  $("useAiToggle").checked = state.useAI;
  $("settingsStatus").textContent = "";
  $("settingsModal").classList.remove("hidden");
}
function closeSettings() { $("settingsModal").classList.add("hidden"); }

$("heroChatButton").addEventListener("click", () => openChat("alex"));
$("backButton").addEventListener("click", () => { showHome(); });
$("messageForm").addEventListener("submit", e => { e.preventDefault(); const value = $("messageInput").value; $("messageInput").value = ""; sendMessage(value); });
$("settingsButton").addEventListener("click", openSettings);
$("settingsNav").addEventListener("click", openSettings);
$("closeSettings").addEventListener("click", closeSettings);
$("saveSettings").addEventListener("click", () => {
  state.apiKey = $("apiKeyInput").value.trim();
  state.model = $("modelInput").value.trim() || "gemini-2.5-flash";
  state.useAI = $("useAiToggle").checked;
  if (state.apiKey) sessionStorage.setItem("dreammate_api_key", state.apiKey);
  else sessionStorage.removeItem("dreammate_api_key");
  localStorage.setItem("dreammate_model", state.model);
  localStorage.setItem("dreammate_use_ai", String(state.useAI));
  $("settingsStatus").textContent = state.useAI && state.apiKey ? "Saved. Live AI is enabled on this device." : "Saved. Demo mode is ready.";
  toast(state.useAI && state.apiKey ? "Live AI enabled" : "Demo mode ready");
});
$("removeKeyButton").addEventListener("click", () => {
  state.apiKey = ""; state.useAI = false;
  sessionStorage.removeItem("dreammate_api_key");
  localStorage.setItem("dreammate_use_ai", "false");
  $("apiKeyInput").value = ""; $("useAiToggle").checked = false;
  $("settingsStatus").textContent = "API key removed from this browser session.";
});
$("characterInfoButton").addEventListener("click", () => {
  if (state.current) toast(state.current.story);
});
$("homeNav").addEventListener("click", () => showHome("home"));
$("chatsNav").addEventListener("click", () => showHome("chats"));
$("clearChatsButton").addEventListener("click", () => {
  if (confirm("Delete all saved demo conversations on this device?")) {
    state.conversations = {}; saveConversations(); renderRecent(); toast("Chat history cleared.");
  }
});
$("settingsModal").addEventListener("click", e => { if (e.target === $("settingsModal")) closeSettings(); });

renderCharacters();
renderRecent();

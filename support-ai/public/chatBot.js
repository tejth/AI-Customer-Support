(function () {
  const api_Url = "https://supportai-lac.vercel.app/api/chat";

  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.log("Owner id not found");
    return;
  }

  /* ---------------- Floating Button ---------------- */

  const button = document.createElement("div");
  button.innerHTML = "💭";

  Object.assign(button.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "22px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
    zIndex: "999999",
  });

  document.body.appendChild(button);

  /* ---------------- Chat Box ---------------- */

  const box = document.createElement("div");

  Object.assign(box.style, {
    position: "fixed",
    bottom: "90px",
    right: "24px",
    width: "320px",
    height: "420px",
    borderRadius: "14px",
    background: "#fff",
    display: "none",
    overflow: "hidden",
    flexDirection: "column",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    zIndex: "999999",
    fontFamily: "Inter, system-ui, sans-serif",
  });

  box.innerHTML = `
    <div style="
      background:#000;
      color:#fff;
      padding:12px 14px;
      font-size:14px;
      display:flex;
      justify-content:space-between;
      align-items:center;">
      <span>Customer Support</span>
      <span id="chat-close" style="cursor:pointer;font-size:16px">✖</span>
    </div>

    <div id="chat-messages" style="
      flex:1;
      padding:12px;
      overflow-y:auto;
      background:#f9fafb;
      display:flex;
      flex-direction:column;">
    </div>

    <div style="
      display:flex;
      border-top:1px solid #e5e7eb;
      padding:8px;
      gap:6px;">
      <input 
        type="text"
        id="chat-input"
        placeholder="Type a message"
        style="
          flex:1;
          padding:8px 10px;
          border:1px solid #d1d5db;
          border-radius:8px;
          font-size:13px;
          outline:none;" />
      <button 
        id="chat-send"
        style="
          padding:8px 12px;
          border:none;
          background:#000;
          color:#fff;
          border-radius:8px;
          font-size:13px;
          cursor:pointer;">
        Send
      </button>
    </div>
  `;

  document.body.appendChild(box);

  button.onclick = () => {
    box.style.display = box.style.display === "none" ? "flex" : "none";
  };

  document.getElementById("chat-close").onclick = () => {
    box.style.display = "none";
  };

  const input = document.getElementById("chat-input");
  const sendButton = document.getElementById("chat-send");
  const messageArea = document.getElementById("chat-messages");

  /* ---------------- Add Message Function ---------------- */

  function addMessage(text, from) {
    const bubble = document.createElement("div");

    bubble.textContent = text; // SAFE TEXT (no [object Object])

    Object.assign(bubble.style, {
      maxWidth: "78%",
      padding: "8px 12px",
      borderRadius: "14px",
      fontSize: "13px",
      lineHeight: "1.4",
      marginBottom: "8px",
      alignSelf: from === "user" ? "flex-end" : "flex-start",
      background: from === "user" ? "#000" : "#e5e7eb",
      color: from === "user" ? "#fff" : "#111",
      borderTopRightRadius: from === "user" ? "4px" : "14px",
      borderTopLeftRadius: from === "user" ? "14px" : "4px",
    });

    messageArea.appendChild(bubble);
    messageArea.scrollTop = messageArea.scrollHeight;
  }

  /* ---------------- Send Message ---------------- */

  sendButton.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    const typing = document.createElement("div");
    typing.textContent = "Typing...";
    typing.style.fontSize = "12px";
    typing.style.color = "#6b7280";
    typing.style.marginBottom = "8px";
    typing.style.alignSelf = "flex-start";

    messageArea.appendChild(typing);
    messageArea.scrollTop = messageArea.scrollHeight;

    try {
      const response = await fetch(api_Url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, message: text }),
      });

      const data = await response.json();

      messageArea.removeChild(typing);

      if (!response.ok) {
        addMessage(data.message || "Something went wrong", "ai");
        return;
      }

      // ✅ IMPORTANT FIX HERE
      addMessage(data.reply || "No response", "ai");

    } catch (error) {
      console.error(error);
      messageArea.removeChild(typing);
      addMessage("Server error. Please try again.", "ai");
    }
  };

})();
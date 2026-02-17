(function () {
  const api_Url = "http://localhost:3000/api/chat";

  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.log("Owner id not found");
    return;
  }

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
    fontFamily: "Inter , system-ui , sans-serif",
  });

  box.innerHTML = `<div style="
                    background: #000;
                    color:#fff;
                    padding:12px 14px;
                    font-size: 14px;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                  ">
                   <span>Customer Support </span>
                   <span id="chat-close" style="cursor:pointer; font-size:16px">✖</span>
                  </div>
                  
                  <div id="chat-messages" style="
                    flex:1;
                    padding:12px;
                    overflow-y:auto;
                    background:#f9fafb;
                    display:flex;
                    flex-direction:column;
                  "></div>



                  <div style="
                    
  
                    display: flex;

                    border-top:1px solid #e5e7eb;

                    padding:8px;

                    gap:6px;

                    ">

                   <input type="text"
                        id="chat-input"
                        placeholder="Type a message"
                        style="
                            flex:1;
                            padding: 8px 10px;
                            border:1px solid #d1d5db;
                            border-radius:8px;
                            font-size:13px;
                            outline:none;
                        "
                        />


                    <button id="chat-send" style="padding:8px 12px;
                
                        border:none;
                        background:#000;
                        color:#fff;
                        border-radius:8px;
                        font-size:13px;
                        cursor:pointer"  
                    >send</button>

                </div>



                  `;

        document.body.appendChild(box);

        button.onclick = ()=>{
            box.style.display=box.style.display === "none" ? "flex": "none"
        }

        document.querySelector("#chat-close").onclick=()=>{
            box.style.display = "none"
        }
})();

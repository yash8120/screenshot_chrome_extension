chrome.action.onClicked.addListener(async (tab) => {
  try {
    const screenshotUrl = await chrome.tabs.captureVisibleTab(null, {
      format: "png"
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (dataUrl) => {
        try {
          const blob = await (await fetch(dataUrl)).blob();

          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);

          showToast("📸 Screenshot copied!", "success");
        } catch (err) {
          showToast(" Failed to copy screenshot", "error");
        }

        function showToast(message, type) {
          const toast = document.createElement("div");
          toast.textContent = message;

          Object.assign(toast.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "12px 16px",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "14px",
            zIndex: 999999,
            background: type === "success" ? "#2fb74f" : "#dc3545",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            fontFamily: "system-ui, sans-serif",
            transition: "opacity 0.3s ease"
          });

          document.body.appendChild(toast);

          setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
          }, 2000);
        }
      },
      args: [screenshotUrl]
    });

  } catch (err) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const toast = document.createElement("div");
          toast.textContent = "❌ Screenshot failed";

          Object.assign(toast.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "12px 16px",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "14px",
            zIndex: 999999,
            background: "#dc3545",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          });

          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 2000);
        }
      });
    } catch {}
  }
});
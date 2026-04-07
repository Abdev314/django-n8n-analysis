<div align="center">
  <h1>📄 File Analyzer</h1>
  
  <h3><strong>AI Document Intelligence</strong> • Powered by Llama 3.1</h3>
  
  <p>
    <img src="https://img.shields.io/badge/n8n-00A4FF?style=for-the-badge&logo=n8n&logoColor=white" height="42" alt="n8n">
    &nbsp;&nbsp;
    <img src="https://img.shields.io/badge/Ollama-FF6B00?style=for-the-badge&logo=ollama&logoColor=white" height="42" alt="Ollama">
    &nbsp;&nbsp;
    <img src="https://img.shields.io/badge/Llama_3.1-4B8BBE?style=for-the-badge&logo=meta&logoColor=white" height="42" alt="Llama 3.1">
    &nbsp;&nbsp;
    <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" height="42" alt="Django">
    &nbsp;&nbsp;
    <img src="https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" height="42" alt="Telegram">
    &nbsp;&nbsp;
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" height="42" alt="Docker">
  </p>

  <strong>Upload PDF or TXT → Instant AI analysis → Results in browser + Telegram bot</strong><br>
  <em>One-command Docker stack • Zero manual setup</em>
</div>

<br>

## 🧩 What’s inside?

- **docker-compose.yml** – Starts Django, n8n, and Ollama.
- **pdfanalyze/** – The Django application (ready to run inside its container).
- **n8n-workflow.json** – A pre‑built n8n workflow (import with one click).

## 🖥️ Prerequisites

You only need **Docker** and **Docker Compose** on your computer.

- **Windows / macOS:** Install Docker Desktop  
- **Linux:** Install Docker Engine and Docker Compose via your package manager.

Verify with:

```bash
docker --version
docker compose --version
```
🚀 Quick Start
Download or clone this repository.

- Open a terminal in the project folder (e.g. django-n8n-pdf-analysis-main):

```
cd /path/to/django-n8n-analysis-master
```
- Start everything with a single command:

```
docker compose up -d
```
- Pull the Llama 3.1 model inside the Ollama container:
- First, find the Ollama container name:
```
docker ps
```
- Then pull the model (replace <ollama-container-name> with the actual name):
```
docker exec -it <ollama-container-name> ollama pull llama3.1
```
- Check the logs (optional – press Ctrl+C to stop watching):
```
docker compose logs -f
```
## 🌐 Access the services

- Django UI: http://localhost:8000

- n8n: http://localhost:5678


## 📥 Import the n8n workflow

- Open n8n: http://localhost:5678

- Create an account (if you haven’t already).

- Click New Workflow.

- Click the “Import from File” button (top right, or via the three-dots menu).

- Select the file `n8n-workflow.json` from your project folder.

- Save the workflow.

⚠️ The workflow contains two Telegram Trigger nodes. You will need to add your chat ID and bot token – see the Telegram setup below.

## 🤖 Telegram Bot Setup (required for the workflow)

The workflow sends the AI response to your Telegram bot. Follow the steps below to create a bot and connect it to the workflow.

### 🛠️ Create a Bot with BotFather

- 🌐 Open Telegram Web in your browser:  
  https://web.telegram.org

- 🔎 Search for the user **BotFather**

- ⌨️ Type `/` and choose `/newbot`

- 📝 Choose a **name** for your bot

- 👤 Choose a **username** that ends with `bot`  

- 🔑 After creation, BotFather will give you an **API Token**. Copy it.  
  It looks like this:
```
1234567890:ABCdefGHIjklmNOPqrstUVwxyz
```


### 🆔 Get Your Personal Chat ID

- 🌐 In your browser, paste the following URL (replace `[api-token]` with your real token):

```
https://api.telegram.org/bot[api-token]/getUpdates
```

- 💬 Go back to your new bot in Telegram Web

- ▶️ Click **Start** or send any message (for example: `Hello`)

- 🔄 Refresh the browser tab where you opened the `getUpdates` URL

- 📄 You will see a JSON response similar to this:

```
"message":{"message_id":7,"from":{"id":chat_id,"is_bot":false,"first_name":"your_name","username":"your_username","language_code":"en"},"chat":{"id":chat_id,"first_name":"your_name","username":"your_username","type":"private"},"date":1775381006,"text":"the_message_you_sent"}
```

- 📌 The number shown as `"id":chat_id` (example: `123456789`) is your **Chat ID**. Copy it.

---

### ⚙️ Configure the n8n Workflow

- 🌐 Open **n8n**

- 📂 Go to **Credentials** → **Create Credential**

- 🔎 Search for **Telegram** → select **Telegram API**

- 🔑 Paste your **API Token** (from BotFather)

- 💾 Click **Save**

---

### 🔗 Connect Telegram to the Workflow

- 📂 Go back to your **imported workflow**

- 📡 Click on each **Telegram Trigger node** (there are two)

For each node:

- 🆔 Set **Chat ID** to the chat ID you copied

- 🔐 Select the **Telegram credential** you created

- 💾 Save the workflow

---

### ▶️ Activate the Workflow

- Toggle the **Active** switch at the top-right of the workflow editor

---

## 🧪 How to use the system (Django UI + Telegram)

- Make sure all containers are running:
```
docker ps
```
- Open the Django UI: http://localhost:8000

- Go to the AI analysis page: http://localhost:8000/api/ai/

- Upload a file (.txt or .pdf) and hit send.



## ⚙️ What Happens Automatically

**Workflow Execution**

- 📤 Django sends the uploaded file to the **n8n webhook**.

- 🔄 **n8n** runs the workflow (you can watch the execution live).

- 🧠 The **AI model (llama3.1)** processes the file.

- 📩 The result is returned to:
  - the **Django UI**
  - your **Telegram bot**

---

## 👀 Monitor the Workflow

To monitor the workflow execution in **n8n**:

- 🌐 Open  
  http://localhost:5678

- 📊 Move to **Executions**

- ⚙️ You will see the appropriate workflow running

- ⏳ Wait until the execution finishes

- ✅ Then check:
  - your **Telegram bot**
  - your **web application** http://localhost:8000/api/ai


## 💡 Tip: The first analysis may take a few seconds because the AI model loads. Subsequent requests are faster.

## 🛑 Stopping the Services

- Stop the containers (keep data):

```
docker compose down
```

- Stop and remove all data (including n8n’s database and workflows):
```
docker compose down -v
```

---

## 📁 Using Your Own Files

- You can upload any **`.txt`** or **`.pdf`** file through the Django UI at:

- No need to manually place files in folders – the web UI handles everything.

Made with ❤️ for clean, powerful, fully containerized AI document analysis.

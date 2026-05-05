import torch
import os
import asyncio
import requests

from raganything import RAGAnything, RAGAnythingConfig
from lightrag.utils import EmbeddingFunc

# 🔥 NEW: local embedding
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
load_dotenv()

# ================= CONFIG =================
ROOT_PATH = "/Users/nghia.nguyen.thanh/Desktop/projects/me/owwi.new.ui/v4"
RAG_DIR = os.path.join(ROOT_PATH, ".rag_store")

ALLOWED_EXT = {
    ".ts", ".tsx", ".js", ".jsx",
    ".json", ".css", ".scss"
}

LLM_API_URL = os.getenv("LLM_API_URL")
LLM_API_KEY = os.getenv("LLM_API_KEY")

EXCLUDE_DIRS = {
    "node_modules", ".git", ".rag_store",
    "dist", "build", ".next", "coverage",
    ".cache", ".turbo", ".vscode", ".idea"
}

EXCLUDE_FILES = (
    ".min.js", ".bundle.js", ".lock", ".log"
)

# ================= LOAD FILES =================
def load_code_files():
    contents = []
    
    for root, dirs, files in os.walk(ROOT_PATH):

        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        for file in files:
            if not any(file.endswith(ext) for ext in ALLOWED_EXT):
                continue

            if file.endswith(EXCLUDE_FILES):
                continue

            full_path = os.path.join(root, file)

            try:
                with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                    code = f.read()
            except:
                continue

            contents.append({
                "path": full_path,
                "code": code
            })

    print(f"📂 Loaded {len(contents)} files")
    return contents


# ================= CHUNK =================
def chunk_code(file_data):
    code = file_data["code"]
    path = file_data["path"]

    chunk_size = 400   # 🔥 ~200–300 tokens
    overlap = 80

    chunks = []

    start = 0
    while start < len(code):
        end = start + chunk_size
        chunk = code[start:end]

        if len(chunk.strip()) > 30:
            chunks.append({
                "type": "text",
                "text": chunk,
                "metadata": {"file": path},
                "page_idx": 0
            })

        start += chunk_size - overlap

    return chunks


def build_content_list(files):
    content_list = []
    for file in files:
        content_list.extend(chunk_code(file))
    return content_list


# ================= LLM =================
def sync_llm_call(prompt, system_prompt=None, history_messages=[]):
    # 🔥 block mọi extract request
    if "extract" in prompt.lower():
        return "[]"
    
    messages = []

    messages.append({
        "role": "system",
        "content": system_prompt or "You are a code analysis assistant. Answer concisely and based only on context."
    })

    messages += history_messages
    messages.append({"role": "user", "content": prompt})

    res = requests.post(
        LLM_API_URL,
        headers={
            "Authorization": f"Bearer {LLM_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "openclaw",
            "messages": messages,
            "stream": False,
        },
        timeout=600,
    )

    data = res.json()

    if isinstance(data, list):
        data = data[0]

    return data["choices"][0]["message"]["content"]


# 🔥 FIX: async wrapper
async def custom_llm_model_func(prompt, system_prompt=None, history_messages=[], **kwargs):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None,
        lambda: sync_llm_call(prompt, system_prompt, history_messages)
    )


# ================= EMBEDDING =================
print("🧠 Loading embedding model...")
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
embed_model = embed_model.to("cpu")

torch.set_num_threads(1)  # 🔥 QUAN TRỌNG


def sync_embed(texts):
    return embed_model.encode(
        texts,
        normalize_embeddings=True,
        show_progress_bar=False,
        batch_size=32,
        convert_to_numpy=True  # 👈 giữ numpy
    )


async def local_embed(texts):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None,
        lambda: sync_embed(texts)  # 👈 gọi lại sync, không encode lại
    )


# ================= CREATE RAG =================
def create_rag():
    embedding_func = EmbeddingFunc(
        embedding_dim=384,  # đúng với MiniLM
        max_token_size=8192,
        func=local_embed,
    )

    config = RAGAnythingConfig(
        working_dir=RAG_DIR,
        enable_image_processing=False,
        enable_table_processing=False,
        enable_equation_processing=False,
    )

    return RAGAnything(
        config=config,
        llm_model_func=custom_llm_model_func,
        embedding_func=embedding_func,
    )


# ================= MAIN =================
async def main():
    print("🔍 Loading files...")
    files = load_code_files()

    print("🧩 Chunking...")
    content_list = build_content_list(files)
    print(f"Total chunks: {len(content_list)}")

    print("⚙️ Init RAG...")
    rag = create_rag()

    print("📥 Inserting...")
    await rag.insert_content_list(
        content_list=content_list,
        file_path="codebase",
        display_stats=True
    )

    print(f"\n✅ DONE. Stored at: {RAG_DIR}")

    print("\n🧠 Test query...")
    result = await rag.aquery(
        "mô tả flow login trong code hoạt động thế nào",
        mode="hybrid"
    )

    print("\n=== RESULT ===\n", result)


if __name__ == "__main__":
    asyncio.run(main())
from raganything import RAGAnything, RAGAnythingConfig
from lightrag.utils import EmbeddingFunc
from sentence_transformers import SentenceTransformer
import sys
import os
import asyncio
import requests
import torch
from dotenv import load_dotenv
load_dotenv()

# ===== EMBEDDING (GIỐNG INDEX) =====
torch.set_num_threads(1)

embed_model = SentenceTransformer("all-MiniLM-L6-v2")

def sync_embed(texts):
    return embed_model.encode(
        texts,
        normalize_embeddings=True,
        show_progress_bar=False,
        batch_size=32,
        convert_to_numpy=True
    )

async def local_embed(texts):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, lambda: sync_embed(texts))


# ===== LLM =====
LLM_API_URL = os.getenv("LLM_API_URL")
API_KEY = os.getenv("LLM_API_KEY")

def sync_llm(prompt, system_prompt=None, history_messages=[]):
    messages = []

    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})

    messages += history_messages
    messages.append({"role": "user", "content": prompt})

    res = requests.post(
        LLM_API_URL,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "openclaw",
            "messages": messages,
        },
    )

    data = res.json()
    if isinstance(data, list):
        data = data[0]

    return data["choices"][0]["message"]["content"]

async def custom_llm(prompt, system_prompt=None, history_messages=[], **kwargs):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None,
        lambda: sync_llm(prompt, system_prompt, history_messages)
    )


# ===== MAIN =====
async def main():
    # 🔥 lấy query từ command line
    if len(sys.argv) < 2:
        print("❌ Please provide a query")
        print('👉 Example: python rag_query.py "your question here"')
        return

    query = sys.argv[1]

    embedding_func = EmbeddingFunc(
        embedding_dim=384,
        max_token_size=8192,
        func=local_embed,
    )

    config = RAGAnythingConfig(
        working_dir="./.rag_store",
        enable_image_processing=False,
        enable_table_processing=False,
        enable_equation_processing=False,
    )

    rag = RAGAnything(
        config=config,
        llm_model_func=custom_llm,
        embedding_func=embedding_func,
    )

    await rag._ensure_lightrag_initialized()

    result = await rag.aquery(
        query,
        mode="naive",
        top_k=10,
        enable_rerank=False
    )

    print("\n=== RESULT ===\n")
    print(result)


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
import os

app = FastAPI()

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# File paths for storing FAISS and metadata
FAISS_INDEX_PATH = "faiss_index.bin"
PRODUCT_METADATA_PATH = "product_store.json"

# Define embedding dimension
embedding_dim = 384  # Model output size
index = faiss.IndexFlatL2(embedding_dim)  # L2 distance-based index
product_store = {}  # {FAISS index: {id, name, description, category}}


# **Load FAISS Index if exists**
if os.path.exists(FAISS_INDEX_PATH):
    index = faiss.read_index(FAISS_INDEX_PATH)

# **Load product metadata if exists**
if os.path.exists(PRODUCT_METADATA_PATH):
    with open(PRODUCT_METADATA_PATH, "r") as f:
        product_store = json.load(f)


# Product Schema
class Product(BaseModel):
    id: str  # MongoDB Product ID
    productName: str
    description: str
    category: str


@app.post("/generate_embedding")
def generate_embedding(product: Product):
    """Stores the embedding using the provided MongoDB product ID."""
    product_text = f"{product.productName} {
        product.description} {product.category}"
    embedding = model.encode(product_text).astype(np.float32)

    # Store embedding in FAISS
    index.add(np.array([embedding]))

    # Map FAISS index to product metadata
    faiss_index = index.ntotal - 1  # Get the last inserted index
    product_store[faiss_index] = {
        "id": product.id,  # Store MongoDB Product ID
    }

    # **Save FAISS index to disk**
    faiss.write_index(index, FAISS_INDEX_PATH)

    # **Save metadata to JSON**
    with open(PRODUCT_METADATA_PATH, "w") as f:
        json.dump(product_store, f)

    return {"message": "Embedding stored successfully", "productId": product.id}


@app.get("/search")
def search_product(query: str, top_k: int = 5):
    """Search for similar products based on a query."""
    query_embedding = model.encode(query).astype(np.float32).reshape(1, -1)

    if index.ntotal == 0:
        return {"message": "No products stored yet"}

    distances, indices = index.search(query_embedding, top_k)

    if os.path.exists(PRODUCT_METADATA_PATH):
        with open(PRODUCT_METADATA_PATH, "rb") as f:
            product_store = json.load(f)
    results = [
        {product_store[str(i)]["id"]}
        for j, i in enumerate(indices[0])
        if str(i) in product_store
    ]

    return {"query": query, "results": results}


@app.put("/update_embedding/{product_id}")
def update_embedding(product_id: str, product: Product):
    """Updates the embedding when a product is modified."""
    product_text = f"{product.productName} {
        product.description} {product.category}"
    new_embedding = model.encode(product_text).astype(np.float32)

    # **Find the FAISS index of this product**
    faiss_index = None
    for idx, data in product_store.items():
        if data["id"] == product_id:
            faiss_index = int(idx)  # Convert back to integer for FAISS

    if faiss_index is None:
        return {"message": "Product not found in embeddings"}

    # **Replace the existing embedding in FAISS**
    index.reconstruct(faiss_index, new_embedding)

    # **Update metadata**
    product_store[str(faiss_index)] = {
        "id": product_id,
        "name": product.productName,
        "description": product.description,
        "category": product.category,
    }

    # **Save FAISS index to disk**
    faiss.write_index(index, FAISS_INDEX_PATH)

    # **Save metadata to JSON**
    with open(PRODUCT_METADATA_PATH, "w") as f:
        json.dump(product_store, f)

    return {"message": "Embedding updated successfully"}


@app.delete("/delete_embedding/{product_id}")
def delete_embedding(product_id: str):
    """Deletes the embedding of a product when it is removed."""
    global index, product_store

    # **Find FAISS index of the product**
    faiss_index = None
    for idx, data in product_store.items():
        if data["id"] == product_id:
            faiss_index = int(idx)  # Convert back to integer
            break  # Stop once found

    if faiss_index is None:
        return {"message": "Product not found in embeddings"}

    # **Remove metadata from dictionary**
    del product_store[str(faiss_index)]  # Delete metadata first

    # **Rebuild FAISS index**
    new_index = faiss.IndexFlatL2(embedding_dim)
    new_product_store = {}

    new_idx = 0  # New FAISS index counter
    for old_idx in range(index.ntotal):
        if old_idx != faiss_index:
            vec = np.zeros((1, embedding_dim), dtype=np.float32)
            index.reconstruct(old_idx, vec)
            new_index.add(vec)
            new_product_store[str(new_idx)] = product_store.get(
                str(old_idx), {}
            )  # Shift metadata
            new_idx += 1

    index = new_index  # Replace with new FAISS index
    product_store = new_product_store  # Update metadata

    # **Save FAISS index to disk**
    faiss.write_index(index, FAISS_INDEX_PATH)

    # **Save metadata to JSON**
    with open(PRODUCT_METADATA_PATH, "w") as f:
        json.dump(product_store, f)

    return {"message": "Embedding and metadata deleted successfully"}

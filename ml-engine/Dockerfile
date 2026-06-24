FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for sentence-transformers & faiss
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY seed_data.json .
COPY seed_index.py .
COPY main.py .

# Build the FAISS index (embeddings generated at build time)
RUN python seed_index.py

# Expose port
EXPOSE 8000

# Run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

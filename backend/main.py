import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # import for serving static files
from pydantic import BaseModel
from typing import List
import os  # for constructing path

class Fruit(BaseModel):
    name: str

class Fruits(BaseModel):
    fruits: List[Fruit]

app = FastAPI()

# serve static files under /static and root index at /
static_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), '../frontend/src'))
app.mount('/static', StaticFiles(directory=static_dir), name='static')

from fastapi.responses import FileResponse
@app.get('/', include_in_schema=False)
def serve_index():
    return FileResponse(os.path.join(static_dir, 'index.html'))

origins = [
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

memory_db = {"fruits": []}

@app.get("/fruits", response_model=Fruits)
def get_fruits():
    return Fruits(fruits=memory_db["fruits"])

@app.post("/fruits", response_model=Fruit)
def add_fruit(fruit: Fruit):
    memory_db["fruits"].append(fruit)
    return fruit

@app.delete("/fruits/{fruit_name}", response_model=Fruits)
def delete_fruit(fruit_name: str):
    memory_db['fruits'] = [fruit for fruit in memory_db['fruits'] if fruit.name != fruit_name]
    return Fruits(fruits=memory_db['fruits'])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
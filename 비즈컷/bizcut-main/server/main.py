import os
import base64
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# FastAPI 인스턴스 생성
app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI 모델 전역 변수
model = None

# ───── [1. 루트 페이지 - "안 열릴 리가 없습니다!"] ─────
@app.get("/")
async def root():
    return {
        "status": "ONLINE",
        "owner": "사장님",
        "message": "BizCut Backend Server is Ready!",
        "note": "AI 모델은 첫 요청 시에 로드됩니다."
    }

# Vertex AI 설정 함수 (필요할 때 호출)
def get_model():
    global model
    if model is None:
        try:
            from vertexai.preview.vision_models import ImageGenerationModel
            model = ImageGenerationModel.from_pretrained("imagen-3.0-capability-001")
        except Exception as e:
            print(f"Auth Error: {e}")
            return None
    return model

# 데이터 모델
class EditRequest(BaseModel):
    image_b64: str
    prompt: str
    aspect_ratio: str = "1:1"

class GenerateImageRequest(BaseModel):
    prompt: str
    aspect_ratio: str = "1:1"

@app.post("/edit-photo")
async def edit_photo(request: EditRequest):
    m = get_model()
    if not m:
        raise HTTPException(status_code=500, detail="AI Model not initialized. Please authenticate.")
    # (보정 로직)
    return {"message": "Image processing test"}

@app.post("/generate-image")
async def generate_image(request: GenerateImageRequest):
    m = get_model()
    if not m:
        raise HTTPException(status_code=500, detail="AI Model not initialized. Please authenticate.")
    try:
        # Imagen 3 호출
        response = m.generate_images(
            prompt=request.prompt,
            number_of_images=1,
            aspect_ratio=request.aspect_ratio,
        )
        if not response.images:
            raise HTTPException(status_code=500, detail="No image generated")
        
        image = response.images[0]
        # ._image_bytes 가져와서 base64 인코딩
        img_b64 = base64.b64encode(image._image_bytes).decode("utf-8")
        return {"image_b64": img_b64}
    except Exception as e:
        print(f"Gen Image Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run 전용!
    uvicorn.run(app, host="0.0.0.0", port=8000)

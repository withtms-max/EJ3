window.THE3CUT_DATA = {
  SHOP_CATEGORIES: [
    {
      id: 'food',
      name: '식당 / 밥집',
      description: '맛있는 음식 사진',
      prompt: 'Professional ultra-high-end food photography, commercial studio lighting, macro lens for texture, bokeh background, steaming fresh food, appetizing color palette, high-resolution details.'
    },
    {
      id: 'cafe',
      name: '카페 / 제과',
      description: '커피와 빵 사진',
      prompt: 'Aesthetic cafe lifestyle photography, soft natural morning window light, warm and cozy bakery atmosphere, minimalist composition, creamy and rich textures, professional social media style.'
    },
    {
      id: 'clothes',
      name: '옷가게 / 패션',
      description: '의류 및 패션 잡화',
      prompt: 'High-end fashion retail photography, professional studio strobe lighting, crisp fabric texture, clean and elegant background, sophisticated boutique atmosphere, commercial-grade look.'
    },
    {
      id: 'etc',
      name: '기타 매장',
      description: '모든 업종 가능',
      prompt: 'Professional commercial business photography, clean and polished look.'
    },
    {
      id: 'portrait',
      name: '사장님컷 👔',
      description: '인물사진 전문 보정',
      prompt: 'Professional portrait photography for business owners. Clean background or natural bokeh, flattering skin tones, sharp eye detail, soft studio lighting, confident and approachable expression, business-appropriate atmosphere.'
    },
    {
      id: 'beauty',
      name: '헤어 / 뷰티',
      description: '미용실·뷰티샵 사진',
      prompt: 'High-end beauty and hair salon photography. Glamorous lighting, perfect skin retouching, vivid hair colors, polished styling, professional cosmetic product shots, elegant and luxurious salon atmosphere.'
    }
  ],

  PHOTO_STYLES: [
  {
    id: 'clean_bg',
    name: '깔끔한 배경',
    description: '제품만 돋보이는 스튜디오',
    prompt: 'Clean minimalist studio background, soft shadows, perfect for e-commerce, isolated product look, neutral professional tones.'
  },
  {
    id: 'pictorial',
    name: '광고 화보 스타일',
    description: '잡지속 한 장면처럼 웅장하게',
    prompt: 'Move the subject into a premium high-end commercial photo studio. Re-create the background with luxury props, sophisticated spot lighting, and a perfectly polished set design that matches a top-tier brand campaign. High-end editorial photo.'
  },
  {
    id: 'vivid',
    name: '생생한 식감 / 접사',
    description: '음식을 가깝게, 더 생동감 넘치게',
    prompt: 'Perform a close-up macro shot of the food/subject. Re-create the scene by enhancing textures to be incredibly vivid and appetizing. Add professional details like subtle steam, fresh water droplets, or appetizing glazes that make the food look freshly prepared and mouth-watering. 8k resolution macro photography.'
  },
  {
    id: 'sunlight',
    name: '따뜻한 오후 햇살',
    description: '창가에서 찍은 듯한 분위기',
    prompt: 'Natural golden hour lighting, soft window shadows, light and airy atmosphere, warm sunlight streak, realistic lifestyle photography, 35mm lens feel, peaceful and aesthetic morning vibe.'
  },
  {
    id: 'place',
    name: '네이버 플레이스용',
    description: '상위 노출되는 핫플 맛집 느낌',
    prompt: 'Re-create the scene using a professional "Flat Lay" (top-down / 항공샷) photography style. NO PEOPLE, NO HUMAN figures. Surround the main dish with a variety of beautifully plated side dishes and ingredients to create a rich and full table setting. Ensure a professional shallow depth of field where the ORIGINAL MAIN DISH remains perfectly sharp and in clear focus, while the surrounding elements have a soft bokeh effect. High-end gourmet aesthetic for Naver Place.'
  },
  {
    id: 'night',
    name: '야간 네온 감성',
    description: '현대적이고 힙한 밤 조명',
    prompt: 'Cyberpunk neon lighting, deep blue and purple highlights, modern urban aesthetic, cool and trendy night photography.'
  },
  {
    id: 'retro',
    name: '빈티지 레트로',
    description: '추억이 묻어나는 필름 느낌',
    prompt: 'Vintage film photography, 90s retro aesthetic, grain texture, warm muted tones, nostalgic feel.'
  },
  {
    id: 'blog',
    name: '네이버 블로그 감성',
    description: '음식을 가깝게, 블로그 감성 담아 생생하게',
    prompt: 'Perform a close-up macro shot of the food/subject. Re-create the scene by enhancing textures to be incredibly vivid and appetizing. Add professional details like subtle steam, fresh water droplets, or appetizing glazes that make the food look freshly prepared and mouth-watering. 8k resolution macro photography.'
  },
  {
    id: 'luxury',
    name: '고급 3D 렌더링',
    description: '금속과 조명의 완벽한 조화',
    prompt: `[Role 정의]
You are a High-End 3D Fashion Visualizer and Digital Cloth Simulator expert.
[Context/배경]
Create a professional 360° product turnaround sheet for a high-fashion outfit. The focus is purely on the garment's structure, fabric texture, and 3D volume, without any human facial features or skin visible.
[Task/지시사항]
Ghost Mannequin Effect: Render the outfit as if worn by an invisible body to maintain a natural 3D shape and flow. (NO human face, NO skin, NO head).
360° Viewport: Generate 8 consistent angles (0°, 30°, 60°, 90°, 150°, 180°, 210°, 270°) arranged in a single row.
Texture Mastery: Use high-resolution shaders to express realistic fabric details (e.g., stitching, embroidery, material density). Ensure the 3D depth of the clothes is visible in every profile.
Cinematic Quality: Apply 8K resolution, Masterpiece quality, and Sharp focus. Eliminate all noise, artifacts, and blurriness.
[Constraints/제약조건]
EXCLUDE: Human heads, faces, hands, and skin.
Background: Solid neutral studio background. Absolutely NO gradation banding or color noise.
Lighting: Soft 3-point studio lighting to highlight the 3D contours of the fabric.
Consistency: The shape, color, and texture of the outfit must remain identical across all 8 angles.
[Output Format/출력형식]
A horizontal panoramic sheet.
8 segmented panels showing the outfit's rotation.
Keywords: [Photorealistic, Ghost mannequin, 3D clothing render, Unreal Engine 5, Ray-traced shadows, 8k, Ultra-detailed fabric].`
  },
  {
    id: 'nature',
    name: '자연친화 컨셉',
    description: '식물과 함께하는 상쾌한 무드',
    prompt: 'Organic and eco-friendly photography, surrounded by greenery and plants, fresh earth tones, sustainable brand image.'
  }
  ],

  PORTRAIT_STYLES_MALE: [
  {
    id: 'pm_id_photo',
    name: '증명사진 / 여권사진',
    description: '4장 인화 시트 · 스튜디오 규격',
    prompt: `업로드된 인물 사진을 기반으로, 동일 인물의 생체적 특징을 완벽히 보존하면서 대한민국 스튜디오 규격의 고품질 증명사진 인화 시트를 생성한다. 최종 결과물은 2x2인치 증명사진 4장, 2열 × 2행 배열, 즉시 인쇄 가능한 해상도, 단일 캔버스 완성본. [절대 규칙] 얼굴형, 턱선, 광대 구조, 눈 크기 및 간격, 코 형태, 입 형태, 눈매/입매 특징 픽셀 수준 유지. AI 미화 얼굴 생성 금지, 과도한 윤곽 보정 금지. 완전 정면, 카메라 아이레벨, 무표정 또는 미세 미소, 치아 노출 금지. 소프트 스튜디오 조명, 양측 균형광. 배경은 흰색 또는 연한 하늘색 단색 균일. 포멀 정장(재킷: 검정/네이비/차콜, 셔츠: 흰색), 단색 넥타이. 초고해상도 300dpi 인쇄 기준. [Identity Lock] 동일 인물 보존 최우선.`
  },
  {
    id: 'pm_emerald',
    name: '에메랄드 + 다크 수트',
    description: '측면 앵글 · 영화 조명',
    prompt: `첨부된 사진을 바탕으로 인물의 얼굴 특징을 완벽하게 유지하면서 수직 비율의 초상화를 생성해 줘. 뺨을 따라 은은한 하이라이트가 흐르고 깊이감이 느껴지도록 명암 대비가 강한 영화 같은 스튜디오 조명을 사용해 줘. 인물의 자연스러운 헤어스타일과 표정을 유지하되, 턱선이 돋보이도록 약간 측면 각도로 프레임을 잡아 줘. 의상은 세련된 어두운 색 정장 재킷으로 하여 현대적이고 지적인 분위기를 연출해 줘. 배경은 이음새 없는 깊은 에메랄드 그린 색상으로 처리하여, 빛나는 피부 톤과 어두운 의상이 우아하고 권위 있게 돋보이도록 해 줘. [Identity Lock] 눈의 위치, 콧날, 입술 모양 등 인물 고유 특징 절대 유지. Photo Realism: 실제 사진과 구분 불가능한 수준. Format: 4:5 고해상도 세로 초상화.`
  },
  {
    id: 'pm_crimson',
    name: '크림슨 레드 + 셔츠',
    description: '로우 앵글 · 하이패션',
    prompt: `첨부된 사진을 바탕으로 하이패션 화보 스타일의 초상화를 생성해 줘. 인물의 얼굴 특징은 그대로 유지해야 해. 왼쪽 위에서 빛이 들어오는 영화 같은 조명을 사용하여 광대뼈와 턱선, 목 라인의 골격을 강조하고 반대편은 부드러운 그림자가 지게 해 줘. 약간 아래에서 위를 바라보는 각도(로우 앵글)로 잡아 턱선을 강조하고 목을 길어 보이게 하여 대담한 존재감을 줘. 표정은 차분하면서도 강렬하고, 약간의 매혹적인 느낌이 들도록 해 줘. 의상은 빳빳하고 잘 재단된 드레스 셔츠를 입혀 세련미를 더해 줘. 배경은 깊고 짙은 크림슨 레드(진홍색)로 설정하여 피부 톤과 강렬한 대비를 이루도록 해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pm_royal_blue',
    name: '로얄 블루 + 다크 수트',
    description: '측면 조명 · 시네마틱',
    prompt: `첨부된 사진의 얼굴 특징을 완벽하게 유지한 세로 초상화를 생성해 줘. 왼쪽 위에서 들어오는 대담한 조명으로 얼굴 왼쪽의 윤곽을 선명하게 살리고 반대쪽은 부드러운 그림자를 줘. 표정은 차분하고 우아하며 강렬한 눈빛을 담아 줘. 의상은 세련된 어두운 색 수트 재킷으로 하여 전문적인 느낌을 주고, 배경은 풍부한 로얄 블루 색상으로 설정하여 피부 톤과 시원하고 강력한 대비를 이루는 영화 같은 분위기를 만들어 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pm_dark_gray',
    name: '딥 그레이 + 블랙 터틀넥',
    description: '팔짱 포즈 · 럭셔리 에디토리얼',
    prompt: `첨부된 사진의 얼굴 특징을 정확히 유지한 하이패션 화보 스타일을 생성해 줘. 강렬하지만 정제된 시네마틱 조명을 사용해 부드러운 그림자로 얼굴의 깊이감을 줘. 팔짱을 끼고 어깨를 살짝 튼 포즈로 남성적인 권위와 자신감을 표현해 줘. 시선은 침착하면서도 강렬하게 유지해 줘. 의상은 심플한 검정 터틀넥, 배경은 이음새 없는 짙은 회색으로 설정하여 미니멀하면서도 럭셔리한 에디토리얼 무드를 완성해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pm_sand_beige',
    name: '샌드 베이지 + 니트',
    description: '소프트 조명 · 부드러운 남성미',
    prompt: `첨부된 사진을 바탕으로 얼굴 특징을 정확히 유지하면서, 커다란 소프트박스 조명을 정면에서 비춘 듯 그림자 없이 화사하고 부드러운 뷰티 조명을 사용해 줘. 표정은 긴장을 풀고 살짝 미소를 머금은 편안하고 친근한 표정을 지어 줘. 의상은 포근한 질감이 느껴지는 아이보리색 케이블 니트나 린넨 셔츠로 내추럴함을 강조해 줘. 배경은 채도가 낮고 따뜻한 샌드 베이지(Sand Beige) 색상의 무배경으로 처리해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pm_royal_blue2',
    name: '로얄 블루 + 머슬핏',
    description: '하이패션 무드',
    prompt: `첨부된 사진의 얼굴 특징을 완벽하게 유지한 세로 초상화를 생성해 줘. 왼쪽 위에서 들어오는 대담한 조명으로 얼굴과 어깨의 윤곽을 선명하게 살리고 반대쪽은 부드러운 그림자 속에 둬. 표정은 차분하고 우아하며 부드러운 강렬함을 담아 줘. 의상은 몸의 실루엣이 드러나는 미니멀한 블랙 상의로 하여 얼굴과 조명에 집중하게 해 줘. 배경은 풍부한 로얄 블루 색상으로 설정하여 피부 톤과 쿨한 대비를 이루는 하이패션 무드를 완성해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pm_ivory_suit',
    name: '아이보리 + 수트',
    description: '상반신 구도 · 우아함',
    prompt: `첨부된 사진의 얼굴 특징을 정확히 유지하면서 상반신 전체가 드러나는 하이패션 화보 스타일을 생성해 줘. 빛나는 하이라이트와 정제된 그림자가 얼굴을 자연스럽게 조각하는 시네마틱 조명을 사용해 줘. 어깨를 살짝 튼 차분한 포즈로 자신감과 세련미를 보여 줘. 시선은 차분하지만 강렬하고 매혹적이어야 해. 의상은 세련된 수트나 모던한 블레이저를 입혀 남성적인 우아함과 권위를 강조해 줘. 배경은 순수한 아이보리 화이트의 무배경으로 처리하여 깨끗한 이미지를 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pm_bw_turtleneck',
    name: '흑백 + 블랙 터틀넥',
    description: '측면 포즈 · 드라마틱',
    prompt: `첨부된 사진을 바탕으로 인물의 얼굴 특징을 완벽하게 유지하면서 고해상도 흑백 초상화를 생성해 줘. 의상은 날렵한 검은색 터틀넥을 착용하고, 헤어스타일은 단정하고 클래식하게 뒤로 넘긴 스타일(Slicked back)로 연출해 줘. 미니멀한 스튜디오 배경에서 약간 측면을 향해 자신감 있게 서 있는 구도를 잡아 줘. 드라마틱한 스튜디오 조명을 사용하여 얼굴에 대담한 기하학적 그림자를 드리우고, 배경에는 강한 빛줄기가 교차하며 그림자를 가르는 영화 같은 분위기를 만들어 줘. 표정은 차분하고 내성적이며 약간 거리감이 느껴지도록 담아 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pm_white_shirt',
    name: '순백색 + 화이트 셔츠',
    description: '테이블 포즈 · 미니멀',
    prompt: `첨부된 사진의 얼굴 특징을 완벽하게 유지한 채, 잡티 하나 없는 순백색 배경의 스튜디오에서 촬영한 사진을 생성해 줘. 의상은 심플하고 깨끗한 화이트 셔츠를 입어 우아하고 미니멀한 분위기를 연출하고, 정돈된 헤어라인으로 얼굴선을 살려 줘. 또렷한 눈매, 정교하게 다듬어진 눈썹 등 결점 없는 자연스러운 그루밍을 적용해 줘. 포즈는 흰 테이블에 팔을 살짝 괴고, 부드럽고 매혹적인 표정으로 카메라를 응시하는 모습으로 잡아 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pm_pastel_pink',
    name: '파스텔 핑크 + 가디건',
    description: '캐주얼 · 소프트 분위기',
    prompt: `부드럽고 화사한 분위기의 캐주얼 초상화를 생성해 줘. 정면에서 비추는 아주 부드럽고 확산된 조명(소프트 박스)을 사용하여 그림자를 최소화하고 뽀얀 피부 톤을 표현해. 카메라를 편안하게 바라보는 정면 미디엄 샷(가슴 위)으로 촬영해. 의상은 밝은 회색 니트 카디건과 흰색 티셔츠를 레이어드하여 편안하고 따뜻한 느낌을 줘. 배경은 깨끗하고 부드러운 파스텔 핑크색 무배경으로 처리하여 사랑스럽고 온화한 분위기를 강조해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pm_ivory_blazer',
    name: '아이보리 + 모던 블레이저',
    description: '시네마틱 조명 · 권위',
    prompt: `첨부된 사진의 얼굴 특징을 정확히 유지한 하이패션 화보 스타일을 생성해 줘. 빛나는 하이라이트와 정제된 그림자가 얼굴을 자연스럽게 조각하는 시네마틱 조명을 사용해 줘. 어깨를 살짝 튼 차분한 포즈로 자신감과 세련미를 보여 줘. 시선은 차분하지만 강렬하고 매혹적이어야 해. 의상은 세련된 수트나 모던한 블레이저를 입혀 남성적인 우아함과 권위를 강조해 줘. 배경은 순수한 아이보리 화이트의 무배경으로 처리하여 시대를 초월한 우아함을 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pm_dark_charcoal',
    name: '다크 챠콜 + 클래식 코트',
    description: '중후한 무드 · 로우키',
    prompt: `첨부된 사진의 얼굴 특징을 유지하며, 묵직한 질감이 느껴지는 다크 챠콜 울 코트를 입혀 줘. 조명은 얼굴의 굵직한 선을 강조하는 로우키 조명을 사용하고, 배경은 차분한 그레이 톤의 콘크리트 질감 스튜디오 배경으로 설정해. 지적이면서도 고독한 분위기의 깊이 있는 표정을 강조해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  }
  ],

  PORTRAIT_STYLES_FEMALE: [
  {
    id: 'pf_id_photo',
    name: '증명사진 / 여권사진',
    description: '4장 인화 시트 · 스튜디오 규격',
    prompt: `업로드된 인물 사진을 기반으로, 동일 인물의 생체적 특징을 완벽히 보존하면서 대한민국 스튜디오 규격의 고품질 증명사진 인화 시트를 생성한다. 최종 결과물은 2x2인치 증명사진 4장, 2열 × 2행 배열, 즉시 인쇄 가능한 해상도, 단일 캔버스 완성본. [절대 규칙] 얼굴형, 턱선, 광대 구조, 눈 크기 및 간격, 코 형태, 입 형태, 눈매/입매 특징 픽셀 수준 유지. AI 미화 얼굴 생성 금지, 과도한 윤곽 보정 금지. 완전 정면, 카메라 아이레벨, 무표정 또는 미세 미소, 치아 노출 금지. 소프트 스튜디오 조명, 양측 균형광. 배경은 흰색 또는 연한 하늘색 단색 균일. 여성: 포멀 정장 블라우스(흰색 또는 밝은 톤), 단정한 헤어, 과장 장식 제거. 초고해상도 300dpi 인쇄 기준. [Identity Lock] 동일 인물 보존 최우선.`
  },
  {
    id: 'pf_emerald',
    name: '에메랄드 + 다크 수트',
    description: '측면 앵글 · 영화 조명',
    prompt: `첨부된 사진을 바탕으로 인물의 얼굴 특징을 완벽하게 유지하면서 수직 비율의 초상화를 생성해 줘. 뺨을 따라 은은한 하이라이트가 흐르고 깊이감이 느껴지도록 명암 대비가 강한 영화 같은 스튜디오 조명을 사용해 줘. 인물의 자연스러운 헤어스타일과 표정을 유지하되, 턱선이 돋보이도록 약간 측면 각도로 프레임 잡아 줘. 의상은 세련된 어두운 색 정장 재킷으로 하여 현대적이고 지적인 분위기를 연출해 줘. 배경은 이음새 없는 깊은 에메랄드 그린 색상으로 처리하여, 빛나는 피부 톤과 어두운 의상이 우아하고 권위 있게 돋보이도록 해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pf_crimson',
    name: '크림슨 레드 + 셔츠',
    description: '로우 앵글 · 하이패션',
    prompt: `첨부된 사진을 바탕으로 하이패션 화보 스타일의 초상화를 생성해 줘. 인물의 얼굴 특징은 그대로 유지해야 해. 왼쪽 위에서 빛이 들어오는 영화 같은 조명을 사용하여 광대뼈와 턱선, 목 라인을 강조하고 반대편은 부드러운 그림자가 지게 해 줘. 약간 아래에서 위를 바라보는 각도(로우 앵글)로 잡아 턱선을 강조하고 목을 길어 보이게 하여 대담한 존재감을 줘. 표정은 차분하면서도 강렬하고, 약간의 매혹적인 느낌이 들도록 해 줘. 의상은 빳빳하고 잘 재단된 셔츠를 입혀 세련미를 더해 줘. 배경은 깊고 짙은 크림슨 레드(진홍색)로 설정하여 피부 톤과 강렬한 대비를 이루도록 해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pf_royal_blue',
    name: '로얄 블루 + 다크 수트',
    description: '측면 조명 · 시네마틱',
    prompt: `첨부된 사진의 얼굴 특징을 완벽하게 유지한 세로 초상화를 생성해 줘. 왼쪽 위에서 들어오는 대담한 조명으로 왼쪽 얼굴의 윤곽을 선명하게 살리고 반대쪽은 부드러운 그림자를 줘. 표정은 차분하고 우아하며 강렬한 눈빛을 담아 줘. 의상은 세련된 어두운 색 수트 재킷으로 하여 전문적인 느낌을 주고, 배경은 풍부한 로얄 블루 색상으로 설정하여 피부 톤과 시원하고 강력한 대비를 이루는 영화 같은 분위기를 만들어 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pf_dark_gray',
    name: '딥 그레이 + 블랙 터틀넥',
    description: '팔짱 포즈 · 럭셔리 에디토리얼',
    prompt: `첨부된 사진의 얼굴 특징을 정확히 유지한 하이패션 화보 스타일을 생성해 줘. 강렬하지만 정제된 시네마틱 조명을 사용해 부드러운 그림자로 깊이감을 줘. 팔짱을 끼고 어깨를 살짝 튼 포즈로 권위와 자신감을 표현해 줘. 시선은 침착하면서도 강렬하게 유지해 줘. 의상은 심플한 검정 터틀넥, 배경은 이음새 없는 짙은 회색으로 설정하여 미니멀하면서도 럭셔리한 에디토리얼 무드를 완성해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pf_sand_beige',
    name: '샌드 베이지 + 니트',
    description: '자연스러운 증명사진 느낌',
    prompt: `첨부된 사진을 바탕으로 얼굴 특징을 정확히 유지하면서, 커다란 소프트박스 조명을 정면에서 비춘 듯 그림자 없이 화사하고 부드러운 뷰티 조명을 사용해 줘. 표정은 긴장을 풀고 살짝 미소를 머금은 편안하고 친근한 표정을 지어줘. 의상은 포근한 질감이 느껴지는 아이보리색 니트나 린넨 셔츠로 내추럴함을 강조해 줘. 배경은 채도가 낮고 따뜻한 샌드 베이지(Sand Beige) 색상의 무배경으로 처리해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pf_royal_blue2',
    name: '로얄 블루 + 오프숄더',
    description: '하이패션 무드 (여성)',
    prompt: `첨부된 사진의 얼굴 특징을 완벽하게 유지한 세로 초상화를 생성해 줘. 왼쪽 위에서 들어오는 대담한 조명으로 얼굴의 윤곽을 선명하게 살리고 반대쪽은 부드러운 그림자 속에 둬. 표정은 차분하고 우아하며 부드러운 강렬함을 담아 줘. 의상은 얇은 끈이 있는 미니멀한 스타일(혹은 오프숄더)로 하여 얼굴과 조명에 집중하게 해 줘. 배경은 풍부한 로얄 블루 색상으로 설정하여 피부 톤과 쿨한 대비를 이루는 하이패션 무드를 완성해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pf_ivory_suit',
    name: '아이보리 + 수트',
    description: '상반신 구도 (여성)',
    prompt: `첨부된 사진의 얼굴 특징을 정확히 유지하면서 상반신 전체가 드러나는 하이패션 화보 스타일을 생성해 줘. 빛나는 하이라이트와 정제된 그림자가 얼굴을 자연스럽게 조각하는 시네마틱 조명을 사용해 줘. 어깨를 살짝 튼 차분한 포즈로 자신감과 세련미를 보여줘. 시선은 차분하지만 강렬하고 매혹적이어야 해. 의상은 세련된 수트나 모던한 블레이저를 입혀 우아함과 권위를 강조해 줘. 배경은 순수한 아이보리 화이트의 무배경으로 처리하여 우아함을 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pf_bw_turtleneck',
    name: '흑백 + 블랙 터틀넥',
    description: '측면 포즈 (여성)',
    prompt: `첨부된 사진을 바탕으로 인물의 얼굴 특징을 완벽하게 유지하면서 고해상도 흑백 초상화를 생성해 줘. 의상은 날렵한 검은색 터틀넥과 시크하고 작은 금 귀걸이를 착용하고, 헤어스타일은 단정한 한국식 묶음 머리(Bun)로 연출해 줘. 미니멀한 스튜디오 배경에서 약간 측면을 향해 자신감 있게 서 있는 구도를 잡아 줘. 드라마틱한 스튜디오 조명을 사용하여 얼굴에 대담한 기하학적 그림자를 드리우고, 배경에는 강한 빛줄기가 교차하며 그림자를 가르는 영화 같은 분위기를 만들어 줘. 표정은 차분하고 내성적이며 약간 거리감이 느껴지도록 담아 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pf_white_dress',
    name: '순백색 + 화이트 드레스',
    description: '테이블 포즈 (여성)',
    prompt: `첨부된 사진의 얼굴 특징을 완벽하게 유지한 채, 잡티 하나 없는 순백색 배경의 스튜디오에서 촬영한 사진을 생성해 줘. 의상은 심플한 민소매 화이트 드레스를 입어 우아하고 미니멀한 분위기를 연출하고, 긴 머리를 자연스럽게 늘어뜨려 얼굴선을 살려 줘. 또렷한 눈매, 깔끔한 눈썹, 은은한 블러셔, 자연스러운 분홍빛 입술 등 결점 없는 자연스러운 글램 메이크업을 적용해 줘. 포즈는 흰 테이블에 머리를 살짝 괴고, 부드럽고 매혹적인 표정으로 카메라를 응시하는 모습으로 잡아 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pf_pastel_pink',
    name: '파스텔 핑크 + 가디건',
    description: '캐주얼 증명사진 느낌',
    prompt: `부드럽고 화사한 분위기의 캐주얼 초상화를 생성해 줘. 정면에서 비추는 아주 부드럽고 확산된 조명(소프트 박스)을 사용하여 그림자를 최소화하고 뽀얀 피부 톤을 표현해. 카메라를 편안하게 바라보는 정면 미디엄 샷(가슴 위)으로 촬영해. 의상은 밝은 회색 니트 카디건과 흰색 티셔츠를 레이어드하여 편안하고 따뜻한 느낌을 줘. 배경은 깨끗하고 부드러운 파스텔 핑크색 무배경으로 처리하여 사랑스럽고 온화한 분위기를 강조해 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  },
  {
    id: 'pf_ivory_blazer',
    name: '아이보리 + 모던 블레이저',
    description: '시네마틱 조명 (여성)',
    prompt: `첨부된 사진의 얼굴 특징을 정확히 유지한 하이패션 화보 스타일을 생성해 줘. 빛나는 하이라이트와 정제된 그림자가 얼굴을 자연스럽게 조각하는 시네마틱 조명을 사용해 줘. 어깨를 살짝 튼 차분한 포즈로 자신감과 세련미를 보여줘. 시선은 차분하지만 강렬하고 매혹적이어야 해. 의상은 세련된 수트나 모던한 블레이저를 입혀 우아함과 권위를 강조해 줘. 배경은 순수한 아이보리 화이트의 무배경으로 처리하여 시대를 초월한 우아함을 줘. [Identity Lock] 얼굴 특징 절대 유지. Format: 4:5 고해상도.`
  }
  ],

  BEAUTY_STYLES_MALE: [
  {
    id: 'bm_buzz',
    name: '클린 버즈컷',
    description: '각진 쉐이딩 · 남성미 극대화',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the uploaded person's IDENTICAL FACIAL FEATURES, JAWLINE, AND EYE SHAPE.\n[Task] Apply Style 1: (Ultra Short) Clean Buzz Cut.\n[Style] High skin fade from temples to nape, sharp geometric hairline edge, perfectly uniform buzz length on top (guard #1-2), sculpted sideburns. Masculine grooming, studio lighting with dramatic rim light.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_ivy',
    name: '아이비리그컷',
    description: '지적인 세련미 · 매트 왁스',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 2: (Textured) Ivy League Cut.\n[Style] Short tapered sides with textured top, natural texture with matte wax hold, small side part, smart-casual clean styling. Preppy intellectual vibe.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_slickback',
    name: '슬릭백',
    description: '포마드 광택 · 비즈니스 엘리트',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 3: (Classic) Slick Back.\n[Style] All hair slicked straight back with high-shine pomade, no parting, clean side hairline, slight volume at crown. Professional executive appearance. Dark professional suit jacket.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_comma',
    name: '콤마 헤어',
    description: '소프트 C컬 앞머리 · K-POP',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 4: (Trendy) Comma Hair.\n[Style] Soft C-curl dangling fringe covering part of forehead (like a comma shape), natural silky black hair, k-pop idol clean styling with soft glow skin. Natural boyish charm.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_center',
    name: '센터 파트',
    description: '5:5 가름 · 애쉬 브라운',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 5: (Modern) Center Part.\n[Style] Perfect 5:5 center-parted curtain hair, medium length falling naturally on both sides, subtle ash brown tint, relaxed natural volume.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_crop',
    name: '크롭컷',
    description: '직선 앞머리 · 스트릿 무드',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 6: (Sharp) Crop Cut.\n[Style] Blunt perfectly straight-cut fringe just above the brows, short slightly permed sides. Street-style aesthetic, urban youth fashion. Bold modern look.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_dandy',
    name: '댄디컷',
    description: '자연스러운 앞머리 · 소프트 감성',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 7: (Soft) Dandy Cut.\n[Style] Natural flowing fringe softly covering the forehead, warm soft brown hair color, gentle and boyish handsome look. Warm indoor lighting, cozy atmosphere.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_shadow',
    name: '섀도우 펌',
    description: '볼륨 C컬 · 캐주얼 아웃도어',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 8: (Volume) Shadow Perm.\n[Style] Messy voluminous C-curl perm on top, high natural volume at crown, slightly textured ends, casual and energetic look. Outdoor park background with soft sunlight.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_leaf',
    name: '리프컷',
    description: '옆으로 쓸어넘긴 기장 · 아티스틱',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 9: (Unique) Leaf Cut.\n[Style] Long side-swept fringe flowing past the eye, neck-length hair in the back. Artistic and introspective moody vibe. Textured and slightly tousled.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_wolf',
    name: '울프컷',
    description: '짙은 레이어링 · 다크 무드',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 10: (Rugged) Shaggy Wolf Cut.\n[Style] Heavily layered shaggy wolf cut, textured choppy ends, slight wet-hair look. Dark moody photography lighting. Effortlessly edgy and rebellious.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_regent',
    name: '리젠트컷',
    description: '위로 세운 앞머리 · 에너지',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 11: (Clean) Regent Cut.\n[Style] Upward-swept fringe fully exposing the forehead, voluminous top swept back, clean and energetic masculine image. Vibrant and confident expression.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_silver',
    name: '실버 애쉬',
    description: '플래티넘 염색 · 미래지향적',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 12: (Chic) Silver Ash Crop.\n[Style] Platinum silver bleach dye, short textured crop haircut, futuristic high-fashion vibe. Avant-garde editorial styling. Cool-tone studio lighting.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_bun',
    name: '맨 번',
    description: '언더컷 묶음 · 크리에이티브',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 13: (Art) Man Bun.\n[Style] Long hair tied back into a clean man bun at crown, shaved or clean undercut sides, creative and artistic studio atmosphere.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_twoblock',
    name: '투블럭 파트',
    description: '극대화 대비 · 골드 포인트',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 14: (Hip) Two-block Parted.\n[Style] High contrast two-block: very short shaved sides, significantly longer top with defined side part, gold or caramel highlight streaks on top.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_pompadour',
    name: '사이드 폼파도르',
    description: '클래식 젠틀맨 · 사이드 가름',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 15: (Gentle) Side-swept Pompadour.\n[Style] High-volume swept pompadour at front, clean tapered sides, gentlemanly side part. Classic old-Hollywood sophistication. Formal suit or blazer.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_bowl',
    name: '볼컷',
    description: '소프트 레이어 · 브라이트 데일리',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 16: (Youth) Bowl Cut Transformation.\n[Style] Modern soft-layered bowl cut with natural texture, bright daily lifestyle background. Fresh and approachable look.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_scurl',
    name: 'S컬 펌',
    description: '웨이브 볼륨 · 로맨틱 무드',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 17: (Wave) S-Curl Perm.\n[Style] Deep S-wave texture with voluminous sides, romantic soft-focus look. Date-night atmosphere with warm golden lighting.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_spiky',
    name: '스파이키 숏',
    description: '매트 스파이크 · 스포티 에너지',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 18: (Sporty) Spiky Short.\n[Style] Messy spiked short hair with matte texture product, energetic and sporty look. Sun-drenched outdoor background.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_mullet',
    name: '블루블랙 멀렛',
    description: '딥 블루 틴트 · 록 시크',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 19: (Bold) Blue-Black Mullet.\n[Style] Deep dark blue-black tinted hair, mullet style with short front and long nape hair, edgy rock-chic attitude. Dark moody background.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  },
  {
    id: 'bm_silk',
    name: '실크 스트레이트',
    description: '광택 블랙 · 레드카펫 럭셔리',
    prompt: `[Role] Professional AI Barber & Stylist\n[Identity] STRICTLY MAINTAIN the person's IDENTICAL FACIAL FEATURES.\n[Task] Apply Style 20: (Luxury) Silk Straight Part.\n[Style] Glossy jet-black hair, perfectly straight with precise clean parting, ultra-smooth silk texture. Luxury suit outfit, red carpet or penthouse background.\n[Constraints] Head-and-shoulders crop, 8K photorealistic. FACE UNCHANGED.`
  }
  ],

  BEAUTY_STYLES_FEMALE: [
  {
    id: 'bf_pixie',
    name: '픽시컷',
    description: '실버 블론드 · 볼드 아이라인',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 1: (Short) Pixie Cut.\n[Style] Choppy textured pixie cut, silver blonde dye with natural root, bold black eyeliner makeup, chic minimalist editorial styling.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_bob',
    name: '블런트 밥',
    description: '젯 블랙 · 레드립 하이패션',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 2: (Classic) Blunt Bob.\n[Style] Chin-length perfectly blunt-cut bob, jet black hair with mirror shine, bold red lip makeup, high-fashion studio photography.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_seethru',
    name: '씨스루뱅 밥',
    description: '밀크 브라운 · 사랑스러운 무드',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 3: (Soft) See-through Bangs Bob.\n[Style] Light wispy see-through bangs, C-curl inward bob ends, milk brown warm hair color, coral dewy glass skin makeup. Lovely feminine charm vibe.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_tasel',
    name: '타슬컷',
    description: '웨트 텍스처 · 누드 메이크업',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 4: (Trendy) Tasel Cut.\n[Style] Straight blunt bottom ends with slight textured outward flip, wet-hair glossy finishing texture, minimal nude makeup, urban street-fashion background.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_hime',
    name: '히메컷',
    description: '날카로운 사이드 · 신비로운 분위기',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 5: (Modern) Hime Cut.\n[Style] Sharp precise side-block sections along cheeks, long perfectly straight back hair center-parted, graphic sharp eyeliner makeup, mysterious and artistic vibe.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_wind',
    name: '윈드컷',
    description: '에어리 볼륨 · 내추럴 무드',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 6: (Natural) Wind Cut.\n[Style] Medium length with light layering and airy volume, hair lightly windswept naturally, no-makeup dewy skin, breezy beach or outdoor park background.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_build',
    name: '빌드컷',
    description: 'S컬 미디엄 · 세련된 뷰티',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 7: (Elegant) Build Cut.\n[Style] S-curl body wave on medium length hair, volume and lift from roots, sophisticated polished makeup, professional office background.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_hush',
    name: '허쉬컷',
    description: '애쉬 하이라이트 · 힙스터 무드',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 8: (Hip) Hush Cut.\n[Style] Heavy extreme layering with mullet-style longer back sections, ash gray and silver highlights through dark base, street neon light background.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_goddess',
    name: '갓데스 웨이브',
    description: '허니 블론드 · 글리터 메이크업',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 9: (Romantic) Goddess Waves.\n[Style] Long flowing S-wave goddess hair, honey blonde and warm caramel tones, glitter eye makeup, romantic floral outdoor background.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_sleek',
    name: '슬릭 롱',
    description: '핀스트레이트 · 우아한 윤기',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 10: (Chic) Sleek Long.\n[Style] Pin-straight ultra-glossy long hair with perfect center part, contouring makeup, luxury penthouse or rooftop background.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_layered',
    name: '레이어드 C컬',
    description: '내추럴 브라운 · 데일리 무드',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 11: (Daily) Layered C-curl.\n[Style] Long layers with gentle natural C-curl at ends, natural brown warm tone, soft everyday makeup, cozy cafe background.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_hippie',
    name: '히피 펌',
    description: '타이트 볼륨 컬 · 레트로 감성',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 12: (Vintage) Hippie Perm.\n[Style] Tight small vintage curls throughout, high overall volume, subtle freckle makeup, retro 70s bohemian aesthetic with warm brown tones.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_pink',
    name: '핑크 발라야주',
    description: '핑크 애쉬 블렌드 · 유니크 무드',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 13: (Bold) Pink Balayage.\n[Style] Long wavy hair with seamless balayage from dark roots to rose pink and ash ends, festival makeup with shimmer, golden sunset background.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_lob',
    name: '사이드스웹 롱밥',
    description: '딥 사이드 파트 · 지적인 분위기',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 14: (Sophisticated) Side-swept Lob.\n[Style] Long bob with deep dramatic side part sweeping across forehead, soft waves, pearl accessories, gallery background. Refined intellectual sophistication.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_jelly',
    name: '젤리 펌',
    description: '탱글탱글 광택 컬 · 통통 튀는 매력',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 15: (Unique) Jelly Perm.\n[Style] Bouncy shiny jelly-like small curls throughout, wet glossy hair finish, vibrant red or coral lip color, colorful pop-art background.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_grace',
    name: '그레이스 펌',
    description: '두꺼운 초콜릿 컬 · 엘레강스 매력',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 16: (Grace) Grace Perm.\n[Style] Thick voluminous Hollywood waves, deep chocolate brown color, high glamour evening gown styling, warm classical studio lighting.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_bun',
    name: '타이트 번',
    description: '슬릭 올림머리 · 깔끔한 무드',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 17: (Clean) Tight Bun.\n[Style] Sleek hair pulled completely back into a tight neat bun, all edges perfectly smooth, clean bare hairline, balletcore aesthetic.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_highlight',
    name: '페이스 프레이밍',
    description: '블론드 앞가닥 · 시크 하이라이트',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 18: (Point) Face-framing Highlights.\n[Style] Dark brown base with bright blonde highlighted streaks framing the face on both front sides, 90s retro chic influence.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_ashblue',
    name: '애쉬 블루 롱',
    description: '딥 오션 블루 · 쿨톤 시크',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 19: (Cool) Ash Blue Long.\n[Style] Deep ocean blue long hair with soft loose waves, cool-tone skin makeup, winter aesthetic with cool neutral tones.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  },
  {
    id: 'bf_halfup',
    name: '하프업 다운',
    description: '소프트 웨이브 · 청순 무드',
    prompt: `[Role] Professional AI Hair Designer & Makeup Artist\n[Identity] STRICTLY KEEP the facial features and identity of the uploaded image.\n[Task] Apply Style 20: (Natural) Half-up Half-down.\n[Style] Top half of hair tied up with delicate ribbon or clip, bottom flows in soft natural waves, bridal or romantic dewy skin makeup, beautiful garden background.\n[Constraints] 8K resolution, realistic hair fiber, identical face, portrait framing. FACE UNCHANGED.`
  }
  ]
};
console.log("THE3CUT_DATA Object structure completed.");

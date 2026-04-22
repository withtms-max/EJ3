
import 'dart:typed_data';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../constants.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import 'save_image_platform.dart';

class EditorScreen extends StatefulWidget {
  final ShopCategory? initialCategory;

  const EditorScreen({super.key, this.initialCategory});

  @override
  State<EditorScreen> createState() => _EditorScreenState();
}

class PhotoSlot {
  final int id;
  Uint8List? original;
  Uint8List? generated;
  bool isGenerating;
  String styleId;
  String localRequest;

  PhotoSlot({
    required this.id,
    this.styleId = 'clean_bg',
    this.isGenerating = false,
    this.localRequest = '',
  });
}

class _EditorScreenState extends State<EditorScreen> {
  final StorageService _storageService = StorageService();
  String? _apiKey;

  late ShopCategory _selectedCategory;
  final List<PhotoSlot> _slots = List.generate(4, (index) => PhotoSlot(id: index + 1));
  int _activeSlotId = 1;
  final List<TextEditingController> _controllers = [];
  final TextEditingController _commonRequestController = TextEditingController();
  String _selectedGender = 'male'; 
  // 슬롯별 원본 보기 토글 상태
  final Map<int, bool> _showOriginalMap = {};
  bool _isProcessingAll = false;

  final ImagePicker _picker = ImagePicker();
  
  // AI 스타일 추천 관련
  final TextEditingController _recommendationTopicController = TextEditingController();
  bool _isRecommending = false;
  List<String> _recommendedStyleIds = [];

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.initialCategory ?? shopCategories.first;
    _loadApiKey();
    // 카테고리에 따라 초기 styleId 설정
    if (_selectedCategory.id == 'portrait') {
      for (final slot in _slots) {
        slot.styleId = portraitStylesMale[0].id;
      }
    } else if (_selectedCategory.id == 'beauty') {
      for (final slot in _slots) {
        slot.styleId = beautyStylesMale[0].id;
      }
    }
    for (int i = 0; i < _slots.length; i++) {
      _controllers.add(TextEditingController(text: _slots[i].localRequest));
    }
  }


  @override
  void dispose() {
    for (var controller in _controllers) {
      controller.dispose();
    }
    _recommendationTopicController.dispose();
    _commonRequestController.dispose();
    super.dispose();
  }

  Future<void> _loadApiKey() async {
    _apiKey = await _storageService.getApiKey();
  }

  PhotoSlot get _activeSlot => _slots.firstWhere((s) => s.id == _activeSlotId);

  Future<void> _recommendStyles() async {
    final topic = _recommendationTopicController.text.trim();
    if (topic.isEmpty) return;
    if (_apiKey == null || _apiKey!.isEmpty) return;

    setState(() => _isRecommending = true);
    try {
      final bool isPortrait = _selectedCategory.id == 'portrait';
      final bool isBeauty = _selectedCategory.id == 'beauty';
      List<PhotoStyle> currentList;
      if (isPortrait) {
        currentList = _selectedGender == 'male' ? portraitStylesMale : portraitStylesFemale;
      } else if (isBeauty) {
        currentList = _selectedGender == 'male' ? beautyStylesMale : beautyStylesFemale;
      } else {
        currentList = photoStyles;
      }

      final styleListStr = currentList.map((s) => "${s.id}: ${s.name}(${s.description})").join('\n');
      
      final prompt = '''
사용자가 입력한 사진 주제: "$topic"

아래 스타일 목록 중에서 위 주제에 가장 잘 어울리는 스타일 3가지를 골라주세요.
스타일 ID만 쉼표로 구분하여 출력하세요. (예: clean_bg, sunlight, vivid)
반드시 목록에 있는 ID만 사용하세요.

[스타일 목록]
$styleListStr
''';

      final apiService = ApiService(_apiKey!);
      final response = await apiService.generateText(prompt: prompt);
      
      setState(() {
        _recommendedStyleIds = response.split(',').map((e) => e.trim()).toList();
        // 추천된 스타일 중 첫 번째로 자동 선택
        if (_recommendedStyleIds.isNotEmpty) {
          final firstRec = _recommendedStyleIds[0];
          if (currentList.any((s) => s.id == firstRec)) {
            _activeSlot.styleId = firstRec;
          }
        }
      });
    } catch (e) {
      debugPrint('Recommendation error: $e');
    } finally {
      setState(() => _isRecommending = false);
    }
  }

  Future<void> _pickImage(int slotId) async {
    final ImageSource? source = await showModalBottomSheet<ImageSource>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                '사진 불러오기',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 20),
              ListTile(
                leading: const CircleAvatar(
                  backgroundColor: Color(0xFFF1F5F9),
                  child: Icon(Icons.camera_alt_outlined, color: Color(0xFFF97316)),
                ),
                title: const Text('직접 사진 찍기', style: TextStyle(fontWeight: FontWeight.w600)),
                onTap: () => Navigator.pop(context, ImageSource.camera),
              ),
              ListTile(
                leading: const CircleAvatar(
                  backgroundColor: Color(0xFFF1F5F9),
                  child: Icon(Icons.photo_library_outlined, color: Color(0xFFF97316)),
                ),
                title: const Text('앨범에서 선택', style: TextStyle(fontWeight: FontWeight.w600)),
                onTap: () => Navigator.pop(context, ImageSource.gallery),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );

    if (source == null) return;

    final XFile? image = await _picker.pickImage(source: source);
    if (image != null) {
      final bytes = await image.readAsBytes();
      setState(() {
        final slot = _slots.firstWhere((s) => s.id == slotId);
        slot.original = bytes;
        slot.generated = null;
        _activeSlotId = slotId;
      });
    }
  }

  Future<void> _processAllSlots() async {
    final targetSlots = _slots.where((s) => s.original != null && !s.isGenerating).toList();
    if (targetSlots.isEmpty) return;

    setState(() => _isProcessingAll = true);
    try {
      // 모든 슬롯을 병렬로 처리
      await Future.wait(targetSlots.map((slot) => _processSlot(slot.id)));
    } finally {
      if (mounted) {
        setState(() => _isProcessingAll = false);
      }
    }
  }

  Future<void> _processSlot(int slotId) async {
    if (_apiKey == null || _apiKey!.trim().isEmpty) {
      if (!mounted) return;
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: Colors.orange),
              SizedBox(width: 8),
              Text('API 키가 없습니다'),
            ],
          ),
          content: const Text('보정 기능을 이용하시려면 먼저 홈 화면 상단 설정(⚙️)에서 사장님이 알려주신 비밀번호 6자리를 입력해 주세요.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('확인', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      );
      return;
    }
    final slot = _slots.firstWhere((s) => s.id == slotId);
    if (slot.original == null) return;

    setState(() => slot.isGenerating = true);

    final apiService = ApiService(_apiKey!);

    try {
      final isPortrait = _selectedCategory.id == 'portrait';
      final isBeauty = _selectedCategory.id == 'beauty';
      final List<PhotoStyle> currentStyles;
      if (isPortrait) {
        currentStyles = _selectedGender == 'male' ? portraitStylesMale : portraitStylesFemale;
      } else if (isBeauty) {
        currentStyles = _selectedGender == 'male' ? beautyStylesMale : beautyStylesFemale;
      } else {
        currentStyles = photoStyles;
      }
          
      final style = currentStyles.firstWhere(
        (s) => s.id == slot.styleId,
        orElse: () => currentStyles.first,
      );

      final String commonReq = _commonRequestController.text.trim();
      final String slotReq = slot.localRequest.trim();
      final String combinedReq = [
        if (commonReq.isNotEmpty) commonReq,
        if (slotReq.isNotEmpty) slotReq,
      ].join(". ");

      // [고도화] 웹 버전과 동일한 고급 프롬프트 엔진 적용
      final String styleDirective = '''
        I have provided an image as a structural foundation. 
        Your task is to RE-RETOUCH and PROFESSIONALLY EDIT this photo by applying the specific "ARTISTIC STYLE" and "MOOD" described below.
        
        TARGET STYLE & PROMPT: "${style.prompt}${isBeauty ? '\n\n[BACKGROUND] MANDATORY: Pure solid WHITE background only. NO colored backgrounds, NO outdoor scenes, NO artistic backgrounds, NO patterns. Clean white studio portrait. Head and shoulders crop, person only.' : ''}"
        
        CRITICAL CORE DIRECTIVE (Business Photography):
        - MANDATORY: Keep the RESULT as a HIGH-RESOLUTION REALISTIC PHOTOGRAPH. 
        - ENVIRONMENTAL RE-CREATION: Feel free to SIGNIFICANTLY CHANGE the background and the environment of the original image to perfectly match the "TARGET STYLE". Re-imagine the settings, add complementary props, and create a masterpiece scene around the original subject.
        - If the Target Style implies drawing/sketching/illustration, IGNORE those medium formats. Instead, interpret only the "COLOR PALETTE", "LIGHTING", and "ATMOSPHERE" from that style and apply it to a REAL PHOTOGRAPH.
        - STRIKING RESEMBLANCE: The person/product in the original image MUST remain exactly as they are in terms of facial features, body structure, and details.
        - PROFESSIONALISM: Enhance lighting, skin texture, and color grading to a premium gallery level.
        
        Additional Context:
        - Business Category: ${_selectedCategory.name}
        - Technical Instructions: Ensure professional lighting, high-end texture, and commercial-grade quality.
        - User Custom Request: ${combinedReq.isNotEmpty ? combinedReq : 'None'}
        
        IMPORTANT RULES:
        1. DO NOT add any text, typography, letters, or watermarks.
        2. Keep the original subject recognizable but aesthetically transformed into a masterpiece photo.
        3. NO CARTOON, NO ANIME, NO DRAWING. ALWAYS REALISTIC PHOTO OUTPUT.
        4. [Identity Lock] Maintain absolute consistency of the original subject's unique identity.
      '''.trim();

      final generatedBytes = await apiService.editPhotoViaBackend(
        prompt: styleDirective,
        imageBytes: slot.original!,
      );

      if (generatedBytes == null) {
        throw Exception('백엔드가 이미지를 반환하지 않았습니다. 서버 상태를 확인해주세요.');
      }

      setState(() {
        slot.generated = generatedBytes;
        slot.isGenerating = false;
      });

    } catch (e) {
      setState(() => slot.isGenerating = false);
      if (!mounted) return;

      String displayError = '이미지 생성 중 문제가 발생했습니다.';
      String eStr = e.toString();
      
      if (eStr.contains('400') || eStr.contains('INVALID_ARGUMENT') || eStr.contains('API_KEY_INVALID')) {
        displayError = '🔑 비밀번호(혹은 API 키)가 올바르지 않습니다.\n홈 화면 설정에서 사장님이 알려주신 비밀번호를 다시 확인해 주세요.';
      } else if (eStr.contains('429') || eStr.contains('RESOURCE_EXHAUSTED')) {
        displayError = '☕ 현재 이용자가 많아 할당량이 초과되었습니다.\n1~2분 뒤에 다시 시도해 주시면 감사하겠습니다.';
      } else if (eStr.contains('safety') || eStr.contains('HARM_CATEGORY')) {
        displayError = '⚠️ AI가 부적절한 이미지나 요청으로 판단하여 노출을 제한했습니다.\n다른 사진이나 요청 사항으로 시도해 주세요.';
      } else {
        displayError = '이미지 생성 중 알 수 없는 오류가 발생했습니다.\n다른 사진을 사용해 보시거나 잠시 후 다시 시도해 주세요.';
      }

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.error_outline, color: Colors.red),
              SizedBox(width: 8),
              Text('알림'),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(displayError, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 8),
                const Text('상세 에러 정보 (전문가용):', style: TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  width: double.infinity,
                  child: SelectableText(eStr, style: TextStyle(fontSize: 11, color: Colors.grey[600], fontFamily: 'monospace')),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('확인', style: TextStyle(fontWeight: FontWeight.bold)),
            )
          ],
        ),
      );
    }
  }

  Future<void> _saveImage(Uint8List bytes, int id) async {
    final fileName = 'BizCut_${id}_${DateTime.now().millisecondsSinceEpoch}.png';
    try {
      final result = await saveImageToPlatform(bytes, fileName);
      if (!mounted) return;
      final msg = kIsWeb ? '✅ 다운로드 완료!' : '✅ 저장 완료: $result';
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('저장 실패: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFFBF5),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Toolbar ──────────────────────────────────
              _buildToolbar(),
              const SizedBox(height: 32),

              // ── 01 Style Selection ───────────────────────
              _buildSectionHeader('01', '${_slots.firstWhere((s) => s.id == _activeSlotId).id}번 사진 테마 설정'),
              const SizedBox(height: 16),
              _buildStyleSelector(),
              const SizedBox(height: 32),

              // ── 02 Global Options ────────────────────────
              _buildSectionHeader('02', '공통 보정 옵션 (전체 적용)'),
              const SizedBox(height: 16),
              _buildCommonOptions(),
              const SizedBox(height: 40),

              // ── 03 Photo Registration ────────────────────
              _buildSectionHeader('03', '사진 등록 및 정밀 보정'),
              const SizedBox(height: 16),
              LayoutBuilder(
                builder: (context, constraints) {
                  final cardWidth = constraints.maxWidth > 800 ? (constraints.maxWidth - 24) / 2 : constraints.maxWidth;
                  return Wrap(
                    spacing: 24,
                    runSpacing: 24,
                    children: _slots.asMap().entries.map((entry) {
                      return SizedBox(
                        width: cardWidth,
                        child: _buildSlotCard(entry.value, _controllers[entry.key]),
                      );
                    }).toList(),
                  );
                },
              ),
              const SizedBox(height: 120), // 하단 버튼 공간 확보
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomActionBar(),
    );
  }

  // ─── Common Options ────────────────────────────────────────────────────────
  Widget _buildCommonOptions() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '📝 모든 사진에 공통으로 적용할 요청사항',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
          ),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFF1F5F9)),
            ),
            child: TextField(
              controller: _commonRequestController,
              decoration: const InputDecoration(
                hintText: '예: 배경을 더 밝게 해줘, 접시를 깨끗하게 닦아줘 등',
                hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
              maxLines: 2,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Bottom Action Bar ──────────────────────────────────────────────────────
  Widget _buildBottomActionBar() {
    final bool hasOriginals = _slots.any((s) => s.original != null && !s.isGenerating);
    
    return Container(
      padding: EdgeInsets.fromLTRB(24, 16, 24, 16 + MediaQuery.of(context).padding.bottom),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 20, offset: const Offset(0, -4))
        ],
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: ElevatedButton(
        onPressed: (hasOriginals && !_isProcessingAll) ? _processAllSlots : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFFF97316),
          foregroundColor: Colors.white,
          disabledBackgroundColor: const Color(0xFFF1F5F9),
          disabledForegroundColor: const Color(0xFFCBD5E1),
          padding: const EdgeInsets.symmetric(vertical: 20),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          elevation: 0,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (_isProcessingAll)
              const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(strokeWidth: 3, color: Colors.white),
              )
            else
              const Icon(Icons.auto_awesome, size: 24),
            const SizedBox(width: 12),
            Text(
              _isProcessingAll ? '모두 보정 중...' : '전체 사진 한꺼번에 보정하기',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
            ),
          ],
        ),
      ),
    );
  }

  // ─── Toolbar ────────────────────────────────────────────────────────────────
  Widget _buildToolbar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2))
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Text(
                'CATEGORY:',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF94A3B8), letterSpacing: 0.5),
              ),
              const SizedBox(width: 8),
              Text(
                _selectedCategory.name,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
              ),
            ],
          ),
          InkWell(
            onTap: () => Navigator.of(context).pop(),
            borderRadius: BorderRadius.circular(10),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.refresh, size: 13, color: Color(0xFF64748B)),
                  SizedBox(width: 6),
                  Text(
                    '처음으로 / 카테고리 변경',
                    style: TextStyle(color: Color(0xFF64748B), fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Section Header ──────────────────────────────────────────────────────────
  Widget _buildSectionHeader(String number, String title) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: const BoxDecoration(
            color: Color(0xFFF97316),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              number,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 11),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
        ),
      ],
    );
  }

  // ─── Action Icon Button ──────────────────────────────────────────────────────
  Widget _buildActionButton(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: 52,
        height: 52,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2))
          ],
        ),
        child: Icon(icon, color: const Color(0xFF64748B), size: 22),
      ),
    );
  }

  // ─── Style Selector ──────────────────────────────────────────────────────────
  Widget _buildStyleSelector() {
    List<PhotoStyle> availableStyles;
    final isPortrait = _selectedCategory.id == 'portrait';
    final isBeauty = _selectedCategory.id == 'beauty';
    final isGenderBased = isPortrait || isBeauty;

    if (isPortrait) {
      availableStyles = _selectedGender == 'female' ? portraitStylesFemale : portraitStylesMale;
    } else if (isBeauty) {
      availableStyles = _selectedGender == 'female' ? beautyStylesFemale : beautyStylesMale;
    } else {
      availableStyles = _selectedCategory.id == 'clothes'
          ? photoStyles
          : photoStyles.where((s) => s.id != 'luxury').toList();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // AI 추천 검색 바
        Padding(
          padding: const EdgeInsets.only(bottom: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                '💡 어떤 느낌을 원하시나요? (AI 스타일 추천)',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFF97316)),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 44,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFF1F5F9)),
                      ),
                      child: TextField(
                        controller: _recommendationTopicController,
                        style: const TextStyle(fontSize: 13),
                        decoration: const InputDecoration(
                          hintText: '예: 비 오는 날 감성, 신선한 과일 느낌 등',
                          hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(horizontal: 16),
                        ),
                        onSubmitted: (_) => _recommendStyles(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  SizedBox(
                    height: 44,
                    child: ElevatedButton(
                      onPressed: _isRecommending ? null : _recommendStyles,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0F172A),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: _isRecommending 
                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Text('추천', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        if (isGenderBased) ...[
          Text(
            isBeauty ? '헤어 스타일을 원하는 성별로 선택하세요:' : '인물의 성별을 선택해주세요:',
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildGenderButton('male', isBeauty ? '✂️ 남성 스타일' : '🧔 남성'),
              const SizedBox(width: 12),
              _buildGenderButton('female', isBeauty ? '💇 여성 스타일' : '👩 여성'),
            ],
          ),
          const SizedBox(height: 24),
          const Divider(color: Color(0xFFF1F5F9)),
          const SizedBox(height: 12),
        ],
        SizedBox(
          height: 90,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: availableStyles.length + 1, // Style Explorer 버튼 추가 (+1)
            separatorBuilder: (context, index) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              if (index == 0) {
                // ─── Style Explorer 버튼 ────────────────────────
                return _buildStyleExplorerButton();
              }
              
              final style = availableStyles[index - 1];
              final isSelected = _activeSlot.styleId == style.id;
              return InkWell(
                onTap: () => setState(() => _activeSlot.styleId = style.id),
                borderRadius: BorderRadius.circular(16),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 100,
                  padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFFFF7ED) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? const Color(0xFFF97316) : (_recommendedStyleIds.contains(style.id) ? const Color(0xFF10B981) : const Color(0xFFF1F5F9)),
                        width: isSelected || _recommendedStyleIds.contains(style.id) ? 1.5 : 1,
                      ),
                    ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        style.icon,
                        color: isSelected ? const Color(0xFFEA580C) : const Color(0xFF94A3B8),
                        size: 20,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        style.name,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: isSelected ? FontWeight.w900 : FontWeight.w600,
                          color: isSelected ? const Color(0xFF0F172A) : const Color(0xFF64748B),
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildGenderButton(String gender, String label) {
    final isSelected = _selectedGender == gender;
    return InkWell(
      onTap: () {
        setState(() {
          _selectedGender = gender;
          // 성별 전환 시 해당 성별의 첫 번째 스타일로 기본값 변경
          final isPortrait = _selectedCategory.id == 'portrait';
          final isBeauty = _selectedCategory.id == 'beauty';
          if (isPortrait) {
            _activeSlot.styleId = gender == 'male' ? portraitStylesMale[0].id : portraitStylesFemale[0].id;
          } else if (isBeauty) {
            _activeSlot.styleId = gender == 'male' ? beautyStylesMale[0].id : beautyStylesFemale[0].id;
          }
        });
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFF97316) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isSelected ? const Color(0xFFF97316) : const Color(0xFFE2E8F0), width: 1.5),
          boxShadow: isSelected ? [BoxShadow(color: const Color(0xFFF97316).withOpacity(0.2), blurRadius: 8)] : [],
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : const Color(0xFF64748B),
            fontWeight: FontWeight.w900,
            fontSize: 14,
          ),
        ),
      ),
    );
  }

  // ─── Slot Card ───────────────────────────────────────────────────────────────
  Widget _buildSlotCard(PhotoSlot slot, TextEditingController controller) {
    final isActive = _activeSlotId == slot.id;
    return GestureDetector(
      onTap: () => setState(() => _activeSlotId = slot.id),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isActive ? const Color(0xFFF97316) : Colors.transparent,
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: isActive
                  ? const Color(0xFFF97316).withOpacity(0.12)
                  : Colors.black.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, 8),
            )
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
             // ── Slot Header ──
             Padding(
               padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
               child: Row(
                 children: [
                   Container(
                     width: 32,
                     height: 32,
                     decoration: BoxDecoration(
                       color: isActive ? const Color(0xFFF97316) : const Color(0xFFF1F5F9),
                       borderRadius: BorderRadius.circular(8),
                     ),
                     child: Center(
                       child: Text(
                         '${slot.id}',
                         style: TextStyle(
                           color: isActive ? Colors.white : const Color(0xFF94A3B8),
                           fontWeight: FontWeight.w900,
                           fontSize: 13,
                         ),
                       ),
                     ),
                   ),
                   if (isActive) ...[
                     const SizedBox(width: 8),
                     const Text(
                       '선택됨',
                       style: TextStyle(color: Color(0xFFF97316), fontSize: 10, fontWeight: FontWeight.bold),
                     ),
                   ],
                   // 헤더에 '보정 완료' 또는 '원본' 표시
                   if (slot.generated != null && !slot.isGenerating) ...[
                     const SizedBox(width: 8),
                     Container(
                       padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                       decoration: BoxDecoration(
                         color: const Color(0xFFF97316),
                         borderRadius: BorderRadius.circular(8),
                       ),
                       child: Text(
                         _showOriginalMap[slot.id] == true ? '원본 보기 중' : '보정 완료',
                         style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900),
                       ),
                     ),
                   ],
                   const Spacer(),
                   // 헤더 우측: 액션 버튼들
                   if (slot.original != null && !slot.isGenerating) ...[
                     if (slot.generated != null) ...[
                       GestureDetector(
                         onTap: () => setState(() {
                           _showOriginalMap[slot.id] = !(_showOriginalMap[slot.id] ?? false);
                         }),
                         child: Container(
                           padding: const EdgeInsets.all(6),
                           decoration: BoxDecoration(
                             color: _showOriginalMap[slot.id] == true ? const Color(0xFFF97316) : const Color(0xFFF1F5F9),
                             borderRadius: BorderRadius.circular(8),
                           ),
                           child: Icon(
                             Icons.remove_red_eye_outlined,
                             size: 18,
                             color: _showOriginalMap[slot.id] == true ? Colors.white : const Color(0xFF64748B),
                           ),
                         ),
                       ),
                       const SizedBox(width: 8),
                     ],
                     GestureDetector(
                       onTap: () => setState(() {
                         slot.original = null;
                         slot.generated = null;
                         _showOriginalMap.remove(slot.id);
                       }),
                       child: Container(
                         padding: const EdgeInsets.all(6),
                         decoration: BoxDecoration(
                           color: const Color(0xFFFEF2F2),
                           borderRadius: BorderRadius.circular(8),
                         ),
                         child: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFEF4444)),
                       ),
                     ),
                   ]
                 ],
               ),
             ),
 
             const SizedBox(height: 16),
 
             // ── Image Area ──
             Container(
               height: 160,
               margin: const EdgeInsets.symmetric(horizontal: 20),
               decoration: BoxDecoration(
                 color: const Color(0xFFF8FAFC),
                 borderRadius: BorderRadius.circular(20),
                 border: Border.all(color: const Color(0xFFF1F5F9)),
               ),
               clipBehavior: Clip.antiAlias,
               child: slot.original == null
                   ? Center(
                       child: Column(
                         mainAxisAlignment: MainAxisAlignment.center,
                         children: [
                           Row(
                             mainAxisAlignment: MainAxisAlignment.center,
                             children: [
                               _buildActionButton(
                                 Icons.file_upload_outlined,
                                 () => _pickImage(slot.id),
                               ),
                               const SizedBox(width: 12),
                               _buildActionButton(
                                 Icons.delete_outline,
                                 () => setState(() {
                                   slot.original = null;
                                   slot.generated = null;
                                 }),
                               ),
                             ],
                           ),
                           const SizedBox(height: 16),
                           const Text(
                             'SELECT IMAGE',
                             style: TextStyle(
                               color: Color(0xFF94A3B8),
                               fontWeight: FontWeight.w900,
                               fontSize: 11,
                               letterSpacing: 1.2,
                             ),
                           ),
                         ],
                       ),
                     )
                   : Stack(
                       fit: StackFit.expand,
                       children: [
                         Image.memory(
                           // 원본 보기 토글에 따라 이미지 결정
                           (slot.generated != null && _showOriginalMap[slot.id] != true)
                               ? slot.generated!
                               : slot.original!,
                           fit: BoxFit.contain,
                         ),
                         if (slot.isGenerating)
                           Container(
                             color: Colors.black54,
                             child: const Center(
                               child: CircularProgressIndicator(color: Color(0xFFF97316)),
                             ),
                           ),
                       ],
                     ),
             ),

            // ── Input & Meta ──
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFF1F5F9)),
                    ),
                    child: TextField(
                      controller: controller,
                      onChanged: (v) => slot.localRequest = v,
                      decoration: const InputDecoration(
                        hintText: '추가 요청사항을 적어주세요...',
                        hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      ),
                      maxLines: 1,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.auto_awesome, size: 13, color: Color(0xFFF97316)),
                        const SizedBox(width: 6),
                        const Text(
                          '적용 중: ',
                          style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                        Flexible(
                          child: Text(
                            () {
                              final allPossible = [...photoStyles, ...portraitStylesMale, ...portraitStylesFemale, ...beautyStylesMale, ...beautyStylesFemale];

                              try {
                                return allPossible.firstWhere((s) => s.id == slot.styleId).name;
                              } catch (_) {
                                return 'Default';
                              }
                            }(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (slot.original != null) ...[
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        // 개별 보정 / 다시 보정 버튼
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: slot.isGenerating ? null : () => _processSlot(slot.id),
                            icon: slot.isGenerating
                                ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                : const Icon(Icons.auto_awesome, size: 14),
                            label: Text(
                              slot.isGenerating ? '보정 중...' : (slot.generated != null ? '다시 보정' : '보정하기'),
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF0F172A),
                              foregroundColor: Colors.white,
                              disabledBackgroundColor: Colors.grey[400],
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              elevation: 0,
                            ),
                          ),
                        ),
                        // 저장 버튼 (보정 후에만 표시)
                        if (slot.generated != null) ...[
                          const SizedBox(width: 8),
                          OutlinedButton.icon(
                            onPressed: () => _saveImage(slot.generated!, slot.id),
                            icon: const Icon(Icons.download, size: 14),
                            label: const Text('저장', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: const Color(0xFF0F172A),
                              side: const BorderSide(color: Color(0xFFE2E8F0)),
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── Style Explorer Button ──────────────────────────────────────────────────
  Widget _buildStyleExplorerButton() {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('스타일 탐색기 - 곧 출시됩니다! 🎨'),
            duration: Duration(seconds: 2),
          ),
        );
      },
      child: Container(
        width: 80,
        height: 90,
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFF97316), Color(0xFFEA580C)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFF97316).withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.auto_awesome, color: Colors.white, size: 22),
            SizedBox(height: 6),
            Text(
              '스타일\n탐색기',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold, height: 1.3),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import '../services/persona_service.dart';

class CaptionCreatorScreen extends StatefulWidget {
  const CaptionCreatorScreen({super.key});

  @override
  State<CaptionCreatorScreen> createState() => _CaptionCreatorScreenState();
}

class _CaptionCreatorScreenState extends State<CaptionCreatorScreen> {
  final StorageService _storageService = StorageService();
  final PersonaService _personaService = PersonaService();
  final TextEditingController _topicController = TextEditingController();
  final TextEditingController _detailsController = TextEditingController();
  
  SnsPlatform _selectedPlatform = snsPlatforms[0];
  bool _isLoading = false;
  String _result = '';
  String _generatedImageB64 = '';
  bool _isGeneratingImage = false;
  PersonaData? _persona;

  @override
  void initState() {
    super.initState();
    _loadPersona();
  }

  Future<void> _loadPersona() async {
    final persona = await _personaService.getPersona();
    if (mounted) {
      setState(() => _persona = persona);
    }
  }

  Future<void> _generateCaption() async {
    if (_topicController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('주제나 상품명을 입력해주세요.')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _result = '';
    });

    try {
      final apiKey = await _storageService.getApiKey();
      if (apiKey == null || apiKey.isEmpty) throw Exception('API 키가 없습니다.');

      final apiService = ApiService(apiKey);
      final personaContext = _personaService.buildPersonaContext(_persona);
      
      final prompt = '''
$personaContext

[플랫폼: ${_selectedPlatform.label}]
[주제: ${_topicController.text}]
[상세내용: ${_detailsController.text}]

위 정보를 바탕으로 ${_selectedPlatform.label}에 올릴 매력적인 홍보 문구(캡션)를 작성해주세요.
- 특징: ${_selectedPlatform.id == 'instagram' ? '이모지를 적절히 사용하고, 감성적인 문체로 작성' : '플랫폼 성격에 맞춰 작성'}
- 최대 글자수: ${_selectedPlatform.maxLen}자 이내
- 해시태그: ${_selectedPlatform.hashtagCount} 적절히 포함
- 결과만 출력하세요.
'''.trim();

      final response = await apiService.generateText(prompt: prompt);
      setState(() => _result = response);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _generateImageForCaption() async {
    if (_topicController.text.trim().isEmpty) return;
    
    setState(() => _isGeneratingImage = true);
    
    try {
      final prompt = 'A highly aesthetic promotional photo for: ${_topicController.text}. ${_detailsController.text}';
      
      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/generate-image'), // 안드로이드라면 10.0.2.2
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'prompt': prompt,
          'aspect_ratio': '1:1',
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _generatedImageB64 = data['image_b64'];
        });
      } else {
        throw Exception('Failed to generate image: ${response.statusCode}');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('이미지 생성 실패: $e')),
      );
    } finally {
      setState(() => _isGeneratingImage = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('SNS 캡션 생성', style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Platform Selection
            const Text('업로드 플랫폼', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            SizedBox(
              height: 50,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: snsPlatforms.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final platform = snsPlatforms[index];
                  final isSelected = _selectedPlatform.id == platform.id;
                  return choiceChip(platform, isSelected);
                },
              ),
            ),
            const SizedBox(height: 32),

            // Inputs
            const Text('무엇을 홍보할까요?', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            TextField(
              controller: _topicController,
              decoration: InputDecoration(
                hintText: '예: 신메뉴 딸기 생크림 케이크 출시',
                fillColor: Colors.white,
                filled: true,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                contentPadding: const EdgeInsets.all(20),
              ),
            ),
            const SizedBox(height: 20),
            const Text('상세 내용 (선택)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            TextField(
              controller: _detailsController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: '특징, 가격, 이벤트 등 추가하고 싶은 내용을 적어주세요.',
                fillColor: Colors.white,
                filled: true,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                contentPadding: const EdgeInsets.all(20),
              ),
            ),
            const SizedBox(height: 32),

            // Generate Button
            SizedBox(
              width: double.infinity,
              height: 60,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _generateCaption,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F172A),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                child: _isLoading 
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('AI 문구 생성하기', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
              ),
            ),
            const SizedBox(height: 32),

            if (_result.isNotEmpty) ...[
              // 미리보기 섹션 (리얼 프리뷰 UI)
              const Text('리얼타임 미리보기 ✨', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 5))
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 인스타 헤더
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 16,
                            backgroundColor: Colors.grey[200],
                            child: const Icon(Icons.person, size: 20, color: Colors.grey),
                          ),
                          const SizedBox(width: 10),
                          const Text('bizcut_official', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          const Spacer(),
                          const Icon(Icons.more_horiz),
                        ],
                      ),
                    ),
                    
                    // 이미지 영역
                    if (_generatedImageB64.isNotEmpty)
                      Image.memory(base64Decode(_generatedImageB64), width: double.infinity, fit: BoxFit.cover)
                    else 
                      InkWell(
                        onTap: _isGeneratingImage ? null : _generateImageForCaption,
                        child: Container(
                          width: double.infinity,
                          height: 300,
                          color: const Color(0xFFF1F5F9),
                          alignment: Alignment.center,
                          child: _isGeneratingImage
                              ? const CircularProgressIndicator()
                              : Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: const [
                                    Icon(Icons.add_photo_alternate, size: 48, color: Color(0xFF94A3B8)),
                                    SizedBox(height: 8),
                                    Text('AI 이미지 추가하기', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
                                  ],
                                ),
                        ),
                      ),
                      
                    // 인스타 아이콘 액션바
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      child: Row(
                        children: [
                          const Icon(Icons.favorite_border, size: 24),
                          const SizedBox(width: 16),
                          const Icon(Icons.chat_bubble_outline, size: 24),
                          const SizedBox(width: 16),
                          const Icon(Icons.send_outlined, size: 24),
                          const Spacer(),
                          const Icon(Icons.bookmark_border, size: 24),
                        ],
                      ),
                    ),
                    
                    // 텍스트 (캡션 내용)
                    Padding(
                      padding: const EdgeInsets.only(left: 16, right: 16, bottom: 20),
                      child: RichText(
                        text: TextSpan(
                          style: const TextStyle(color: Colors.black, fontSize: 14, height: 1.4),
                          children: [
                            const TextSpan(text: 'bizcut_official  ', style: TextStyle(fontWeight: FontWeight.bold)),
                            TextSpan(text: _result),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
            ],

            // Result (텍스트 복사용 원본 UI 유지)
            if (_result.isNotEmpty) ...[
              const Text('생성된 결과', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_result, style: const TextStyle(fontSize: 15, height: 1.6)),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton.icon(
                          onPressed: () {
                            Clipboard.setData(ClipboardData(text: _result));
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('클립보드에 복사되었습니다.')),
                            );
                          },
                          icon: const Icon(Icons.copy, size: 18),
                          label: const Text('복사하기'),
                          style: TextButton.styleFrom(foregroundColor: const Color(0xFF64748B)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget choiceChip(SnsPlatform platform, bool isSelected) {
    return InkWell(
      onTap: () => setState(() => _selectedPlatform = platform),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0F172A) : Colors.white,
          borderRadius: BorderRadius.circular(25),
          border: Border.all(color: isSelected ? Colors.transparent : const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Text(platform.emoji, style: const TextStyle(fontSize: 16)),
            const SizedBox(width: 8),
            Text(
              platform.label,
              style: TextStyle(
                color: isSelected ? Colors.white : const Color(0xFF475569),
                fontWeight: isSelected ? FontWeight.w900 : FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

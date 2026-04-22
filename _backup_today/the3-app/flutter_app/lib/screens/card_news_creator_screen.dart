import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import '../services/persona_service.dart';

class CardNewsCreatorScreen extends StatefulWidget {
  const CardNewsCreatorScreen({super.key});

  @override
  State<CardNewsCreatorScreen> createState() => _CardNewsCreatorScreenState();
}

class _CardNewsCreatorScreenState extends State<CardNewsCreatorScreen> {
  final StorageService _storageService = StorageService();
  final PersonaService _personaService = PersonaService();
  final TextEditingController _topicController = TextEditingController();
  
  CardNewsDesignPreset _selectedPreset = cardNewsPresets[0];
  bool _isLoading = false;
  List<Map<String, String>> _slides = [];
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

  Future<void> _generateCardNews() async {
    if (_topicController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('카드뉴스의 주제를 입력해주세요.')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _slides = [];
    });

    try {
      final apiKey = await _storageService.getApiKey();
      if (apiKey == null || apiKey.isEmpty) throw Exception('API 키가 없습니다.');

      final apiService = ApiService(apiKey);
      final personaContext = _personaService.buildPersonaContext(_persona);
      
      final prompt = '''
$personaContext

[주제: ${_topicController.text}]
[디자인 프리셋: ${_selectedPreset.label} (${_selectedPreset.description})]

위 정보를 바탕으로 인스타그램 카드뉴스(1080x1080)용 스크립트를 총 5~6장 분량으로 작성해주세요.
각 장에는 [헤드라인]과 [바디카피]가 포함되어야 합니다.

응답은 반드시 아래와 같은 JSON 형식으로만 해주세요:
[
  {"title": "1페이지 제목", "content": "1페이지 내용"},
  {"title": "2페이지 제목", "content": "2페이지 내용"},
  ...
]
'''.trim();

      final response = await apiService.generateText(prompt: prompt);
      
      // JSON 파싱 시도 (단순화를 위해 정규식을 쓰거나 직접 파싱)
      // 실제로는 더 견고한 파싱이 필요하지만 여기서는 간단히 구현
      final cleanJson = response.replaceAll('```json', '').replaceAll('```', '').trim();
      final List<dynamic> data = List.from(JsonDecoder().convert(cleanJson));
      
      setState(() {
        _slides = data.map((e) => Map<String, String>.from(e)).toList();
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9), // Slate-100
      appBar: AppBar(
        title: const Text('카드뉴스 작성', style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
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
            // Design Presets
            const Text('디자인 프리셋', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            SizedBox(
              height: 110,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: cardNewsPresets.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final preset = cardNewsPresets[index];
                  final isSelected = _selectedPreset.id == preset.id;
                  return presetCard(preset, isSelected);
                },
              ),
            ),
            const SizedBox(height: 32),

            // Topic Input
            const Text('카드뉴스 주제', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            TextField(
              controller: _topicController,
              decoration: InputDecoration(
                hintText: '예: 겨울철 매장 방문 고객을 위한 이벤트 안내',
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
                onPressed: _isLoading ? null : _generateCardNews,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF97316), // Orange-500
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                child: _isLoading 
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('카드뉴스 스크립트 생성', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
              ),
            ),
            const SizedBox(height: 32),

            // Result Slides
            if (_slides.isNotEmpty) ...[
              const Text('생성된 카드뉴스 구성', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              ..._slides.asMap().entries.map((entry) {
                final idx = entry.key;
                final slide = entry.value;
                return slideItem(idx + 1, slide['title'] ?? '', slide['content'] ?? '');
              }).toList(),
            ],
          ],
        ),
      ),
    );
  }

  Widget presetCard(CardNewsDesignPreset preset, bool isSelected) {
    return InkWell(
      onTap: () => setState(() => _selectedPreset = preset),
      child: Container(
        width: 140,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0F172A) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? Colors.transparent : const Color(0xFFE2E8F0)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(preset.emoji, style: const TextStyle(fontSize: 24)),
            const SizedBox(height: 8),
            Text(
              preset.label,
              style: TextStyle(
                fontSize: 14,
                color: isSelected ? Colors.white : const Color(0xFF1E293B),
                fontWeight: isSelected ? FontWeight.w900 : FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget slideItem(int number, String title, String content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFF97316).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text('Slide $number', style: const TextStyle(color: Color(0xFFF97316), fontWeight: FontWeight.bold, fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
          const SizedBox(height: 8),
          Text(content, style: const TextStyle(fontSize: 14, height: 1.5, color: Color(0xFF475569))),
          const SizedBox(height: 16),
          Align(
            alignment: Alignment.centerRight,
            child: IconButton(
              onPressed: () {
                Clipboard.setData(ClipboardData(text: '$title\n$content'));
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('$number번 슬라이드가 복사되었습니다.')),
                );
              },
              icon: const Icon(Icons.copy, size: 20, color: Color(0xFF94A3B8)),
            ),
          ),
        ],
      ),
    );
  }
}

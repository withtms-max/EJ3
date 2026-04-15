import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import '../services/persona_service.dart';

class BlogWizardScreen extends StatefulWidget {
  const BlogWizardScreen({super.key});

  @override
  State<BlogWizardScreen> createState() => _BlogWizardScreenState();
}

class _BlogWizardScreenState extends State<BlogWizardScreen> {
  final StorageService _storageService = StorageService();
  final PersonaService _personaService = PersonaService();
  final PageController _pageController = PageController();
  
  final TextEditingController _topicController = TextEditingController();
  final TextEditingController _keywordsController = TextEditingController();
  
  int _currentStep = 1;
  bool _isLoading = false;
  BlogTheme _selectedTheme = blogThemes[0];
  
  String _outline = '';
  String _finalDraft = '';
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

  Future<void> _generateOutline() async {
    if (_topicController.text.trim().isEmpty) return;
    
    setState(() => _isLoading = true);
    try {
      final apiKey = await _storageService.getApiKey();
      final apiService = ApiService(apiKey!);
      final personaContext = _personaService.buildPersonaContext(_persona);

      final prompt = '''
$personaContext

[블로그 주제: ${_topicController.text}]
[핵심 키워드: ${_keywordsController.text}]
[톤앤매너: ${_selectedTheme.label}]

위 내용을 바탕으로 네이버 블로그 포스팅을 위한 '상세 목차'를 작성해주세요. 
- 서론, 본론(3개 섹션), 결론으로 구성
- 각 섹션에서 다룰 핵심 내용을 짧게 포함
- 결과만 출력하세요.
'''.trim();

      final response = await apiService.generateText(prompt: prompt);
      setState(() {
        _outline = response;
        _currentStep = 2;
      });
      _pageController.animateToPage(1, duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _generateFinalDraft() async {
    setState(() => _isLoading = true);
    try {
      final apiKey = await _storageService.getApiKey();
      final apiService = ApiService(apiKey!);
      final personaContext = _personaService.buildPersonaContext(_persona);

      final prompt = '''
$personaContext

[최종 목차]
$_outline

[블로그 성격: ${_selectedTheme.label}]

위 목차를 바탕으로 실제 블로그에 바로 올릴 수 있는 '본문 전체 문장'을 작성해주세요.
- 독자의 눈길을 끄는 제목을 포함하세요.
- ${_selectedTheme.id == 'expert' ? '신뢰감 있는 전문 문체를 사용' : '친근하고 부드러운 구어체를 사용'}
- 적절한 위치에 이모지를 활용하세요.
- 결과만 출력하세요.
'''.trim();

      final response = await apiService.generateText(prompt: prompt);
      setState(() {
        _finalDraft = response;
        _currentStep = 3;
      });
      _pageController.animateToPage(2, duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('블로그 마법사', style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          _buildStepIndicator(),
          Expanded(
            child: PageView(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildStep1(),
                _buildStep2(),
                _buildStep3(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepIndicator() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _stepDot(1, '주제 선정'),
          _stepLine(),
          _stepDot(2, '목차 구성'),
          _stepLine(),
          _stepDot(3, '본문 완성'),
        ],
      ),
    );
  }

  Widget _stepDot(int step, String label) {
    bool isActive = _currentStep >= step;
    return Column(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: isActive ? const Color(0xFF10B981) : const Color(0xFFE2E8F0),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text('$step', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: TextStyle(fontSize: 10, color: isActive ? const Color(0xFF1E293B) : const Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _stepLine() {
    return Container(width: 40, height: 2, color: const Color(0xFFE2E8F0), margin: const EdgeInsets.only(bottom: 20));
  }

  Widget _buildStep1() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('블로그 테마 선택', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: blogThemes.map((theme) {
              bool isSelected = _selectedTheme.id == theme.id;
              return InkWell(
                onTap: () => setState(() => _selectedTheme = theme),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFF0F172A) : Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: isSelected ? Colors.transparent : const Color(0xFFE2E8F0)),
                  ),
                  child: Text('${theme.emoji} ${theme.label}', style: TextStyle(color: isSelected ? Colors.white : const Color(0xFF475569), fontWeight: FontWeight.bold)),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 32),
          const Text('포스팅 주제', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          TextField(
            controller: _topicController,
            decoration: InputDecoration(
              hintText: '예: 우리 가게만의 특별한 소스 레시피 공개',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
            ),
          ),
          const SizedBox(height: 24),
          const Text('추천 키워드 (선택)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          TextField(
            controller: _keywordsController,
            decoration: InputDecoration(
              hintText: '예: 수제 소스, 비법 레시피, 맛집 공유',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
            ),
          ),
          const SizedBox(height: 48),
          SizedBox(
            width: double.infinity,
            height: 60,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _generateOutline,
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F172A), foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
              child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('다음 단계 (목차 생성)', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStep2() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('생성된 목차 확인', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          Expanded(
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFE2E8F0))),
              child: SingleChildScrollView(child: Text(_outline, style: const TextStyle(fontSize: 15, height: 1.8))),
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {
                    setState(() => _currentStep = 1);
                    _pageController.animateToPage(0, duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
                  },
                  style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 60), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
                  child: const Text('수정하기'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _generateFinalDraft,
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F172A), foregroundColor: Colors.white, minimumSize: const Size(double.infinity, 60), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
                  child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('본문 작성 시작', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStep3() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('블로그 본문 완성!', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          Expanded(
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFE2E8F0))),
              child: SingleChildScrollView(child: Text(_finalDraft, style: const TextStyle(fontSize: 15, height: 1.8))),
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 60,
            child: ElevatedButton.icon(
              onPressed: () {
                Clipboard.setData(ClipboardData(text: _finalDraft));
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('본문 전체가 복사되었습니다.')));
              },
              icon: const Icon(Icons.copy),
              label: const Text('전체 복사 후 블로그에 올리기', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981), foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
            ),
          ),
        ],
      ),
    );
  }
}

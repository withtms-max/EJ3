
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/storage_service.dart';
import '../constants.dart';
import 'editor_screen.dart';
import 'category_selection_screen.dart';
import '../services/api_service.dart';
import '../services/persona_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final StorageService _storageService = StorageService();
  final PersonaService _personaService = PersonaService();
  final TextEditingController _apiKeyController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final GlobalKey _examplesKey = GlobalKey();
  bool _isLoading = true;
  bool _hasKey = false;

  @override
  void initState() {
    super.initState();
    _checkApiKey();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToExamples() {
    final context = _examplesKey.currentContext;
    if (context != null) {
      Scrollable.ensureVisible(
        context,
        duration: const Duration(seconds: 1),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _checkApiKey() async {
    final key = await _storageService.getApiKey();
    if (mounted) {
      setState(() {
        _hasKey = key != null && key.isNotEmpty;
        _isLoading = false;
      });
    }
  }

  Future<void> _saveApiKey() async {
    final key = _apiKeyController.text.trim();
    if (key.length > 5) { // 6자리 비밀번호 이상 수용
      await _storageService.saveApiKey(key);
      await _checkApiKey();
      if (mounted) Navigator.of(context).pop(); // Close dialog
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('비밀번호 6자리 또는 유효한 API Key를 입력해주세요.')),
      );
    }
  }

  void _showApiKeyDialog({VoidCallback? onSuccess}) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => _ApiSettingsDialog(
        initialKey: _apiKeyController.text,
        onSave: (key) async {
          _apiKeyController.text = key;
          await _saveApiKey();
          if (_hasKey && onSuccess != null) {
            onSuccess();
          }
        },
      ),
    );
  }

  Widget _buildFeatureCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String description,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC), // Slate-50
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: const Color(0xFFF1F5F9)), // Slate-100
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ],
            ),
            child: Icon(icon, size: 32, color: iconColor),
          ),
          const SizedBox(height: 24),
          Text(
            title,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            description,
            style: const TextStyle(
              fontSize: 16,
              color: Color(0xFF64748B),
              height: 1.6,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepItem(String number, String title, String description) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            number,
            style: const TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w900,
              color: Color(0xFFF97316), // Orange-500
            ),
          ),
          const SizedBox(width: 24),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF94A3B8), // Slate-400
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFFFF7ED), Colors.white], // Orange-50 to White
          ),
        ),
        child: SingleChildScrollView(
          controller: _scrollController,
          child: Column(
            children: [
              // Header
              _buildHeader(),
              
              const SizedBox(height: 60),

              // Hero Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  children: [
                    // Pill
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(color: const Color(0xFFFFCCBC)), // Orange-200
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            margin: const EdgeInsets.only(right: 8),
                            decoration: const BoxDecoration(
                              color: Color(0xFFF97316),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const Text(
                            'AI Powered Photography Studio',
                            style: TextStyle(
                              color: Color(0xFFEA580C), // Orange-600
                              fontWeight: FontWeight.w900,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
                    
                    ShaderMask(
                      shaderCallback: (bounds) => const LinearGradient(
                        colors: [Color(0xFFEA580C), Color(0xFFF59E0B)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ).createShader(Rect.fromLTWH(0, 0, bounds.width, bounds.height)),
                      child: const Text(
                        '사진 한 장으로 시작되는\n매출 상승의 기적',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 42,
                          fontWeight: FontWeight.w900,
                          height: 1.1,
                          color: Colors.white,
                          fontFamily: 'Pretendard',
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    const Text(
                      '전문 포토그래퍼 없이도, 스튜디오 없이도\n단 3초 만에 고객의 시선을 사로잡는 고퀄리티 사진을 완성하세요.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: Color(0xFF475569), // Slate-600
                        height: 1.6,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 48),

                    // Buttons
                    Column(
                      children: [
                        Container(
                          width: double.infinity,
                          constraints: const BoxConstraints(maxWidth: 300),
                          height: 60,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFF97316).withOpacity(0.3),
                                blurRadius: 20,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: ElevatedButton(
                            onPressed: _scrollToExamples,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF0F172A), // Slate-900
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text('보정 사례 보기', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                                SizedBox(width: 8),
                                Icon(Icons.arrow_downward, size: 20),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 60),

              _ThemedScrollSection(
                key: _examplesKey,
                title: '음식 이미지 보정',
                icon: '🍜',
                items: [
                  {'type': 'before', 'url': 'assets/images/1.food떡볶이_before.jpg', 'label': '떡볶이'},
                  {'type': 'after', 'url': 'assets/images/1.food떡볶이_after.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/2.food김밥_before.png', 'label': '김밥'},
                  {'type': 'after', 'url': 'assets/images/2.food김밥_after.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/3.food라뽁이_before.png', 'label': '라볶이'},
                  {'type': 'after', 'url': 'assets/images/3.food라뽁이_after.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/4.food곱창_before.png', 'label': '곱창/구이'},
                  {'type': 'after', 'url': 'assets/images/4.food곱창_after.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/food아구찜before.png', 'label': '아구찜'},
                  {'type': 'after', 'url': 'assets/images/food아구찜after.png', 'label': '스타일 A'},
                  {'type': 'after', 'url': 'assets/images/food아구찜after1.png', 'label': '스타일 B'},
                  {'type': 'before', 'url': 'assets/images/food뼈찜before.png', 'label': '뼈찜'},
                  {'type': 'after', 'url': 'assets/images/food뼈찜after.png', 'label': 'After Magic'},
                ],
              ),
              
              const _SectionDivider(),

              _ThemedScrollSection(
                title: '카페 & 제과 보정',
                icon: '☕',
                items: [
                  {'type': 'before', 'url': 'assets/images/카페제과before1.png', 'label': '베이커리 A'},
                  {'type': 'after', 'url': 'assets/images/카페제과after1.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/카페제과before2.png', 'label': '디저트 세트'},
                  {'type': 'after', 'url': 'assets/images/카페제과after2.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/카페제과before3.png', 'label': '베이커리 B'},
                  {'type': 'after', 'url': 'assets/images/카페제과after3.jpeg', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/카페제과before4.png', 'label': '카페 음료'},
                  {'type': 'after', 'url': 'assets/images/카페제과after4.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/카페제과before5.png', 'label': '브런치 메뉴'},
                  {'type': 'after', 'url': 'assets/images/카페제과after5.jpeg', 'label': 'After Magic'},
                ],
              ),

              const _SectionDivider(),

              _ThemedScrollSection(
                title: '옷가게 & 패션 룩북',
                icon: '👕',
                items: [
                  {'type': 'before', 'url': 'assets/images/옷가게패션_before.png', 'label': '패션 룩북 1'},
                  {'type': 'after', 'url': 'assets/images/옷가게패션_after.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/옷가게패션before2.png', 'label': '웨어러블 A'},
                  {'type': 'after', 'url': 'assets/images/옷가게패션after2.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/옷가게패션before3.png', 'label': '패션 룩북 2'},
                  {'type': 'after', 'url': 'assets/images/옷가게패션after3-1.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/옷가게패션before4.png', 'label': '의류 누끼 A'},
                  {'type': 'after', 'url': 'assets/images/옷가게패션after4.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/옷가게패션before5.png', 'label': '의류 누끼 B'},
                  {'type': 'after', 'url': 'assets/images/옷가게패션after5.png', 'label': 'After Magic'},
                  {'type': 'before', 'url': 'assets/images/옷가게패션before6.png', 'label': '패션 상세페이지'},
                  {'type': 'after', 'url': 'assets/images/옷가게패션after6.png', 'label': 'After Magic'},
                ],
              ),

              const _SectionDivider(),

              _ThemedScrollSection(
                title: '헤어 스타일링 보정',
                icon: '✂️',
                items: [
                  {'type': 'before', 'url': 'assets/images/헤어남성before.png', 'label': '남성 헤어'},
                  {'type': 'after', 'url': 'assets/images/헤어남성after.png', 'label': '스타일 A'},
                  {'type': 'after', 'url': 'assets/images/헤어남성after2.png', 'label': '스타일 B'},
                  {'type': 'after', 'url': 'assets/images/헤어남성after3.png', 'label': '스타일 C'},
                  {'type': 'after', 'url': 'assets/images/헤어남성after4.png', 'label': '스타일 D'},
                  {'type': 'after', 'url': 'assets/images/헤어남성after6.png', 'label': '스타일 E'},
                  {'type': 'after', 'url': 'assets/images/헤어남성after7.png', 'label': '스타일 F'},
                  {'type': 'after', 'url': 'assets/images/헤어남성after8.png', 'label': '스타일 G'},
                  {'type': 'before', 'url': 'assets/images/헤어여성before.png', 'label': '여성 헤어'},
                  {'type': 'after', 'url': 'assets/images/헤어여성after.png', 'label': '스타일 A'},
                  {'type': 'after', 'url': 'assets/images/헤어여성after2.png', 'label': '스타일 B'},
                  {'type': 'after', 'url': 'assets/images/헤어여성after3.png', 'label': '스타일 C'},
                  {'type': 'after', 'url': 'assets/images/헤어여성after4.png', 'label': '스타일 D'},
                  {'type': 'after', 'url': 'assets/images/헤어여성after5.png', 'label': '스타일 E'},
                ],
              ),

              const _SectionDivider(),

              _ThemedScrollSection(
                title: '사장님 추천 프로필 컷',
                icon: '👤',
                items: [
                  {'type': 'before', 'url': 'assets/images/사장님컷before.png', 'label': '원본 사진'},
                  {'type': 'after', 'url': 'assets/images/사장님컷after.png', 'label': '프로필 A'},
                  {'type': 'after', 'url': 'assets/images/사장님컷after1.png', 'label': '프로필 B'},
                  {'type': 'after', 'url': 'assets/images/사장님컷after2.png', 'label': '프로필 C'},
                  {'type': 'after', 'url': 'assets/images/사장님컷after3.png', 'label': '프로필 D'},
                  {'type': 'after', 'url': 'assets/images/사장님컷after4.png', 'label': '프로필 E'},
                  {'type': 'after', 'url': 'assets/images/사장님컷after5.png', 'label': '프로필 F'},
                  {'type': 'after', 'url': 'assets/images/사장님컷after6.png', 'label': '프로필 G'},
                  {'type': 'after', 'url': 'assets/images/사장님컷after7.png', 'label': '프로필 H'},
                ],
              ),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Center(
                  child: Container(
                    width: double.infinity,
                    constraints: const BoxConstraints(maxWidth: 400),
                    height: 64,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF97316).withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: ElevatedButton(
                      onPressed: () {
                        if (!_hasKey) {
                          _showApiKeyDialog(onSuccess: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const CategorySelectionScreen(),
                              ),
                            );
                          });
                        } else {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const CategorySelectionScreen(),
                            ),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0F172A), // Slate-900
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.auto_awesome, color: Colors.orange, size: 20),
                          SizedBox(width: 12),
                          Text('지금 바로 시작하기', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward, size: 20),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 100),

              // Features Section (Why BizCut?)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 80),
                color: Colors.white,
                child: Column(
                  children: [
                    const Text(
                      '왜 비즈컷(BizCut)일까요?',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      '복잡한 설정 없이, 클릭 몇 번으로 전문가 수준의 결과물을 만듭니다.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 48),
                    _buildFeatureCard(
                      icon: Icons.bolt,
                      iconColor: Colors.amber,
                      title: '즉각적인 퀄리티 향상',
                      description: '흐린 사진, 어두운 조명도 AI가 자동으로 분석하여 선명하고 화사하게 보정합니다.',
                    ),
                    const SizedBox(height: 24),
                    _buildFeatureCard(
                      icon: Icons.restaurant,
                      iconColor: Colors.orange,
                      title: '업종별 맞춤 스타일',
                      description: '음식점, 카페, 의류 매장 등 사장님의 업종에 딱 맞는 분위기를 제안합니다.',
                    ),
                    const SizedBox(height: 24),
                    _buildFeatureCard(
                      icon: Icons.smartphone,
                      iconColor: Colors.blue,
                      title: '모바일 최적화',
                      description: '배달앱, 스마트스토어, 인스타그램에 바로 올릴 수 있는 최적의 비율과 해상도를 지원합니다.',
                    ),
                  ],
                ),
              ),

              // How it Works Section
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 24),
                decoration: const BoxDecoration(
                  color: Color(0xFF0F172A), // Slate-900
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'EASY PROCESS',
                      style: TextStyle(
                        color: Color(0xFFF97316), // Orange-500
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 16),
                    RichText(
                      text: const TextSpan(
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          height: 1.2,
                          color: Colors.white,
                          fontFamily: 'Pretendard',
                        ),
                        children: [
                          TextSpan(text: '복잡한 과정은\n'),
                          TextSpan(
                            text: '이제 그만.',
                            style: TextStyle(color: Color(0xFF94A3B8)), // Slate-400
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      '단 3단계면 충분합니다.\n나머지는 AI에게 맡기세요.',
                      style: TextStyle(
                        fontSize: 16,
                        color: Color(0xFF94A3B8), // Slate-400
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 32),
                    Container(
                      width: double.infinity,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: TextButton(
                        onPressed: () {
                           if (!_hasKey) {
                             _showApiKeyDialog(onSuccess: () {
                               Navigator.push(
                                 context,
                                 MaterialPageRoute(
                                   builder: (context) => const CategorySelectionScreen(),
                                 ),
                               );
                             });
                           } else {
                             Navigator.push(
                               context,
                               MaterialPageRoute(
                                 builder: (context) => const CategorySelectionScreen(),
                               ),
                             );
                           }
                        },
                        child: const Text(
                          '지금 바로 시작하기',
                          style: TextStyle(
                            color: Color(0xFF0F172A),
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 60),
                    _buildStepItem('01', '업종 선택', '운영하시는 가게의 종류를 선택하세요.'),
                    const SizedBox(height: 24),
                    _buildStepItem('02', '사진 업로드', '휴대폰으로 찍은 사진을 그대로 올리세요.'),
                    const SizedBox(height: 24),
                    _buildStepItem('03', 'AI 자동 변환', '원하는 스타일을 고르면 3초 만에 완성!'),
                  ],
                ),
              ),

              // Footer
              _buildFooter(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF94A3B8), letterSpacing: 1.0)),
      ],
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'BizCut',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A), // Slate-900 from web
                  letterSpacing: -1.0, // tracking-tighter
                  fontFamily: 'Pretendard',
                ),
              ),
              const Text(
                '소상공인을 위한 AI 이미지 솔루션',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF64748B), // Slate-500
                  letterSpacing: -0.5,
                ),
              ),
            ],
          ),
          Row(
            children: [
              TextButton.icon(
                onPressed: _showPersonaDialog,
                icon: const Icon(Icons.person_outline, size: 16, color: Colors.blue),
                label: const Text('브랜드 설정', style: TextStyle(color: Colors.blue, fontSize: 12)),
                style: TextButton.styleFrom(
                   backgroundColor: Colors.blue[50],
                   padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                   shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
              const SizedBox(width: 8),
              TextButton.icon(
                 onPressed: () {
                  _apiKeyController.text = "";
                  _showApiKeyDialog();
                 },
                 icon: const Icon(Icons.key, size: 16, color: Colors.grey),
                 label: const Text('비밀번호', style: TextStyle(color: Colors.grey, fontSize: 12)),
                 style: TextButton.styleFrom(
                    backgroundColor: Colors.grey[100],
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                 ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showPersonaDialog() async {
    final persona = await _personaService.getPersona() ?? PersonaData(brandName: '', industry: '', tone: '', targetAudience: '', description: '');
    if (!mounted) return;

    showDialog(
      context: context,
      builder: (context) => _PersonaSettingsDialog(
        initialData: persona,
        onSave: (data) async {
          await _personaService.savePersona(data);
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('브랜드 페르소나가 저장되었습니다.')));
        },
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 24),
      color: const Color(0xFF0F172A), // Slate-900
      child: Column(
        children: [
          const Text(
            'BizCut',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'AI IMAGE SOLUTION',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w900,
              color: Color(0xFFEA580C), // Orange-600
              letterSpacing: 3.0,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            '"사장님들의 정성을 가장 맛있는 한 컷으로 표현합니다."',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Color(0xFF94A3B8), // Slate-400
              fontStyle: FontStyle.italic,
              fontSize: 14,
              height: 1.6,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 32),
          const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('PROFESSIONAL', style: TextStyle(color: Color(0xFF475569), fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
              SizedBox(width: 16),
              Text('LOCAL SUPPORT', style: TextStyle(color: Color(0xFF475569), fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
              SizedBox(width: 16),
              Text('DIGITAL TRANSFORMATION', style: TextStyle(color: Color(0xFF475569), fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
            ],
          ),
          const SizedBox(height: 24),
          const Text(
            '© 2024 BizCut. All rights reserved.',
            style: TextStyle(
              color: Color(0xFF475569), // Slate-600
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }
}

class _ApiSettingsDialog extends StatefulWidget {
  final String initialKey;
  final Function(String) onSave;

  const _ApiSettingsDialog({
    super.key,
    required this.initialKey,
    required this.onSave,
  });

  @override
  State<_ApiSettingsDialog> createState() => _ApiSettingsDialogState();
}

class _ApiSettingsDialogState extends State<_ApiSettingsDialog> {
  late TextEditingController _controller;
  bool _isValidating = false;
  bool _obscureText = true; // 가리기/보이기 상태 추가
  bool? _isValid;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialKey);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _getEffectiveKey(String input) {
    return masterKeys[input] ?? input;
  }

  Future<void> _testConnection() async {
    setState(() {
      _isValidating = true;
      _errorMessage = null;
    });

    final input = _controller.text.trim();
    if (input.isEmpty) {
      setState(() {
        _isValidating = false;
        _isValid = false;
        _errorMessage = "마스터 비밀번호 또는 API 키를 입력해 주세요.";
      });
      return;
    }

    final effectiveKey = _getEffectiveKey(input);
    bool isValid = false;
    try {
       isValid = await ApiService.verifyApiKey(effectiveKey);
    } catch (e) {
       isValid = false;
    }

    setState(() {
      _isValidating = false;
      _isValid = isValid;
      if (!isValid) _errorMessage = "유효하지 않은 키이거나 연결에 실패했습니다.";
    });
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF151517), // Dark background
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Container(
        width: 400,
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Expanded(
                  child: Text(
                    '마스터 비밀번호 & API 설정',
                    style: TextStyle(
                      color: Color(0xFF8A9AFE), // Light purple/blue
                      fontWeight: FontWeight.w900,
                      fontSize: 20,
                      letterSpacing: 1.0,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.grey),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              '안전하게 보호되는 설정입니다',
              style: TextStyle(
                color: Color(0xFF666666),
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
              ),
            ),
            
            const SizedBox(height: 32),

            // Status Card
            Container(
               padding: const EdgeInsets.all(20),
               decoration: BoxDecoration(
                 color: const Color(0xFF0A0A0B), // Darker black
                 borderRadius: BorderRadius.circular(16),
               ),
               child: Column(
                 crossAxisAlignment: CrossAxisAlignment.start,
                 children: [
                   Row(
                     mainAxisAlignment: MainAxisAlignment.spaceBetween,
                     children: [
                       const Text(
                         '현재 상태',
                         style: TextStyle(
                           color: Color(0xFFAAAAAA), // Light grey
                           fontSize: 11,
                           fontWeight: FontWeight.w900,
                         ),
                       ),
                       Container(
                         padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                         decoration: BoxDecoration(
                           color: (_isValid == true) 
                               ? const Color(0xFF1B382A) // Dark Green bg
                               : const Color(0xFF2A1B1B), // Dark Red bg
                           borderRadius: BorderRadius.circular(4),
                         ),
                         child: Row(
                           children: [
                             Container(
                               width: 6,
                               height: 6,
                               decoration: BoxDecoration(
                                 color: (_isValid == true) 
                                     ? const Color(0xFF00E676) // Bright Green
                                     : (_isValid == false) ? const Color(0xFFFF5252) : Colors.grey, // Red or Grey
                                 shape: BoxShape.circle,
                               ),
                             ),
                             const SizedBox(width: 8),
                             Text(
                               (_isValid == true) 
                                   ? '사용 가능' 
                                   : (_isValid == false) ? '사용 불가' : '확인 필요',
                               style: TextStyle(
                                 color: (_isValid == true) 
                                     ? const Color(0xFF00E676) 
                                     : (_isValid == false) ? const Color(0xFFFF5252) : Colors.grey,
                                 fontSize: 11,
                                 fontWeight: FontWeight.bold,
                               ),
                             ),
                           ],
                         ),
                       ),
                     ],
                   ),
                   const SizedBox(height: 24),
                   const Text(
                     '마스터 비밀번호 6자리 (또는 API Key) 입력',
                     style: TextStyle(
                       color: Color(0xFF666666),
                       fontSize: 10,
                       fontWeight: FontWeight.bold,
                     ),
                   ),
                   const SizedBox(height: 8),
                   TextField(
                     controller: _controller,
                     style: const TextStyle(color: Colors.white, fontSize: 14),
                     obscureText: _obscureText,
                     decoration: InputDecoration(
                       isDense: true,
                       contentPadding: const EdgeInsets.symmetric(vertical: 12),
                       border: InputBorder.none,
                       hintText: '여기에 입력해 주세요',
                       hintStyle: const TextStyle(color: Color(0xFF444444)),
                       suffixIcon: IconButton(
                         icon: Icon(
                           _obscureText ? Icons.visibility_off : Icons.visibility,
                           color: const Color(0xFF666666),
                           size: 20,
                         ),
                         onPressed: () {
                           setState(() {
                             _obscureText = !_obscureText;
                           });
                         },
                       ),
                     ),
                   ),
                 ],
               ),
            ),
            
            if (_errorMessage != null) ...[
              const SizedBox(height: 12),
              Text(
                _errorMessage!,
                style: const TextStyle(color: Color(0xFFFF5252), fontSize: 12),
                textAlign: TextAlign.center,
              ),
            ],

            const SizedBox(height: 24),

            // Buttons
            ElevatedButton(
              onPressed: () {
                String input = _controller.text.trim();
                String effectiveKey = _getEffectiveKey(input);
                
                if (masterKeys.containsKey(input)) {
                  widget.onSave(effectiveKey);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('✅ 인증 성공! 전용 API 키가 적용되었습니다.')),
                  );
                } else {
                  widget.onSave(effectiveKey);
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                elevation: 0,
              ),
              child: const Text(
                '저장 및 적용',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
              ),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: _isValidating ? null : _testConnection,
              style: TextButton.styleFrom(
                backgroundColor: const Color(0xFF252527),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              ),
              child: _isValidating 
                  ? const SizedBox(
                      width: 16, 
                      height: 16, 
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)
                    )
                  : const Text(
                      '연결 테스트',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                    ),
            ),
            
             const SizedBox(height: 8),
             Center(
               child: TextButton(
                onPressed: () async {
                  final Uri url = Uri.parse('https://aistudio.google.com/app/apikey');
                  if (!await launchUrl(url)) {
                    // ignore: use_build_context_synchronously
                    ScaffoldMessenger.of(context).showSnackBar(
                       const SnackBar(content: Text('URL을 열 수 없습니다')),
                    );
                  }
                },
                child: const Text(
                  '오류가 난다면? API Key 발급받기',
                  style: TextStyle(color: Color(0xFF666666), fontSize: 12, decoration: TextDecoration.underline),
                ),
               ),
             ),

            const SizedBox(height: 24),
            const Center(
              child: Text(
                'ENCRYPTED STORAGE PROTOCOL V5.0',
                style: TextStyle(
                  color: Color(0xFF333333),
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 2.0,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionDivider extends StatelessWidget {
  const _SectionDivider();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      height: 1,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFFF1F5F9).withOpacity(0),
            const Color(0xFFE2E8F0),
            const Color(0xFFF1F5F9).withOpacity(0),
          ],
        ),
      ),
    );
  }
}

class _ThemedScrollSection extends StatelessWidget {
  final String title;
  final String icon;
  final List<Map<String, dynamic>> items;

  const _ThemedScrollSection({
    super.key,
    required this.title,
    required this.icon,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  icon,
                  style: const TextStyle(fontSize: 20),
                ),
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
              const Spacer(),
              const Text(
                '옆으로 밀어서 보기',
                style: TextStyle(
                  fontSize: 12,
                  color: Color(0xFF64748B),
                  fontWeight: FontWeight.w500,
                ),
              ),
              const Icon(Icons.chevron_right, size: 16, color: Color(0xFF64748B)),
            ],
          ),
        ),
        SizedBox(
          height: 240,
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: items.length,
            itemBuilder: (context, index) {
              final item = items[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: _buildImageCard(
                  item['url']!,
                  item['type'] == 'before' ? '${item['label']} (Before)' : item['label']!,
                  item['type'] == 'after',
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildImageCard(String url, String label, bool isAfter) {
    return Container(
      width: 200, // Reduced width for better horizontal layout
      height: 220,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(
          color: isAfter ? const Color(0xFFF97316).withOpacity(0.3) : const Color(0xFFF1F5F9),
          width: 2,
        ),
      ),
      child: Stack(
        fit: StackFit.expand,
        children: [
          Padding(
            padding: const EdgeInsets.all(4.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.asset(
                url,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    color: Colors.grey[200],
                    child: Center(
                      child: Text(
                        '이미지 오타:\n${url.split('/').last}',
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 8, color: Colors.grey),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          Positioned(
            bottom: 8,
            left: 8,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: isAfter ? const Color(0xFFF97316) : Colors.black.withOpacity(0.6),
                borderRadius: BorderRadius.circular(30),
              ),
              child: Text(
                label,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 8,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PersonaSettingsDialog extends StatefulWidget {
  final PersonaData initialData;
  final Function(PersonaData) onSave;

  const _PersonaSettingsDialog({required this.initialData, required this.onSave});

  @override
  State<_PersonaSettingsDialog> createState() => _PersonaSettingsDialogState();
}

class _PersonaSettingsDialogState extends State<_PersonaSettingsDialog> {
  late TextEditingController _brandNameController;
  late TextEditingController _industryController;
  late TextEditingController _toneController;
  late TextEditingController _targetController;
  late TextEditingController _descController;

  @override
  void initState() {
    super.initState();
    _brandNameController = TextEditingController(text: widget.initialData.brandName);
    _industryController = TextEditingController(text: widget.initialData.industry);
    _toneController = TextEditingController(text: widget.initialData.tone);
    _targetController = TextEditingController(text: widget.initialData.targetAudience);
    _descController = TextEditingController(text: widget.initialData.description);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: const Text('브랜드 페르소나 설정', style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('사장님의 브랜드 정보를 입력해 주세요.\nAI가 이 정보를 바탕으로 맞춤형 문구를 작성합니다.', 
              style: TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.5)),
            const SizedBox(height: 20),
            _buildField('브랜드명', _brandNameController, '예: 카페 비즈컷'),
            _buildField('업종', _industryController, '예: 베이커리 카페'),
            _buildField('톤앤매너', _toneController, '예: 따뜻하고 친절한, 전문적인'),
            _buildField('타겟 고객', _targetController, '예: 2030 직장인, 동네 주민'),
            _buildField('브랜드 소개 (선택)', _descController, '브랜드의 특징을 자유롭게 적어주세요.', maxLines: 3),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context), 
          child: const Text('취소', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.bold))
        ),
        ElevatedButton(
          onPressed: () {
            widget.onSave(PersonaData(
              brandName: _brandNameController.text,
              industry: _industryController.text,
              tone: _toneController.text,
              targetAudience: _targetController.text,
              description: _descController.text,
            ));
            Navigator.pop(context);
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF0F172A),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
          child: const Text('저장하기', style: TextStyle(fontWeight: FontWeight.w900)),
        ),
      ],
    );
  }

  Widget _buildField(String label, TextEditingController controller, String hint, {int maxLines = 1}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextField(
        controller: controller,
        maxLines: maxLines,
        style: const TextStyle(fontSize: 14),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF475569)),
          hintText: hint,
          hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
          filled: true,
          fillColor: const Color(0xFFF8FAFC),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
      ),
    );
  }
}

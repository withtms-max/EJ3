
import 'package:flutter/material.dart';
import '../constants.dart';
import 'editor_screen.dart';
import 'caption_creator_screen.dart';
import 'card_news_creator_screen.dart';
import 'blog_wizard_screen.dart';

class CategorySelectionScreen extends StatelessWidget {
  const CategorySelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF9F2), // Web background color
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 10),
            // Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFFFCCBC).withOpacity(0.3), // Orange-100 equivalent
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFFFCCBC)),
              ),
              child: const Text(
                '소상공인 전용 AI 사진 보정 서비스',
                style: TextStyle(
                  color: Color(0xFFC2410C), // Orange-700
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            const SizedBox(height: 24),
            // Title
            RichText(
              textAlign: TextAlign.center,
              text: const TextSpan(
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A), // Slate-900
                  height: 1.2,
                  fontFamily: 'Pretendard', 
                ),
                children: [
                  TextSpan(text: '어떤 종류의\n'),
                  TextSpan(
                    text: '가게를 운영하시나요?',
                    style: TextStyle(
                      decoration: TextDecoration.underline,
                      decorationColor: Color(0xFFFB923C), // Orange-400
                      decorationThickness: 2,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              '업종에 딱 맞는 AI 모델을 준비해드립니다.',
              style: TextStyle(
                fontSize: 14,
                color: Color(0xFF475569), // Slate-600
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            // Category Grid
            LayoutBuilder(
              builder: (context, constraints) {
                // Determine responsive crossAxisCount
                int crossAxisCount = constraints.maxWidth > 600 ? 3 : 2;
                double aspectRatio = constraints.maxWidth > 600 ? 1.0 : 1.05;

                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: crossAxisCount,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: aspectRatio,
                  ),
                  itemCount: shopCategories.length,
                  itemBuilder: (context, index) {
                    final category = shopCategories[index];
                    return _buildCategoryCard(context, category);
                  },
                );
              },
            ),
            const SizedBox(height: 48),
            // Marketing Tools Section
            const Text(
              '✨ SNS 마케팅 툴',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _buildToolCard(context, '캡션 생성', Icons.text_fields, const Color(0xFFF97316), () => Navigator.push(context, MaterialPageRoute(builder: (context) => const CaptionCreatorScreen())))),
                const SizedBox(width: 12),
                Expanded(child: _buildToolCard(context, '카드뉴스', Icons.copy_all, const Color(0xFFF59E0B), () => Navigator.push(context, MaterialPageRoute(builder: (context) => const CardNewsCreatorScreen())))),
                const SizedBox(width: 12),
                Expanded(child: _buildToolCard(context, '블로그', Icons.edit_note, const Color(0xFF10B981), () => Navigator.push(context, MaterialPageRoute(builder: (context) => const BlogWizardScreen())))),
              ],
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildToolCard(BuildContext context, String title, IconData icon, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.1), width: 1.5),
          boxShadow: [BoxShadow(color: color.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))],
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF1E293B))),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryCard(BuildContext context, ShopCategory category) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => EditorScreen(initialCategory: category),
          ),
        );
      },
      borderRadius: BorderRadius.circular(32),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: const Color(0xFFF1F5F9), width: 2), // Slate-100
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: const Color(0xFFFFF7ED), // Orange-50
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                category.icon,
                size: 30,
                color: const Color(0xFFEA580C), // Orange-600
              ),
            ),
            const SizedBox(height: 12),
            Text(
              category.name,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w900,
                color: Color(0xFF1E293B), // Slate-800
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class PersonaData {
  final String brandName;
  final String industry;
  final String tone;
  final String targetAudience;
  final String description;

  PersonaData({
    required this.brandName,
    required this.industry,
    required this.tone,
    required this.targetAudience,
    required this.description,
  });

  Map<String, dynamic> toJson() => {
    'brandName': brandName,
    'industry': industry,
    'tone': tone,
    'targetAudience': targetAudience,
    'description': description,
  };

  factory PersonaData.fromJson(Map<String, dynamic> json) => PersonaData(
    brandName: json['brandName'] ?? '',
    industry: json['industry'] ?? '',
    tone: json['tone'] ?? '',
    targetAudience: json['targetAudience'] ?? '',
    description: json['description'] ?? '',
  );

  bool get isEmpty => brandName.isEmpty;
}

class PersonaService {
  static const String _key = 'bizcut_persona_data';

  Future<void> savePersona(PersonaData data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(data.toJson()));
  }

  Future<PersonaData?> getPersona() async {
    final prefs = await SharedPreferences.getInstance();
    final String? json = prefs.getString(_key);
    if (json == null) return null;
    try {
      return PersonaData.fromJson(jsonDecode(json));
    } catch (e) {
      return null;
    }
  }

  String buildPersonaContext(PersonaData? persona) {
    if (persona == null || persona.isEmpty) return '';
    return '''
[브랜드 페르소나]
- 브랜드명: \${persona.brandName}
- 업종: \${persona.industry}
- 톤/스타일: \${persona.tone}
- 타겟 고객: \${persona.targetAudience}
\${persona.description.isNotEmpty ? "- 브랜드 소개: \${persona.description}" : ""}
위 페르소나를 반영하여 작성해주세요.
'''.trim();
  }
}

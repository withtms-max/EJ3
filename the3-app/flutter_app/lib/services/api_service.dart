import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import '../constants.dart';

class ApiService {
  final String apiKey;

  ApiService(this.apiKey);

  /// 로컬 백엔드(Imagen 3)를 이용한 사진 보정
  Future<Uint8List?> editPhotoViaBackend({
    required Uint8List imageBytes,
    required String prompt,
  }) async {
    final url = Uri.parse('$apiBaseUrl/edit-photo');

    final bodyMap = {
      "image_b64": base64Encode(imageBytes),
      "prompt": prompt,
      "aspect_ratio": "1:1"
    };

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(bodyMap),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['image_b64'] != null) {
          return base64Decode(data['image_b64']);
        }
      }
      throw Exception('백엔드 오류: ${response.statusCode} - ${response.body}');
    } catch (e) {
      print("Backend call failed, check if server is running: $e");
      rethrow;
    }
  }

  /// 로컬 백엔드(Imagen 3)를 이용한 카드뉴스 이미지 생성
  Future<Uint8List?> generateCardNewsImage({
    required String userTopic,
    required String templateId,
    required String templateName,
    required String scriptData,
    required String photoAnalysis,
    required List<Uint8List> photos,
  }) async {
    final url = Uri.parse('$apiBaseUrl/generate-image');

    final bodyMap = {
      "user_topic": userTopic,
      "template_id": templateId,
      "template_name": templateName,
      "script_data": scriptData,
      "photo_analysis": photoAnalysis,
      "uploaded_photos_b64": photos.map((p) => base64Encode(p)).toList(),
      "aspect_ratio": "1:1"
    };

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(bodyMap),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['image_b64'] != null) {
          return base64Decode(data['image_b64']);
        }
      }
      throw Exception('백엔드 오류: ${response.statusCode} - ${response.body}');
    } catch (e) {
      rethrow;
    }
  }

  /// 웹과 동일: gemini-3.1-flash-image 모델 사용
  Future<Uint8List?> generateImage({
    required Uint8List imageBytes,
    required String prompt,
  }) async {
    final url = Uri.parse(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=$apiKey',
    );

    final bodyMap = {
      "contents": [
        {
          "parts": [
            {
              "inline_data": {
                "mime_type": "image/jpeg",
                "data": base64Encode(imageBytes),
              }
            },
            {"text": prompt},
          ]
        }
      ],
      "generationConfig": {
        "responseModalities": ["IMAGE"]
      }
    };

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(bodyMap),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      if (data['candidates'] != null &&
          (data['candidates'] as List).isNotEmpty) {
        final candidate = data['candidates'][0];
        if (candidate['content'] != null &&
            candidate['content']['parts'] != null) {
          final parts = candidate['content']['parts'] as List;
          for (var part in parts) {
            final inlineData = part['inlineData'] ?? part['inline_data'];
            if (inlineData != null) {
              final base64Data = inlineData['data'];
              if (base64Data != null) {
                return base64Decode(base64Data as String);
              }
            }
          }
        }
      }
      throw Exception('이미지 없음. 응답: ${response.body.substring(0, response.body.length > 800 ? 800 : response.body.length)}');
    } else {
      throw Exception('API Error: ${response.statusCode} - ${response.body}');
    }
  }

  Future<String> getAvailableModels() async {
    try {
      final url = Uri.parse(
          'https://generativelanguage.googleapis.com/v1beta/models?key=$apiKey');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['models'] != null) {
          final models = (data['models'] as List)
              .map((m) => m['name'].toString().replaceAll('models/', ''))
              .toList();
          return models.join(',\n');
        }
        return 'No models found';
      } else {
        return 'Failed: ${response.statusCode}';
      }
    } catch (e) {
      return 'Error: $e';
    }
  }

  Future<String> generateText({
    required String prompt,
    String model = 'gemini-2.5-flash',
  }) async {
    final url = Uri.parse(
      'https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent?key=$apiKey',
    );

    final bodyMap = {
      "contents": [
        {
          "parts": [
            {"text": prompt},
          ]
        }
      ],
      "generationConfig": {
        "temperature": 0.7,
        "topK": 40,
        "topP": 0.95,
        "maxOutputTokens": 2048,
      }
    };

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(bodyMap),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['candidates'] != null && (data['candidates'] as List).isNotEmpty) {
        final candidate = data['candidates'][0];
        if (candidate['content'] != null && candidate['content']['parts'] != null) {
          final parts = candidate['content']['parts'] as List;
          if (parts.isNotEmpty) {
            return parts[0]['text'] ?? '';
          }
        }
      }
      throw Exception('텍스트 생성 결과가 없습니다.');
    } else {
      throw Exception('API Error: ${response.statusCode} - ${response.body}');
    }
  }

  static Future<bool> verifyApiKey(String apiKey) async {
    try {
      final url = Uri.parse(
          'https://generativelanguage.googleapis.com/v1beta/models?key=$apiKey');
      final response = await http.get(url);
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}

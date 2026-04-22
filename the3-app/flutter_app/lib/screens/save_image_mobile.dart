import 'dart:typed_data';
import 'package:gal/gal.dart';

Future<String> saveImageImpl(Uint8List bytes, String fileName) async {
  try {
    // Gal.putImageBytes를 사용하여 갤러리에 저장
    await Gal.putImageBytes(bytes, name: fileName);
    return '갤러리에 저장됨';
  } catch (e) {
    throw Exception('이미지 저장 중 오류가 발생했습니다: $e');
  }
}

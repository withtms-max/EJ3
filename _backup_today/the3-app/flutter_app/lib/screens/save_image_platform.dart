import 'dart:typed_data';
import 'save_image_web.dart' if (dart.library.io) 'save_image_mobile.dart';

/// 플랫폼에 맞게 이미지를 저장합니다.
/// - 웹: 브라우저 다운로드
/// - 모바일: 파일 시스템 저장
Future<String> saveImageToPlatform(Uint8List bytes, String fileName) {
  return saveImageImpl(bytes, fileName);
}

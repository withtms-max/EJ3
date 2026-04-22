// 모바일(dart:io)에서 dart:html을 import할 때 사용하는 stub 파일
// 웹에서는 dart:html 실제 파일이 사용됨

class Blob {
  Blob(List<dynamic> data, String type);
}

class Url {
  static String createObjectUrlFromBlob(dynamic blob) => '';
  static void revokeObjectUrl(String url) {}
}

class AnchorElement {
  AnchorElement({String? href});
  void setAttribute(String name, String value) {}
  void click() {}
}

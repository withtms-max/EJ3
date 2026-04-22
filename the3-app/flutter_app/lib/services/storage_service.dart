
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const String _apiKeyKey = 'google_api_key';
  static const String _timestampKey = 'api_key_timestamp';

  Future<void> saveApiKey(String apiKey) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_apiKeyKey, apiKey);
    await prefs.setInt(_timestampKey, DateTime.now().millisecondsSinceEpoch);
  }

  Future<String?> getApiKey() async {
    final prefs = await SharedPreferences.getInstance();
    final apiKey = prefs.getString(_apiKeyKey);
    final timestamp = prefs.getInt(_timestampKey);

    if (apiKey != null && timestamp != null) {
      final now = DateTime.now().millisecondsSinceEpoch;
      final oneHour = 60 * 60 * 1000;
      if (now - timestamp > oneHour) {
        // 만료됨
        await clearApiKey();
        return null;
      }
    }
    return apiKey;
  }

  Future<void> clearApiKey() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_apiKeyKey);
    await prefs.remove(_timestampKey);
  }
}

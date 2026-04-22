
import 'package:flutter/material.dart';
// Google Fonts removed to avoid extra dependency. Using default font.
import 'package:flutter/services.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));
  runApp(const BizCutApp());
}

class BizCutApp extends StatelessWidget {
  const BizCutApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BizCut',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.orange,
            primary: Colors.orange,
            secondary: Colors.amber,
            background: const Color(0xFFFFF9F2),
        ),
        useMaterial3: false,
        scaffoldBackgroundColor: const Color(0xFFFFF9F2),
        fontFamily: 'Noto Sans KR', // If system has it, otherwise default
        appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFFFFF9F2),
            foregroundColor: Colors.black,
            elevation: 0,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black87,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            )
        )
      ),
      home: const HomeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

export default {
  expo: {
    name: 'Insurance Services',
    slug: 'insurance-services-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './generated-icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './generated-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.insuranceservices.app'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './generated-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.insuranceservices.app'
    },
    web: {
      favicon: './generated-icon.png',
      bundler: 'metro'
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
  }
};

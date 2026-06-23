export default function (api) {
  api.cache(true);
  let plugins = [];

  plugins.push('react-native-worklets/plugin');

  // Module resolver to support TS path aliases in Metro/Expo
  plugins.push([
    'module-resolver',
    {
      root: ['./'],
      alias: {
        '@': './src',
        '@composants': './src/components',
      },
    },
  ]);

  return {
    presets: ['babel-preset-expo'],

    plugins,
  };
}

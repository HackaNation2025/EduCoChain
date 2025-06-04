module.exports = function(api) {
  api.cache(true); // Permite que o Babel cache a configuração para builds mais rápidos
  return {
    presets: [
      // Aqui, 'babel-preset-expo' é um array onde o primeiro item é o nome do preset
      // e o segundo item é um objeto com as opções para esse preset.
      ['babel-preset-expo', {
        unstable_transformImportMeta: true, // <--- COLOQUE AQUI DENTRO DO OBJETO DE OPÇÕES
      }],
    ],
  };
};
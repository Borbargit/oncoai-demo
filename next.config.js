/** @type {import('next').NextConfig} */
const nextConfig = {
  // Настройка для решения предупреждения о lock файлах
  experimental: {
    turbo: {
      resolveAlias: {
        // Базовые настройки
      }
    }
  }
}

module.exports = nextConfig

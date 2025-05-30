const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongodb', 'mongoose'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
      }
    }

    // Exclude MongoDB native modules from client bundle
    config.externals = config.externals || []
    config.externals.push({
      'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
      'kerberos': 'commonjs kerberos',
      '@napi-rs/snappy-linux-x64-gnu': 'commonjs @napi-rs/snappy-linux-x64-gnu',
      '@napi-rs/snappy-linux-x64-musl': 'commonjs @napi-rs/snappy-linux-x64-musl',
      'snappy': 'commonjs snappy',
      'aws4': 'commonjs aws4',
      'mongodb-connection-string-url': 'commonjs mongodb-connection-string-url',
    })

    return config
  },
}

export default nextConfig

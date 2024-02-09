/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    urlImports: ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css', 'https://fonts.googleapis.com/css?family=Montserrat', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/css/bootstrap.min.css'],
  },
  reactStrictMode: true,
};

export default nextConfig;

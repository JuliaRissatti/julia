/** @type {import('next').NextConfig} */

const nextConfig = {
    
	// https://github.com/wojtekmaj/react-pdf
	webpack: (config) => {
		config.resolve.alias.canvas = false;

		return config;
	},
    
};

export default nextConfig;

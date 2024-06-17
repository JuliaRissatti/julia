/** @type {import('next').NextConfig} */

const nextConfig = {
	// https://github.com/wojtekmaj/react-pdf
	webpack: (config) => {
		config.resolve.alias.canvas = false;

		return config;
	},
	images: {
		remotePatterns: [
			{
				// https://www.svgrepo.com/show/66745/pdf.svg
				protocol: "https",
				hostname: "www.svgrepo.com",
				pathname: "show/*",
				port: "",
			},
		],
	},
};

export default nextConfig;
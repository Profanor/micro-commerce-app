import 'dotenv/config';

export default {
  expo: {
    name: "micro-commerce-mobile",
    slug: "micro-commerce-mobile",
    version: "1.0.0",
    orientation: "portrait",
    extra: {
      API_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    },
  },
};

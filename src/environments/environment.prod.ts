export const environment = {
  production: true,
  wordpress: {
    baseUrl: 'https://stpetelodge139.org',
    // After moving WordPress to /wp subdirectory
    apiUrl: 'https://stpetelodge139.org/wp/wp-json/wp/v2',
    woocommerceUrl: 'https://stpetelodge139.org/wp/wp-json/wc/v3'
  },
  woocommerce: {
    // Get these from WordPress Admin → WooCommerce → Settings → Advanced → REST API
    consumerKey: 'your_consumer_key_here',
    consumerSecret: 'your_consumer_secret_here'
  }
};




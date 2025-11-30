export const environment = {
  production: true,
  wordpress: {
    // Production WordPress server
    baseUrl: 'https://y91.b3b.myftpupload.com',
    apiUrl: 'https://y91.b3b.myftpupload.com/wp-json/wp/v2',
    woocommerceUrl: 'https://y91.b3b.myftpupload.com/wp-json/wc/v3'
  },
  woocommerce: {
    // Get these from WordPress Admin → WooCommerce → Settings → Advanced → REST API
    consumerKey: 'your_consumer_key_here',
    consumerSecret: 'your_consumer_secret_here'
  }
};




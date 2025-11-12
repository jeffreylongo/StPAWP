export const environment = {
  production: false,
  staging: true,
  wordpress: {
    // STAGING WordPress API URLs
    baseUrl: 'http://s9d.607.myftpupload.com',
    apiUrl: 'http://s9d.607.myftpupload.com/wp/wp-json/wp/v2',
    woocommerceUrl: 'http://s9d.607.myftpupload.com/wp/wp-json/wc/v3'
  },
  woocommerce: {
    // Get these from WordPress Admin (STAGING) → WooCommerce → Settings → Advanced → REST API
    // After deployment, go to: http://s9d.607.myftpupload.com/wp/wp-admin
    consumerKey: 'your_consumer_key_here',
    consumerSecret: 'your_consumer_secret_here'
  }
};



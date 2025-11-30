export const environment = {
  production: false,
  wordpress: {
    // Development uses staging WordPress
    baseUrl: 'http://s9d.607.myftpupload.com',
    apiUrl: 'http://s9d.607.myftpupload.com/wp/wp-json/wp/v2',
    woocommerceUrl: 'http://s9d.607.myftpupload.com/wp/wp-json/wc/v3'
  },
  woocommerce: {
    consumerKey: 'your_consumer_key_here',
    consumerSecret: 'your_consumer_secret_here'
  }
};
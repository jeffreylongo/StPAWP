<?php
/**
 * Plugin Name: CORS Headers for Angular Frontend
 * Plugin URI: https://stpetelodge139.org
 * Description: Enables CORS headers to allow Angular frontend to access WordPress REST API
 * Version: 1.0.0
 * Author: St. Petersburg Lodge No. 139
 * 
 * Installation:
 * 1. Upload this file to: wp/wp-content/mu-plugins/cors-headers.php
 * 2. Create mu-plugins directory if it doesn't exist
 * 3. File will auto-activate (mu-plugins = must-use plugins)
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add CORS headers to WordPress REST API responses
 */
function stpete_lodge_cors_headers() {
    // Allow requests from your Angular domains
    $allowed_origins = [
        'http://s9d.607.myftpupload.com',  // STAGING
        'https://stpetelodge139.org',       // PRODUCTION (future)
    ];
    
    // For development, allow localhost
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        $origin = $_SERVER['HTTP_ORIGIN'];
        
        // Allow staging, production, and localhost
        if (in_array($origin, $allowed_origins) || 
            strpos($origin, 'http://localhost') === 0 || 
            strpos($origin, 'http://127.0.0.1') === 0) {
            header("Access-Control-Allow-Origin: $origin");
        }
    }
    
    // Allow specific HTTP methods
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    
    // Allow credentials (for authenticated requests)
    header('Access-Control-Allow-Credentials: true');
    
    // Allow specific headers
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce');
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}

// Add CORS headers to REST API
add_action('rest_api_init', 'stpete_lodge_cors_headers', 15);

/**
 * Enable REST API access for logged out users (if needed)
 * Remove or comment out if you want to require authentication
 */
function stpete_lodge_enable_rest_api_anonymous() {
    // Allow anonymous access to specific endpoints
    remove_filter('rest_authentication_errors', 'rest_cookie_check_errors', 100);
}
// Uncomment the next line if you want anonymous access to REST API
// add_filter('rest_authentication_errors', 'stpete_lodge_enable_rest_api_anonymous', 20);

/**
 * Add custom CORS headers to all WordPress responses (not just REST API)
 * Useful for WooCommerce and other endpoints
 */
function stpete_lodge_global_cors_headers() {
    $allowed_origins = [
        'http://s9d.607.myftpupload.com',  // STAGING
        'https://stpetelodge139.org',       // PRODUCTION (future)
    ];
    
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        $origin = $_SERVER['HTTP_ORIGIN'];
        
        if (in_array($origin, $allowed_origins) || 
            strpos($origin, 'http://localhost') === 0 || 
            strpos($origin, 'http://127.0.0.1') === 0) {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Credentials: true');
        }
    }
}
add_action('init', 'stpete_lodge_global_cors_headers');

/**
 * Log CORS requests for debugging (optional)
 * Remove in production for better performance
 */
function stpete_lodge_log_cors_request($result, $server, $request) {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('REST API Request: ' . $request->get_route());
        error_log('Origin: ' . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'none'));
    }
    return $result;
}
// Uncomment for debugging:
// add_filter('rest_pre_dispatch', 'stpete_lodge_log_cors_request', 10, 3);


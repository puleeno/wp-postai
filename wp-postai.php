<?php
/**
 * Plugin Name: WP PostAI
 * Plugin URI: https://wordpress.org/plugins/wp-postai/
 * Description: WP PostAI is a plugin that allows you to generate content using AI
 * Version: 1.0.0
 * Author: WP PostAI
 * Author URI: https://wppostai.com/
 * License: GPLv3 or later
 * Text Domain: wp-postai
 * Domain Path: /languages
 * Requires at least: 5.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('WP_POSTAI_PLUGIN_FILE')) {
    define('WP_POSTAI_PLUGIN_FILE', __FILE__);
}

if (!defined('WP_POSTAI_PLUGIN_DIR')) {
    define('WP_POSTAI_PLUGIN_DIR', plugin_dir_path(__FILE__));
}

if (!defined('WP_POSTAI_PLUGIN_URL')) {
    define('WP_POSTAI_PLUGIN_URL', plugin_dir_url(__FILE__));
}

// Autoload classes
require_once WP_POSTAI_PLUGIN_DIR . 'vendor/autoload.php';

class WP_PostAI_Plugin {
    private $settings_api;
    private $content_api;

    public function __construct() {
        $this->settings_api = new \WPPostAI\Settings\SettingsAPI();
        $this->content_api = new \WPPostAI\ContentBuilder\ContentAPI();
    }

    public function boot() {
        add_action('rest_api_init', [$this->settings_api, 'register_routes']);
        add_action('rest_api_init', [$this->content_api, 'register_routes']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
    }

    public function enqueue_admin_scripts($hook) {
        if (!in_array($hook, [
            'toplevel_page_wp-postai',
            'wp-postai_page_wp-postai-settings',
            'wp-postai_page_wp-postai-batch'
        ])) {
            return;
        }

        wp_enqueue_script('wp-element');
        wp_enqueue_script('wp-components');
        wp_enqueue_style('wp-components');

        wp_enqueue_script(
            'wp-postai-admin',
            WP_POSTAI_PLUGIN_URL . 'dist/bundle.js',
            ['wp-element', 'wp-components'],
            filemtime(WP_POSTAI_PLUGIN_DIR . 'dist/bundle.js'),
            true
        );

        wp_localize_script('wp-postai-admin', 'wpPostAI', [
            'apiUrl' => rest_url('wp-postai/v1'),
            'nonce' => wp_create_nonce('wp_rest')
        ]);
    }

    public function add_admin_menu() {
        add_menu_page(
            'WP PostAI',
            'WP PostAI',
            'manage_options',
            'wp-postai',
            [$this, 'render_admin_page'],
            'dashicons-edit'
        );

        add_submenu_page(
            'wp-postai',
            'Single Content',
            'Single Content',
            'manage_options',
            'wp-postai',
            [$this, 'render_admin_page']
        );

        add_submenu_page(
            'wp-postai',
            'Batch Content',
            'Batch Content',
            'manage_options',
            'wp-postai-batch',
            [$this, 'render_batch_page']
        );

        add_submenu_page(
            'wp-postai',
            'Settings',
            'Settings',
            'manage_options',
            'wp-postai-settings',
            [$this, 'render_settings_page']
        );
    }

    public function render_admin_page() {
        echo '<div id="wp-postai-app" data-page="content-builder"></div>';
    }

    public function render_settings_page() {
        echo '<div id="wp-postai-app" data-page="settings"></div>';
    }

    public function render_batch_page() {
        echo '<div id="wp-postai-app" data-page="batch-content"></div>';
    }
}

// Initialize plugin
function wp_postai_init() {
    $plugin = new WP_PostAI_Plugin();
    $plugin->boot();
}

add_action('plugins_loaded', 'wp_postai_init');

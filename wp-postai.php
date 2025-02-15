<?php
/**
 * Plugin Name: WP PostAI
 * Plugin URI: https://wordpress.org/plugins/wp-postai/
 * Description: WP PostAI is a plugin that allows you to automatically publish your posts to your social media accounts like Facebook, Twitter, LinkedIn, Tumblr, Reddit, Telegram, VK, Instagram, Pinterest, YouTube, Medium, and Google My Business.
 * Version: 1.0.0
 * Author: WP PostAI
 * Author URI: https://wppostai.com/
 * License: GPLv3 or later
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: wp-postai
 * Domain Path: /languages
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * Tested up to: 5.8
 * Stable tag: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('WP_POSTAI_PLUGIN_FILE')) {
    define('WP_POSTAI_PLUGIN_FILE', __FILE__);
}

class WP_PostAI_Plugin {
    private $settings_api;

    public function __construct() {
        $this->settings_api = new \WPPostAI\Settings\SettingsAPI();
    }

    public function boot() {
        add_action('rest_api_init', [$this->settings_api, 'register_routes']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
    }

    public function enqueue_admin_scripts($hook) {
        if ('toplevel_page_wp-postai' !== $hook) {
            return;
        }

        wp_enqueue_script(
            'wp-postai-admin',
            plugins_url('dist/bundle.js', __FILE__),
            ['wp-element'],
            filemtime(plugin_dir_path(__FILE__) . 'dist/bundle.js'),
            true
        );
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
    }

    public function render_admin_page() {
        echo '<div id="wp-postai-app"></div>';
    }
}

$wpPostAI = new WP_PostAI_Plugin();
$wpPostAI->boot();

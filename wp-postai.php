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
    public function boot() {
    }
}

$wpPostAI = new WP_PostAI_Plugin();
$wpPostAI->boot();

<?php
namespace WPPostAI\Settings;

class SettingsAPI {
    private $option_name = 'wp_postai_settings';

    public function register_routes() {
        register_rest_route('wp-postai/v1', '/settings', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_settings'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ],
            [
                'methods' => 'POST',
                'callback' => [$this, 'update_settings'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ],
        ]);
    }

    public function check_admin_permissions() {
        return current_user_can('manage_options');
    }

    public function get_settings() {
        $settings = get_option($this->option_name, $this->get_default_settings());
        return rest_ensure_response($settings);
    }

    public function update_settings($request) {
        $settings = $request->get_json_params();

        // Validate and sanitize settings here
        $sanitized_settings = $this->sanitize_settings($settings);

        update_option($this->option_name, $sanitized_settings);

        return rest_ensure_response($sanitized_settings);
    }

    private function sanitize_settings($settings) {
        // Add validation and sanitization logic here
        return $settings;
    }

    private function get_default_settings() {
        return [
            'ai_platforms' => [
                'openai' => [
                    'api_key' => '',
                    'organization_id' => '',
                ],
                'gemini' => [
                    'api_key' => '',
                ],
                'claude' => [
                    'api_key' => '',
                ],
                'grok' => [
                    'api_key' => '',
                ],
                'meta_ai' => [
                    'api_key' => '',
                    'app_secret' => '',
                ],
            ],
            'image_sources' => [
                'unsplash' => [
                    'access_key' => '',
                    'secret_key' => '',
                ],
                'bing' => [
                    'api_key' => '',
                ],
                'google' => [
                    'api_key' => '',
                    'cx_id' => '',
                ],
                'serpapi' => [
                    'api_key' => '',
                ],
            ],
        ];
    }
}
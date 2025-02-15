<?php
namespace WPPostAI\ContentBuilder;

class ContentAPI {
    public function register_routes() {
        register_rest_route('wp-postai/v1', '/post-types', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_post_types'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ]
        ]);
        register_rest_route('wp-postai/v1', '/publish-content', [
            [
                'methods' => 'POST',
                'callback' => [$this, 'publish_content'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ]
        ]);
    }

    public function check_admin_permissions() {
        return current_user_can('publish_posts');
    }

    public function get_post_types() {
        $post_types = get_post_types(['public' => true], 'objects');
        $formatted_types = [];

        foreach ($post_types as $post_type) {
            $formatted_types[] = [
                'value' => $post_type->name,
                'label' => $post_type->labels->singular_name
            ];
        }

        return rest_ensure_response($formatted_types);
    }

    public function publish_content($request) {
        $content_data = $request->get_json_params();

        $post_data = [
            'post_title'    => $content_data['title'] ?? '',
            'post_content'  => $content_data['content'] ?? '',
            'post_status'   => $content_data['post_status'] ?? 'publish', // Default to publish
            'post_type'     => $content_data['post_type'] ?? 'post',     // Default to post
            'post_author'   => get_current_user_id(),
        ];

        $post_id = wp_insert_post($post_data);

        if (is_wp_error($post_id)) {
            return new \WP_Error('publish_failed', $post_id->get_error_message());
        }

        return rest_ensure_response([
            'success' => true,
            'post_id' => $post_id,
            'post_url' => get_permalink($post_id)
        ]);
    }
}
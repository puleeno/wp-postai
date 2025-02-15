<?php
namespace WPPostAI\ContentBuilder;

use WPPostAI\Interfaces\AIAdapter;
use WPPostAI\Interfaces\ImageRepository;

class ContentBuilder {
    private $aiAdapter;
    private $imageRepository;

    public function __construct(AIAdapter $aiAdapter, ImageRepository $imageRepository) {
        $this->aiAdapter = $aiAdapter;
        $this->imageRepository = $imageRepository;
    }

    public function build(string $idea, bool $generateCategories = true): array {
        // Step 1: Generate outline
        $outline = $this->aiAdapter->generateOutline($idea);

        // Step 2: Generate content
        $content = $this->aiAdapter->generateContent($outline);

        // Step 3: Process images
        $contentWithImages = $this->processImages($content, $outline);

        $result = [
            'outline' => $outline,
            'content' => $contentWithImages,
        ];

        // Generate categories if requested
        if ($generateCategories) {
            $result['categories'] = $this->aiAdapter->suggestCategories($idea, $outline);
        }

        return $result;
    }

    private function processImages(string $content, array $outline): string {
        foreach ($outline as $section) {
            $images = $this->imageRepository->search($section['title']);
            if (!empty($images)) {
                $attachmentId = $this->imageRepository->download($images[0]['url']);
                $imageHtml = wp_get_attachment_image($attachmentId, 'full');
                $content = $this->insertImageToSection($content, $section['title'], $imageHtml);
            }
        }
        return $content;
    }

    private function insertImageToSection(string $content, string $sectionTitle, string $imageHtml): string {
        // Logic to insert image HTML near section title
        return $content;
    }

    public function buildBatch(array $ideas, bool $generateCategories = true): array {
        $results = [];
        foreach ($ideas as $idea) {
            try {
                $result = $this->build($idea, $generateCategories);
                $results[] = [
                    'idea' => $idea,
                    'success' => true,
                    'data' => $result
                ];
            } catch (\Exception $e) {
                $results[] = [
                    'idea' => $idea,
                    'success' => false,
                    'error' => $e->getMessage()
                ];
            }
        }
        return $results;
    }
}
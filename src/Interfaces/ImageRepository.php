<?php
namespace WPPostAI\Interfaces;

interface ImageRepository {
    public function search(string $keyword): array;
    public function download(string $url): int; // Returns WP attachment ID
}
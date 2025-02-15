<?php
namespace WPPostAI\Interfaces;

interface AIAdapter {
    public function connect(): bool;
    public function generateOutline(string $idea): array;
    public function generateContent(array $outline): string;
}
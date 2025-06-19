<?php
require_once '../vendor/autoload.php';
require_once '../includes/config.php';
require_once '../templates/resume_template.php';

// 使用TCPDF生成PDF
use TCPDF;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => '方法不允许']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // 创建PDF实例
    $pdf = new TCPDF();
    $pdf->SetCreator('简历生成器');
    $pdf->SetAuthor($data['name']);
    $pdf->SetTitle($data['name'] . '的简历');
    
    // 设置页面
    $pdf->AddPage();
    $pdf->SetFont('stsongstdlight', '', 12);
    
    // 生成HTML内容
    $html = generateResumeHTML($data);
    
    // 添加CSS样式
    $css = '
        <style>
        .resume-header { text-align: center; border-bottom: 2px solid #333; }
        .name { font-size: 24px; font-weight: bold; }
        .title { font-size: 16px; color: #666; }
        .contact-info { margin-top: 10px; }
        .resume-body { margin-top: 20px; }
        .skills-section, .work-section, .projects-section { margin-bottom: 20px; }
        h2 { color: #333; border-bottom: 1px solid #ddd; }
        .work-item, .project-item { margin-bottom: 15px; }
        .company, .project-name { font-weight: bold; }
        .duration, .project-duration { color: #666; font-size: 12px; }
        </style>
    ';
    
    $pdf->writeHTML($css . $html, true, false, true, false, '');
    
    // 输出PDF
    $filename = $data['name'] . '的简历.pdf';
    $pdf->Output($filename, 'D');
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

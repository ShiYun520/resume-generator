<?php
// 禁用错误显示，防止HTML错误信息干扰JSON输出
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// 确保输出缓冲区干净
if (ob_get_level()) {
    ob_clean();
}

session_start();
header('Content-Type: application/json; charset=utf-8');

// --- 配置 ---
define('TEMP_FILES_RELATIVE_DIR', 'temp_files');
define('TEMP_FILES_BASE_URL', './' . TEMP_FILES_RELATIVE_DIR . '/');

// 全局变量
$tempDirPath = __DIR__ . '/' . TEMP_FILES_RELATIVE_DIR;

// 函数定义区域
function getPdfStyles() {
    return <<<CSS
/* 基础打印样式 */
@page {
    size: A4;
    margin: 10mm;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.6;
    color: #333;
    background: white;
    font-size: 12px;
}

.resume-template {
    display: flex;
    width: 100%;
    min-height: auto;
    border: none;
    background: white;
}

.resume-sidebar {
    width: 30%;
    background-color: #f8f9fa;
    padding: 15px;
    color: #333;
    border-right: 1px solid #eee;
}

.resume-main {
    width: 70%;
    padding: 15px;
}

.profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 15px;
    display: block;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #2c3e50;
}

h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 20px 0 10px 0;
    color: #34495e;
    border-bottom: 2px solid #3498db;
    padding-bottom: 3px;
}

h3 {
    font-size: 14px;
    font-weight: 600;
    margin: 12px 0 6px 0;
    color: #2c3e50;
}

p {
    margin: 6px 0;
    font-size: 12px;
}

ul {
    padding-left: 16px;
    margin: 6px 0;
}

li {
    margin-bottom: 3px;
    font-size: 12px;
}

.contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    word-break: break-all;
    font-size: 11px;
}

.contact-item i {
    margin-right: 6px;
    width: 14px;
    text-align: center;
}

.skill-item {
    display: inline-block;
    background-color: #e8f4f8;
    color: #2c3e50;
    padding: 3px 6px;
    margin: 1px;
    border-radius: 10px;
    font-size: 10px;
    border: 1px solid #bdc3c7;
}

.experience-item, .education-item, .project-item {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    page-break-inside: avoid;
}

.experience-item:last-child, .education-item:last-child, .project-item:last-child {
    border-bottom: none;
}

.job-title {
    font-weight: bold;
    color: #2c3e50;
    font-size: 13px;
}

.company {
    color: #3498db;
    font-weight: 500;
    font-size: 12px;
}

.date-range {
    color: #7f8c8d;
    font-size: 11px;
}
CSS;
}

function processHtmlForPdf($html, $filenameForTitle) {
    $css = getPdfStyles();
    $escapedTitle = htmlspecialchars($filenameForTitle);
    
    return <<<HTML
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$escapedTitle}</title>
    <style>{$css}</style>
</head>
<body>
    <div class="resume-content resume-template">
{$html}
    </div>
</body>
</html>
HTML;
}

function generatePrintableHtml($html, $filename) {
    $css = getPdfStyles();
    $escapedTitle = htmlspecialchars($filename);
    
    return <<<HTML
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$escapedTitle} (可打印)</title>
    <style>
{$css}
.no-print { display: block; }
@media print {
    .no-print { display: none !important; }
    body { margin: 0; }
}
.print-instructions {
    background: #f0f0f0;
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
}
.print-btn {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 4px;
}
    </style>
    <script>
        window.addEventListener('load', function() {
            const printBtn = document.getElementById('print-btn-action');
            if (printBtn) {
                printBtn.addEventListener('click', function() {
                    window.print();
                });
            }
        });
    </script>
</head>
<body>
    <div class="no-print print-instructions">
        <h3>📄 简历HTML版本</h3>
        <p>请使用浏览器的打印功能将此页面保存为PDF：</p>
        <ol style="text-align: left; display: inline-block;">
            <li>点击下方 "🖨️ 打印/保存为PDF" 按钮 (或按 Ctrl+P / Cmd+P)。</li>
            <li>在打印对话框中，目标打印机选择 "另存为PDF" 或 "Save as PDF"。</li>
            <li>纸张大小通常选择 A4。</li>
            <li>边距可以设为 "默认" 或 "无"。</li>
            <li>(重要) 确保勾选 "背景图形" 或 "Background graphics" 选项。</li>
            <li>点击 "保存"。</li>
        </ol>
        <p><button id="print-btn-action" class="print-btn">🖨️ 打印/保存为PDF</button></p>
    </div>

    <div class="resume-content resume-template">
{$html}
    </div>
</body>
</html>
HTML;
}

function detectPdfMethod() {
    // 检查wkhtmltopdf
    $wkPath = trim(shell_exec('which wkhtmltopdf 2>/dev/null'));
    if (!empty($wkPath) && is_executable($wkPath)) {
        return 'wkhtmltopdf';
    }

    // 检查weasyprint
    $weasyPath = trim(shell_exec('which weasyprint 2>/dev/null'));
    if (!empty($weasyPath) && is_executable($weasyPath)) {
        return 'weasyprint';
    }

    // 检查是否在Windows环境下有wkhtmltopdf.exe
    $wkPathWin = trim(shell_exec('where wkhtmltopdf 2>nul'));
    if (!empty($wkPathWin)) {
        return 'wkhtmltopdf';
    }

    return 'html';
}

function getTempFilePath($extension) {
    global $tempDirPath;
    return $tempDirPath . '/' . uniqid('pdfgen_', true) . '.' . $extension;
}

function generateWithWkhtmltopdf($html, $filename, $action) {
    $tempHtml = getTempFilePath('html');
    $tempPdf = getTempFilePath('pdf');

    $processedHtml = processHtmlForPdf($html, $filename);
    if (file_put_contents($tempHtml, $processedHtml) === false) {
        throw new Exception('无法写入临时HTML文件');
    }

    // 检测wkhtmltopdf路径
    $wkPath = trim(shell_exec('which wkhtmltopdf 2>/dev/null'));
    if (empty($wkPath)) {
        $wkPath = trim(shell_exec('where wkhtmltopdf 2>nul')); // Windows
    }
    if (empty($wkPath)) {
        $wkPath = 'wkhtmltopdf'; // 假设在PATH中
    }

    $options = [
        '--page-size A4',
        '--margin-top 10mm',
        '--margin-bottom 10mm',
        '--margin-left 10mm',
        '--margin-right 10mm',
        '--encoding utf-8',
        '--enable-local-file-access',
        '--disable-smart-shrinking',
        '--load-error-handling ignore',
        '--quiet'
    ];
    
    $command = sprintf(
        '%s %s %s %s 2>&1',
        escapeshellcmd($wkPath),
        implode(' ', $options),
        escapeshellarg($tempHtml),
        escapeshellarg($tempPdf)
    );

    $output = shell_exec($command);
    $returnCode = 0; // shell_exec doesn't return exit code directly

    if (file_exists($tempPdf) && filesize($tempPdf) > 0) {
        handlePdfOutput($tempPdf, $filename, $action);
    } else {
        error_log("wkhtmltopdf failed. Command: $command. Output: $output");
        throw new Exception('wkhtmltopdf执行失败，可能未安装或配置错误');
    }

    @unlink($tempHtml);
}

function generateWithWeasyprint($html, $filename, $action) {
    $tempHtml = getTempFilePath('html');
    $tempPdf = getTempFilePath('pdf');

    $processedHtml = processHtmlForPdf($html, $filename);
    if (file_put_contents($tempHtml, $processedHtml) === false) {
        throw new Exception('无法写入临时HTML文件');
    }
    
    $weasyPath = trim(shell_exec('which weasyprint 2>/dev/null'));
    if (empty($weasyPath)) {
        $weasyPath = 'weasyprint';
    }

    $command = sprintf(
        '%s %s %s 2>&1',
        escapeshellcmd($weasyPath),
        escapeshellarg($tempHtml),
        escapeshellarg($tempPdf)
    );

    $output = shell_exec($command);

    if (file_exists($tempPdf) && filesize($tempPdf) > 0) {
        handlePdfOutput($tempPdf, $filename, $action);
    } else {
        error_log("WeasyPrint failed. Command: $command. Output: $output");
        throw new Exception('WeasyPrint执行失败，可能未安装或配置错误');
    }

    @unlink($tempHtml);
}

function generateHtmlVersion($html, $filename, $action) {
    $printableHtml = generatePrintableHtml($html, $filename);
    
    if ($action === 'preview') {
        header('Content-Type: text/html; charset=utf-8');
        echo $printableHtml;
        exit;
    } else {
        $tempHtmlFile = getTempFilePath('html');
        $urlAccessibleFilename = basename($tempHtmlFile);
        
        if (file_put_contents($tempHtmlFile, $printableHtml) === false) {
            throw new Exception('无法写入可打印的HTML文件');
        }
        
        $htmlFilename = pathinfo($filename, PATHINFO_FILENAME) . '.html';
        
        echo json_encode([
            'success' => true,
            'message' => '无法生成PDF文件，已生成可打印的HTML版本。请使用浏览器的打印功能保存为PDF。',
            'download_url' => TEMP_FILES_BASE_URL . $urlAccessibleFilename,
            'filename' => $htmlFilename,
            'type' => 'html',
            'print_instructions' => true,
            'fallback' => true
        ], JSON_UNESCAPED_UNICODE);
    }
}

function handlePdfOutput($sourcePdfFile, $outputFilename, $action) {
    if (!file_exists($sourcePdfFile) || filesize($sourcePdfFile) === 0) {
        @unlink($sourcePdfFile);
        throw new Exception('生成的PDF文件无效或为空');
    }

    if ($action === 'preview') {
        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="' . rawurlencode($outputFilename) . '"');
        header('Content-Length: ' . filesize($sourcePdfFile));
        readfile($sourcePdfFile);
        @unlink($sourcePdfFile);
        exit;
    } else {
        $urlAccessibleFilename = basename($sourcePdfFile);

        echo json_encode([
            'success' => true,
            'message' => 'PDF生成成功',
            'download_url' => TEMP_FILES_BASE_URL . $urlAccessibleFilename,
            'filename' => $outputFilename,
            'type' => 'pdf'
        ], JSON_UNESCAPED_UNICODE);
    }
}

// 主逻辑开始
try {
    // 确保临时目录存在
    if (!is_dir($tempDirPath)) {
        if (!mkdir($tempDirPath, 0755, true)) {
            throw new Exception('无法创建临时文件目录');
        }
    }
    
    if (!is_writable($tempDirPath)) {
        throw new Exception('临时文件目录不可写');
    }

    // 读取输入数据
    $input = file_get_contents('php://input');
    
    if ($input === false || empty($input)) {
        throw new Exception('未收到输入数据');
    }

    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON解析失败: ' . json_last_error_msg());
    }

    if (!$data || !isset($data['html'])) {
        throw new Exception('数据格式无效');
    }

    $html = $data['html'];
    $filename = isset($data['filename']) ? basename($data['filename']) : 'resume.pdf';
    $action = $data['action'] ?? 'download';

    // 检测并使用最佳的PDF生成方法
    $method = detectPdfMethod();
    error_log("PDF生成方法: " . $method);

    switch ($method) {
        case 'wkhtmltopdf':
            generateWithWkhtmltopdf($html, $filename, $action);
            break;
        case 'weasyprint':
            generateWithWeasyprint($html, $filename, $action);
            break;
        case 'html':
        default:
            generateHtmlVersion($html, $filename, $action);
            break;
    }

} catch (Exception $e) {
    // 记录错误到日志
    error_log("generate_pdf.php - Exception: " . $e->getMessage());
    
    // 输出错误JSON
    echo json_encode([
        'success' => false,
        'error' => 'PDF生成失败: ' . $e->getMessage(),
        'fallback' => true
    ], JSON_UNESCAPED_UNICODE);
}
?>

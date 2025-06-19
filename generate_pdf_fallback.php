<?php
// generate_pdf_fallback.php

header('Content-Type: text/html; charset=utf-8');

// 这是一个非常基础的骨架，你需要实现从POST获取HTML内容等逻辑
$htmlContent = "<h1>请将此页面打印为PDF</h1><p>这是备用方案。</p>"; // 应该从 POST 获取
$filename = "resume_fallback.pdf"; // 应该从 POST 获取或默认

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if ($data && isset($data['html'])) {
        $htmlContent = $data['html']; // 接收前端传来的简历HTML
        if (isset($data['filename'])) {
            // 清理文件名
            $baseFilename = basename($data['filename']);
            if (empty(trim(pathinfo($baseFilename, PATHINFO_FILENAME)))) {
                $filename = 'resume.pdf';
            } else {
                $filename = $baseFilename;
            }
        }
    } else {
        // 如果没有收到有效的HTML，显示一个通用消息
        $htmlContent = "<h1>错误</h1><p>未能正确接收简历数据。请重试或联系支持。</p>";
        $filename = "error.html";
    }
} else {
    // 如果不是POST请求，可以显示一个说明或错误
    $htmlContent = "<h1>访问错误</h1><p>此页面需要通过POST请求访问。</p>";
    $filename = "access_error.html";
}

// 复用 generate_pdf.php 中的 getPrintStyles() 函数 (如果该函数是独立的)
// 或者在这里直接定义CSS
function getFallbackPrintStyles() {
    // 复制或简化 getPrintStyles() 的内容
    // 确保包含简历本身的样式和打印提示的样式
    return <<<CSS
    /* 基础打印样式 */
    body { font-family: sans-serif; margin: 20px; }
    .no-print { display: block; }
    @media print {
        .no-print { display: none !important; }
        body { margin: 0; }
    }
    .print-instructions { background: #f0f0f0; padding: 15px; border: 1px solid #ccc; margin-bottom: 20px; }
    .print-btn { padding: 10px 15px; background-color: #007bff; color: white; border: none; cursor: pointer; }

    /* 你的简历预览CSS (从 generate_pdf.php 的 getPdfStyles 或 getPrintStyles 复制) */
    /* 例如: .resume-template, .resume-sidebar, .resume-main, 等等... */
    /* 你需要确保这里有足够的样式来渲染 $htmlContent */
    .resume-template { display: flex; width: 100%; min-height: 260mm; border: 1px solid #eee; }
    .resume-sidebar { width: 30%; background-color: #f8f9fa; padding: 20px; color: #333; border-right: 1px solid #eee; display: flex; flex-direction: column; }
    .resume-main { width: 70%; padding: 20px; }
    /* ... 更多简历样式 ... */
CSS;
}

$css = getFallbackPrintStyles();
$escapedTitle = htmlspecialchars(pathinfo($filename, PATHINFO_FILENAME));

?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $escapedTitle; ?> (可打印)</title>
    <style>
        <?php echo $css; ?>
    </style>
    <script>
        window.addEventListener('load', function() {
            const printBtn = document.getElementById('print-btn-action');
            if (printBtn) {
                printBtn.addEventListener('click', function() {
                    document.getElementById('print-instructions-div').style.display = 'none'; // 隐藏提示
                    window.print();
                    // 可选：打印后重新显示提示
                    // setTimeout(() => { document.getElementById('print-instructions-div').style.display = 'block'; }, 1000);
                });
            }
            // 可选：自动弹出打印对话框 (某些浏览器可能阻止)
            // setTimeout(() => { window.print(); }, 500);
        });
    </script>
</head>
<body>
    <div id="print-instructions-div" class="no-print print-instructions">
        <h3>📄 简历HTML版本 (备用方案)</h3>
        <p>请使用浏览器的打印功能将此页面保存为PDF：</p>
        <ol>
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
        <?php echo $htmlContent; // 这是从前端传来的简历HTML ?>
    </div>
</body>
</html>
<?php
exit;
?>

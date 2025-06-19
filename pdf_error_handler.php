<?php
// 错误日志记录
function logPDFError($error, $context = []) {
    $logFile = __DIR__ . '/logs/pdf_errors.log';
    $logDir = dirname($logFile);
    
    if (!file_exists($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[{$timestamp}] PDF Error: {$error}\n";
    
    if (!empty($context)) {
        $logEntry .= "Context: " . json_encode($context) . "\n";
    }
    
    $logEntry .= "---\n";
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// 检查系统要求
function checkSystemRequirements() {
    $requirements = [
        'php_version' => version_compare(PHP_VERSION, '7.4.0', '>='),
        'mbstring' => extension_loaded('mbstring'),
        'gd' => extension_loaded('gd'),
        'dom' => extension_loaded('dom'),
        'libxml' => extension_loaded('libxml')
    ];
    
    return $requirements;
}
?>

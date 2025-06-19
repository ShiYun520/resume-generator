<?php
session_start();
require_once '../includes/config.php';
require_once '../includes/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => '方法不允许']);
    exit;
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // 获取POST数据
    $data = json_decode(file_get_contents('php://input'), true);
    
    // 验证必要字段
    if (empty($data['name']) || empty($data['title'])) {
        throw new Exception('姓名和职位不能为空');
    }
    
    // 处理技能数组
    $skills = isset($data['skills']) ? json_encode($data['skills']) : '[]';
    
    // 处理工作经历
    $work_experience = isset($data['work_experience']) ? json_encode($data['work_experience']) : '[]';
    
    // 处理项目经验
    $projects = isset($data['projects']) ? json_encode($data['projects']) : '[]';
    
    // 处理教育背景
    $education = isset($data['education']) ? json_encode($data['education']) : '{}';
    
    // 插入或更新数据
    $sql = "INSERT INTO resumes (name, title, phone, email, github, location, skills, education, work_experience, projects, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            phone = VALUES(phone),
            email = VALUES(email),
            github = VALUES(github),
            location = VALUES(location),
            skills = VALUES(skills),
            education = VALUES(education),
            work_experience = VALUES(work_experience),
            projects = VALUES(projects),
            updated_at = NOW()";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $data['name'],
        $data['title'],
        $data['phone'] ?? '',
        $data['email'] ?? '',
        $data['github'] ?? '',
        $data['location'] ?? '',
        $skills,
        $education,
        $work_experience,
        $projects
    ]);
    
    echo json_encode(['success' => true, 'message' => '简历保存成功']);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => '方法不允许']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        throw new Exception('无效的数据');
    }
    
    // 生成HTML
    $html = generateResumeHTML($data);
    
    echo json_encode(['success' => true, 'html' => $html]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function generateResumeHTML($data) {
    $name = htmlspecialchars($data['name'] ?? '');
    $title = htmlspecialchars($data['title'] ?? '');
    $phone = htmlspecialchars($data['phone'] ?? '');
    $email = htmlspecialchars($data['email'] ?? '');
    $location = htmlspecialchars($data['location'] ?? '');
    
    $html = '
    <div class="resume-content">
        <div class="resume-header">
            <h1 class="name">' . $name . '</h1>
            <div class="title">' . $title . '</div>
            <div class="contact-info">';
    
    if ($phone) $html .= '<span>' . $phone . '</span>';
    if ($email) $html .= '<span>' . $email . '</span>';
    if ($location) $html .= '<span>' . $location . '</span>';
    
    $html .= '
            </div>
        </div>
        
        <div class="resume-body">
            <div class="left-column">
                <section class="skills-section">
                    <h2>技能</h2>';
    
    // 技能部分
    if (!empty($data['skills'])) {
        foreach ($data['skills'] as $skill) {
            if (!empty($skill)) {
                $html .= '<div class="skill-item">' . htmlspecialchars($skill) . '</div>';
            }
        }
    }
    
    $html .= '
                </section>
            </div>
            
            <div class="right-column">
                <section class="work-section">
                    <h2>工作经历</h2>';
    
    // 工作经历部分
    if (!empty($data['work_experience'])) {
        foreach ($data['work_experience'] as $work) {
            if (!empty($work['company'])) {
                $html .= '
                    <div class="work-item">
                        <div class="work-header">
                            <div class="company">' . htmlspecialchars($work['company']) . '</div>
                            <div class="position">' . htmlspecialchars($work['position'] ?? '') . '</div>
                            <div class="duration">' . htmlspecialchars($work['duration'] ?? '') . '</div>
                        </div>
                        <div class="work-description">' . nl2br(htmlspecialchars($work['description'] ?? '')) . '</div>
                    </div>';
            }
        }
    }
    
    $html .= '
                </section>
                
                <section class="projects-section">
                    <h2>项目经验</h2>';
    
    // 项目经验部分
    if (!empty($data['projects'])) {
        foreach ($data['projects'] as $project) {
            if (!empty($project['name'])) {
                $html .= '
                    <div class="project-item">
                        <div class="project-header">
                            <div class="project-name">' . htmlspecialchars($project['name']) . '</div>
                            <div class="project-duration">' . htmlspecialchars($project['duration'] ?? '') . '</div>
                        </div>
                        <div class="project-description">' . nl2br(htmlspecialchars($project['description'] ?? '')) . '</div>';
                
                if (!empty($project['tech'])) {
                    $html .= '<div class="project-tech"><small>技术栈: ' . htmlspecialchars($project['tech']) . '</small></div>';
                }
                
                $html .= '</div>';
            }
        }
    }
    
    $html .= '
                </section>
            </div>
        </div>
    </div>';
    
    return $html;
}
?>

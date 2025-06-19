<?php
// ajax/render_template.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// 错误处理
error_reporting(E_ALL);
ini_set('display_errors', 0); // 不直接输出错误，通过JSON返回

// 输出缓冲，防止意外输出影响JSON
ob_start();

try {
    // 检查请求方法
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('只允许 POST 请求');
    }

    // 获取POST数据
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('无效的 JSON 数据: ' . json_last_error_msg());
    }

    // 验证必需参数
    if (!isset($data['template'])) {
        $data['template'] = 'classic'; // 默认模板
    }

    if (!isset($data['data'])) {
        $data['data'] = []; // 默认空数据
    }

    $template = $data['template'];
    $resumeData = $data['data'];

    // 清理输出缓冲区
    ob_clean();

    // 生成简历HTML
    $html = generateResumeHTML($template, $resumeData);

    // 返回成功响应
    echo json_encode([
        'success' => true,
        'html' => $html,
        'template' => $template,
        'message' => '模板渲染成功'
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    // 清理输出缓冲区
    ob_clean();
    
    // 返回错误响应
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'template' => isset($template) ? $template : 'unknown',
        'message' => '模板渲染失败'
    ], JSON_UNESCAPED_UNICODE);
}

// 确保缓冲区清理
ob_end_clean();
exit;

/**
 * 生成简历HTML
 */
function generateResumeHTML($template, $data) {
    // 默认数据
    $defaultData = [
        'name' => '请输入姓名',
        'title' => '求职岗位',
        'tagline' => '',
        'phone' => '',
        'email' => '',
        'github' => '',
        'location' => '',
        'avatar' => 'https://www.qmjianli.com/images/edit/man.png',
        'skills' => [],
        'education' => [],
        'work_experience' => [],
        'projects' => [],
        'more_info' => []
    ];

    // 合并数据
    $data = array_merge($defaultData, $data);

    // 根据模板类型生成HTML
    switch ($template) {
        case 'modern':
            return generateModernTemplate($data);
        case 'creative':
            return generateCreativeTemplate($data);
        case 'classic':
        default:
            return generateClassicTemplate($data);
    }
}

/**
 * 经典模板
 */
function generateClassicTemplate($data) {
    $html = '<div class="resume-classic" style="font-family: \'Microsoft YaHei\', sans-serif; line-height: 1.6; color: #333;">';
    
    // 头部区域
    $html .= '<div class="resume-header" style="background: var(--theme-gradient); color: white; padding: 30px; text-align: center; margin-bottom: 0;">';
    $html .= '<div style="display: flex; align-items: center; justify-content: center; gap: 30px; flex-wrap: wrap;">';
    
    // 头像
    if (!empty($data['avatar'])) {
        $html .= '<div class="avatar" style="flex-shrink: 0;">';
        $html .= '<img src="' . htmlspecialchars($data['avatar']) . '" alt="头像" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.3); object-fit: cover;">';
        $html .= '</div>';
    }
    
    // 基本信息
    $html .= '<div class="basic-info" style="text-align: left; color: white;">';
    $html .= '<h1 class="resume-name" style="margin: 0 0 10px 0; font-size: 2.5em; font-weight: 700; color: white;">' . htmlspecialchars($data['name']) . '</h1>';
    
    if (!empty($data['title'])) {
        $html .= '<h2 class="resume-title" style="margin: 0 0 15px 0; font-size: 1.3em; font-weight: 400; color: rgba(255,255,255,0.9);">' . htmlspecialchars($data['title']) . '</h2>';
    }
    
    if (!empty($data['tagline'])) {
        $html .= '<p class="resume-tagline" style="margin: 0 0 20px 0; font-size: 1.1em; color: rgba(255,255,255,0.8); font-style: italic;">' . htmlspecialchars($data['tagline']) . '</p>';
    }
    
    // 联系信息
    $html .= '<div class="contact-info" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; color: rgba(255,255,255,0.9);">';
    
    if (!empty($data['phone'])) {
        $html .= '<div><i class="fas fa-phone" style="width: 20px; color: rgba(255,255,255,0.8);"></i> ' . htmlspecialchars($data['phone']) . '</div>';
    }
    if (!empty($data['email'])) {
        $html .= '<div><i class="fas fa-envelope" style="width: 20px; color: rgba(255,255,255,0.8);"></i> ' . htmlspecialchars($data['email']) . '</div>';
    }
    if (!empty($data['github'])) {
        $html .= '<div><i class="fas fa-globe" style="width: 20px; color: rgba(255,255,255,0.8);"></i> ' . htmlspecialchars($data['github']) . '</div>';
    }
    if (!empty($data['location'])) {
        $html .= '<div><i class="fas fa-map-marker-alt" style="width: 20px; color: rgba(255,255,255,0.8);"></i> ' . htmlspecialchars($data['location']) . '</div>';
    }
    
    $html .= '</div></div></div></div>';

    // 内容区域
    $html .= '<div class="resume-content" style="padding: 40px; background: white;">';
    
    // 技能部分
    if (!empty($data['skills'])) {
        $html .= generateSkillsSection($data['skills']);
    }
    
    // 工作经历
    if (!empty($data['work_experience'])) {
        $html .= generateWorkSection($data['work_experience']);
    }
    
    // 项目经验
    if (!empty($data['projects'])) {
        $html .= generateProjectsSection($data['projects']);
    }
    
    // 教育背景
    if (!empty($data['education'])) {
        $html .= generateEducationSection($data['education']);
    }
    
    // 更多信息
    if (!empty($data['more_info'])) {
        $html .= generateMoreInfoSection($data['more_info']);
    }
    
    $html .= '</div></div>';
    
    return $html;
}

/**
 * 现代模板
 */
function generateModernTemplate($data) {
    $html = '<div class="resume-modern" style="font-family: \'Microsoft YaHei\', sans-serif; line-height: 1.6; color: #333; background: #f8f9fa;">';
    
    // 头部区域 - 现代风格
    $html .= '<div class="resume-header" style="background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary)); color: white; padding: 40px; border-radius: 0 0 30px 30px; margin-bottom: 30px;">';
    $html .= '<div class="container" style="max-width: 1000px; margin: 0 auto;">';
    $html .= '<div style="display: grid; grid-template-columns: auto 1fr; gap: 30px; align-items: center;">';
    
    // 头像
    if (!empty($data['avatar'])) {
        $html .= '<div class="avatar">';
        $html .= '<img src="' . htmlspecialchars($data['avatar']) . '" alt="头像" style="width: 100px; height: 100px; border-radius: 20px; border: 3px solid rgba(255,255,255,0.3); object-fit: cover;">';
        $html .= '</div>';
    }
    
    // 基本信息
    $html .= '<div class="basic-info">';
    $html .= '<h1 style="margin: 0 0 8px 0; font-size: 2.2em; font-weight: 600;">' . htmlspecialchars($data['name']) . '</h1>';
    
    if (!empty($data['title'])) {
        $html .= '<h2 style="margin: 0 0 12px 0; font-size: 1.2em; font-weight: 400; opacity: 0.9;">' . htmlspecialchars($data['title']) . '</h2>';
    }
    
    if (!empty($data['tagline'])) {
        $html .= '<p style="margin: 0 0 15px 0; opacity: 0.8;">' . htmlspecialchars($data['tagline']) . '</p>';
    }
    
    // 联系信息 - 横向布局
    $html .= '<div style="display: flex; flex-wrap: wrap; gap: 20px; font-size: 0.9em;">';
    if (!empty($data['phone'])) {
        $html .= '<span><i class="fas fa-phone"></i> ' . htmlspecialchars($data['phone']) . '</span>';
    }
    if (!empty($data['email'])) {
        $html .= '<span><i class="fas fa-envelope"></i> ' . htmlspecialchars($data['email']) . '</span>';
    }
    if (!empty($data['location'])) {
        $html .= '<span><i class="fas fa-map-marker-alt"></i> ' . htmlspecialchars($data['location']) . '</span>';
    }
    $html .= '</div>';
    
    $html .= '</div></div></div></div>';

    // 内容区域 - 卡片式布局
    $html .= '<div class="resume-content" style="padding: 0 40px 40px; display: grid; gap: 30px;">';
    
    // 使用卡片样式包装每个部分
    if (!empty($data['skills'])) {
        $html .= '<div class="card" style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">';
        $html .= generateSkillsSection($data['skills']);
        $html .= '</div>';
    }
    
    if (!empty($data['work_experience'])) {
        $html .= '<div class="card" style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">';
        $html .= generateWorkSection($data['work_experience']);
        $html .= '</div>';
    }
    
    if (!empty($data['projects'])) {
        $html .= '<div class="card" style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">';
        $html .= generateProjectsSection($data['projects']);
        $html .= '</div>';
    }
    
    if (!empty($data['education'])) {
        $html .= '<div class="card" style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">';
        $html .= generateEducationSection($data['education']);
        $html .= '</div>';
    }
    
    if (!empty($data['more_info'])) {
        $html .= '<div class="card" style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">';
        $html .= generateMoreInfoSection($data['more_info']);
        $html .= '</div>';
    }
    
    $html .= '</div></div>';
    
    return $html;
}

/**
 * 创意模板
 */
function generateCreativeTemplate($data) {
    $html = '<div class="resume-creative" style="font-family: \'Microsoft YaHei\', sans-serif; line-height: 1.6; color: #333; display: grid; grid-template-columns: 300px 1fr; min-height: 100vh;">';
    
    // 左侧边栏
    $html .= '<div class="sidebar" style="background: var(--theme-gradient); color: white; padding: 40px 30px;">';
    
    // 头像和基本信息
    if (!empty($data['avatar'])) {
        $html .= '<div class="avatar" style="text-align: center; margin-bottom: 30px;">';
        $html .= '<img src="' . htmlspecialchars($data['avatar']) . '" alt="头像" style="width: 150px; height: 150px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.3); object-fit: cover;">';
        $html .= '</div>';
    }
    
    $html .= '<div class="basic-info" style="text-align: center; margin-bottom: 40px;">';
    $html .= '<h1 style="margin: 0 0 10px 0; font-size: 1.8em; font-weight: 600;">' . htmlspecialchars($data['name']) . '</h1>';
    
    if (!empty($data['title'])) {
        $html .= '<h2 style="margin: 0 0 15px 0; font-size: 1.1em; font-weight: 400; opacity: 0.9;">' . htmlspecialchars($data['title']) . '</h2>';
    }
    
    if (!empty($data['tagline'])) {
        $html .= '<p style="margin: 0; font-size: 0.9em; opacity: 0.8; font-style: italic;">' . htmlspecialchars($data['tagline']) . '</p>';
    }
    $html .= '</div>';
    
    // 联系信息
    $html .= '<div class="contact-section" style="margin-bottom: 40px;">';
    $html .= '<h3 style="margin: 0 0 20px 0; font-size: 1.2em; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 10px;">联系方式</h3>';
    
    if (!empty($data['phone'])) {
        $html .= '<div style="margin-bottom: 10px; font-size: 0.9em;"><i class="fas fa-phone" style="width: 20px;"></i> ' . htmlspecialchars($data['phone']) . '</div>';
    }
    if (!empty($data['email'])) {
        $html .= '<div style="margin-bottom: 10px; font-size: 0.9em;"><i class="fas fa-envelope" style="width: 20px;"></i> ' . htmlspecialchars($data['email']) . '</div>';
    }
    if (!empty($data['github'])) {
        $html .= '<div style="margin-bottom: 10px; font-size: 0.9em;"><i class="fas fa-globe" style="width: 20px;"></i> ' . htmlspecialchars($data['github']) . '</div>';
    }
    if (!empty($data['location'])) {
        $html .= '<div style="margin-bottom: 10px; font-size: 0.9em;"><i class="fas fa-map-marker-alt" style="width: 20px;"></i> ' . htmlspecialchars($data['location']) . '</div>';
    }
    $html .= '</div>';
    
    // 技能部分 - 侧边栏版本
    if (!empty($data['skills'])) {
        $html .= '<div class="skills-section">';
        $html .= '<h3 style="margin: 0 0 20px 0; font-size: 1.2em; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 10px;">专业技能</h3>';
        foreach ($data['skills'] as $skill) {
            $html .= '<div style="margin-bottom: 15px;">';
            $html .= '<div style="font-size: 0.9em; margin-bottom: 5px;">' . htmlspecialchars($skill['name']) . '</div>';
            $html .= '<div style="background: rgba(255,255,255,0.2); height: 6px; border-radius: 3px;">';
            $rating = isset($skill['rating']) ? (int)$skill['rating'] : 5;
            $percentage = ($rating / 5) * 100;
            $html .= '<div style="background: rgba(255,255,255,0.8); height: 100%; width: ' . $percentage . '%; border-radius: 3px;"></div>';
            $html .= '</div></div>';
        }
        $html .= '</div>';
    }
    
    $html .= '</div>';
    
    // 右侧主要内容
    $html .= '<div class="main-content" style="padding: 40px; background: white;">';
    
    if (!empty($data['work_experience'])) {
        $html .= generateWorkSection($data['work_experience']);
    }
    
    if (!empty($data['projects'])) {
        $html .= generateProjectsSection($data['projects']);
    }
    
    if (!empty($data['education'])) {
        $html .= generateEducationSection($data['education']);
    }
    
    if (!empty($data['more_info'])) {
        $html .= generateMoreInfoSection($data['more_info']);
    }
    
    $html .= '</div>';
    $html .= '</div>';
    
    return $html;
}

/**
 * 生成技能部分
 */
function generateSkillsSection($skills) {
    $html = '<div class="skills-section" style="margin-bottom: 40px;">';
    $html .= '<h3 class="section-title" style="font-size: 1.5em; margin: 0 0 25px 0; color: var(--theme-primary); border-bottom: 2px solid var(--theme-primary); padding-bottom: 10px; font-weight: 600;">专业技能</h3>';
    $html .= '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">';
    
    foreach ($skills as $skill) {
        $html .= '<div class="skill-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--theme-primary);">';
        $html .= '<span class="skill-name" style="font-weight: 500; color: var(--theme-primary);">' . htmlspecialchars($skill['name']) . '</span>';
        
        // 星级评分
        $html .= '<div class="skill-rating" style="display: flex; gap: 2px;">';
        $rating = isset($skill['rating']) ? (int)$skill['rating'] : 5;
        for ($i = 1; $i <= 5; $i++) {
            $class = $i <= $rating ? 'active' : '';
            $color = $i <= $rating ? 'var(--theme-accent)' : '#ddd';
            $html .= '<span class="star ' . $class . '" style="color: ' . $color . '; font-size: 14px;">★</span>';
        }
        $html .= '</div></div>';
    }
    
    $html .= '</div></div>';
    return $html;
}

/**
 * 生成工作经历部分
 */
function generateWorkSection($workExperience) {
    $html = '<div class="work-section" style="margin-bottom: 40px;">';
    $html .= '<h3 class="section-title" style="font-size: 1.5em; margin: 0 0 25px 0; color: var(--theme-primary); border-bottom: 2px solid var(--theme-primary); padding-bottom: 10px; font-weight: 600;">工作经历</h3>';
    
    foreach ($workExperience as $work) {
        $html .= '<div class="work-item" style="margin-bottom: 30px; padding: 20px; border-left: 4px solid var(--theme-primary); background: #f8f9fa; border-radius: 8px;">';
        $html .= '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">';
        $html .= '<div>';
        $html .= '<h4 class="work-company" style="margin: 0 0 5px 0; color: var(--theme-primary); font-weight: 600; font-size: 1.2em;">' . htmlspecialchars($work['company']) . '</h4>';
        $html .= '<p class="work-position" style="margin: 0; color: var(--theme-secondary); font-weight: 500;">' . htmlspecialchars($work['position']) . '</p>';
        $html .= '</div>';
        $html .= '<span style="color: #666; font-size: 0.9em; background: white; padding: 5px 10px; border-radius: 4px;">' . htmlspecialchars($work['duration']) . '</span>';
        $html .= '</div>';
        
        if (!empty($work['description'])) {
            $html .= '<div style="margin-top: 15px; line-height: 1.6;">';
            $html .= '<p style="margin: 0; white-space: pre-line;">' . htmlspecialchars($work['description']) . '</p>';
            $html .= '</div>';
        }
        $html .= '</div>';
    }
    
    $html .= '</div>';
    return $html;
}

/**
 * 生成项目经验部分
 */
function generateProjectsSection($projects) {
    $html = '<div class="projects-section" style="margin-bottom: 40px;">';
    $html .= '<h3 class="section-title" style="font-size: 1.5em; margin: 0 0 25px 0; color: var(--theme-primary); border-bottom: 2px solid var(--theme-primary); padding-bottom: 10px; font-weight: 600;">项目经验</h3>';
    
    foreach ($projects as $project) {
        $html .= '<div class="project-item" style="margin-bottom: 30px; padding: 20px; border-left: 4px solid var(--theme-primary); background: #f8f9fa; border-radius: 8px;">';
        $html .= '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">';
        $html .= '<div>';
        $html .= '<h4 class="project-name" style="margin: 0 0 5px 0; color: var(--theme-primary); font-weight: 600; font-size: 1.2em;">' . htmlspecialchars($project['name']) . '</h4>';
        
        if (!empty($project['tech'])) {
            $html .= '<p class="project-tech" style="margin: 0; color: var(--theme-secondary); font-weight: 500;">' . htmlspecialchars($project['tech']) . '</p>';
        }
        $html .= '</div>';
        $html .= '<span style="color: #666; font-size: 0.9em; background: white; padding: 5px 10px; border-radius: 4px;">' . htmlspecialchars($project['duration']) . '</span>';
        $html .= '</div>';
        
        if (!empty($project['description'])) {
            $html .= '<div style="margin-top: 15px; line-height: 1.6;">';
            $html .= '<p style="margin: 0; white-space: pre-line;">' . htmlspecialchars($project['description']) . '</p>';
            $html .= '</div>';
        }
        $html .= '</div>';
    }
    
    $html .= '</div>';
    return $html;
}

/**
 * 生成教育背景部分
 */
function generateEducationSection($education) {
    $html = '<div class="education-section" style="margin-bottom: 40px;">';
    $html .= '<h3 class="section-title" style="font-size: 1.5em; margin: 0 0 25px 0; color: var(--theme-primary); border-bottom: 2px solid var(--theme-primary); padding-bottom: 10px; font-weight: 600;">教育背景</h3>';
    
    foreach ($education as $edu) {
        $html .= '<div class="education-item" style="margin-bottom: 20px; padding: 20px; border-left: 4px solid var(--theme-primary); background: #f8f9fa; border-radius: 8px;">';
        $html .= '<div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">';
        $html .= '<div>';
        $html .= '<h4 class="education-school" style="margin: 0 0 5px 0; color: var(--theme-primary); font-weight: 600; font-size: 1.2em;">' . htmlspecialchars($edu['school']) . '</h4>';
        $html .= '<p class="education-major" style="margin: 0; color: var(--theme-secondary); font-weight: 500;">' . htmlspecialchars($edu['major']);
        
        if (!empty($edu['degree'])) {
            $html .= ' | ' . htmlspecialchars($edu['degree']);
        }
        $html .= '</p>';
        $html .= '</div>';
        $html .= '<span style="color: #666; font-size: 0.9em; background: white; padding: 5px 10px; border-radius: 4px;">' . htmlspecialchars($edu['duration']) . '</span>';
        $html .= '</div>';
        $html .= '</div>';
    }
    
    $html .= '</div>';
    return $html;
}

/**
 * 生成更多信息部分
 */
function generateMoreInfoSection($moreInfo) {
    $html = '<div class="more-info-section" style="margin-bottom: 20px;">';
    $html .= '<h3 class="section-title" style="font-size: 1.5em; margin: 0 0 25px 0; color: var(--theme-primary); border-bottom: 2px solid var(--theme-primary); padding-bottom: 10px; font-weight: 600;">更多信息</h3>';
    $html .= '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">';
    
    foreach ($moreInfo as $info) {
        $html .= '<div style="padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--theme-primary);">';
        $html .= '<div style="display: flex; justify-content: space-between; align-items: center;">';
        $html .= '<span class="more-info-title" style="font-weight: 500; color: var(--theme-primary);">' . htmlspecialchars($info['title']) . '</span>';
        if (!empty($info['time'])) {
            $html .= '<span style="color: #666; font-size: 0.9em;">' . htmlspecialchars($info['time']) . '</span>';
        }
        $html .= '</div>';
        $html .= '</div>';
    }
    
    $html .= '</div></div>';
    return $html;
}
?>

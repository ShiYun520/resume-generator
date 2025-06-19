<?php
// 现代简约模板
function renderModernTemplate($data) {
    $escapeHtml = function($text) {
        return htmlspecialchars($text ?? '', ENT_QUOTES, 'UTF-8');
    };
    
    $avatarSrc = !empty($data['avatar']) ? $data['avatar'] : 'https://www.qmjianli.com/images/edit/man.png';
    
    $html = '
        <div class="modern-resume" style="font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px;">
            <div class="modern-header" style="background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary)); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                <div class="header-content" style="display: flex; align-items: center; gap: 30px;">
                    <div class="avatar-section">
                        <img src="' . $avatarSrc . '" alt="头像" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; object-fit: cover;">
                    </div>
                    <div class="info-section" style="flex: 1;">
                        <h1 style="margin: 0 0 10px 0; font-size: 2.5em; font-weight: 300;">' . $escapeHtml($data['name']) . '</h1>
                        <h2 style="margin: 0 0 15px 0; font-size: 1.3em; opacity: 0.9;">' . $escapeHtml($data['title']) . '</h2>';
    
    if (!empty($data['tagline'])) {
        $html .= '<p style="margin: 0 0 20px 0; font-size: 1.1em; opacity: 0.8; line-height: 1.4;">' . $escapeHtml($data['tagline']) . '</p>';
    }
    
    $html .= '
                        <div class="contact-info">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">';
    
    if (!empty($data['phone'])) {
        $html .= '<div style="font-size: 0.9em;"><i class="fas fa-phone" style="margin-right: 8px;"></i> ' . $escapeHtml($data['phone']) . '</div>';
    }
    if (!empty($data['email'])) {
        $html .= '<div style="font-size: 0.9em;"><i class="fas fa-envelope" style="margin-right: 8px;"></i> ' . $escapeHtml($data['email']) . '</div>';
    }
    if (!empty($data['github'])) {
        $html .= '<div style="font-size: 0.9em;"><i class="fab fa-github" style="margin-right: 8px;"></i> ' . $escapeHtml($data['github']) . '</div>';
    }
    if (!empty($data['location'])) {
        $html .= '<div style="font-size: 0.9em;"><i class="fas fa-map-marker-alt" style="margin-right: 8px;"></i> ' . $escapeHtml($data['location']) . '</div>';
    }
    
    $html .= '
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modern-content" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">';
    
    // 技能部分 - 现代风格
    if (!empty($data['skills']) && is_array($data['skills'])) {
        $html .= '
                <section class="modern-section" style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h3 style="color: var(--theme-primary); border-bottom: 2px solid var(--theme-primary); padding-bottom: 10px; margin-bottom: 20px;">技能特长</h3>
                    <div class="skills-grid" style="display: grid; gap: 15px;">';
        
        foreach ($data['skills'] as $skill) {
            if (!empty($skill['name'])) {
                $ratingPercent = (intval($skill['rating'] ?? 5) * 20);
                $html .= '
                            <div class="skill-item">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span style="font-weight: 500;">' . $escapeHtml($skill['name']) . '</span>
                                    <span style="color: var(--theme-primary); font-weight: bold;">' . $ratingPercent . '%</span>
                                </div>
                                <div style="background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: linear-gradient(90deg, var(--theme-primary), var(--theme-secondary)); height: 100%; width: ' . $ratingPercent . '%; border-radius: 4px; transition: width 0.3s ease;"></div>
                                </div>
                            </div>';
            }
        }
        
        $html .= '
                    </div>
                </section>';
    }
    
    // 教育背景 - 现代风格
    if (!empty($data['education']) && is_array($data['education'])) {
        $html .= '
                <section class="modern-section" style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h3 style="color: var(--theme-primary); border-bottom: 2px solid var(--theme-primary); padding-bottom: 10px; margin-bottom: 20px;">教育背景</h3>';
        
        foreach ($data['education'] as $edu) {
            if (!empty($edu['school']) || !empty($edu['major'])) {
                $html .= '
                        <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--theme-primary);">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                <h4 style="margin: 0; color: var(--theme-primary); font-size: 1.1em;">' . $escapeHtml($edu['school'] ?? '') . '</h4>
                                <span style="background: var(--theme-primary); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">' . $escapeHtml($edu['duration'] ?? '') . '</span>
                            </div>
                            <p style="margin: 0; color: #666;">' . $escapeHtml($edu['major'] ?? '') . (!empty($edu['degree']) ? ' - ' . $escapeHtml($edu['degree']) : '') . '</p>
                        </div>';
            }
        }
        
        $html .= '
                </section>';
    }
    
    $html .= '
            </div>';
    
    // 工作经历和项目经验 - 全宽显示
    if (!empty($data['work_experience']) && is_array($data['work_experience'])) {
        $html .= '
            <section class="modern-section" style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 20px;">
                <h3 style="color: var(--theme-primary); border-bottom: 2px solid var(--theme-primary); padding-bottom: 10px; margin-bottom: 20px;">工作经验</h3>';
        
        foreach ($data['work_experience'] as $work) {
            if (!empty($work['company']) || !empty($work['position'])) {
                $html .= '
                        <div style="margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--theme-secondary);">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                                <div>
                                    <h4 style="margin: 0 0 5px 0; color: var(--theme-primary);">' . $escapeHtml($work['company'] ?? '') . '</h4>
                                    <p style="margin: 0; color: var(--theme-secondary); font-weight: 500;">' . $escapeHtml($work['position'] ?? '') . '</p>
                                </div>
                                <span style="background: var(--theme-secondary); color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.9em;">' . $escapeHtml($work['duration'] ?? '') . '</span>
                            </div>';
                
                if (!empty($work['description'])) {
                    $descriptionLines = explode("\n", $work['description']);
                    $html .= '<div style="margin-top: 15px;">';
                    foreach ($descriptionLines as $line) {
                        if (trim($line)) {
                            $html .= '<p style="margin: 5px 0; color: #555; line-height: 1.6;">• ' . $escapeHtml($line) . '</p>';
                        }
                    }
                    $html .= '</div>';
                }
                
                $html .= '</div>';
            }
        }
        
        $html .= '
            </section>';
    }
    
    $html .= '
        </div>';
    
    return $html;
}
?>

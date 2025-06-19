<?php
// 创意设计模板
function renderCreativeTemplate($data) {
    $escapeHtml = function($text) {
        return htmlspecialchars($text ?? '', ENT_QUOTES, 'UTF-8');
    };
    
    $avatarSrc = !empty($data['avatar']) ? $data['avatar'] : 'https://www.qmjianli.com/images/edit/man.png';
    
    $html = '
        <div class="creative-resume" style="display: flex; min-height: 600px; font-family: Arial, sans-serif; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div class="creative-sidebar" style="width: 300px; background: linear-gradient(180deg, var(--theme-primary), var(--theme-secondary)); color: white; padding: 30px 25px;">
                <div class="sidebar-content">
                    <div class="profile-section" style="text-align: center; margin-bottom: 30px;">
                        <div class="creative-avatar" style="margin-bottom: 20px;">
                            <img src="' . $avatarSrc . '" alt="头像" style="width: 150px; height: 150px; border-radius: 50%; border: 5px solid rgba(255,255,255,0.3); object-fit: cover;">
                        </div>
                        <h1 style="margin: 0 0 10px 0; font-size: 1.8em; font-weight: 300;">' . $escapeHtml($data['name']) . '</h1>
                        <h2 style="margin: 0; font-size: 1em; opacity: 0.9; font-weight: 400;">' . $escapeHtml($data['title']) . '</h2>
                    </div>
                    
                    <div class="contact-section" style="margin-bottom: 30px;">
                        <h3 style="font-size: 1.1em; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid rgba(255,255,255,0.3);">联系方式</h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">';
    
    if (!empty($data['phone'])) {
        $html .= '<li style="margin-bottom: 10px; font-size: 0.9em;"><i class="fas fa-phone" style="width: 20px; margin-right: 10px;"></i> ' . $escapeHtml($data['phone']) . '</li>';
    }
    if (!empty($data['email'])) {
        $html .= '<li style="margin-bottom: 10px; font-size: 0.9em;"><i class="fas fa-envelope" style="width: 20px; margin-right: 10px;"></i> ' . $escapeHtml($data['email']) . '</li>';
    }
    if (!empty($data['github'])) {
        $html .= '<li style="margin-bottom: 10px; font-size: 0.9em;"><i class="fab fa-github" style="width: 20px; margin-right: 10px;"></i> ' . $escapeHtml($data['github']) . '</li>';
    }
    if (!empty($data['location'])) {
        $html .= '<li style="margin-bottom: 10px; font-size: 0.9em;"><i class="fas fa-map-marker-alt" style="width: 20px; margin-right: 10px;"></i> ' . $escapeHtml($data['location']) . '</li>';
    }
    
    $html .= '
                        </ul>
                    </div>';
    
    // 技能部分 - 创意风格
    if (!empty($data['skills']) && is_array($data['skills'])) {
        $html .= '
                    <div class="skills-section">
                        <h3 style="font-size: 1.1em; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid rgba(255,255,255,0.3);">技能专长</h3>
                        <div class="creative-skills">';
        
        foreach ($data['skills'] as $skill) {
            if (!empty($skill['name'])) {
                $ratingPercent = (intval($skill['rating'] ?? 5) * 20);
                $html .= '
                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span style="font-size: 0.9em;">' . $escapeHtml($skill['name']) . '</span>
                                    <span style="font-size: 0.8em; opacity: 0.8;">' . $ratingPercent . '%</span>
                                </div>
                                <div style="background: rgba(255,255,255,0.2); height: 6px; border-radius: 3px; overflow: hidden;">
                                    <div style="background: white; height: 100%; width: ' . $ratingPercent . '%; border-radius: 3px;"></div>
                                </div>
                            </div>';
            }
        }
        
        $html .= '
                        </div>
                    </div>';
    }
    
    $html .= '
                </div>
            </div>
            
            <div class="creative-main" style="flex: 1; padding: 30px;">
                <div class="main-content">';
    
    if (!empty($data['tagline'])) {
        $html .= '
                    <section style="margin-bottom: 30px;">
                        <h3 style="color: var(--theme-primary); font-size: 1.3em; margin-bottom: 15px; position: relative; padding-left: 20px;">
                            <span style="position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: var(--theme-primary); border-radius: 2px;"></span>
                            个人简介
                        </h3>
                        <p style="line-height: 1.6; color: #555; font-size: 1em; margin: 0;">' . $escapeHtml($data['tagline']) . '</p>
                    </section>';
    }
    
    // 工作经历
    if (!empty($data['work_experience']) && is_array($data['work_experience'])) {
        $html .= '
                    <section style="margin-bottom: 30px;">
                        <h3 style="color: var(--theme-primary); font-size: 1.3em; margin-bottom: 20px; position: relative; padding-left: 20px;">
                            <span style="position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: var(--theme-primary); border-radius: 2px;"></span>
                            工作经验
                        </h3>';
        
        foreach ($data['work_experience'] as $index => $work) {
            if (!empty($work['company']) || !empty($work['position'])) {
                $isLast = $index === count($data['work_experience']) - 1;
                $html .= '
                        <div style="position: relative; padding-left: 25px; margin-bottom: ' . ($isLast ? '0' : '25px') . ';">
                            <div style="position: absolute; left: 0; top: 8px; width: 12px; height: 12px; background: var(--theme-secondary); border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px var(--theme-secondary);"></div>';
                
                if (!$isLast) {
                    $html .= '<div style="position: absolute; left: 5px; top: 20px; width: 2px; height: calc(100% + 5px); background: #e9ecef;"></div>';
                }
                
                $html .= '
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 3px solid var(--theme-secondary);">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                    <div>
                                        <h4 style="margin: 0 0 3px 0; color: var(--theme-primary); font-size: 1.1em;">' . $escapeHtml($work['company'] ?? '') . '</h4>
                                        <p style="margin: 0; color: var(--theme-secondary); font-weight: 500;">' . $escapeHtml($work['position'] ?? '') . '</p>
                                    </div>
                                    <span style="background: var(--theme-primary); color: white; padding: 3px 10px; border-radius: 15px; font-size: 0.8em; white-space: nowrap;">' . $escapeHtml($work['duration'] ?? '') . '</span>
                                </div>';
                
                if (!empty($work['description'])) {
                    $descriptionLines = explode("\n", $work['description']);
                    $html .= '<div style="margin-top: 10px; font-size: 0.9em; color: #666;">';
                    foreach ($descriptionLines as $line) {
                        if (trim($line)) {
                            $html .= '<p style="margin: 3px 0; line-height: 1.5;">• ' . $escapeHtml($line) . '</p>';
                        }
                    }
                    $html .= '</div>';
                }
                
                $html .= '
                            </div>
                        </div>';
            }
        }
        
        $html .= '
                    </section>';
    }
    
    // 项目经验
    if (!empty($data['projects']) && is_array($data['projects'])) {
        $html .= '
                    <section>
                        <h3 style="color: var(--theme-primary); font-size: 1.3em; margin-bottom: 20px; position: relative; padding-left: 20px;">
                            <span style="position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: var(--theme-primary); border-radius: 2px;"></span>
                            项目经验
                        </h3>';
        
        foreach ($data['projects'] as $project) {
            if (!empty($project['name'])) {
                $html .= '
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 3px solid var(--theme-accent, var(--theme-primary));">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                <h4 style="margin: 0; color: var(--theme-primary); font-size: 1em;">' . $escapeHtml($project['name']) . '</h4>
                                <span style="background: var(--theme-accent, var(--theme-primary)); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">' . $escapeHtml($project['duration'] ?? '') . '</span>
                            </div>';
                
                if (!empty($project['tech'])) {
                    $html .= '<p style="margin: 5px 0; color: var(--theme-secondary); font-size: 0.9em; font-weight: 500;">' . $escapeHtml($project['tech']) . '</p>';
                }
                
                if (!empty($project['description'])) {
                    $descriptionLines = explode("\n", $project['description']);
                    $html .= '<div style="margin-top: 8px; font-size: 0.85em; color: #666;">';
                    foreach ($descriptionLines as $line) {
                        if (trim($line)) {
                            $html .= '<p style="margin: 2px 0; line-height: 1.4;">• ' . $escapeHtml($line) . '</p>';
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
                </div>
            </div>
        </div>';
    
    return $html;
}
?>

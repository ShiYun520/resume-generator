<?php
// 经典商务模板 - 移除所有require语句
function renderClassicTemplate($data) {
    $escapeHtml = function($text) {
        return htmlspecialchars($text ?? '', ENT_QUOTES, 'UTF-8');
    };
    
    // 获取头像
    $avatarSrc = !empty($data['avatar']) ? $data['avatar'] : 'https://www.qmjianli.com/images/edit/man.png';
    
    $html = '
        <div class="resume_header">
            个人简历
        </div>

        <div class="basic_info_box">
            <div class="photo_box">
                <img src="' . $avatarSrc . '" width="100%" alt="个人照片">
            </div>
            <dl class="basic_info_list">
                <dt>
                    <b class="myname">' . $escapeHtml($data['name']) . '</b>
                    <p class="yixiang_tip">
                        <span>求职岗位：' . $escapeHtml($data['title']) . '</span>
                    </p>
                </dt>';
    
    // 基本信息项目
    if (!empty($data['tagline'])) {
        $html .= '
                <dd>
                    <i class="qmfont qmicon-calendar"></i>
                    <span>个人标语</span>： ' . $escapeHtml($data['tagline']) . '
                </dd>';
    }
    
    if (!empty($data['phone'])) {
        $html .= '
                <dd>
                    <i class="qmfont qmicon-phone"></i>
                    <span>联系电话</span>： ' . $escapeHtml($data['phone']) . '
                </dd>';
    }
    
    if (!empty($data['email'])) {
        $html .= '
                <dd>
                    <i class="qmfont qmicon-xin"></i>
                    <span>电子邮箱</span>： ' . $escapeHtml($data['email']) . '
                </dd>';
    }
    
    if (!empty($data['github'])) {
        $html .= '
                <dd>
                    <i class="qmfont qmicon-bangongbao"></i>
                    <span>GitHub</span>： ' . $escapeHtml($data['github']) . '
                </dd>';
    }
    
    if (!empty($data['location'])) {
        $html .= '
                <dd>
                    <i class="qmfont qmicon-didian"></i>
                    <span>工作地点</span>： ' . $escapeHtml($data['location']) . '
                </dd>';
    }
    
    $html .= '
            </dl>
        </div>

        <div class="resume_content_all">
            <div class="resume_line"></div>';
    
    // 添加技能特长
    if (!empty($data['skills']) && is_array($data['skills'])) {
        $html .= '
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <span>技能特长</span>
                    </div>
                    <ul class="jineng_list">';
        
        foreach ($data['skills'] as $skill) {
            if (!empty($skill['name'])) {
                $ratingPercent = (intval($skill['rating'] ?? 5) * 20);
                $proficiencyText = $skill['rating'] >= 4 ? '精通' : ($skill['rating'] >= 3 ? '熟练' : '良好');
                
                $html .= '
                            <li class="is_text">
                                <div class="el-progress jineng_progress el-progress--line">
                                    <div class="el-progress-bar">
                                        <div class="el-progress-bar__outer">
                                            <div class="el-progress-bar__inner" style="width: ' . $ratingPercent . '%;"></div>
                                        </div>
                                    </div>
                                    <div class="el-progress__text">' . $ratingPercent . '%</div>
                                </div>
                                <p>' . $escapeHtml($skill['name']) . '</p>
                                <span class="shuliandu">' . $proficiencyText . '</span>
                            </li>';
            }
        }
        
        $html .= '
                    </ul>
                </div>
            </div>';
    }
    
    // 添加教育背景
    if (!empty($data['education']) && is_array($data['education'])) {
        $html .= '
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <span>教育背景</span>
                    </div>';
        
        foreach ($data['education'] as $edu) {
            if (!empty($edu['school']) || !empty($edu['major'])) {
                $html .= '
                        <div class="content_list">
                            <ul class="list_top">
                                <li class="time">' . $escapeHtml($edu['duration'] ?? '') . '</li>
                                <li class="name"><b>' . $escapeHtml($edu['school'] ?? '') . '</b></li>
                                <li>' . $escapeHtml($edu['major'] ?? '') . (!empty($edu['degree']) ? '（<b>' . $escapeHtml($edu['degree']) . '</b>）' : '') . '</li>
                            </ul>
                        </div>';
            }
        }
        
        $html .= '
                </div>
            </div>';
    }
    
    // 添加工作经历
    if (!empty($data['work_experience']) && is_array($data['work_experience'])) {
        $html .= '
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <span>工作经验</span>
                    </div>';
        
        foreach ($data['work_experience'] as $work) {
            if (!empty($work['company']) || !empty($work['position'])) {
                $html .= '
                        <div class="content_list">
                            <ul class="list_top">
                                <li class="time">' . $escapeHtml($work['duration'] ?? '') . '</li>
                                <li class="name"><b>' . $escapeHtml($work['company'] ?? '') . '</b></li>
                                <li>' . $escapeHtml($work['position'] ?? '') . '</li>
                            </ul>';
                
                if (!empty($work['description'])) {
                    $descriptionLines = explode("\n", $work['description']);
                    $html .= '<div class="ql-editor">';
                    foreach ($descriptionLines as $line) {
                        if (trim($line)) {
                            $html .= '<p>' . $escapeHtml($line) . '</p>';
                        }
                    }
                    $html .= '</div>';
                }
                
                $html .= '</div>';
            }
        }
        
        $html .= '
                </div>
            </div>';
    }
    
    // 添加项目经验
    if (!empty($data['projects']) && is_array($data['projects'])) {
        $html .= '
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <span>项目经验</span>
                    </div>';
        
        foreach ($data['projects'] as $project) {
            if (!empty($project['name'])) {
                $html .= '
                        <div class="content_list">
                            <ul class="list_top">
                                <li class="time">' . $escapeHtml($project['duration'] ?? '') . '</li>
                                <li class="name"><b>' . $escapeHtml($project['name']) . '</b></li>
                                <li>' . $escapeHtml($project['tech'] ?? '') . '</li>
                            </ul>';
                
                if (!empty($project['description'])) {
                    $descriptionLines = explode("\n", $project['description']);
                    $html .= '<div class="ql-editor">';
                    foreach ($descriptionLines as $line) {
                        if (trim($line)) {
                            $html .= '<p>' . $escapeHtml($line) . '</p>';
                        }
                    }
                    $html .= '</div>';
                }
                
                $html .= '</div>';
            }
        }
        
        $html .= '
                </div>
            </div>';
    }
    
    // 添加更多信息
    if (!empty($data['more_info']) && is_array($data['more_info'])) {
        $html .= '
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <span>更多信息</span>
                    </div>';
        
        foreach ($data['more_info'] as $info) {
            if (!empty($info['title'])) {
                $html .= '
                        <div class="content_list">
                            <ul class="list_top">
                                <li class="time">' . $escapeHtml($info['time'] ?? '') . '</li>
                                <li class="name"><b>' . $escapeHtml($info['title']) . '</b></li>
                            </ul>
                        </div>';
            }
        }
        
        $html .= '
                </div>
            </div>';
    }
    
    $html .= '
        </div>';
    
    return $html;
}
?>

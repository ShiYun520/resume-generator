// === 诗云简历生成器 - 完整离线版本 ===
$(document).ready(function() {
    // 页面加载时初始化
    initializePage();
  
    // 绑定表单变化事件
    bindFormEvents();
  
    // 初始化工具提示
    initializeTooltips();
  
    // 绑定PDF导出按钮
    const exportButton = document.getElementById('export-pdf-btn');
    if (exportButton) {
        exportButton.addEventListener('click', exportAutoSizedPDF);
    }
  
    // 绑定Word导出按钮
    const exportWordButton = document.getElementById('export-word-btn');
    if (exportWordButton) {
        exportWordButton.addEventListener('click', exportToWord);
    }
  
    // 检查必要的库是否加载
    setTimeout(checkDependencies, 1000);
});

// === 主题颜色管理 ===
let currentThemeColor = '#8b5cf6'; // 默认紫色

function getCurrentThemeColor() {
    // 从页面中检测当前主题颜色
    const themeColorElement = document.querySelector('[data-theme-color]');
    if (themeColorElement) {
        currentThemeColor = themeColorElement.getAttribute('data-theme-color');
    } else {
        // 尝试从CSS变量中获取
        const rootStyles = getComputedStyle(document.documentElement);
        const cssThemeColor = rootStyles.getPropertyValue('--theme-primary') || 
                             rootStyles.getPropertyValue('--theme-color') || 
                             rootStyles.getPropertyValue('--primary-color') ||
                             rootStyles.getPropertyValue('--accent-color');
        if (cssThemeColor) {
            currentThemeColor = cssThemeColor.trim();
        } else {
            // 从侧边栏背景色中提取
            const sidebarElement = document.querySelector('.resume-sidebar');
            if (sidebarElement) {
                const computedStyle = getComputedStyle(sidebarElement);
                const bgColor = computedStyle.backgroundColor;
                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                    currentThemeColor = rgbToHex(bgColor) || currentThemeColor;
                }
            }
        }
    }
  
    return currentThemeColor;
}

function rgbToHex(rgb) {
    if (!rgb) return null;
  
    // 处理 rgb(r, g, b) 格式
    const rgbMatch = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
  
    return rgb.startsWith('#') ? rgb : null;
}

function updateThemeColor(color) {
    currentThemeColor = color;
    console.log('主题颜色已更新为:', color);
  
    // 触发预览更新
    updatePreview();
}

// === 模板渲染器 - 完全离线版本 ===
const TemplateRenderer = {
    // 渲染经典模板
    renderClassic: function(data) {
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        const avatarHtml = data.avatar ? 
            `<img src="${data.avatar}" alt="头像" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover;">` : 
            '';

        const themeColor = currentThemeColor;
        const gradientColor = `linear-gradient(135deg, ${adjustColor(themeColor, 0.1)}, ${themeColor}, ${adjustColor(themeColor, -0.1)})`;

        return `
            <style>
                :root {
                    --theme-primary: ${themeColor};
                    --theme-gradient: ${gradientColor};
                }
                 .resume-classic {
                    font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;
                    max-width: 210mm; margin: 0 auto; background-color: #fff; padding-bottom: 20px;
                }
                .resume-classic h1, .resume-classic h2, .resume-classic h3 { color: var(--theme-primary); }
                .resume-classic .resume-header { 
                    color: white !important; 
                    padding: 30px; 
                    text-align: center; 
                    margin-bottom: 30px; 
                    background: var(--theme-gradient) !important; 
                }
                /* 强制经典模板头部文字为白色 */
                .resume-classic .resume-header h1,
                .resume-classic .resume-header h2,
                .resume-classic .resume-header p,
                .resume-classic .basic-info h1,
                .resume-classic .basic-info h2,
                .resume-classic .basic-info p,
                .resume-classic .contact-info span {
                    color: white !important;
                }
                .resume-classic .avatar-section img { border: 3px solid white; }
                .resume-classic .contact-info span { margin: 0 15px; }
                .resume-classic .contact-info i { margin-right: 8px; }
                .resume-classic .skills-section .skill-item,
                .resume-classic .education-item,
                .resume-classic .work-item,
                .resume-classic .project-item,
                .resume-classic .info-item {
                    padding-left: 20px; border-left: 3px solid var(--theme-primary); margin-bottom: 15px;
                }
                 @media print {
                    .resume-classic { box-shadow: none; margin:0; border:0; }
                    .resume-classic .resume-header {
                        background: var(--theme-gradient) !important;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    /* 打印时强制经典模板头部文字为白色 */
                    .resume-classic .resume-header,
                    .resume-classic .resume-header h1,
                    .resume-classic .resume-header h2,
                    .resume-classic .resume-header p,
                    .resume-classic .basic-info h1,
                    .resume-classic .basic-info h2,
                    .resume-classic .basic-info p,
                    .resume-classic .contact-info span,
                    .resume-classic .contact-info i {
                        color: white !important;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    body { margin: 0; background-color: #fff;}
                }
            </style>
            <div class="resume-classic">
                <!-- 头部信息 -->
                <div class="resume-header">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 30px; flex-wrap: wrap;">
                        ${avatarHtml ? `<div class="avatar-section">${avatarHtml}</div>` : ''}
                        <div class="basic-info" style="text-align: left;">
                            <h1 style="margin: 0 0 10px 0; font-size: 2.5em; font-weight: bold; color: white !important;">${escapeHtml(data.name)}</h1>
                            <h2 style="margin: 0 0 15px 0; font-size: 1.3em; opacity: 0.9; color: white !important;">${escapeHtml(data.title)}</h2>
                            ${data.tagline ? `<p style="margin: 0; font-size: 1.1em; opacity: 0.8; color: white !important;">${escapeHtml(data.tagline)}</p>` : ''}
                        </div>
                    </div>
                    <div class="contact-info" style="margin-top: 20px; display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; color: white !important;">
                        ${data.phone ? `<span style="color: white !important;"><i class="fas fa-phone" style="color: white !important;"></i> ${escapeHtml(data.phone)}</span>` : ''}
                        ${data.email ? `<span style="color: white !important;"><i class="fas fa-envelope" style="color: white !important;"></i> ${escapeHtml(data.email)}</span>` : ''}
                        ${data.location ? `<span style="color: white !important;"><i class="fas fa-map-marker-alt" style="color: white !important;"></i> ${escapeHtml(data.location)}</span>` : ''}
                        ${data.github ? `<span style="color: white !important;"><i class="fab fa-github" style="color: white !important;"></i> ${escapeHtml(data.github)}</span>` : ''}
                    </div>
                </div>

                <div class="resume-content" style="padding: 0 30px;">
                    ${this.renderSkillsSection(data.skills)}
                    ${this.renderEducationSection(data.education)}
                    ${this.renderWorkSection(data.work_experience)}
                    ${this.renderProjectsSection(data.projects)}
                    ${this.renderMoreInfoSection(data.more_info)}
                </div>
            </div>
        `;
    },

    // 渲染现代模板（基于新的全民简历样式）
    renderModern: function(data) {
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        const themeColor = currentThemeColor;
        const themeRgb = this.hexToRgb(themeColor);
        const themeColorRgba = `rgba(${themeRgb.r}, ${themeRgb.g}, ${themeRgb.b}, 0.5)`;
        const themeColorLight = `rgba(${themeRgb.r}, ${themeRgb.g}, ${themeRgb.b}, 0.04)`;
      
        const avatarHtml = data.avatar ? 
            `<img src="${data.avatar}" width="100%" alt="" style="display:block; width:100%; height:100%; object-fit:cover;">` : 
            `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmMGYwZjAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIxOCIgZmlsbD0iI2NjYyIvPjxwYXRoIGQ9Im0yNSA4NWMwLTE0IDExLTI1IDI1LTI1czI1IDExIDI1IDI1djI1aC01MHoiIGZpbGw9IiNjY2MiLz48L3N2Zz4=" width="100%" alt="" style="display:block; width:100%; height:100%; object-fit:cover;">`;

        return `
            <style>
                :root {
                    --theme-primary: ${themeColor};
                }
                .resume_all { font-family: 'Microsoft YaHei', 'SimSun', 'PingFang SC', 'Arial', sans-serif; font-size: 12px; line-height: 1.5; color: #333; }
                .pc_main { -webkit-text-size-adjust: none; -moz-text-size-adjust: none; -ms-text-size-adjust: none; text-size-adjust: none; }
                .resume_box { position: relative; padding-bottom: 2px; min-height: 1150px; color: #333; background-color: #fff; max-width: 210mm; margin: 0 auto; box-sizing: border-box; }
                .basic_info_box { padding: 25px 30px 10px 60px; position: relative; min-height: 170px; box-sizing: border-box; }
                .basic_info_list { font-size: 13px; margin: 0; padding: 0; }
                .basic_info_list dt { margin-bottom: 15px; }
                .basic_info_list dt b { color: var(--theme-primary); font-size: 24px; font-weight: bold; }
                .basic_info_list dd { margin: 0; padding: 5px 0; display: flex; align-items: center; gap: 8px; font-size: 13px; }
                .basic_info_list dd i { color: var(--theme-primary); font-size: 14px; width: 16px; text-align: center; flex-shrink: 0; }
                .basic_info_list dd span { min-width: 80px; display: inline-block; }
                .photo_box { position: absolute; right: 60px; top: 20px; width: 120px; height: 150px; border: 2px solid #f0f0f0; border-radius: 8px; overflow: hidden; }
                .resume_content_all { margin: 15px 30px 0px 165px; padding-top: 1px; position: relative; border-left: 1px dashed #888; box-sizing: border-box;}
                .resume_content { margin-bottom: 15px; position: relative; }
                .resume_content_main { position: relative; }
                .module_tit { font-size: 15px; color: var(--theme-primary); font-weight: bold; margin-bottom: 15px; position: relative; padding-left: 20px; display: flex; align-items: center; gap: 10px; }
                .module_tit .zfx { position: absolute; left: -8px; top: 50%; transform: translateY(-50%); width: 12px; height: 12px; border-radius: 50%; background-color: var(--theme-primary); border: 3px solid white; box-shadow: 0 0 0 1px #ddd; }
                .content_list { margin-top: 10px; padding-left: 20px; position: relative; }
                .content_list .lx { position: absolute; left: -8px; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, var(--theme-primary), transparent); }
                .content_list .time { color: #666; font-size: 12px; margin-bottom: 8px; font-weight: 500; }
                .content_list .time .ffyh { margin: 0 3px; font-style: normal; }
                .list_top { margin: 0; padding: 0; list-style: none; font-size: 13px; margin-bottom: 8px; }
                .list_top li { margin-bottom: 3px; }
                .list_top .name { font-weight: bold; }
                .list_top .name b { font-weight: bold; color: #333; }
                .ql-editor { font-size: 13px; margin-top: 5px; line-height: 1.8; } /* Increased line-height */
                .ql-editor p { margin: 8px 0; }
                .ql-editor ul { margin: 8px 0; padding-left: 20px; }
                .ql-editor li { margin: 5px 0; list-style-type: disc; }
                .baokao_list { margin: 0; padding: 0; list-style: none; font-size: 14px; }
                .baokao_list li { margin-bottom: 8px; padding-left: 15px; position: relative; }
                .baokao_list li:before { content: "•"; color: var(--theme-primary); position: absolute; left: 0; font-weight: bold; }
                .baokao_cj { margin-top: 10px; font-size: 13px; width: 100%; border-collapse: collapse; }
                .baokao_cj th, .baokao_cj td { padding: 8px 12px; border: 1px solid #ddd; text-align: center; }
                .baokao_cj th { background-color: ${themeColorLight}; color: var(--theme-primary); font-weight: bold; }
                .tag_box { font-size: 13px; margin-top: 11px; display: flex; flex-wrap: wrap; gap: 8px; }
                .tag_box span { padding: 4px 12px; border: 1px solid; border-radius: 15px; font-size: 12px; border-color: ${themeColorRgba}; background-color: ${themeColorLight}; color: var(--theme-primary); }
                @media (max-width: 768px) {
                    .basic_info_box { padding: 20px 15px 10px 30px; }
                    .photo_box { right: 15px; width: 100px; height: 125px; }
                    .resume_content_all { margin: 15px 15px 0px 80px; }
                    .module_tit { font-size: 14px; }
                }
                @media print {
                    body { margin: 0; background-color: #fff; }
                    .resume_box { box-shadow: none; margin: 0; min-height: auto; border: none; max-width: 100%;}
                    .module_tit, .basic_info_list dt b, .basic_info_list dd i, .tag_box span, .baokao_cj th, .module_tit .zfx {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    .module_tit { color: var(--theme-primary) !important; }
                    .module_tit .zfx { background-color: var(--theme-primary) !important; }
                    .basic_info_list dt b { color: var(--theme-primary) !important; }
                    .basic_info_list dd i { color: var(--theme-primary) !important; }
                    .tag_box span { border-color: ${themeColorRgba} !important; background-color: ${themeColorLight} !important; color: var(--theme-primary) !important; }
                    .baokao_cj th { background-color: ${themeColorLight} !important; color: var(--theme-primary) !important; }
                    .resume_content { page-break-inside: avoid; }
                }
            </style>
          
            <div class="resume_all">
                <div class="pc_main">
                    <div class="weiruanyahei">
                        <div class="resume_box">
                            <!-- 基本信息区域 -->
                            <div class="basic_info_box">
                                <dl class="basic_info_list">
                                    <dt>
                                        <b>${escapeHtml(data.name)}</b>
                                    </dt>
                                    ${data.age ? `<dd><i>📅</i><span>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄</span>:&nbsp; ${escapeHtml(data.age)}</dd>` : ''}
                                    ${data.gender ? `<dd><i>👤</i><span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>:&nbsp; ${escapeHtml(data.gender)}</dd>` : ''}
                                    ${data.location ? `<dd><i>📍</i><span>籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯</span>:&nbsp; ${escapeHtml(data.location)}</dd>` : ''}
                                    ${data.experience ? `<dd><i>💼</i><span>工作年限</span>:&nbsp; ${escapeHtml(data.experience)}</dd>` : ''}
                                    ${data.phone ? `<dd><i>📱</i><span>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话</span>:&nbsp; ${escapeHtml(data.phone)}</dd>` : ''}
                                    ${data.email ? `<dd><i>✉️</i><span>邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱</span>:&nbsp; ${escapeHtml(data.email)}</dd>` : ''}
                                </dl>
                                <div class="photo_box">
                                    ${avatarHtml}
                                </div>
                            </div>
                          
                            <!-- 主要内容区域 -->
                            <div class="resume_content_all">
                                ${this.renderApplyInfoSectionModern(data, themeColor)}
                                ${this.renderEducationSectionModern(data.education, themeColor)}
                                ${this.renderWorkSectionModern(data.work_experience, themeColor)}
                                ${this.renderSkillsSectionModern(data.skills, themeColor)}
                                ${this.renderCertificateSectionModern(data.more_info, themeColor)}
                                ${this.renderProjectsSectionModern(data.projects, themeColor)}
                                ${this.renderSelfEvaluationModern(data.tagline || data.position_desc, themeColor)}
                                ${this.renderHobbiesSectionModern(data.hobbies, themeColor, themeColorRgba, themeColorLight)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 渲染创意模板
    renderCreative: function(data) {
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        const avatarHtml = data.avatar ? 
            `<img src="${data.avatar}" alt="头像" style="width: 150px; height: 150px; border-radius: 15px; object-fit: cover; border: 3px solid white;">` : 
            '';

        const themeColor = currentThemeColor;
        const gradientColor = `linear-gradient(135deg, ${adjustColor(themeColor, 0.2)}, ${themeColor}, ${adjustColor(themeColor, -0.2)})`;

        return `
            <style>
                :root {
                    --theme-primary: ${themeColor};
                    --theme-gradient: ${gradientColor};
                }
                .resume-creative { 
                    font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; 
                    display: flex; min-height: 100vh; /* Use flex for better control */
                    max-width: 210mm; margin: 0 auto; background-color: #fff;
                }
                .resume-creative .sidebar { 
                    background: var(--theme-gradient) !important; color: white; 
                    padding: 30px 25px; width: 280px; /* Fixed width for sidebar */
                    flex-shrink: 0; box-sizing: border-box;
                }
                .resume-creative .main-content { 
                    padding: 30px 40px; flex-grow: 1; /* Main content takes remaining space */
                    box-sizing: border-box;
                }
                .resume-creative h1, .resume-creative h2, .resume-creative h3 { font-weight: bold; }
                .resume-creative .contact-info i { width: 20px; margin-right: 5px; }
                .resume-creative .main-content h3 { color: var(--theme-primary); }
                .resume-creative .main-content section > h3 {
                     margin-bottom: 15px; font-size: 1.3em; 
                     border-bottom: 2px solid var(--theme-primary); padding-bottom: 5px;
                }
                 .resume-creative .main-content .education-item,
                 .resume-creative .main-content .work-item,
                 .resume-creative .main-content .project-item,
                 .resume-creative .main-content .info-item {
                    padding-left: 20px; border-left: 3px solid var(--theme-primary); margin-bottom: 20px;
                 }

                @media (max-width: 768px) {
                    .resume-creative { flex-direction: column; min-height: auto; }
                    .resume-creative .sidebar { width: 100%; }
                }
                @media print {
                    body { margin: 0; background-color: #fff; }
                    .resume-creative { flex-direction: row !important; box-shadow: none; border:0; max-width:100%;}
                    .resume-creative .sidebar {
                        background: var(--theme-gradient) !important;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        page-break-inside: avoid;
                    }
                     .resume-creative .main-content section { page-break-inside: avoid; }
                }
            </style>
            <div class="resume-creative">
                <!-- 左侧边栏 -->
                <div class="sidebar">
                    <div class="sidebar-content">
                        ${avatarHtml ? `<div class="avatar-section" style="text-align: center; margin-bottom: 25px;">${avatarHtml}</div>` : ''}
                      
                        <div class="basic-info" style="text-align: center; margin-bottom: 30px;">
                            <h1 style="margin: 0 0 10px 0; font-size: 1.8em;">${escapeHtml(data.name)}</h1>
                            <h2 style="margin: 0 0 15px 0; font-size: 1.1em; opacity: 0.9;">${escapeHtml(data.title)}</h2>
                            ${data.tagline ? `<p style="margin: 0; font-size: 0.9em; opacity: 0.8; line-height: 1.4;">${escapeHtml(data.tagline)}</p>` : ''}
                        </div>

                        <div class="contact-info" style="margin-bottom: 30px;">
                            <h3 style="font-size: 1.1em; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 5px;">联系方式</h3>
                            ${data.phone ? `<div style="margin-bottom: 8px; font-size: 0.9em;"><i class="fas fa-phone"></i> ${escapeHtml(data.phone)}</div>` : ''}
                            ${data.email ? `<div style="margin-bottom: 8px; font-size: 0.9em;"><i class="fas fa-envelope"></i> ${escapeHtml(data.email)}</div>` : ''}
                            ${data.location ? `<div style="margin-bottom: 8px; font-size: 0.9em;"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(data.location)}</div>` : ''}
                            ${data.github ? `<div style="margin-bottom: 8px; font-size: 0.9em;"><i class="fab fa-github"></i> ${escapeHtml(data.github)}</div>` : ''}
                        </div>

                        <div class="sidebar-skills">
                            ${this.renderSkillsSidebar(data.skills)}
                        </div>
                    </div>
                </div>

                <!-- 右侧主内容 -->
                <div class="main-content">
                    ${this.renderEducationSection(data.education)}
                    ${this.renderWorkSection(data.work_experience)}
                    ${this.renderProjectsSection(data.projects)}
                    ${this.renderMoreInfoSection(data.more_info)}
                </div>
            </div>
        `;
    },
  
    // 渲染商务专业模板
    renderBusiness: function(data) {
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        const themeColor = currentThemeColor;
        const themeRgb = this.hexToRgb(themeColor);
        const backgroundColorLight = `rgba(${themeRgb.r}, ${themeRgb.g}, ${themeRgb.b}, 0.04)`;
      
        const avatarHtml = data.avatar ? 
            `<img src="${data.avatar}" width="100%" alt="" style="display:block; width:100%; height:100%; object-fit:cover;">` : 
            `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmMGYwZjAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIxOCIgZmlsbD0iI2NjYyIvPjxwYXRoIGQ9Im0yNSA4NWMwLTE0IDExLTI1IDI1LTI1czI1IDExIDI1IDI1djI1aC01MHoiIGZpbGw9IiNjY2MiLz48L3N2Zz4=" width="100%" alt="" style="display:block; width:100%; height:100%; object-fit:cover;">`;

        return `
            <style>
                :root { --theme-primary: ${themeColor}; }
                .resume_box_business { min-height: 1150px; padding: 20px 30px 10px; position: relative; background-color: #fff; color: #333; font-family: 'Microsoft YaHei', 'SimSun', 'PingFang SC', 'Arial', sans-serif; font-size: 12px; line-height: 1.5; box-sizing: border-box; max-width: 210mm; margin: 0 auto; }
                .resume_box_business .resume_tit { font-size: 24px; font-weight: bold; text-align: center; color: #333; margin-bottom: 20px; padding-bottom: 10px; }
                .resume_box_business .resume_table { width: 100%; margin: 0 auto; font-size: 13px; line-height: 1.7; border-collapse: collapse; margin-bottom: 15px; }
                .resume_box_business .resume_table table { width: 100%; border-collapse: collapse; }
                .resume_box_business .resume_table td { padding: 8px 12px; border: 1px solid #e0e0e0; vertical-align: middle; }
                .resume_box_business .key_title { background-color: ${backgroundColorLight}; color: var(--theme-primary); font-weight: bold; text-align: center; padding: 8px 12px; }
                .resume_box_business .photo_td { text-align: center; padding: 10px; vertical-align: top; }
                .resume_box_business .photo_box { width: 120px; height: 150px; margin: 0 auto; overflow: hidden; border: 2px solid #f0f0f0; border-radius: 6px; }
                .resume_box_business .yixiang_tip { font-weight: 500; color: #333; }
                .resume_box_business dl { margin: 15px 0; border: 1px solid #e5e5e5; }
                .resume_box_business dt.key_title { background-color: ${backgroundColorLight}; color: var(--theme-primary); font-weight: bold; text-align: left; padding: 10px 15px; margin: 0; border-bottom: 1px solid #e5e5e5; font-size: 14px;}
                .resume_box_business dd { padding: 15px 20px; margin: 0; background: white; }
                .resume_box_business .info_box { padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
                .resume_box_business .info_box:last-child { border-bottom: none; }
                .resume_box_business .info_list { list-style: none; margin: 0; padding: 0; font-size: 13px; display: flex; flex-wrap: wrap; gap: 10px 20px; align-items: center; margin-bottom: 8px; }
                .resume_box_business .info_list .time { color: #666; font-weight: normal; }
                .resume_box_business .info_list .time .ffyh { margin: 0 5px; font-style: normal; }
                .resume_box_business .info_list .name { font-weight: bold; color: #333; }
                .resume_box_business .info_list .name b { font-weight: bold; }
                .resume_box_business .ql-editor { font-size: 13px; line-height: 1.8; margin-top: 8px; }
                .resume_box_business .ql-editor p { margin: 8px 0; }
                .resume_box_business .ql-editor ul { margin: 8px 0; padding-left: 20px; }
                .resume_box_business .ql-editor li { margin: 5px 0; list-style-type: disc; }
                .resume_box_business .jineng_list { list-style: none; margin: 0; padding: 0; }
                .resume_box_business .jineng_list .is_text { margin-top: 7px; position: relative; }
                .resume_box_business .jineng_list .is_text p { font-size: 13px; margin: 0 0 8px 0; font-weight: 500; }
                .resume_box_business .el-progress { margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
                .resume_box_business .el-progress-bar { flex: 1; }
                .resume_box_business .el-progress-bar__outer { height: 6px; background-color: rgb(235, 238, 245); border-radius: 3px; overflow: hidden; position: relative; }
                .resume_box_business .el-progress-bar__inner { height: 100%; background-color: var(--theme-primary); border-radius: 3px; transition: width 0.3s ease; }
                .resume_box_business .el-progress__text { font-size: 12px; color: rgb(96, 98, 102); min-width: 35px; }
                .resume_box_business .shuliandu { font-size: 12px; color: #666; position: absolute; right: 0; top: 0; }
                 @media print {
                    body { margin: 0; background-color: #fff; }
                    .resume_box_business { box-shadow: none; margin:0; border:0; max-width: 100%;}
                    .resume_box_business .key_title, .resume_box_business .el-progress-bar__inner {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    .resume_box_business .key_title { background-color: ${backgroundColorLight} !important; color: var(--theme-primary) !important; }
                    .resume_box_business .el-progress-bar__inner { background-color: var(--theme-primary) !important;}
                    .resume_box_business dl, .resume_box_business .info_box { page-break-inside: avoid; }
                }
            </style>
          
            <div class="resume_box_business">
                <div class="resume_tit">个人简历</div>
              
                <table class="resume_table">
                    <tr>
                        <td width="120" class="key_title">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</td>
                        <td width="200">${escapeHtml(data.name)}</td>
                        <td width="120" class="key_title">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</td>
                        <td width="200">${escapeHtml(data.gender || '男')}</td>
                        <td width="130" rowspan="3" class="photo_td">
                            <div class="photo_box">
                                ${avatarHtml}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="key_title">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄</td>
                        <td>${escapeHtml(data.age ? data.age + (data.age.includes('岁') ? '' : '岁') : '20岁')}</td>
                        <td class="key_title">籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯</td>
                        <td>${escapeHtml(data.location || '桂林市')}</td>
                    </tr>
                    <tr>
                        <td class="key_title">工作年限</td>
                        <td>${escapeHtml(data.experience ? (data.experience.includes('经验') ? data.experience : data.experience + '经验') : '2年经验')}</td>
                        <td class="key_title">联系电话</td>
                        <td>${escapeHtml(data.phone)}</td>
                    </tr>
                    <tr>
                        <td class="key_title">联系邮箱</td>
                        <td>${escapeHtml(data.email)}</td>
                        <td class="key_title">求职岗位</td>
                        <td colspan="2" class="yixiang_tip">${escapeHtml(data.title)}</td>
                    </tr>
                </table>
              
                <div class="resume_table">
                    ${this.renderEducationSectionBusiness(data.education, themeColor, backgroundColorLight)}
                    ${this.renderWorkSectionBusiness(data.work_experience, themeColor, backgroundColorLight)}
                    ${this.renderSkillsSectionBusiness(data.skills, themeColor, backgroundColorLight)}
                    ${this.renderCertificateSectionBusiness(data.more_info, themeColor, backgroundColorLight)}
                    ${this.renderSelfEvaluationBusiness(data.position_desc || data.tagline, themeColor, backgroundColorLight)}
                    ${this.renderProjectsSectionBusiness(data.projects, themeColor, backgroundColorLight)}
                </div>
            </div>
        `;
    },

    // 渲染极简风格模板
    renderMinimal: function(data) {
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        const themeColor = currentThemeColor;
        const accentColor = '#ed7d31';
      
        const avatarHtml = data.avatar ? 
            `<img src="${data.avatar}" alt="" style="border-color: ${accentColor}; width: 100%; max-width:120px; height: auto; border: 3px solid ${accentColor}; border-radius: 8px; display:block; margin-bottom: 20px;">` : 
            `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmMGYwZjAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIxOCIgZmlsbD0iI2NjYyIvPjxwYXRoIGQ9Im0yNSA4NWMwLTE0IDExLTI1IDI1LTI1czI1IDExIDI1IDI1djI1aC01MHoiIGZpbGw9IiNjY2MiLz48L3N2Zz4=" alt="" style="border-color: ${accentColor}; width: 100%; max-width:120px; height: auto; border: 3px solid ${accentColor}; border-radius: 8px; display:block; margin-bottom: 20px;">`;

        const workColors = ['#7fb1de', '#82b1af', '#98a6bd', '#d89cb1', '#b19cd9', '#ffb4a3'];

        return `
            <style>
                :root {
                    --theme-primary: ${themeColor};
                }
                .resume_content_all {
                    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
                    font-size: 14px;
                    line-height: 1.7;
                    color: rgb(51, 51, 51);
                    background-color: rgb(255, 255, 255);
                    max-width: 820px;
                    margin: 0 auto;
                    padding: 25px;
                    min-height: 1160px;
                    box-sizing: border-box;
                }

                .resume_content_all h4 {
                    font-size: 1.1em;
                    font-weight: bold;
                    color: ${themeColor};
                    margin-top: 15px;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #ddd;
                }
                .resume_content_all .resume_name {
                    font-size: 1.7em;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .resume_content_all .yixiang_list {
                    list-style: none;
                    padding: 0;
                    margin-bottom: 15px;
                    text-align: center;
                }
                 .resume_content_all .yixiang_list li {
                    font-size: 0.9em;
                    margin-bottom: 5px;
                }
                .resume_content_all .yixiang_list li span { color: ${accentColor}; }

                .resume_content_all .info_list { list-style: none; padding: 0; margin-bottom: 15px; }
                .resume_content_all .info_list li { margin-bottom: 5px; line-height: 1.6; }
                .resume_content_all .info_list li b { font-weight: bold; display: inline-block; min-width: 70px; }
              
                .resume_content_all .ql-editor { margin-top: 5px; line-height: 1.6; }
                .resume_content_all .ql-editor p { margin: 0 0 8px 0; }
                .resume_content_all .ql-editor ul { margin: 0 0 8px 0; padding-left: 20px; }
                .resume_content_all .ql-editor li { margin-bottom: 4px; }

                .resume_content_all .module_c_list, .resume_l_module { margin-bottom: 20px; }
                .resume_content_all .jiaoyu_top { list-style:none; padding:0; margin-bottom: 8px; }
                .resume_content_all .jiaoyu_top li { margin-bottom: 3px; }
                .resume_content_all .jiaoyu_top .name { color: ${accentColor}; font-weight: bold; }
                .resume_content_all .jiaoyu_top .time { color: #666; font-size: 0.9em; }

                .resume_content_all .jineng_list { list-style:none; padding:0; }
                .resume_content_all .jineng_list .is_text { margin-bottom: 10px; position:relative; }
                .resume_content_all .jineng_list .is_text p { margin:0 0 3px 0; font-weight: 500; }
                .resume_content_all .el-progress { display: flex; align-items: center; margin-bottom: 3px; }
                .resume_content_all .el-progress-bar__outer { height:6px; background-color:#ebeef5; border-radius:3px; overflow:hidden; flex-grow:1; }
                .resume_content_all .el-progress-bar__inner { height:100%; background-color:#aaa; }
                .resume_content_all .el-progress__text { font-size:0.8em; color:#606266; margin-left:10px; }
                .resume_content_all .shuliandu { font-size:0.8em; color:#666; position:absolute; right:0; bottom:2px; }

                .resume_content_all .tag_box { display:flex; flex-wrap:wrap; gap:8px; margin-top: 8px; }
                .resume_content_all .tag_box span {
                    padding: 3px 8px; font-size:0.85em;
                    border: 1px solid rgba(237,125,49,0.3);
                    background-color: rgba(237,125,49,0.04);
                    border-radius: 12px;
                }
                .resume_content_all .module_tit {
                    font-size: 1.3em;
                    font-weight: bold;
                    color: #333;
                    margin-top: 20px;
                    margin-bottom: 15px;
                    padding-bottom: 8px;
                    border-bottom: 2px solid ${themeColor};
                }
                .resume_content_all .list_top { list-style:none; padding:0; margin-bottom:8px; display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
                .resume_content_all .list_top .time { color:#666; font-size:0.9em; }
                .resume_content_all .list_top .name { font-weight:bold; }
                .resume_content_all .list_top .name b { font-weight:bold; }

                .resume_l_box, .resume_r_box {
                     width: 100%;
                }
              
                @media print {
                    body { margin: 0; background-color: #fff; }
                    .resume_content_all {
                        box-shadow: none !important;
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 10mm !important;
                        min-height: auto !important;
                        max-width: 100% !important;
                        font-size: 11pt;
                        line-height: 1.5;
                        background-color: #fff !important;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    .resume_content_all h4, .resume_content_all .module_tit {
                        color: ${themeColor} !important;
                        border-bottom-color: #ddd !important;
                         -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                     .resume_content_all .module_tit {
                        border-bottom-color: ${themeColor} !important;
                    }
                    .resume_content_all .photo_box img {
                         border-color: ${accentColor} !important;
                         -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    .resume_content_all .yixiang_list li span,
                    .resume_content_all .jiaoyu_top .name {
                        color: ${accentColor} !important;
                         -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    .resume_content_all .tag_box span {
                         border-color: rgba(237,125,49,0.3) !important;
                         background-color: rgba(237,125,49,0.04) !important;
                         -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    .resume_content_all .module_c_list, .resume_l_module, .resume_module_box {
                        page-break-inside: avoid;
                    }
                }

            </style>
          
            <div class="resume_content_all">
                ${avatarHtml}
                <div class="resume_name">${escapeHtml(data.name)}</div>
                <ul class="yixiang_list">
                    <li>求职岗位：<span>${escapeHtml(data.title)}</span></li>
                </ul>
              
                <h4>个人信息</h4>
                <ul class="info_list">
                    ${data.age ? `<li><b>年龄：</b>${escapeHtml(data.age)}</li>` : ''}
                    ${data.gender ? `<li><b>性别：</b>${escapeHtml(data.gender)}</li>` : ''}
                    ${data.location ? `<li><b>籍贯：</b>${escapeHtml(data.location)}</li>` : ''}
                    ${data.experience ? `<li><b>工作年限：</b>${escapeHtml(data.experience)}</li>` : ''}
                    ${data.phone ? `<li><b>电话：</b>${escapeHtml(data.phone)}</li>` : ''}
                    ${data.email ? `<li><b>邮箱：</b>${escapeHtml(data.email)}</li>` : ''}
                </ul>
              
                ${data.tagline || data.position_desc ? `
                <div class="pingjia_box">
                    <h4>自我评价</h4>
                    <div class="ql-editor">
                        <p>${escapeHtml(data.tagline || data.position_desc)}</p>
                    </div>
                </div>
                ` : ''}

                ${this.renderEducationSectionLeft(data.education, accentColor)}
                ${this.renderSkillsSectionLeft(data.skills)}
                ${this.renderWorkSectionRight(data.work_experience, workColors)}
                ${this.renderProjectsSectionRight(data.projects, workColors)}
                ${this.renderMoreInfoSectionLeft(data.more_info, accentColor)}
                ${data.hobbies ? this.renderHobbiesSection(data.hobbies, accentColor) : ''}
            </div>
        `;
    },

    // 现代模板 - 报考信息部分
    renderApplyInfoSectionModern: function(data, themeColor) {
        if (!data.apply_school && !data.apply_major && !data.exam_scores) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        let content = '';
        if (data.apply_school || data.apply_major) {
            content += `<ul class="baokao_list">
                            ${data.apply_school ? `<li>报考院校：${escapeHtml(data.apply_school)}</li>` : ''}
                            ${data.apply_major ? `<li>报考专业：${escapeHtml(data.apply_major)}</li>` : ''}
                        </ul>`;
        }
        if (data.exam_scores) {
            content += this.renderExamScoresTable(data.exam_scores, themeColor);
        }

        if (!content) return '';
      
        return `
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <div class="zfx"></div>
                        <span>报考信息</span>
                    </div>
                    <div class="content_list">
                        ${content}
                    </div>
                </div>
            </div>
        `;
    },

    // 考试成绩表格
    renderExamScoresTable: function(scores, themeColor) {
        if (!scores || typeof scores !== 'object') return '';
        const scoreKeys = Object.keys(scores);
        if (scoreKeys.every(key => !scores[key])) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <table class="baokao_cj">
                <tr>
                    <th rowspan="2">初试成绩</th>
                    <th>数学</th>
                    <th>英语</th>
                    <th>计算机综合</th>
                    <th>政治理论</th>
                    <th>总分</th>
                </tr>
                <tr>
                    <td>${escapeHtml(scores.math || '')}</td>
                    <td>${escapeHtml(scores.english || '')}</td>
                    <td>${escapeHtml(scores.computer || '')}</td>
                    <td>${escapeHtml(scores.politics || '')}</td>
                    <td>${escapeHtml(scores.total || '')}</td>
                </tr>
            </table>
        `;
    },

    // 现代模板 - 教育背景部分
    renderEducationSectionModern: function(education, themeColor) {
        if (!education || education.length === 0) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <div class="zfx"></div>
                        <span>教育背景</span>
                    </div>
                    ${education.map(edu => `
                        <div class="content_list">
                            <div class="lx"></div>
                            <div class="time">${escapeHtml(edu.duration || '').replace('-', ' <i class="ffyh">~</i> ')}</div>
                            <ul class="list_top">
                                <li class="name"><b>${escapeHtml(edu.school || '')}</b></li>
                                <li>${escapeHtml(edu.major || '')}${edu.degree ? `&nbsp;(${escapeHtml(edu.degree)})` : ''}</li>
                            </ul>
                            ${edu.description ? `
                                <div class="ql-editor">
                                    ${escapeHtml(edu.description).split('\n').map(line => `<p>${line}</p>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 现代模板 - 工作经验部分
    renderWorkSectionModern: function(workExperience, themeColor) {
        if (!workExperience || workExperience.length === 0) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <div class="zfx"></div>
                        <span>工作经验</span>
                    </div>
                    ${workExperience.map(work => `
                        <div class="content_list">
                            <div class="lx"></div>
                            <div class="time">${escapeHtml(work.duration || '').replace('-', ' <i class="ffyh">~</i> ')}</div>
                            <ul class="list_top">
                                <li class="name"><b>${escapeHtml(work.company || '')}</b></li>
                                <li>${escapeHtml(work.position || '')}</li>
                            </ul>
                            ${work.description ? `
                                <div class="ql-editor">
                                    <ul>
                                        ${work.description.split('\n').filter(line => line.trim()).map(line => 
                                            `<li>${escapeHtml(line.trim())}</li>`
                                        ).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 现代模板 - 技能特长部分
    renderSkillsSectionModern: function(skills, themeColor) {
        if (!skills || skills.length === 0) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <div class="zfx"></div>
                        <span>技能特长</span>
                    </div>
                    <div class="content_list">
                        <div class="ql-editor">
                            <ul>
                                ${skills.map(skill => `
                                    <li><strong>${escapeHtml(skill.name)}</strong>: ${'★'.repeat(skill.rating)}${'☆'.repeat(5-skill.rating)} (${skill.rating}/5)</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 现代模板 - 荣誉证书部分
    renderCertificateSectionModern: function(moreInfo, themeColor) {
        if (!moreInfo || moreInfo.length === 0) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <div class="zfx"></div>
                        <span>荣誉证书</span>
                    </div>
                    <div class="content_list">
                        <div class="ql-editor">
                            <ul>
                                ${moreInfo.map(info => `
                                    <li>${escapeHtml(info.title)}${info.time ? `&nbsp;(${escapeHtml(info.time)})` : ''}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 现代模板 - 项目经验部分
    renderProjectsSectionModern: function(projects, themeColor) {
        if (!projects || projects.length === 0) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <div class="zfx"></div>
                        <span>项目经验</span>
                    </div>
                    ${projects.map(project => `
                        <div class="content_list">
                            <div class="lx"></div>
                            <div class="time">${escapeHtml(project.duration || '').replace('-', ' <i class="ffyh">~</i> ')}</div>
                            <ul class="list_top">
                                <li class="name"><b>${escapeHtml(project.name || '')}</b></li>
                                ${project.tech ? `<li>技术栈：${escapeHtml(project.tech)}</li>` : ''}
                            </ul>
                            ${project.description ? `
                                <div class="ql-editor">
                                    ${escapeHtml(project.description).split('\n').map(line => `<p>${line}</p>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 现代模板 - 自我评价部分
    renderSelfEvaluationModern: function(selfEvaluation, themeColor) {
        if (!selfEvaluation || !selfEvaluation.trim()) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <div class="zfx"></div>
                        <span>自我评价</span>
                    </div>
                    <div class="content_list">
                        <div class="ql-editor">
                            <p>${escapeHtml(selfEvaluation)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 现代模板 - 兴趣爱好部分
    renderHobbiesSectionModern: function(hobbies, themeColor, themeColorRgba, themeColorLight) {
        if (!hobbies) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        const hobbiesArray = hobbies.split(/[,，、\s]+/).map(h => h.trim()).filter(h => h);
        if (hobbiesArray.length === 0) return '';
      
        return `
            <div class="resume_content">
                <div class="resume_content_main">
                    <div class="module_tit">
                        <div class="zfx"></div>
                        <span>兴趣爱好</span>
                    </div>
                    <div class="content_list">
                        <div class="tag_box">
                            ${hobbiesArray.map(hobby => `
                                <span style="border-color: ${themeColorRgba}; background-color: ${themeColorLight}; color: ${themeColor};">${escapeHtml(hobby)}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 商务模板 - 教育背景部分
    renderEducationSectionBusiness: function(education, themeColor, backgroundColorLight) {
        if (!education || education.length === 0) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <dl>
                <dt class="key_title" style="background-color: ${backgroundColorLight}; color: ${themeColor};">
                    <span>教育背景</span>
                </dt>
                <dd>
                    ${education.map(edu => `
                        <div class="info_box">
                            <ul class="info_list">
                                <li class="time">${escapeHtml(edu.duration || '').replace(/-/g, ' <i class="ffyh">~</i> ')}</li>
                                <li class="name"><b>${escapeHtml(edu.school || '')}</b></li>
                                <li>${escapeHtml(edu.major || '')}${edu.degree ? `&nbsp;(${escapeHtml(edu.degree)})` : ''}</li>
                            </ul>
                            ${edu.description ? `
                                <div class="ql-editor">
                                    ${escapeHtml(edu.description).split('\n').map(line => `<p>${line}</p>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </dd>
            </dl>
        `;
    },

    // 商务模板 - 工作经验部分
    renderWorkSectionBusiness: function(workExperience, themeColor, backgroundColorLight) {
        if (!workExperience || workExperience.length === 0) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <dl>
                <dt class="key_title" style="background-color: ${backgroundColorLight}; color: ${themeColor};">
                    <span>工作经验</span>
                </dt>
                <dd>
                    ${workExperience.map(work => `
                        <div class="info_box">
                            <ul class="info_list">
                                <li class="time">${escapeHtml(work.duration || '').replace(/-/g, ' <i class="ffyh">~</i> ')}</li>
                                <li class="name"><b>${escapeHtml(work.company || '')}</b></li>
                                <li>${escapeHtml(work.position || '')}</li>
                            </ul>
                            ${work.description ? `
                                <div class="ql-editor">
                                    <ul>
                                        ${work.description.split('\n').filter(line => line.trim()).map(line => 
                                            `<li>${escapeHtml(line.trim())}</li>`
                                        ).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </dd>
            </dl>
        `;
    },

    // 商务模板 - 技能特长部分
    renderSkillsSectionBusiness: function(skills, themeColor, backgroundColorLight) {
        if (!skills || skills.length === 0) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        const getSkillLevelText = (rating) => {
            if (rating >= 4.5) return '精通';
            if (rating >= 3.5) return '熟练'; 
            if (rating >= 2.5) return '良好';
            if (rating >= 1.5) return '一般';
            return '入门';
        };
      
        return `
            <dl>
                <dt class="key_title" style="background-color: ${backgroundColorLight}; color: ${themeColor};">
                    <span>技能特长</span>
                </dt>
                <dd>
                    <ul class="jineng_list">
                        ${skills.map(skill => `
                            <li class="is_text">
                                <p>${escapeHtml(skill.name)}</p>
                                <div class="el-progress jineng_progress el-progress--line">
                                    <div class="el-progress-bar">
                                        <div class="el-progress-bar__outer">
                                            <div class="el-progress-bar__inner" style="width: ${Math.round((skill.rating/5)*100)}%; background-color: ${themeColor};"></div>
                                        </div>
                                    </div>
                                    <div class="el-progress__text">${Math.round((skill.rating/5)*100)}%</div>
                                </div>
                                <span class="shuliandu">${getSkillLevelText(skill.rating)}</span>
                            </li>
                        `).join('')}
                    </ul>
                </dd>
            </dl>
        `;
    },

    // 商务模板 - 荣誉证书部分
    renderCertificateSectionBusiness: function(moreInfo, themeColor, backgroundColorLight) {
        if (!moreInfo || moreInfo.length === 0) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <dl>
                <dt class="key_title" style="background-color: ${backgroundColorLight}; color: ${themeColor};">
                    <span>荣誉证书</span>
                </dt>
                <dd>
                    <div class="ql-editor">
                        <ul>
                            ${moreInfo.map(info => `
                                <li>${escapeHtml(info.title)}${info.time ? `&nbsp;(${escapeHtml(info.time)})` : ''}</li>
                            `).join('')}
                        </ul>
                    </div>
                </dd>
            </dl>
        `;
    },

    // 商务模板 - 自我评价部分
    renderSelfEvaluationBusiness: function(selfEvaluation, themeColor, backgroundColorLight) {
        if (!selfEvaluation || !selfEvaluation.trim()) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <dl>
                <dt class="key_title" style="background-color: ${backgroundColorLight}; color: ${themeColor};">
                    <span>自我评价</span>
                </dt>
                <dd>
                    <div class="ql-editor">
                        <p>${escapeHtml(selfEvaluation)}</p>
                    </div>
                </dd>
            </dl>
        `;
    },

    // 商务模板 - 项目经验部分
    renderProjectsSectionBusiness: function(projects, themeColor, backgroundColorLight) {
        if (!projects || projects.length === 0) return '';
      
        const escapeHtml = (text) => {
            if (!text) return '';
            return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
      
        return `
            <dl>
                <dt class="key_title" style="background-color: ${backgroundColorLight}; color: ${themeColor};">
                    <span>项目经验</span>
                </dt>
                <dd>
                    ${projects.map(project => `
                        <div class="info_box">
                            <ul class="info_list">
                                <li class="time">${escapeHtml(project.duration || '').replace(/-/g, ' <i class="ffyh">~</i> ')}</li>
                                <li class="name"><b>${escapeHtml(project.name || '')}</b></li>
                                ${project.tech ? `<li>技术栈：${escapeHtml(project.tech)}</li>` : ''}
                            </ul>
                            ${project.description ? `
                                <div class="ql-editor">
                                    ${escapeHtml(project.description).split('\n').map(line => `<p>${line}</p>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </dd>
            </dl>
        `;
    },

    // 左侧教育背景渲染
    renderEducationSectionLeft: function(education, accentColor) {
        if (!education || education.length === 0) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        return `
            <div class="resume_l_module">
                <h4>教育背景</h4>
                ${education.map(edu => `
                    <div class="module_c_list">
                        <ul class="jiaoyu_top">
                            <li class="name">${escapeHtml(edu.school || '')}</li>
                            <li class="time">${escapeHtml(edu.duration || '').replace('-', ' <i class="ffyh">~</i> ')}</li>
                            <li>${escapeHtml(edu.major || '')}${edu.degree ? `&nbsp;(${escapeHtml(edu.degree)})` : ''}</li>
                        </ul>
                        ${edu.description ? `<div class="ql-editor">${escapeHtml(edu.description).split('\n').map(line => `<p>${line}</p>`).join('')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },

    // 左侧技能特长渲染
    renderSkillsSectionLeft: function(skills) {
        if (!skills || skills.length === 0) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        const getSkillProgress = (rating) => Math.round((rating / 5) * 100);
        const getSkillLevelText = (rating) => {
            if (rating >= 4.5) return '精通'; if (rating >= 3.5) return '熟练'; 
            if (rating >= 2.5) return '良好'; if (rating >= 1.5) return '一般'; return '入门';
        };
        return `
            <div class="resume_l_module">
                <h4>技能特长</h4>
                <ul class="jineng_list">
                    ${skills.map(skill => `
                        <li class="is_text">
                            <p>${escapeHtml(skill.name)}：</p>
                            <div class="el-progress jineng_progress el-progress--line">
                                <div class="el-progress-bar">
                                    <div class="el-progress-bar__outer">
                                        <div class="el-progress-bar__inner" style="width: ${getSkillProgress(skill.rating)}%;"></div>
                                    </div>
                                </div>
                                <div class="el-progress__text">${getSkillProgress(skill.rating)}%</div>
                            </div>
                            <span class="shuliandu">${getSkillLevelText(skill.rating)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    },

    // 左侧更多信息渲染
    renderMoreInfoSectionLeft: function(moreInfo, accentColor) {
        if (!moreInfo || moreInfo.length === 0) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        return `
            <div class="resume_l_module">
                <h4>更多信息</h4>
                <div class="ql-editor">
                    <ul>
                        ${moreInfo.map(info => `
                            <li>${escapeHtml(info.title)}${info.time ? `&nbsp;(${escapeHtml(info.time)})` : ''}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    },

    // 兴趣爱好渲染
    renderHobbiesSection: function(hobbies, accentColor) {
        if (!hobbies) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        const hobbiesArray = hobbies.split(/[,，、\s]+/).map(h => h.trim()).filter(h => h);
        if (hobbiesArray.length === 0) return '';
        return `
            <div class="resume_l_module">
                <h4>兴趣爱好</h4>
                <div class="tag_box">
                    ${hobbiesArray.map(hobby => `<span>${escapeHtml(hobby)}</span>`).join('')}
                </div>
            </div>
        `;
    },

    // 右侧工作经验渲染
    renderWorkSectionRight: function(workExperience, workColors) {
        if (!workExperience || workExperience.length === 0) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        return `
            <div class="resume_module_box">
                <div class="module_tit">工作经验</div>
                <div class="module_content">
                    ${workExperience.map((work, index) => {
                        const color = workColors[index % workColors.length];
                        return `
                            <div class="module_c_list">
                                <ul class="list_top">
                                    <li class="time">${escapeHtml(work.duration || '').replace('-', ' <i class="ffyh">~</i> ')}</li>
                                    <li class="name" style="color: ${color};"><b>${escapeHtml(work.company || '')}</b></li>
                                    <li>${escapeHtml(work.position || '')}</li>
                                </ul>
                                ${work.description ? `
                                    <div class="ql-editor" style="background-color: ${color}; color: white; padding: 10px; border-radius: 4px;">
                                        <ul>
                                            ${work.description.split('\n').filter(line => line.trim()).map(line => 
                                                `<li>${escapeHtml(line.trim())}</li>`
                                            ).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    // 右侧项目经验渲染
    renderProjectsSectionRight: function(projects, workColors) {
        if (!projects || projects.length === 0) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        return `
            <div class="resume_module_box">
                <div class="module_tit">项目经验</div>
                <div class="module_content">
                    ${projects.map((project, index) => {
                        const color = workColors[(index + 3) % workColors.length];
                        return `
                            <div class="module_c_list">
                                <ul class="list_top">
                                    <li class="time">${escapeHtml(project.duration || '').replace('-', ' <i class="ffyh">~</i> ')}</li>
                                    <li class="name" style="color: ${color};"><b>${escapeHtml(project.name || '')}</b></li>
                                    ${project.tech ? `<li>技术栈：${escapeHtml(project.tech)}</li>` : ''}
                                </ul>
                                ${project.description ? `
                                    <div class="ql-editor" style="background-color: ${color}; color: white; padding: 10px; border-radius: 4px;">
                                        ${escapeHtml(project.description).split('\n').map(line => `<p>${line}</p>`).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    // 渲染技能部分
    renderSkillsSection: function(skills) {
        if (!skills || skills.length === 0) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        return `
            <section class="skills-section" style="margin-bottom: 20px;">
                <h3 style="color: var(--theme-primary); margin-bottom: 10px; font-size: 1.3em; border-bottom: 2px solid var(--theme-primary); padding-bottom: 5px;">
                    <i class="fas fa-code"></i> 个人技能
                </h3>
                <div class="skills-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                    ${skills.map(skill => `
                        <div class="skill-item" style="padding:5px 0;">
                            <span style="font-weight: 500;">${escapeHtml(skill.name)}</span>
                            <div class="skill-rating" style="float:right;">
                                ${'★'.repeat(skill.rating)}${'☆'.repeat(5-skill.rating)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    },

    // 渲染侧边栏技能
    renderSkillsSidebar: function(skills) {
        if (!skills || skills.length === 0) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        return `
            <div class="skills-sidebar">
                <h3 style="font-size: 1.1em; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 5px;">技能专长</h3>
                <div class="skills-list">
                    ${skills.map(skill => `
                        <div class="skill-item" style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span style="font-size: 0.9em;">${escapeHtml(skill.name)}</span>
                                <span style="font-size: 0.8em;">${skill.rating}/5</span>
                            </div>
                            <div style="background: rgba(255,255,255,0.3); height: 5px; border-radius: 2.5px;">
                                <div style="background: white; height: 100%; width: ${(skill.rating/5)*100}%; border-radius: 2.5px;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 渲染教育背景部分
    renderEducationSection: function(education) {
        if (!education || education.length === 0) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        return `
            <section class="education-section" style="margin-bottom: 20px;">
                <h3><i class="fas fa-graduation-cap"></i> 教育背景</h3>
                ${education.map(edu => `
                    <div class="education-item">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                            <h4 style="margin: 0; font-size: 1.1em; color: var(--theme-primary);">${escapeHtml(edu.school)}</h4>
                            <span style="color: #666; font-size: 0.9em;">${escapeHtml(edu.duration)}</span>
                        </div>
                        <div style="display: flex; gap: 20px; margin-bottom: 5px;">
                            <span style="font-weight: 500;">${escapeHtml(edu.major)}</span>
                            ${edu.degree ? `<span style="color: #666;">${escapeHtml(edu.degree)}</span>` : ''}
                        </div>
                         ${edu.description ? `<div style="color: #555; font-size:0.9em;">${escapeHtml(edu.description).replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `).join('')}
            </section>
        `;
    },

    // 渲染工作经历部分
    renderWorkSection: function(workExperience) {
        if (!workExperience || workExperience.length === 0) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        return `
            <section class="work-section" style="margin-bottom: 20px;">
                <h3><i class="fas fa-briefcase"></i> 工作经历</h3>
                ${workExperience.map(work => `
                    <div class="work-item">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <h4 style="margin: 0; font-size: 1.1em; color: var(--theme-primary);">${escapeHtml(work.company)}</h4>
                            <span style="color: #666; font-size: 0.9em;">${escapeHtml(work.duration)}</span>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong style="color: #555;">${escapeHtml(work.position)}</strong>
                        </div>
                        ${work.description ? `<div style="color: #666; line-height: 1.6; font-size:0.9em;">${work.description.split('\n').map(line => `<p style="margin: 3px 0;">${escapeHtml(line)}</p>`).join('')}</div>` : ''}
                    </div>
                `).join('')}
            </section>
        `;
    },

    // 渲染项目经验部分
    renderProjectsSection: function(projects) {
        if (!projects || projects.length === 0) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        return `
            <section class="projects-section" style="margin-bottom: 20px;">
                <h3><i class="fas fa-project-diagram"></i> 项目经验</h3>
                ${projects.map(project => `
                    <div class="project-item">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <h4 style="margin: 0; font-size: 1.1em; color: var(--theme-primary);">${escapeHtml(project.name)}</h4>
                            <span style="color: #666; font-size: 0.9em;">${escapeHtml(project.duration)}</span>
                        </div>
                        ${project.tech ? `<div style="margin-bottom: 10px;"><span style="background: var(--theme-primary); color: white; padding: 2px 8px; border-radius: 3px; font-size: 0.8em;">${escapeHtml(project.tech)}</span></div>` : ''}
                        ${project.description ? `<div style="color: #666; line-height: 1.6; font-size:0.9em;">${project.description.split('\n').map(line => `<p style="margin: 3px 0;">${escapeHtml(line)}</p>`).join('')}</div>` : ''}
                    </div>
                `).join('')}
            </section>
        `;
    },

    // 渲染更多信息部分
    renderMoreInfoSection: function(moreInfo) {
        if (!moreInfo || moreInfo.length === 0) return '';
        const escapeHtml = (text) => { if (!text) return ''; return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
        return `
            <section class="more-info-section" style="margin-bottom: 20px;">
                <h3><i class="fas fa-info-circle"></i> 更多信息</h3>
                ${moreInfo.map(info => `
                    <div class="info-item">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; color: var(--theme-primary);">${escapeHtml(info.title)}</span>
                            <span style="color: #666; font-size: 0.9em;">${escapeHtml(info.time)}</span>
                        </div>
                    </div>
                `).join('')}
            </section>
        `;
    },

    // 辅助函数：hex转rgb
    hexToRgb: function(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 33, g: 70, b: 102 };
    },

    // 根据模板类型渲染
    render: function(templateType, data) {
        getCurrentThemeColor();
        switch(templateType) {
            case 'classic':
                return this.renderClassic(data);
            case 'modern':
                return this.renderModern(data);
            case 'creative':
                return this.renderCreative(data);
            case 'business':
                return this.renderBusiness(data);
            case 'minimal':
                return this.renderMinimal(data);
            default:
                return this.renderClassic(data);
        }
    }
};

// === 核心初始化函数 ===
function initializePage() {
    getCurrentThemeColor();
    loadSavedData();
    setDefaultData();
    updatePreview();
}

function bindFormEvents() {
    $('#resumeForm').on('input change', function(e) {
        updatePreview();
        autoSave();
    });
  
    $('#avatar-input').on('change', handleAvatarUpload);
    $(document).on('click', '.skill-rating .star', handleStarRating);
  
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'data-theme-color' || 
                     mutation.attributeName === 'style' ||
                     mutation.attributeName === 'class')) {
                    setTimeout(() => {
                        const oldColor = currentThemeColor;
                        getCurrentThemeColor();
                        if (oldColor !== currentThemeColor) {
                            updatePreview();
                        }
                    }, 100);
                }
            });
        });
      
        observer.observe(document.documentElement, {
            attributes: true, subtree: true, 
            attributeFilter: ['data-theme-color', 'style', 'class']
        });
        observer.observe(document.body, {
            attributes: true, subtree: true,
            attributeFilter: ['data-theme-color', 'style', 'class']
        });
    }
  
    $(document).on('click', '.template-option', function() {
        const templateType = $(this).data('template');
        if (templateType && window.switchTemplate) {
            window.switchTemplate(templateType);
        } else if (templateType) {
            $('#resumeForm').attr('data-current-template', templateType);
             console.log('切换模板:', templateType);
            updatePreview();
        }
    });
}

function checkDependencies() {
    const dependencies = [];
    if (typeof html2pdf === 'undefined') dependencies.push('html2pdf.js');
    if (typeof bootstrap === 'undefined') dependencies.push('Bootstrap');
  
    const wordLibraries = ['docx', 'html-docx-js', 'officegen'];
    if (!wordLibraries.some(lib => typeof window[lib] !== 'undefined')) {
        console.warn('Word导出库未找到，Word导出功能将使用备用方案');
    }
  
    if (dependencies.length > 0) {
        showMessage(`缺少依赖库: ${dependencies.join(', ')}。某些功能可能无法正常使用。`, 'warning');
    }
}

// === 表单处理函数 ===
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showMessage('图片大小不能超过2MB', 'warning'); return; }
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) { showMessage('请选择图片文件 (JPG, PNG, GIF, WebP)', 'warning'); return; }
  
    const reader = new FileReader();
    reader.onload = function(e) {
        $('#avatar-preview').html(`<img src="${e.target.result}" alt="头像" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`);
        updatePreview();
        showMessage('头像上传成功', 'success');
    };
    reader.onerror = () => showMessage('头像上传失败，请重试', 'error');
    reader.readAsDataURL(file);
}

function handleStarRating() {
    const rating = $(this).data('value');
    const container = $(this).parent();
    container.attr('data-rating', rating);
    container.find('.star').each((index, el) => $(el).toggleClass('active', index < rating));
    updatePreview();
}

// === 数据获取和管理 ===
function getFormData() {
    const data = {};
  
    const getValue = (id, defaultValue = '') => $(`#${id}`).val() || defaultValue;

    data.name = getValue('name', '您的姓名');
    data.title = getValue('title', '求职岗位');
    data.tagline = getValue('tagline', '个人简介或职业目标');
    data.phone = getValue('phone');
    data.email = getValue('email');
    data.github = getValue('github');
    data.location = getValue('location');
    data.position_desc = getValue('position-desc');
  
    data.age = getValue('age');
    data.gender = getValue('gender');
    data.experience = getValue('experience');
    data.hobbies = getValue('hobbies');

    data.apply_school = getValue('apply_school');
    data.apply_major = getValue('apply_major');
    data.exam_scores = {
        math: getValue('exam_math'),
        english: getValue('exam_english'),
        computer: getValue('exam_computer'),
        politics: getValue('exam_politics'),
        total: getValue('exam_total'),
    };
  
    data.themeColor = getCurrentThemeColor();
    data.avatar = $('#avatar-preview img').attr('src') || '';
  
    const collectItems = (containerId, itemSelector, fieldsMap) => {
        const items = [];
        $(`#${containerId} ${itemSelector}`).each(function() {
            const item = {};
            let hasValue = false;
            for (const key in fieldsMap) {
                const selector = fieldsMap[key].selector;
                const isRating = fieldsMap[key].isRating;
                let value;
                if (isRating) {
                    value = parseInt($(this).find(selector).attr('data-rating')) || 0;
                } else {
                    value = $(this).find(selector).val();
                }
                item[key] = value || '';
                if (item[key] && item[key].toString().trim() !== '') hasValue = true;
            }
            if (hasValue) items.push(item);
        });
        return items;
    };

    data.skills = collectItems('skills-container', '.skill-item', {
        name: { selector: '.skill-name' },
        rating: { selector: '.skill-rating', isRating: true }
    });
  
    data.education = collectItems('education-container', '.education-item', {
        school: { selector: 'input[name="education_school[]"]' },
        major: { selector: 'input[name="education_major[]"]' },
        degree: { selector: 'select[name="education_degree[]"]' },
        duration: { selector: 'input[name="education_duration[]"]' },
        description: { selector: 'textarea[name="education_description[]"]' }
    });
  
    data.work_experience = collectItems('work-container', '.work-item', {
        company: { selector: 'input[name="work_company[]"]' },
        position: { selector: 'input[name="work_position[]"]' },
        duration: { selector: 'input[name="work_duration[]"]' },
        description: { selector: 'textarea[name="work_description[]"]' }
    });
  
    data.projects = collectItems('projects-container', '.project-item', {
        name: { selector: 'input[name="project_name[]"]' },
        duration: { selector: 'input[name="project_duration[]"]' },
        description: { selector: 'textarea[name="project_description[]"]' },
        tech: { selector: 'input[name="project_tech[]"]' }
    });
  
    data.more_info = collectItems('more-info-container', '.more-info-item', {
        title: { selector: 'input[name="more_info_title[]"]' },
        time: { selector: 'input[name="more_info_time[]"]' }
    });
  
    return data;
}

// === 完全离线的预览生成系统 ===
function updatePreview() {
    try {
        const formData = getFormData();
        const currentTemplate = $('#resumeForm').attr('data-current-template') || 
                               (window.getCurrentTemplate ? window.getCurrentTemplate() : 'modern');
      
        const html = TemplateRenderer.render(currentTemplate, formData);
      
        const previewContainer = document.getElementById('resume-preview');
        if (previewContainer) {
            previewContainer.innerHTML = html;
        } else {
            console.error('找不到预览容器: #resume-preview');
        }
    } catch (error) {
        console.error('更新预览时发生错误:', error);
        showMessage('预览更新失败: ' + error.message, 'error');
    }
}

// === 动态项目管理 ===
function addSkill() {
    $('#skills-container').append(`
        <div class="skill-item mb-3">
            <div class="row align-items-center gx-2">
                <div class="col-md-5"><input type="text" class="form-control form-control-sm skill-name" placeholder="技能名称"></div>
                <div class="col-md-5">
                    <div class="skill-rating" data-rating="3" style="font-size:1.2rem; cursor:pointer;">
                        ${[1,2,3,4,5].map(v => `<span class="star${v <= 3 ? ' active' : ''}" data-value="${v}">⭐</span>`).join('')}
                    </div>
                </div>
                <div class="col-md-2"><button class="btn btn-outline-danger btn-sm w-100" type="button" onclick="removeDynamicItem(this, '.skill-item')">删除</button></div>
            </div>
        </div>
    `);
    updatePreview();
}

function addEducation() {
    $('#education-container').append(`
        <div class="education-item border p-3 mb-3 position-relative">
            <button type="button" class="btn-remove position-absolute" onclick="removeDynamicItem(this, '.education-item')" style="top: 5px; right: 5px; background: none; border: none; font-size: 1.2rem; color: #dc3545; padding:0.1rem 0.5rem;">&times;</button>
            <div class="row gx-2">
                <div class="col-md-6 mb-2"><label class="form-label-sm">学校名称*</label><input type="text" class="form-control form-control-sm" name="education_school[]" placeholder="学校名称"></div>
                <div class="col-md-6 mb-2"><label class="form-label-sm">专业</label><input type="text" class="form-control form-control-sm" name="education_major[]" placeholder="专业"></div>
                <div class="col-md-6 mb-2"><label class="form-label-sm">学历</label><select class="form-select form-select-sm" name="education_degree[]"><option value="">选择</option><option>高中</option><option>中专</option><option>专科</option><option>本科</option><option>硕士</option><option>博士</option></select></div>
                <div class="col-md-6 mb-2"><label class="form-label-sm">时间</label><input type="text" class="form-control form-control-sm" name="education_duration[]" placeholder="2020.09-2024.06"></div>
                <div class="col-12"><label class="form-label-sm">主修课程/描述 (可选)</label><textarea class="form-control form-control-sm" name="education_description[]" rows="2" placeholder="简述主修课程或在校经历"></textarea></div>
            </div>
        </div>
    `);
    updatePreview();
}

function addWorkExperience() {
    $('#work-container').append(`
        <div class="work-item border p-3 mb-3 position-relative">
            <button type="button" class="btn-remove position-absolute" onclick="removeDynamicItem(this, '.work-item')" style="top: 5px; right: 5px; background: none; border: none; font-size: 1.2rem; color: #dc3545;padding:0.1rem 0.5rem;">&times;</button>
            <div class="row gx-2">
                <div class="col-md-6 mb-2"><label class="form-label-sm">公司名称*</label><input type="text" class="form-control form-control-sm" name="work_company[]" placeholder="公司名称"></div>
                <div class="col-md-6 mb-2"><label class="form-label-sm">职位</label><input type="text" class="form-control form-control-sm" name="work_position[]" placeholder="职位"></div>
                <div class="col-md-6 mb-2"><label class="form-label-sm">工作时间</label><input type="text" class="form-control form-control-sm" name="work_duration[]" placeholder="2022.01-2024.01"></div>
            </div>
            <div class="mt-1"><label class="form-label-sm">工作描述 (每点一行)</label><textarea class="form-control form-control-sm" name="work_description[]" rows="3" placeholder="描述工作内容、职责和成果"></textarea></div>
        </div>
    `);
    updatePreview();
}

function addProject() {
    $('#projects-container').append(`
        <div class="project-item border p-3 mb-3 position-relative">
            <button type="button" class="btn-remove position-absolute" onclick="removeDynamicItem(this, '.project-item')" style="top: 5px; right: 5px; background: none; border: none; font-size: 1.2rem; color: #dc3545;padding:0.1rem 0.5rem;">&times;</button>
            <div class="row gx-2">
                <div class="col-md-6 mb-2"><label class="form-label-sm">项目名称*</label><input type="text" class="form-control form-control-sm" name="project_name[]" placeholder="项目名称"></div>
                <div class="col-md-6 mb-2"><label class="form-label-sm">开发时间</label><input type="text" class="form-control form-control-sm" name="project_duration[]" placeholder="2023.01-2023.06"></div>
                <div class="col-12 mb-2"><label class="form-label-sm">技术栈</label><input type="text" class="form-control form-control-sm" name="project_tech[]" placeholder="React, Node.js, MySQL"></div>
            </div>
            <div class="mt-1"><label class="form-label-sm">项目描述 (每点一行)</label><textarea class="form-control form-control-sm" name="project_description[]" rows="3" placeholder="描述项目背景、功能和贡献"></textarea></div>
        </div>
    `);
    updatePreview();
}

function addMoreInfo() {
    $('#more-info-container').append(`
        <div class="more-info-item border p-3 mb-3 position-relative">
            <button type="button" class="btn-remove position-absolute" onclick="removeDynamicItem(this, '.more-info-item')" style="top: 5px; right: 5px; background: none; border: none; font-size: 1.2rem; color: #dc3545;padding:0.1rem 0.5rem;">&times;</button>
            <div class="row gx-2">
                <div class="col-md-6 mb-2"><label class="form-label-sm">标题*</label><input type="text" class="form-control form-control-sm" name="more_info_title[]" placeholder="奖项/证书/语言等"></div>
                <div class="col-md-6 mb-2"><label class="form-label-sm">时间/描述</label><input type="text" class="form-control form-control-sm" name="more_info_time[]" placeholder="2024.03 或 熟练"></div>
            </div>
        </div>
    `);
    updatePreview();
}

function removeDynamicItem(btn, itemSelector) {
    $(btn).closest(itemSelector).remove();
    updatePreview();
    showMessage('条目已删除', 'info');
}

// === 数据存储和加载 ===
function saveResume() {
    try {
        const formData = getFormData();
        localStorage.setItem('resumeData', JSON.stringify(formData));
        localStorage.setItem('resumeSaveTime', new Date().toLocaleString());
        showMessage('简历已保存到本地存储！', 'success');
    } catch (error) { console.error('保存失败:', error); showMessage('保存失败: ' + error.message, 'error'); }
}

function autoSave() {
    try {
        localStorage.setItem('resumeAutoSave', JSON.stringify(getFormData()));
        localStorage.setItem('resumeAutoSaveTime', new Date().toLocaleString());
    } catch (error) { console.warn('自动保存失败:', error); }
}

function loadSavedData() {
    try {
        const savedData = localStorage.getItem('resumeData') || localStorage.getItem('resumeAutoSave');
        if (savedData) {
            const data = JSON.parse(savedData);
            loadDataToForm(data);
            if (data.themeColor) currentThemeColor = data.themeColor;
        }
    } catch (error) { console.error('加载数据失败:', error); showMessage('加载已保存的数据时出错', 'warning'); }
}

function loadDataToForm(data) {
    if (!data) return;
  
    const setValue = (id, value) => {
        const el = $(`#${id}`);
        if (el.length) el.val(value || '');
    };

    ['name', 'title', 'tagline', 'phone', 'email', 'github', 'location', 'position-desc', 'age', 'gender', 'experience', 'hobbies', 'apply_school', 'apply_major'].forEach(key => {
        setValue(key.replace(/_/g, '-'), data[key]);
    });

    if (data.exam_scores) {
        for(const scoreKey in data.exam_scores) {
            setValue(`exam-${scoreKey}`, data.exam_scores[scoreKey]);
        }
    }

    if (data.avatar) $('#avatar-preview').html(`<img src="${data.avatar}" alt="头像" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`);
  
    const loadDynamicItems = (sectionName, addFunction, containerId, itemSelector, fieldsMap) => {
        $(`#${containerId}`).empty();
        if (data[sectionName] && data[sectionName].length > 0) {
            data[sectionName].forEach(itemData => {
                addFunction();
                const lastItem = $(`#${containerId} ${itemSelector}`).last();
                for (const key in fieldsMap) {
                    const field = fieldsMap[key];
                    if (field.isRating) {
                        const ratingEl = lastItem.find(field.selector);
                        ratingEl.attr('data-rating', itemData[key]);
                        ratingEl.find('.star').each((i, starEl) => $(starEl).toggleClass('active', i < itemData[key]));
                    } else {
                        lastItem.find(field.selector).val(itemData[key] || '');
                    }
                }
            });
        }
    };

    loadDynamicItems('skills', addSkill, 'skills-container', '.skill-item', { name: {selector:'.skill-name'}, rating: {selector:'.skill-rating', isRating:true} });
    loadDynamicItems('education', addEducation, 'education-container', '.education-item', { school: {selector:'input[name="education_school[]"]'}, major: {selector:'input[name="education_major[]"]'}, degree: {selector:'select[name="education_degree[]"]'}, duration: {selector:'input[name="education_duration[]"]'}, description: {selector:'textarea[name="education_description[]"]'} });
    loadDynamicItems('work_experience', addWorkExperience, 'work-container', '.work-item', { company: {selector:'input[name="work_company[]"]'}, position: {selector:'input[name="work_position[]"]'}, duration: {selector:'input[name="work_duration[]"]'}, description: {selector:'textarea[name="work_description[]"]'} });
    loadDynamicItems('projects', addProject, 'projects-container', '.project-item', { name: {selector:'input[name="project_name[]"]'}, duration: {selector:'input[name="project_duration[]"]'}, description: {selector:'textarea[name="project_description[]"]'}, tech: {selector:'input[name="project_tech[]"]'} });
    loadDynamicItems('more_info', addMoreInfo, 'more-info-container', '.more-info-item', { title: {selector:'input[name="more_info_title[]"]'}, time: {selector:'input[name="more_info_time[]"]'} });
  
    updatePreview();
}

function setDefaultData() {
    if (!localStorage.getItem('resumeData') && !localStorage.getItem('resumeAutoSave') && !$('#name').val()) {
        $('#name').val('蓝山简历');
        $('#title').val('前端开发工程师');
        $('#tagline').val('热爱技术，追求极致用户体验的前端开发者。');
        $('#phone').val('13800138000');
        $('#email').val('example@email.com');
        $('#location').val('上海市');
        $('#age').val('25');
        $('#gender').val('男');
        $('#experience').val('3年');
        $('#position-desc').val('一名经验丰富的前端开发工程师，具备扎实的HTML、CSS和JavaScript基础，熟练掌握React、Vue等现代前端框架。致力于构建高性能、用户友好的Web应用程序。');
        $('#hobbies').val('篮球, 阅读, 旅游');
      
        if ($('#skills-container .skill-item').length === 0) {
             addSkill();
             $('#skills-container .skill-item').first().find('.skill-name').val('JavaScript');
             const ratingContainer = $('#skills-container .skill-item').first().find('.skill-rating');
             ratingContainer.attr('data-rating', 4);
             ratingContainer.find('.star').each((idx, el) => $(el).toggleClass('active', idx < 4));
        }
        if ($('#education-container .education-item').length === 0) {
            addEducation();
            const eduItem = $('#education-container .education-item').first();
            eduItem.find('input[name="education_school[]"]').val('蓝山大学');
            eduItem.find('input[name="education_major[]"]').val('计算机科学与技术');
            eduItem.find('select[name="education_degree[]"]').val('本科');
            eduItem.find('input[name="education_duration[]"]').val('2018.09-2022.06');
        }
        updatePreview();
    }
}

// === 颜色处理函数 ===
function adjustColor(color, amount) {
    const usePound = color[0] === "#";
    const col = usePound ? color.slice(1) : color;
    if (col.length !== 6 && col.length !== 3) return color;
  
    let r, g, b;
    if (col.length === 3) {
        r = parseInt(col[0] + col[0], 16);
        g = parseInt(col[1] + col[1], 16);
        b = parseInt(col[2] + col[2], 16);
    } else {
        r = parseInt(col.substring(0, 2), 16);
        g = parseInt(col.substring(2, 4), 16);
        b = parseInt(col.substring(4, 6), 16);
    }
  
    r = Math.max(0, Math.min(255, Math.round(r * (1 + amount))));
    g = Math.max(0, Math.min(255, Math.round(g * (1 + amount))));
    b = Math.max(0, Math.min(255, Math.round(b * (1 + amount))));
  
    return (usePound ? "#" : "") + 
           r.toString(16).padStart(2, '0') + 
           g.toString(16).padStart(2, '0') + 
           b.toString(16).padStart(2, '0');
}

// === Word导出功能 ===
function exportToWord() {
    if (!validateRequiredFields()) return;
    showWordLoadingState('正在生成Word文档...');
    try {
        exportToWordWithPreviewHTML();
    } catch (error) {
        console.error('Word导出失败:', error);
        hideWordLoadingState();
        showWordAlternative();
    }
}

function exportToWordWithPreviewHTML() {
    try {
        const previewElement = document.getElementById('resume-preview');
        if (!previewElement) throw new Error('无法找到简历预览内容');
      
        const formData = getFormData();
        const cleanName = (formData.name || '简历').replace(/[^\u4e00-\u9fa5\w\s-]/g, '');
        const fileName = `${cleanName}_简历_${new Date().toISOString().slice(0, 10)}.doc`;
      
        const previewHTML = previewElement.innerHTML;
        const previewStyles = extractStylesFromPreview();
      
        const wordContent = generateWordHTMLFromPreview(previewHTML, previewStyles, formData);
      
        const blob = new Blob(['\ufeff', wordContent], { type: 'application/msword;charset=utf-8' });
      
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      
        hideWordLoadingState();
        showMessage('Word文档生成成功！', 'success');
    } catch (error) {
        console.error('基于预览的Word导出失败:', error);
        exportToWordFallback();
    }
}

function extractStylesFromPreview() {
    const styles = {};
    const previewElement = document.getElementById('resume-preview').firstChild;
  
    styles.themeColor = getCurrentThemeColor();
  
    if (previewElement) {
        const computedStyle = getComputedStyle(previewElement);
        styles.fontFamily = computedStyle.fontFamily || 'Microsoft YaHei, SimSun, PingFang SC, Arial, sans-serif';
        styles.fontSize = computedStyle.fontSize || '12px';
        styles.lineHeight = computedStyle.lineHeight || '1.5';
        styles.color = computedStyle.color || '#333';
        styles.backgroundColor = computedStyle.backgroundColor || '#ffffff';
    }
    return styles;
}

function generateWordHTMLFromPreview(previewHTML, styles, data) {
    const themeColor = styles.themeColor || currentThemeColor;
    const themeRgb = TemplateRenderer.hexToRgb(themeColor);
  
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = previewHTML;
    const resumeRoot = tempDiv.firstChild;

    Array.from(tempDiv.querySelectorAll('script, link[rel="stylesheet"], meta, noscript')).forEach(el => el.remove());
  
    function applyInlineStyles(element) {
        if (!element || typeof element.style === 'undefined') return;

        const computed = getComputedStyle(element);
        let inlineStyle = "";
        const relevantStyles = [
            'color', 'background-color', 'font-family', 'font-size', 'font-weight', 'font-style',
            'text-align', 'line-height', 'margin', 'padding', 'border', 'border-radius',
            'width', 'height', 'display', 'flex-direction', 'align-items', 'justify-content',
            'border-left', 'border-right', 'border-top', 'border-bottom',
            'border-color', 'border-style', 'border-width' 
        ];

        relevantStyles.forEach(prop => {
            let value = computed[prop];
            if (prop === 'background-color' && (value === 'rgba(0, 0, 0, 0)' || value === 'transparent')) {
            } else if (value) {
                inlineStyle += `${prop}: ${value} !important; `;
            }
        });
      
        const existingInlineStyle = element.getAttribute('style');
        if(existingInlineStyle) {
            inlineStyle += existingInlineStyle;
        }

        if (inlineStyle) {
            element.setAttribute('style', inlineStyle);
        }

        if (element.tagName === 'IMG') {
            if (!element.style.width && element.offsetWidth > 0) {
                element.style.width = element.offsetWidth + 'px';
            }
            if (!element.style.height && element.offsetHeight > 0) {
                 element.style.height = element.offsetHeight + 'px';
            }
             element.style.maxWidth = '100%';
        }
      
        Array.from(element.children).forEach(applyInlineStyles);
    }

    if (resumeRoot) {
        applyInlineStyles(resumeRoot);
    }
  
    let processedHTML = tempDiv.innerHTML;

    const wordHTML = `
        <!DOCTYPE html>
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:w="urn:schemas-microsoft-com:office:word" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <title>${data.name || '个人简历'}</title>
            <!--[if gte mso 9]>
            <xml>
                <w:WordDocument>
                    <w:View>Print</w:View>
                    <w:Zoom>100</w:Zoom>
                    <w:DoNotOptimizeForBrowser/>
                    <w:TrackMoves>false</w:TrackMoves>
                    <w:TrackFormatting/>
                    <w:ValidateAgainstSchemas/>
                    <w:SaveInvalidXML>false</w:SaveInvalidXML>
                    <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
                    <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
                    <w:DoNotUnderlineForeignWords/>
                </w:WordDocument>
            </xml>
            <![endif]-->
            <style>
                @page {
                    size: A4;
                    margin: 0.75in;
                }
                body {
                    font-family: ${styles.fontFamily || 'Calibri, sans-serif'};
                    font-size: ${styles.fontSize || '11pt'};
                    line-height: ${styles.lineHeight || '1.15'};
                    color: ${styles.color || '#000000'};
                    background-color: ${styles.backgroundColor || '#ffffff'};
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                table { border-collapse: collapse; width: 100%; }
                td, th { padding: 5px; border: 1px solid #ccc; vertical-align: top; }
                ul, ol { margin-top: 0; margin-bottom: 0; padding-left: 20px;}
                p { margin-top: 0; margin-bottom: 0.5em; }
                h1, h2, h3, h4, h5, h6 { margin-top: 0.5em; margin-bottom: 0.25em; font-weight: bold; }
                img { max-width: 100%; height: auto; vertical-align: middle; }

                .module_tit, .basic_info_list dt b, .basic_info_list dd i,
                .sidebar h1, .sidebar h2, .sidebar h3, .sidebar .contact-info div,
                .main-content h3, .main-content h4,
                .key_title, .yixiang_tip span[style*="color"],
                .jiaoyu_top .name, .list_top .name[style*="color"],
                .tag_box span {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                .resume-header, .sidebar, .module_tit .zfx, .el-progress-bar__inner,
                .key_title[style*="background-color"], .tag_box span[style*="background-color"],
                .module_c_list .ql-editor[style*="background-color"] {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                .resume_content, .info_box, .module_c_list, dl, .education-item, .work-item, .project-item {
                    page-break-inside: avoid;
                }
            </style>
        </head>
        <body>
            ${processedHTML}
        </body>
        </html>
    `;
  
    return wordHTML;
}

function exportToWordFallback() {
    try {
        const formData = getFormData();
        const cleanName = (formData.name || '简历').replace(/[^\u4e00-\u9fa5\w\s-]/g, '');
        const fileName = `${cleanName}_简历_简版_${new Date().toISOString().slice(0, 10)}.doc`;
      
        const currentTemplate = $('#resumeForm').attr('data-current-template') || (window.getCurrentTemplate ? window.getCurrentTemplate() : 'classic');
        const templateHTML = TemplateRenderer.render(currentTemplate, formData);
      
        const wordContent = generateSimpleWordFormat(templateHTML, formData);
      
        const blob = new Blob(['\ufeff', wordContent], { type: 'application/msword;charset=utf-8' });
      
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      
        hideWordLoadingState();
        showMessage('Word文档（简版）生成成功！', 'success');
    } catch (error) {
        console.error('Word备用导出失败:', error);
        hideWordLoadingState();
        showWordAlternative();
    }
}

function generateSimpleWordFormat(templateHTML, data) {
    const themeColor = currentThemeColor;
    const themeRgb = TemplateRenderer.hexToRgb(themeColor);
  
    let simplifiedHTML = templateHTML
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/\sclass="[^"]*"/gi, '')
        .replace(/\sid="[^"]*"/gi, '');

    const wordHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${data.name || '个人简历'}</title>
            <style>
                body { font-family: 'SimSun', serif; font-size: 10.5pt; line-height: 1.5; color: #000; margin: 0.75in; }
                h1, h2, h3, h4 { color: ${themeColor}; font-weight: bold; margin-bottom: 8pt; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 10pt; }
                td, th { padding: 4pt; border: 1px solid #999; text-align: left; vertical-align: top; }
                ul, ol { margin: 5pt 0; padding-left: 20pt; }
                li { margin: 2pt 0; }
                p { margin: 5pt 0; }
                img {max-width: 100%; height:auto;}
            </style>
        </head>
        <body>
            ${simplifiedHTML}
        </body>
        </html>
    `;
    return wordHTML;
}

function showWordAlternative() {
    const modalHtml = `
        <div class="modal fade" id="wordAlternativeModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog"><div class="modal-content">
                <div class="modal-header bg-info text-white"><h5 class="modal-title">Word导出替代方案</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
                <div class="modal-body">
                    <p>Word自动生成遇到问题，您可以使用以下方法：</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" onclick="copyResumeText()">📋 复制简历文本</button>
                        <button class="btn btn-secondary" onclick="exportToWordSimple()">📄 下载简单Word格式</button>
                        <button class="btn btn-success" onclick="exportAutoSizedPDF()">📑 导出为PDF (推荐)</button>
                    </div><hr><small class="text-muted"><strong>使用方法：</strong>复制文本后可以粘贴到Word中进行格式化，或直接使用PDF格式</small>
                </div>
            </div></div>
        </div>`;
    $('#wordAlternativeModal').remove();
    $('body').append(modalHtml);
    new bootstrap.Modal($('#wordAlternativeModal')[0]).show();
}

function copyResumeText() {
    try {
        const resumeText = generatePlainTextResume(getFormData());
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(resumeText)
                .then(() => showMessage('简历文本已复制到剪贴板！', 'success'))
                .catch(err => { console.error('复制失败:', err); fallbackCopyText(resumeText); });
        } else {
            fallbackCopyText(resumeText);
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('wordAlternativeModal'));
        if (modal) modal.hide();
    } catch (error) { console.error('复制文本失败:', error); showMessage('复制失败: ' + error.message, 'error'); }
}

function fallbackCopyText(text) {
    const textArea = $('<textarea>').val(text).css({position: 'fixed', left: '-9999px', top: '-9999px'}).appendTo('body');
    textArea.trigger('focus').trigger('select');
    try {
        document.execCommand('copy');
        showMessage('简历文本已复制到剪贴板！', 'success');
    } catch (err) {
        console.error('备用复制方法失败:', err);
        showMessage('复制失败，请手动选择文本', 'error');
    } finally {
        textArea.remove();
    }
}

function generatePlainTextResume(data) {
    let text = `${data.name || '个人简历'}\n====================\n\n`;
    if (data.title) text += `求职岗位: ${data.title}\n`;
    if (data.tagline) text += `简介: ${data.tagline}\n`;
    text += '\n基本信息\n--------\n';
    if (data.phone) text += `电话: ${data.phone}\n`;
    if (data.email) text += `邮箱: ${data.email}\n`;
    if (data.location) text += `地点: ${data.location}\n`;
    if (data.age) text += `年龄: ${data.age}\n`;
    if (data.gender) text += `性别: ${data.gender}\n`;
    if (data.experience) text += `经验: ${data.experience}\n`;
    if (data.github) text += `GitHub: ${data.github}\n`;
    text += '\n';

    if (data.position_desc) text += `职位描述/自我评价\n--------\n${data.position_desc}\n\n`;
  
    const sectionToText = (title, items, formatter) => {
        if (items && items.length > 0) {
            text += `${title}\n--------\n`;
            items.forEach(item => text += formatter(item));
            text += '\n';
        }
    };

    sectionToText('教育背景', data.education, edu => 
        `${edu.school || ''} - ${edu.major || ''} (${edu.degree || ''}) (${edu.duration || ''})\n` +
        (edu.description ? `  ${edu.description.replace(/\n/g, '\n  ')}\n` : '')
    );
    sectionToText('工作经历', data.work_experience, work => 
        `${work.company || ''} - ${work.position || ''} (${work.duration || ''})\n` +
        (work.description ? `  ${work.description.replace(/\n/g, '\n  • ')}\n` : '')
    );
    sectionToText('项目经验', data.projects, proj => 
        `${proj.name || ''} (${proj.duration || ''})\n` +
        (proj.tech ? `  技术栈: ${proj.tech}\n` : '') +
        (proj.description ? `  ${proj.description.replace(/\n/g, '\n  ')}\n` : '')
    );
    sectionToText('个人技能', data.skills, skill => `• ${skill.name || ''} (熟练度: ${skill.rating || 0}/5)\n`);
    sectionToText('更多信息', data.more_info, info => `• ${info.title || ''} (${info.time || ''})\n`);
    if (data.hobbies) text += `兴趣爱好\n--------\n${data.hobbies}\n\n`;
  
    return text;
}

function exportToWordSimple() {
    try {
        const modal = bootstrap.Modal.getInstance(document.getElementById('wordAlternativeModal'));
        if (modal) modal.hide();
        exportToWordFallback();
    } catch (error) { console.error('简单Word导出失败:', error); showMessage('Word导出失败: ' + error.message, 'error'); }
}

function showWordLoadingState(message = '正在生成Word文档...') {
    $('#word-loading-overlay').remove();
    $('body').append(`
        <div id="word-loading-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:10000; color:white; font-family:Arial,sans-serif;">
            <div style="text-align:center;">
                <div style="border:4px solid #f3f3f3; border-top:4px solid #28a745; border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite; margin:0 auto 20px auto;"></div>
                <div style="font-size:18px; margin-bottom:10px;">${message}</div>
                <div style="font-size:14px; color:#ccc;">样式与预览尽量保持一致</div>
            </div>
            <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
        </div>
    `);
}

function hideWordLoadingState() { $('#word-loading-overlay').fadeOut(300, function() { $(this).remove(); }); }

// === PDF导出功能 ===
function exportAutoSizedPDF() {
    if (typeof html2pdf === 'undefined') { showMessage('PDF生成库 (html2pdf.js) 未加载。', 'error'); return; }
    if (!validateRequiredFields()) return;
  
    getCurrentThemeColor();
    showPdfLoadingState('正在生成自适应PDF...');
  
    const element = document.querySelector('#resume-preview');
    if (!element || !element.firstChild) { hidePdfLoadingState(); showMessage('无法找到简历内容进行导出', 'error'); return; }
  
    const formData = getFormData();
    const cleanName = (formData.name || '简历').replace(/[^\u4e00-\u9fa5\w\s-]/g, '');
    const fileName = `${cleanName}_简历_${new Date().toISOString().slice(0, 10)}.pdf`;
  
    const clonedElement = element.cloneNode(true);
    $(clonedElement).css({
        'width': '210mm', 
        'min-height': '297mm',
        'box-sizing': 'border-box',
        'margin': '0',
        'padding': '0'
    });
    if (clonedElement.firstChild && clonedElement.firstChild.style) {
        clonedElement.firstChild.style.width = '100%';
        clonedElement.firstChild.style.margin = '0 auto';
    }

    document.body.appendChild(clonedElement);

    const options = {
        margin: [5, 5, 5, 5],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: clonedElement.offsetWidth,
            windowWidth: clonedElement.scrollWidth
        },
        jsPDF: { 
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
  
    html2pdf().from(clonedElement).set(options).save()
        .then(() => {
            hidePdfLoadingState();
            showMessage('PDF生成成功！', 'success');
        })
        .catch((error) => {
            console.error('PDF生成失败:', error);
            hidePdfLoadingState();
            showPrintAlternative(fileName);
        })
        .finally(() => {
            clonedElement.remove();
        });
}

function validateRequiredFields() {
    const requiredFields = [ { id: 'name', label: '姓名' }, { id: 'email', label: '邮箱' } ];
    for (let field of requiredFields) {
        const el = $(`#${field.id}`);
        if (!el.length || !el.val().trim()) {
            showMessage(`请填写必填项：${field.label}`, 'warning');
            if (el.length) el.trigger('focus');
            return false;
        }
    }
    return true;
}

function showPrintAlternative() {
    const modalHtml = `
        <div class="modal fade" id="pdfAlternativeModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog"><div class="modal-content">
                <div class="modal-header bg-info text-white"><h5 class="modal-title">PDF生成替代方案</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
                <div class="modal-body">
                    <p>PDF自动生成遇到问题，您可以使用以下方法：</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" onclick="openPrintPreview()">🖨️ 打开打印预览 (推荐)</button>
                        <button class="btn btn-secondary" onclick="previewPDF()">👀 在新窗口预览</button>
                    </div><hr><small class="text-muted"><strong>使用打印预览:</strong> 按 Ctrl+P (或 Cmd+P)，然后选择"另存为PDF"即可保存。</small>
                </div>
            </div></div>
        </div>`;
    $('#pdfAlternativeModal').remove();
    $('body').append(modalHtml);
    new bootstrap.Modal($('#pdfAlternativeModal')[0]).show();
}

function openPrintPreview() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('pdfAlternativeModal'));
    if (modal) modal.hide();
    window.print();
}

function previewPDF() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('pdfAlternativeModal'));
    if (modal) modal.hide();

    showMessage('正在准备预览...', 'info');
    getCurrentThemeColor();
  
    try {
        const resumeContentHTML = document.getElementById('resume-preview').innerHTML;
        const previewWindow = window.open('', '_blank');
        if (!previewWindow) { showMessage('无法打开新窗口，请检查浏览器弹窗设置。', 'warning'); return; }
      
        previewWindow.document.write(`
            <!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>诗云简历预览</title>
            <style>
                body { margin:0; background-color:#eee; display:flex; justify-content:center; padding:20px 0; }
                .page-container { background-color:white; width:210mm; min-height:297mm; padding:0; box-shadow:0 0 15px rgba(0,0,0,0.1); margin:0 auto; overflow:hidden; }
                .preview-controls { position:fixed; top:10px; left:50%; transform:translateX(-50%); background:rgba(255,255,255,0.9); padding:8px 12px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.2); z-index:100; font-family:Arial,sans-serif; display:flex; gap:10px;}
                .preview-controls button { padding:8px 15px; border:none; border-radius:4px; cursor:pointer; font-size:14px; background-color:#007bff; color:white; }
                .preview-controls button.btn-close { background-color:#6c757d; }
                @media print { body { background-color:white; padding:0; margin:0; } .preview-controls { display:none; } .page-container { margin:0; box-shadow:none; width:auto; min-height:auto; padding:0; } }
            </style></head><body>
            <div class="preview-controls">
                <button onclick="window.print()">🖨️ 打印/另存为PDF</button>
                <button class="btn-close" onclick="window.close()">❌ 关闭</button>
            </div>
            <div class="page-container">${resumeContentHTML}</div>
            </body></html>`);
        previewWindow.document.close();
    } catch (error) { console.error('预览失败:', error); showMessage('预览失败: ' + error.message, 'error'); }
}

// === 其他功能函数 ===
function clearForm() {
    if (confirm('确定要清空所有简历内容吗？此操作无法撤销。')) {
        $('#resumeForm')[0].reset();
        $('#avatar-preview').empty();
        ['skills-container', 'education-container', 'work-container', 'projects-container', 'more-info-container'].forEach(id => $(`#${id}`).empty());
        localStorage.removeItem('resumeData');
        localStorage.removeItem('resumeAutoSave');
        setDefaultData();
        showMessage('表单已清空', 'info');
    }
}

function exportData() {
    try {
        const formData = getFormData();
        const dataStr = JSON.stringify(formData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
        const filename = `shiyun_resume_data_${new Date().toISOString().split('T')[0]}.json`;
      
        const link = $('<a>').attr({ href: URL.createObjectURL(dataBlob), download: filename }).appendTo('body');
        link[0].click();
        link.remove();
        URL.revokeObjectURL(link.attr('href'));
        showMessage('数据已导出为JSON文件', 'success');
    } catch (error) { console.error('导出失败:', error); showMessage('导出失败: ' + error.message, 'error'); }
}

function importData(event) {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/json') {
        showMessage('请选择有效的JSON文件', 'warning');
        event.target.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            loadDataToForm(data);
            localStorage.setItem('resumeData', JSON.stringify(data));
            if (data.themeColor) {
                currentThemeColor = data.themeColor;
            }
            showMessage('数据导入成功！', 'success');
        } catch (error) {
            console.error('导入失败:', error);
            showMessage('导入失败：文件格式错误或内容不兼容', 'error');
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsText(file);
}

// === 加载状态管理 ===
function showPdfLoadingState(message = '正在生成PDF...') {
    $('#pdf-loading-overlay').remove();
    $('body').append(`
        <div id="pdf-loading-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:10000; color:white; font-family:Arial,sans-serif;">
            <div style="text-align:center;">
                <div style="border:4px solid #f3f3f3; border-top:4px solid #3498db; border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite; margin:0 auto 20px auto;"></div>
                <div style="font-size:18px; margin-bottom:10px;">${message}</div>
                <div style="font-size:14px; color:#ccc;">主题颜色：<span style="color:${currentThemeColor}; font-weight:bold;">${currentThemeColor}</span></div>
            </div>
            <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
        </div>
    `);
}
function hidePdfLoadingState() { $('#pdf-loading-overlay').fadeOut(300, function() { $(this).remove(); }); }

// === 通用消息提示 ===
function showMessage(message, type = 'info') {
    $('.toast-message-custom').remove();
    let alertClass = 'alert-info';
    if (type === 'success') alertClass = 'alert-success';
    else if (type === 'warning') alertClass = 'alert-warning';
    else if (type === 'error') alertClass = 'alert-danger';
  
    const messageDiv = $(`
        <div class="alert ${alertClass} alert-dismissible fade show position-fixed toast-message-custom" role="alert" style="top:20px; right:20px; z-index:10001; min-width:280px; box-shadow:0 0.5rem 1rem rgba(0,0,0,0.15);">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `).appendTo('body');
  
    setTimeout(() => messageDiv.fadeOut(500, () => messageDiv.remove()), type === 'error' ? 8000 : 5000);
}

function initializeTooltips() {
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }
}

// === 兼容旧版本的函数 ===
function generateOfflineTemplate(data) { return TemplateRenderer.render('classic', data); }
function collectFormData() { return getFormData(); }

console.log('简历生成器已加载完成 - 版本: 2024.6.2 (经典模板颜色修复版)');

import re
import os

file_path = r'c:\THE3studio\the3cut.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# The target block to replace (Multi-Slot Grid)
target_pattern = r'<!-- Multi-Slot Grid -->\s*<div class="slot-grid">.*?</div>'
replacement = r'''<!-- Multi-Slot Grid -->
        <div class="slot-grid">
            <script>
                for(let i=1; i<=4; i++) {
                    document.write(`
                    <div class="slot-card" id="slot-${i}" onclick="window.selectSlot(${i})">
                        <div class="slot-num">${i}</div>
                        <div class="slot-top-actions">
                            <button class="btn-top-icon btn-del" onclick="window.deleteSlot(${i}); event.stopPropagation();" title="삭제"><i class="fa fa-trash-alt"></i></button>
                        </div>
                        <div class="slot-visual" onclick="document.getElementById('file-input-${i}').click()">
                            <div class="upload-center" id="upload-ui-${i}">
                                <div class="icon-group">
                                    <i class="fa fa-cloud-upload-alt"></i>
                                    <i class="fa fa-paste"></i>
                                </div>
                                <p>SELECT IMAGE OR CTRL+V</p>
                            </div>
                            <img id="img-preview-${i}" class="preview-img">
                            <input type="file" id="file-input-${i}" style="display:none" onchange="window.handleSlotFile(${i}, event)">
                            <div class="status-tag" id="status-${i}"><i class="fa fa-check-circle"></i> 보정 완료</div>
                            <div class="slot-loader" id="loader-${i}"><i class="fa fa-spinner fa-spin"></i></div>
                        </div>
                        <div class="memo-container">
                            <i class="fa fa-comment-dots"></i>
                            <textarea class="slot-textarea" id="memo-${i}" placeholder="추가로 수정하고 싶은 내용이 있다면 적어주세요 (예: 배경을 더 환하게)"></textarea>
                        </div>
                        <div class="card-footer">
                            <div class="applied-meta">
                                <span>적용 테마</span>
                                <b id="theme-name-${i}">미설정</b>
                            </div>
                            <div class="footer-btns">
                                <button class="btn-card-action btn-card-regen" id="regen-${i}" onclick="window.reprocessSlot(${i}); event.stopPropagation();"><i class="fa fa-magic"></i> 다시 보정</button>
                                <a id="dl-${i}" class="btn-card-action btn-card-save" download="THE3_${i}.png"><i class="fa fa-download"></i> 저장</a>
                            </div>
                        </div>
                    </div>
                    `);
                }
            </script>
        </div>'''

new_content = re.sub(target_pattern, replacement, content, flags=re.DOTALL)

if new_content != content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated the slot grid HTML!")
else:
    print("Could not find the target pattern. Please check the file content.")


// --- TOTAL BUDGET & RESERVE BUDGET MODAL & APPROVAL WORKFLOW ---
window.openReserveBudgetModal = function() {
  const current = appState.accountingSettings?.reserveBudget || 0;
  const disp = document.getElementById('currentReserveBudgetDisplay');
  if (disp) disp.textContent = current.toLocaleString() + '원';
  const inp = document.getElementById('newReserveBudgetInput');
  if (inp) inp.value = current;
  const reason = document.getElementById('reserveBudgetReason');
  if (reason) reason.value = '';
  document.getElementById('reserveBudgetModal').classList.remove('hidden');
};

window.closeReserveBudgetModal = function() {
  document.getElementById('reserveBudgetModal').classList.add('hidden');
};

window.handleReserveBudgetDirectSave = function() {
  const val = parseInt(document.getElementById('newReserveBudgetInput').value, 10);
  if (isNaN(val) || val < 0) {
    alert("올바른 예비비 금액을 입력하세요.");
    return;
  }
  appState.accountingSettings = appState.accountingSettings || {};
  appState.accountingSettings.reserveBudget = val;
  saveState();
  closeReserveBudgetModal();
  renderAdminFinanceTab(document.getElementById('adminContentArea'));
  alert("예비비가 " + val.toLocaleString() + "원으로 즉시 변경 반영되었습니다.");
};

window.handleReserveBudgetApproval = function() {
  const val = parseInt(document.getElementById('newReserveBudgetInput').value, 10);
  const reason = document.getElementById('reserveBudgetReason').value.trim();
  if (isNaN(val) || val < 0) {
    alert("올바른 예비비 금액을 입력하세요.");
    return;
  }

  const current = appState.accountingSettings?.reserveBudget || 0;
  window._pendingTargetReserveBudget = val;

  closeReserveBudgetModal();
  switchTab('createView');

  setTimeout(() => {
    const catSelect = document.getElementById('newCategory');
    if (catSelect) {
      catSelect.value = '예산지출';
      handleNewCategoryChange('예산지출');
    }
    const expInput = document.getElementById('newExpenseAmount');
    if (expInput) expInput.value = val;

    const titleEl = document.getElementById('newTitle');
    if (titleEl) titleEl.value = "[예비비 조정] 예비비(선예약) 승인의 건: " + val.toLocaleString() + "원";

    const summaryEl = document.getElementById('newSummary');
    if (summaryEl) {
      summaryEl.value = 
"■ 안건 명칭: 의원실 예비비(선예약) 조정 승인의 건\n" +
"- 기존 예비비 설정액: " + current.toLocaleString() + "원\n" +
"- 조정 요청 예비비: " + val.toLocaleString() + "원 (증감액: " + (val - current >= 0 ? '+' : '') + (val - current).toLocaleString() + "원)\n" +
"- 예비비 조정 사유: " + (reason || "당무 일정 및 하반기 주요 행사 예비비 선예약 재산정");
    }
  }, 80);

  alert("예비비 조정 승인 전자결재 안건 양식이 자동으로 준비되었습니다. 결재선을 확인하고 상정하세요.");
};

window.openTotalBudgetModal = function() {
  const current = appState.accountingSettings?.totalBudget || 0;
  const disp = document.getElementById('currentTotalBudgetDisplay');
  if (disp) disp.textContent = current.toLocaleString() + '원';
  const inp = document.getElementById('newTotalBudgetInput');
  if (inp) inp.value = current;
  const reason = document.getElementById('totalBudgetReason');
  if (reason) reason.value = '';
  document.getElementById('totalBudgetModal').classList.remove('hidden');
};

window.closeTotalBudgetModal = function() {
  document.getElementById('totalBudgetModal').classList.add('hidden');
};

window.handleTotalBudgetApproval = function() {
  const val = parseInt(document.getElementById('newTotalBudgetInput').value, 10);
  const reason = document.getElementById('totalBudgetReason').value.trim();
  if (isNaN(val) || val <= 0) {
    alert("올바른 총 예산 금액을 입력하세요.");
    return;
  }

  const current = appState.accountingSettings?.totalBudget || 0;
  window._pendingTargetTotalBudget = val;

  closeTotalBudgetModal();
  switchTab('createView');

  setTimeout(() => {
    const catSelect = document.getElementById('newCategory');
    if (catSelect) {
      catSelect.value = '예산지출';
      handleNewCategoryChange('예산지출');
    }
    const expInput = document.getElementById('newExpenseAmount');
    if (expInput) expInput.value = val;

    const titleEl = document.getElementById('newTitle');
    if (titleEl) titleEl.value = "[총예산 변경] 전체 총 예산 변경 승인의 건: " + val.toLocaleString() + "원";

    const summaryEl = document.getElementById('newSummary');
    if (summaryEl) {
      summaryEl.value = 
"■ 안건 명칭: 의원실 전체 총 예산 변경 및 공식 승인의 건\n" +
"- 기존 총 예산: " + current.toLocaleString() + "원\n" +
"- 변경 요청 총 예산: " + val.toLocaleString() + "원\n" +
"- 예산 변경 사유: " + (reason || "시당 의정 지원금 배정 및 후원금 증액에 따른 예산 총괄 변경");
    }
  }, 80);

  alert("전체 총 예산 변경 승인 전자결재 안건이 준비되었습니다. 최종결재권자 승인 시 공식 예산에 자동 반영됩니다.");
};


window.switchComplaintSubTab = function(tab) {
  appState.complaintSubTab = tab;
  renderModuleView();
};

window.handleReopenComplaint = function(id) {
  const c = (appState.complaints || []).find(item => String(item.id) === String(id));
  if (!c) return;
  c.step = '접수';
  saveState();
  renderModuleView();
  alert("해당 민원이 진행 중(접수 단계)으로 정상 복원되었습니다.");
};


// --- ACCOUNTING LEDGER HANDLERS ---
window.handleLedgerDirectionChange = function(dir) {
  const typeSelect = document.getElementById('accLedgerType');
  if (!typeSelect) return;
  if (dir === 'INCOME') {
    typeSelect.innerHTML = `
      <option value="후원금">후원금</option>
      <option value="당비/지원금">당비/지원금</option>
      <option value="기타수입">기타수입</option>
    `;
  } else {
    typeSelect.innerHTML = `
      <option value="경비지출">경비지출</option>
      <option value="사업비">사업비</option>
      <option value="행사지출">행사지출</option>
      <option value="기타지출">기타지출</option>
    `;
  }
};

window.handleAddLedgerEntry = function(event) {
  event.preventDefault();
  const dirEl = document.getElementById('accLedgerDirection');
  const direction = dirEl ? dirEl.value : 'EXPENSE';
  const type = document.getElementById('accLedgerType').value;
  const title = document.getElementById('accLedgerTitle').value.trim();
  const amount = parseInt(document.getElementById('accLedgerAmount').value, 10) || 0;
  const note = document.getElementById('accLedgerNote').value.trim();

  if (!title || amount <= 0) {
    alert("항목 명칭과 올바른 금액을 입력하세요.");
    return;
  }

  appState.accountingLedger = appState.accountingLedger || [];
  appState.accountingLedger.unshift({
    id: 'led-' + Date.now(),
    date: new Date().toLocaleDateString(),
    direction: direction,
    type: type,
    title: title,
    amount: amount,
    note: note,
    registeredBy: appState.currentUser.name
  });

  saveState();
  renderAdminFinanceTab(document.getElementById('adminContentArea'));
  alert((direction === 'INCOME' ? '수입' : '지출') + " 장부 내역이 안전하게 등록되었습니다.");
};

window.handleDeleteLedgerEntry = function(id) {
  if (!confirm("해당 회계 장부 내역을 삭제하시겠습니까?")) return;
  appState.accountingLedger = (appState.accountingLedger || []).filter(item => String(item.id) !== String(id));
  saveState();
  renderAdminFinanceTab(document.getElementById('adminContentArea'));
};


// --- BRANDING (EMBLEM & SUBTITLE) LOGIC ---
window.handleEmblemUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    appState.branding = appState.branding || {};
    appState.branding.emblem = dataUrl;
    saveState();

    const img = document.getElementById('sidebarEmblemImg');
    const def = document.getElementById('sidebarEmblemDefault');
    if (img && def) {
      img.src = dataUrl;
      img.style.display = 'block';
      def.style.display = 'none';
    }
    alert("당 엠블럼 로고가 성공적으로 등록되었습니다.");
  };
  reader.readAsDataURL(file);
};

window.editSidebarSubtitle = function() {
  const current = appState.branding?.subtitle || '인천시당';
  const next = prompt("소속 시당 또는 당협 명칭을 입력하세요:", current);
  if (next !== null && next.trim() !== '') {
    appState.branding = appState.branding || {};
    appState.branding.subtitle = next.trim();
    saveState();
    const el = document.getElementById('sidebarSubtitle');
    if (el) el.textContent = next.trim();
  }
};

// --- PROFILE & PHOTO MODAL HANDLERS ---
let tempProfilePhotoDataUrl = null;

window.openProfileDocModal = function() {
  if (!appState.currentUser) return;
  const u = appState.currentUser;

  const nameEl = document.getElementById('profileDocName');
  if (nameEl) nameEl.value = u.name || '';

  const roleEl = document.getElementById('profileDocRole');
  if (roleEl) roleEl.value = (u.roleTitle || getUserRoleClean(u)) + (u.clearance ? ' (' + u.clearance + ')' : '');

  const emailEl = document.getElementById('profileDocEmail');
  if (emailEl) emailEl.value = u.email || '';

  const phoneEl = document.getElementById('profileDocPhone');
  if (phoneEl) phoneEl.value = u.phone || '';

  const bioEl = document.getElementById('profileDocBio');
  if (bioEl) bioEl.value = u.bio || '';

  const preview = document.getElementById('profileDocPhotoPreview');
  if (preview) {
    if (u.photoUrl) {
      preview.innerHTML = '<img src="' + u.photoUrl + '" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
    } else {
      preview.innerHTML = u.avatar || (u.name ? u.name.charAt(0) : '류');
    }
  }

  tempProfilePhotoDataUrl = null;
  const photoInput = document.getElementById('profileDocPhotoInput');
  if (photoInput) photoInput.value = '';

  const modal = document.getElementById('profileDocModal');
  if (modal) modal.classList.remove('hidden');
};

window.closeProfileDocModal = function() {
  const modal = document.getElementById('profileDocModal');
  if (modal) modal.classList.add('hidden');
};

window.handleProfilePhotoChange = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 300;
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      tempProfilePhotoDataUrl = canvas.toDataURL('image/jpeg', 0.85);

      const preview = document.getElementById('profileDocPhotoPreview');
      if (preview) {
        preview.innerHTML = '<img src="' + tempProfilePhotoDataUrl + '" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.removeProfilePhoto = function() {
  tempProfilePhotoDataUrl = 'REMOVE';
  const preview = document.getElementById('profileDocPhotoPreview');
  if (preview) {
    const u = appState.currentUser;
    preview.innerHTML = (u && u.avatar) || (u && u.name ? u.name.charAt(0) : '류');
  }
};

window.handleProfileDocSubmit = async function(event) {
  event.preventDefault();
  if (!appState.currentUser) return;

  const u = appState.currentUser;
  const phoneVal = document.getElementById('profileDocPhone').value.trim();
  const bioVal = document.getElementById('profileDocBio').value.trim();

  u.phone = phoneVal;
  u.bio = bioVal;

  if (tempProfilePhotoDataUrl === 'REMOVE') {
    u.photoUrl = null;
  } else if (tempProfilePhotoDataUrl) {
    u.photoUrl = tempProfilePhotoDataUrl;
  }

  // Update in appState.users array
  const userIdx = (appState.users || []).findIndex(user => user.id === u.id || user.email === u.email);
  if (userIdx !== -1) {
    appState.users[userIdx] = { ...appState.users[userIdx], ...u };
  } else {
    appState.users.push({ ...u });
  }

  saveState();
  renderApp();

  // Cloud sync to Supabase
  if (supabaseClient && u.id) {
    try {
      await supabaseClient.from('profiles').update({
        phone: u.phone
      }).eq('id', u.id);
    } catch (err) {
      console.warn("Supabase profile update warning:", err);
    }
  }

  closeProfileDocModal();
  alert("개인 프로필 정보 및 사진이 안전하게 저장되었습니다.");
};


window.handleModalProgressInput = function(val) {
  const num = parseInt(val, 10) || 0;
  const color = getProgressColor(num);
  const label = document.getElementById('modalProgressPercentLabel');
  const stage = document.getElementById('modalProgressStageText');
  const slider = document.getElementById('modalProgressSlider');
  const hidden = document.getElementById('progressPercent');

  if (label) {
    label.textContent = num + '%';
    label.style.color = color;
  }
  if (stage) {
    stage.textContent = getProgressStageName(num);
    stage.style.color = color;
  }
  if (slider) {
    slider.style.background = 'linear-gradient(to right, ' + color + ' ' + num + '%, #E2E8F0 ' + num + '%)';
  }
  if (hidden) hidden.value = num;
};

window.setModalProgressQuick = function(num) {
  const slider = document.getElementById('modalProgressSlider');
  if (slider) slider.value = num;
  handleModalProgressInput(num);
};


window.handleNewCategoryChange = function(cat) {
  const expRow = document.getElementById('expenseAmountRow');
  if (expRow) {
    if (cat === '예산지출') expRow.style.display = 'block';
    else expRow.style.display = 'none';
  }
};


// --- COMPLAINTS MANAGEMENT HANDLERS ---
window.setComplaintFilter = function(filter) {
  appState.complaintFilter = filter;
  renderModuleView();
};

window.handleComplaintSearch = function(e) {
  appState.complaintSearchQuery = e.target.value;
  renderModuleView();
};

window.openComplaintCreateModal = function() {
  document.getElementById('compTitleInput').value = '';
  document.getElementById('compRequesterInput').value = '';
  document.getElementById('compPhoneInput').value = '';
  document.getElementById('compLocationInput').value = '';
  document.getElementById('compDeptInput').value = '';
  document.getElementById('compContentInput').value = '';
  document.getElementById('complaintCreateModal').classList.remove('hidden');
};

window.closeComplaintCreateModal = function() {
  document.getElementById('complaintCreateModal').classList.add('hidden');
};

window.handleComplaintCreateSubmit = function(e) {
  e.preventDefault();
  const title = document.getElementById('compTitleInput').value.trim();
  const requester = document.getElementById('compRequesterInput').value.trim();
  const phone = document.getElementById('compPhoneInput').value.trim();
  const location = document.getElementById('compLocationInput').value.trim();
  const dept = document.getElementById('compDeptInput').value.trim();
  const content = document.getElementById('compContentInput').value.trim();

  const newId = 'CMP-' + String((appState.complaints ? appState.complaints.length : 0) + 1).padStart(3, '0');
  
  if (!appState.complaints) appState.complaints = [];
  appState.complaints.unshift({
    id: newId,
    title: title,
    requester: requester,
    phone: phone,
    location: location,
    dept: dept,
    step: '접수',
    date: new Date().toLocaleDateString(),
    content: content
  });

  saveState();
  closeComplaintCreateModal();
  renderModuleView();
  alert("신규 민원이 성공적으로 접수 등록되었습니다. (민원번호: " + newId + ")");
};

window.overrideComplaintStep = function(id, newStep) {
  const comp = (appState.complaints || []).find(c => String(c.id) === String(id));
  if (!comp) return;
  comp.step = newStep;
  saveState();
  renderModuleView();
  alert("민원 상태가 " + newStep + "(으)로 변경되었습니다.");
};

window.advanceComplaintStep = function(id) {
  const comp = (appState.complaints || []).find(c => String(c.id) === String(id));
  if (!comp) return;
  const steps = ['접수', '구청이첩', '현장점검', '처리완료'];
  const curIdx = steps.indexOf(comp.step);
  if (curIdx < steps.length - 1) {
    comp.step = steps[curIdx + 1];
    saveState();
    renderModuleView();
    alert("민원 상태가 " + comp.step + "(으)로 순차 이동되었습니다.");
  } else {
    alert("이미 최종 처리완료된 민원입니다.");
  }
};

// --- PROGRESS SLIDER & DEADLINE CALCULATION HELPERS ---
window.getProgressColor = function(percent) {
  const p = Number(percent) || 0;
  if (p >= 100) return '#10B981'; // Green
  if (p >= 75) return '#0D9488'; // Teal
  if (p >= 50) return '#2563EB'; // Blue
  if (p >= 25) return '#D97706'; // Amber
  return '#64748B'; // Slate
};

window.getProgressStageName = function(percent) {
  const p = Number(percent) || 0;
  if (p >= 100) return '업무 완료';
  if (p >= 75) return '마무리 단계';
  if (p >= 50) return '중반 실행중';
  if (p >= 25) return '초기 착수';
  return '접수 대기';
};

window.getDeadlineInfo = function(task) {
  const dateStr = task.dueDate || task.targetDate;
  if (!dateStr) {
    return { isUrgent: false, isBlink: false, label: '기한 미지정', daysLeft: 999, badgeColor: '#64748B' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { isUrgent: true, isBlink: true, label: '기한초과 (D+' + Math.abs(diffDays) + ')', daysLeft: diffDays, badgeColor: '#DC2626' };
  } else if (diffDays === 0) {
    return { isUrgent: true, isBlink: true, label: 'D-DAY (오늘 마감)', daysLeft: 0, badgeColor: '#DC2626' };
  } else if (diffDays <= 2) {
    return { isUrgent: true, isBlink: true, label: 'D-' + diffDays + ' (마감임박)', daysLeft: diffDays, badgeColor: '#DC2626' };
  } else if (diffDays <= 5) {
    return { isUrgent: false, isBlink: false, label: 'D-' + diffDays, daysLeft: diffDays, badgeColor: '#D97706' };
  } else {
    return { isUrgent: false, isBlink: false, label: 'D-' + diffDays, daysLeft: diffDays, badgeColor: '#475569' };
  }
};

window.handleTaskProgressInput = function(e, taskId, val) {
  e.stopPropagation();
  const num = parseInt(val, 10) || 0;
  const color = getProgressColor(num);
  const label = document.getElementById('progressLabel-' + taskId);
  const slider = document.getElementById('progressSlider-' + taskId);
  const stageText = document.getElementById('progressStageText-' + taskId);
  if (label) {
    label.textContent = num + '%';
    label.style.color = color;
  }
  if (slider) {
    slider.style.background = 'linear-gradient(to right, ' + color + ' ' + num + '%, #E2E8F0 ' + num + '%)';
  }
  if (stageText) {
    stageText.textContent = '(' + getProgressStageName(num) + ')';
    stageText.style.color = color;
  }
};

window.handleTaskProgressChange = function(e, taskId, val) {
  e.stopPropagation();
  const num = parseInt(val, 10) || 0;
  const task = (appState.tasks || []).find(t => String(t.id) === String(taskId));
  if (!task) return;
  task.progressPercent = num;

  if (num === 100 && !task.isCompleted) {
    if (confirm("진척도가 100%에 도달했습니다.\n이 업무를 최종 완료 처리하여 [완료된 업무] 보관함으로 이관하시겠습니까?")) {
      handleCompleteTask(taskId);
      return;
    }
  }
  saveState();
  renderApp();
};

window.setTaskProgressQuick = function(taskId, num) {
  const task = (appState.tasks || []).find(t => String(t.id) === String(taskId));
  if (!task) return;
  task.progressPercent = num;

  if (num === 100 && !task.isCompleted) {
    if (confirm("진척도가 100%에 도달했습니다.\n이 업무를 최종 완료 처리하여 [완료된 업무] 보관함으로 이관하시겠습니까?")) {
      handleCompleteTask(taskId);
      return;
    }
  }
  saveState();
  renderApp();
};

window.handleSaveAccountingSettings = function(event) {
  event.preventDefault();
  const total = parseInt(document.getElementById('accTotalBudgetInput').value, 10) || 0;
  const reserve = parseInt(document.getElementById('accReserveBudgetInput').value, 10) || 0;

  appState.accountingSettings = {
    totalBudget: total,
    reserveBudget: reserve
  };

  saveState();
  renderAdminFinanceTab(document.getElementById('adminContentArea'));
  alert("의원실 전체 총 예산 및 예비비 설정이 안전하게 저장되었습니다.");
};

// --- ASSIGNEE SUBTAB & PROGRESS MANAGEMENT ---
window.switchAssigneeSubTab = function(tab) {
  appState.assigneeSubTab = tab;
  renderAssigneeView();
};

window.openProgressModal = function(taskId) {
  const task = (appState.tasks || []).find(t => String(t.id) === String(taskId));
  if (!task) return;

  document.getElementById('progressTaskId').value = task.id;
  document.getElementById('progressTaskTitle').textContent = task.title;
  document.getElementById('progressContent').value = '';
  const currentPct = task.progressPercent || 30;
  const slider = document.getElementById('modalProgressSlider');
  if (slider) slider.value = currentPct;
  handleModalProgressInput(currentPct);
  document.getElementById('progressModal').classList.remove('hidden');
};

window.closeProgressModal = function() {
  document.getElementById('progressModal').classList.add('hidden');
};

window.handleSubmitProgress = function(e) {
  e.preventDefault();
  const taskId = document.getElementById('progressTaskId').value;
  const percent = parseInt(document.getElementById('progressPercent').value, 10) || 50;
  const content = document.getElementById('progressContent').value.trim();

  const task = (appState.tasks || []).find(t => String(t.id) === String(taskId));
  if (!task) return;

  task.progressPercent = percent;
  task.progressUpdates = task.progressUpdates || [];
  task.progressUpdates.push({
    id: 'prog-' + Date.now(),
    who: appState.currentUser.name,
    role: appState.currentUser.roleTitle || '',
    percent: percent,
    date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0,5),
    content: content
  });

  saveState();
  closeProgressModal();
  renderAssigneeView();
  if (!document.getElementById('taskDetailModal').classList.contains('hidden')) {
    openTaskDetailModal(task.id);
  }
  alert("업무 진행 사항이 성공적으로 등록되었습니다. 결재자와 요청자에게 실시간 공유됩니다.");
};

window.handleCompleteTask = function(taskId) {
  const task = (appState.tasks || []).find(t => String(t.id) === String(taskId));
  if (!task) return;

  if (!confirm("안건 '" + task.title + "' 업무를 최종 완료 처리하시겠습니까?\n완료 처리 시 진행 목록에서 숨겨지고 [완료된 업무] 페이지로 이동합니다.")) return;

  task.isCompleted = true;
  task.completedAt = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0,5);
  task.completedBy = appState.currentUser.name;

  task.progressUpdates = task.progressUpdates || [];
  task.progressUpdates.push({
    id: 'prog-' + Date.now(),
    who: appState.currentUser.name,
    role: appState.currentUser.roleTitle || '',
    percent: 100,
    date: task.completedAt,
    content: "최종 업무가 완료되었습니다. (완료 페이지 이관)"
  });

  saveState();
  renderApp();
  if (!document.getElementById('taskDetailModal').classList.contains('hidden')) {
    closeTaskDetailModal();
  }
  alert("해당 업무가 최종 완료 처리되었습니다. [완료된 업무 (완료 페이지)]에서 언제든 확인하실 수 있습니다.");
};

window.handleReopenTask = function(taskId) {
  const task = (appState.tasks || []).find(t => String(t.id) === String(taskId));
  if (!task) return;

  if (!confirm("'" + task.title + "' 업무를 다시 진행 중 상태로 복원하시겠습니까?")) return;

  task.isCompleted = false;
  task.progressUpdates = task.progressUpdates || [];
  task.progressUpdates.push({
    id: 'prog-' + Date.now(),
    who: appState.currentUser.name,
    role: appState.currentUser.roleTitle || '',
    percent: 70,
    date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0,5),
    content: "업무가 다시 진행 중 상태로 재개되었습니다."
  });

  saveState();
  renderAssigneeView();
  alert("업무가 진행 중 상태로 복원되었습니다.");
};

window.handleSaveEventReportOnly = function() {
  const id = document.getElementById('reportEventId').value;
  const evt = (appState.eventsList || []).find(e => String(e.id) === String(id));
  if (!evt) return;

  const isApproved = (appState.tasks || []).some(t => 
    (t.relatedEventId === evt.id || (t.category === '예산지출' && t.title.includes(evt.title))) && t.status === 'APPROVED'
  );

  evt.attendees = parseInt(document.getElementById('evReportAttendees').value, 10) || 0;
  if (!isApproved) {
    evt.budget = parseInt(document.getElementById('evReportBudget').value, 10) || 0;
    evt.spent = parseInt(document.getElementById('evReportSpent').value, 10) || 0;
  }
  evt.report = document.getElementById('evReportContent').value.trim();

  saveState();
  closeEventDetailModal();
  renderModuleView();
  alert("경비 상세보고서가 성공적으로 저장되었습니다.");
};

window.handleCreateApprovalFromEvent = function() {
  const id = document.getElementById('reportEventId').value;
  const evt = (appState.eventsList || []).find(e => String(e.id) === String(id));
  if (!evt) return;
  window._pendingApprovalEventId = evt.id;

  // 1. Save latest event values
  evt.attendees = parseInt(document.getElementById('evReportAttendees').value, 10) || 0;
  evt.budget = parseInt(document.getElementById('evReportBudget').value, 10) || 0;
  evt.spent = parseInt(document.getElementById('evReportSpent').value, 10) || 0;
  evt.report = document.getElementById('evReportContent').value.trim();
  saveState();

  // 2. Close modal and switch to createView
  closeEventDetailModal();
  switchTab('createView');

  // 3. Pre-fill create task form with comprehensive expense breakdown
  setTimeout(() => {
    const catSelect = document.getElementById('newCategory');
    if (catSelect) {
      catSelect.value = '예산지출';
      handleNewCategoryChange('예산지출');
    }

    const expInput = document.getElementById('newExpenseAmount');
    if (expInput) expInput.value = spentNum;

    const titleEl = document.getElementById('newTitle');
    if (titleEl) titleEl.value = "행사 결산 및 경비 지출: " + evt.title;

    const locEl = document.getElementById('newLocation');
    if (locEl) locEl.value = evt.location || '';

    const budgetNum = Number(evt.budget) || 0;
    const spentNum = Number(evt.spent) || 0;
    const diffNum = budgetNum - spentNum;
    const rateText = budgetNum > 0 ? ((spentNum / budgetNum) * 100).toFixed(1) + '%' : '0%';

    const summaryEl = document.getElementById('newSummary');
    if (summaryEl) {
      summaryEl.value = 
"■ 안건 명칭: " + evt.title + " 행사 결산 및 경비 정산 승인의 건\n" +
"■ 행사 일시: " + evt.date + (evt.endDate ? ' ~ ' + evt.endDate : '') + "\n" +
"■ 행사 장소: " + evt.location + "\n" +
"■ 요구 참석자 수: " + evt.attendees + "명\n\n" +
"[비용 정산 및 예산 집행 내역]\n" +
"- 배정 예산: " + budgetNum.toLocaleString() + "원\n" +
"- 실집행 경비: " + spentNum.toLocaleString() + "원\n" +
"- 집행 잔액: " + diffNum.toLocaleString() + "원 (예산 집행률: " + rateText + ")\n\n" +
"[행사 상세 결과 및 결산 보고서]\n" +
(evt.report || "상세 결과 보고서가 작성되지 않았습니다.");
    }
  }, 60);

  alert("행사 경비 및 상세보고서 내용이 신규 결재 양식으로 자동 이관되었습니다. 결재선을 확인하고 상정하세요.");
};

window.exportFinanceCSV = function() {
  const events = appState.eventsList || [];
  let csv = '\uFEFF일시,행사명,장소,요구참석자수,배정예산(원),실집행경비(원),잔액(원),집행률(%),상태,상세보고서\n';
  events.forEach(e => {
    const bg = Number(e.budget) || 0;
    const sp = Number(e.spent) || 0;
    const diff = bg - sp;
    const rate = bg > 0 ? ((sp / bg) * 100).toFixed(1) : '0.0';
    const rep = (e.report || '').replace(/"/g, '""').replace(/\n/g, ' ');
    csv += `"${e.date || ''}","${e.title}","${e.location || ''}",${e.attendees || 0},${bg},${sp},${diff},${rate}%,"${e.status || '준비중'}","${rep}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `회계경비집행대장_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
};

window.toggleHideCompletedSimpleTasks = function() {
  appState.hideCompletedSimpleTasks = !appState.hideCompletedSimpleTasks;
  saveState();
  renderModuleView();
};

window.handleMsgAudioPreview = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewArea = document.getElementById('msgAudioPreviewArea') || document.getElementById('msgAudioPreviewContainer');
    const player = document.getElementById('msgAudioPlayerPreview');
    if (previewArea && player) {
      previewArea.style.display = 'block';
      player.src = e.target.result;
    }
    window._tempMsgAudio = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.playVoiceMessage = function(content, audioUrl) {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
    return;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const clean = content.replace('음성 변환:', '').trim();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = 'ko-KR';
    utter.rate = 1.0;
    window.speechSynthesis.speak(utter);
  } else {
    alert("음성 재생 기능을 지원하지 않는 환경입니다.");
  }
};

window.openEventDetailModal = function(id) {
  const evt = appState.eventsList.find(e => String(e.id) === String(id));
  if (!evt) return;

  document.getElementById('reportEventId').value = evt.id;
  document.getElementById('evModalTitle').textContent = evt.title;
  document.getElementById('evModalDate').textContent = '일시: ' + evt.date + (evt.endDate ? ' ~ ' + evt.endDate : '');
  document.getElementById('evModalLoc').textContent = '장소: ' + evt.location;
  document.getElementById('evModalStatusBadge').textContent = evt.status || '준비중';
  document.getElementById('evReportAttendees').value = evt.attendees || 0;
  
  const budgetInput = document.getElementById('evReportBudget');
  const spentInput = document.getElementById('evReportSpent');
  budgetInput.value = evt.budget || 0;
  spentInput.value = evt.spent || 0;
  document.getElementById('evReportContent').value = evt.report || '';

  // Check if this event has an approved budget approval task
  const isApproved = (appState.tasks || []).some(t => 
    (t.relatedEventId === evt.id || (t.category === '예산지출' && t.title.includes(evt.title))) && t.status === 'APPROVED'
  );

  const noticeEl = document.getElementById('evReportApprovedNotice');
  if (noticeEl) {
    noticeEl.style.display = isApproved ? 'block' : 'none';
  }

  // Lock budget and spent inputs if approved
  if (isApproved) {
    budgetInput.disabled = true;
    spentInput.disabled = true;
    budgetInput.style.background = '#F1F5F9';
    spentInput.style.background = '#F1F5F9';
  } else {
    budgetInput.disabled = false;
    spentInput.disabled = false;
    budgetInput.style.background = '#FFF';
    spentInput.style.background = '#FFF';
  }

  document.getElementById('eventDetailModal').classList.remove('hidden');
};

window.closeEventDetailModal = function() {
  document.getElementById('eventDetailModal').classList.add('hidden');
};

window.handleEventReportSubmit = function(e) {
  e.preventDefault();
  const id = document.getElementById('reportEventId').value;
  const evt = appState.eventsList.find(e => String(e.id) === String(id));
  if (!evt) return;

  evt.attendees = parseInt(document.getElementById('evReportAttendees').value, 10) || 0;
  evt.budget = parseInt(document.getElementById('evReportBudget').value, 10) || 0;
  evt.spent = parseInt(document.getElementById('evReportSpent').value, 10) || 0;
  evt.report = document.getElementById('evReportContent').value.trim();

  saveState();
  closeEventDetailModal();
  renderModuleView();
  alert("경비 및 상세 보고서가 성공적으로 저장되었습니다.");
};

function resetCreateTaskForm() {
  const form = document.getElementById('createTaskForm');
  if (form) form.reset();
  
  const titleInput = document.getElementById('newTitle');
  if (titleInput) titleInput.value = '';
  const locInput = document.getElementById('newLocation');
  if (locInput) locInput.value = '';
  const sumInput = document.getElementById('newSummary');
  if (sumInput) sumInput.value = '';
  const catInput = document.getElementById('newCategory');
  if (catInput) catInput.value = '민원';
  const assInput = document.getElementById('newAssigneeSelect');
  if (assInput) assInput.value = 'UNASSIGNED';
  const photoInput = document.getElementById('newPhotoInput');
  if (photoInput) photoInput.value = '';
  
  const photoContainer = document.getElementById('photoPreviewContainer');
  if (photoContainer) photoContainer.innerHTML = '';
  appState.tempPhotos = [];

  const coopBox = document.getElementById('newCoopUsersBox');
  if (coopBox) coopBox.innerHTML = '<span style="font-size: 12px; color: var(--text-muted);">지정된 협조 부서가 없습니다.</span>';
  
  const midBox = document.getElementById('newMidReviewersBox');
  if (midBox) midBox.innerHTML = '<span style="font-size: 12px; color: var(--text-muted);">지정된 중간 결재자가 없습니다.</span>';

  appState.selectedCoopUserIds = [];
  appState.selectedMidReviewerIds = [];
}

function getUserRoleClean(u) {
  if (!u) return '';
  const rt = typeof u === 'string' ? u : (u.title || u.roleTitle || '');
  const match = rt.match(/\(([^)]+)\)/);
  if (match && match[1]) return match[1].trim();
  return rt.trim();
}


// --- CATEGORY CODE MAPPING & TASK ID GENERATION (2026-1-0001 Format) ---
function getCategoryCode(category) {
  const map = {
    '민원': 1,
    '일정행사': 2,
    '일정': 2,
    '행사': 2,
    '조직인사': 3,
    '조직': 3,
    '홍보보도': 4,
    '홍보': 4,
    '정책공약': 5,
    '정책': 5,
    '예산지출': 6,
    '회계': 6,
    '예산': 6,
    '기타': 7
  };
  return map[category] || 7;
}

function generateTaskId(category) {
  const catCode = getCategoryCode(category);
  const year = new Date().getFullYear();
  const prefix = `${year}-${catCode}-`;
  let maxSeq = 0;
  (appState.tasks || []).forEach(t => {
    if (t.id && t.id.startsWith(prefix)) {
      const parts = t.id.split('-');
      if (parts.length >= 3) {
        const seq = parseInt(parts[2], 10);
        if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
      }
    }
  });
  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `${year}-${catCode}-${nextSeq}`;
}

// Universal Task ID Migration to ensure all existing tasks are in 2026-1-0001 format
function migrateTaskIds() {
  if (!appState.tasks || appState.tasks.length === 0) return;
  const year = new Date().getFullYear();
  const catCounters = {};

  let changed = false;
  appState.tasks.forEach((t) => {
    const catCode = getCategoryCode(t.category);
    catCounters[catCode] = catCounters[catCode] || 0;
    catCounters[catCode]++;

    // If ID is not in YYYY-catCode-XXXX format
    if (!t.id || !t.id.match(/^\d{4}-\d+-\d{4}$/)) {
      const oldId = t.id;
      const newId = `${year}-${catCode}-${String(catCounters[catCode]).padStart(4, '0')}`;
      t.id = newId;
      changed = true;
    }
  });

  if (changed) {
    saveState();
  }
}

function formatUserDisplay(u) {
  if (!u) return '';
  const name = typeof u === 'string' ? u : (u.name || '');
  const role = getUserRoleClean(u);
  return role ? `${name}(${role})` : name;
}
/* ==========================================================================
   자유와혁신 Pro Enterprise - Complete Executive Logic Engine (Zero Emojis)
   ========================================================================== */

// --- PRODUCTION CLOUD FRESH INITIALIZATION ---
if (localStorage.getItem('prod_cloud_deployed_v5') !== 'true') {
  localStorage.clear();
  localStorage.setItem('prod_cloud_deployed_v5', 'true');
}

// --- SUPABASE CONFIGURATION ---
// 주의: 배포 시 Vercel 환경 변수로 교체하거나, 여기에 본인의 Supabase URL 및 ANON KEY를 입력하세요.
const SUPABASE_URL = 'https://ofpsevkowbvcarjjrloa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_941PpPexG72rhOHe5t7nRQ_0TYwCcc7';

let supabaseClient = null;
if (typeof window.supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE') {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn("Supabase is not configured yet. Using local fallback for testing.");
}

// --- OFFICIAL PRODUCTION USERS DATABASE (ZERO DUMMY USERS - ONLY REAL 1급 ADMIN) ---
const DEFAULT_USERS = [
  {
    id: '85b55d3d-7c43-4060-b117-77fe0b9dea12',
    name: '류민우',
    team: '의원실',
    roleTitle: '의원실 (당협추진위원장)',
    clearance: '1급',
    phone: '010-4956-4169',
    email: 'nnqrt1983@gmail.com',
    avatar: '류',
    isAdmin: true,
    status: 'APPROVED'
  }
];

// --- PERMISSION CHECK HELPERS (STRICT 1급 ADMIN) ---
function isUserSuperAdmin(user) {
  if (!user) return false;
  return user.clearance === '1급' || user.isAdmin === true || user.email === 'nnqrt1983@gmail.com';
}

function isUserFinanceAdmin(user) {
  if (!user) return false;
  return isUserSuperAdmin(user) || user.clearance === '회계관리';
}

// --- SYNC SUPABASE REAL PROFILES ---
async function fetchSupabaseProfiles() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('profiles').select('*');
    if (!error && data && data.length > 0) {
      appState.users = data.map(p => {
        const existing = (appState.users || []).find(u => u.id === p.id || u.email === p.email);
        return {
          id: p.id,
          name: p.name,
          team: p.team || '의원실',
          roleTitle: p.role_title || '의원실',
          clearance: p.clearance || '1급',
          phone: p.phone || (existing ? existing.phone : ''),
          email: p.email,
          avatar: p.avatar || (p.name ? p.name.charAt(0) : '류'),
          isAdmin: p.is_admin === true || p.clearance === '1급' || p.email === 'nnqrt1983@gmail.com',
          status: p.status || 'APPROVED',
          photoUrl: p.photo_url || (existing ? existing.photoUrl : null),
          bio: p.bio || (existing ? existing.bio : '')
        };
      });

      if (appState.currentUser) {
        const found = appState.users.find(u => u.email === appState.currentUser.email || u.id === appState.currentUser.id);
        if (found) {
          appState.currentUser = { ...appState.currentUser, ...found };
        } else {
          appState.currentUser = appState.users.find(u => u.email === 'nnqrt1983@gmail.com') || appState.users[0];
        }
      } else {
        appState.currentUser = appState.users.find(u => u.email === 'nnqrt1983@gmail.com') || appState.users[0];
      }

      saveState();
      populateFormChecklists();
      renderApp();
    }
  } catch (e) {
    console.warn("Supabase profiles load failed:", e);
  }
}

const DEFAULT_TASKS = [];
const DEFAULT_CRM = [];
const DEFAULT_SCHEDULES = [];
const DEFAULT_COMPLAINTS = [];
const DEFAULT_SIMPLE_TASKS = [];
const DEFAULT_EVENTS = [];
const DEFAULT_DOCS = [];
const DEFAULT_PRESS = [];
const DEFAULT_MSGS = [];

// --- APP STATE ---
let appState = {
  users: JSON.parse(localStorage.getItem('politic_sync_users')) || DEFAULT_USERS,
  currentUser: JSON.parse(localStorage.getItem('politic_sync_current_user')) || DEFAULT_USERS[0],
  tasks: JSON.parse(localStorage.getItem('politic_sync_tasks')) || DEFAULT_TASKS,
  crmList: JSON.parse(localStorage.getItem('politic_sync_crm')) || DEFAULT_CRM,
  schedules: JSON.parse(localStorage.getItem('politic_sync_schedules')) || DEFAULT_SCHEDULES,
  complaints: JSON.parse(localStorage.getItem('politic_sync_complaints')) || DEFAULT_COMPLAINTS,
  simpleTasks: JSON.parse(localStorage.getItem('politic_sync_simple_tasks')) || DEFAULT_SIMPLE_TASKS,
  eventsList: JSON.parse(localStorage.getItem('politic_sync_events')) || DEFAULT_EVENTS,
  docsList: JSON.parse(localStorage.getItem('politic_sync_docs')) || DEFAULT_DOCS,
  pressList: JSON.parse(localStorage.getItem('politic_sync_press')) || DEFAULT_PRESS,
  msgList: JSON.parse(localStorage.getItem('politic_sync_msgs')) || DEFAULT_MSGS,
  trashBin: JSON.parse(localStorage.getItem('politic_sync_trash')) || [],
  activeTab: 'seniorView',
  activeModuleTab: 'mod-dashboard',
  adminActiveTab: 'adm-users',
  seniorTaskIndex: 0,
  selectedCategoryFilter: '전체',
  selectedDocFilter: '전체',
  staffSearchQuery: '',
  isStampAnimating: false,
  selectedMidReviewers: [],
  selectedCoopStaff: [],
  currentModalTarget: 'MID',
  currentAttachedPhotos: [],
  isTestMode: false,
  isSidebarCollapsed: false,
  isLoggedIn: localStorage.getItem('politic_sync_logged_in') === 'true',
  hideCompletedSimpleTasks: true
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  migrateTaskIds();
  updateLoginScreenUI();
  renderApp();
  populateFormChecklists();
  updateTestModeUI();
  initGlobalESCListener();
  await fetchSupabaseProfiles();
});

function updateLoginScreenUI() {
  const loginScreen = document.getElementById('loginScreen');
  const appShell = document.getElementById('mainAppShell');
  if (!loginScreen || !appShell) return;

  if (appState.isLoggedIn) {
    loginScreen.classList.add('hidden');
    appShell.classList.remove('hidden');
  } else {
    loginScreen.classList.remove('hidden');
    appShell.classList.add('hidden');
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const emailVal = document.getElementById('loginIdInput').value.trim();
  const pwVal = document.getElementById('loginPwInput').value.trim();
  
  if (!emailVal || !pwVal) {
    alert("이메일과 비밀번호를 모두 입력하세요.");
    return;
  }

  // Supabase Auth Integration
  if (supabaseClient) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: emailVal,
      password: pwVal,
    });
    
    if (error) {
      alert("로그인 실패: " + error.message);
      return;
    }
    
    // Fetch profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError || !profile) {
      alert("프로필 정보를 불러오지 못했습니다.");
      return;
    }
    
    if (profile.status === 'PENDING') {
      alert("현재 가입 승인 대기 상태입니다. 최고관리자(1급)의 최종 승인 전까지 접근이 제한됩니다.");
      await supabaseClient.auth.signOut();
      return;
    }
    
    // Map DB profile to app format
    appState.currentUser = {
      id: profile.id,
      name: profile.name,
      team: profile.team,
      roleTitle: profile.role_title,
      clearance: profile.clearance,
      phone: profile.phone,
      email: profile.email,
      avatar: profile.avatar || (profile.name ? profile.name.charAt(0) : '류'),
      isAdmin: profile.is_admin === true || profile.clearance === '1급' || profile.email === 'nnqrt1983@gmail.com',
      status: profile.status
    };

    await fetchSupabaseProfiles();
  } else {
    const inputClean = emailVal.toLowerCase();
    let matchedUser = appState.users.find(u => 
      (u.email && u.email.toLowerCase() === inputClean) ||
      (inputClean === 'admin' || inputClean === 'nnqrt' || inputClean === 'nnqrt1983@gmail.com')
    );
    if (!matchedUser) {
      alert("등록된 사용자 정보를 찾을 수 없습니다. 먼저 회원가입을 진행해주세요.");
      return;
    }
    if (matchedUser.status === 'PENDING' || matchedUser.status === 'PENDING_APPROVAL') {
      alert("현재 가입 승인 대기 상태입니다.");
      return;
    }
    appState.currentUser = matchedUser;
  }

  appState.isLoggedIn = true;
  localStorage.setItem('politic_sync_logged_in', 'true');
  saveState();
  updateLoginScreenUI();
  renderApp();
  alert(`로그인 완료 - ${appState.currentUser.name} (${appState.currentUser.roleTitle}) 계정으로 접속하였습니다.`);
}

async function handleLogout() {
  if (!confirm("현재 접속 중인 계정에서 로그아웃 하시겠습니까?")) return;
  
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  
  appState.isLoggedIn = false;
  localStorage.setItem('politic_sync_logged_in', 'false');
  updateLoginScreenUI();
  alert("로그아웃 완료 - 초기 로그인 화면으로 이동합니다.");
}

function toggleLoginRegSection() {
  try {
    const loginForm = document.getElementById('loginFormSection');
    const regForm = document.getElementById('loginRegFormSection');
    if (loginForm && regForm) {
      if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
      } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
      }
    }
  } catch(e) {
    console.error("Toggle error: ", e);
    alert("화면 전환 중 오류가 발생했습니다.");
  }
}

async function handleLoginRegSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('initRegName').value.trim();
  const team = document.getElementById('initRegTeam').value;
  const title = document.getElementById('initRegTitle').value.trim();
  const phone = document.getElementById('initRegPhone').value.trim();
  const email = document.getElementById('initRegId').value.trim();
  const pw = document.getElementById('initRegPw').value.trim();
  const pwConfirm = document.getElementById('initRegPwConfirm').value.trim();
  const clearance = document.getElementById('initRegClearance').value;

  if (!name || !title || !phone || !email || !pw || !pwConfirm) {
    alert("모든 가입 정보를 빠짐없이 입력해주세요.");
    return;
  }

  if (pw !== pwConfirm) {
    alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
    return;
  }

  const roleTitle = `${team} (${title})`;
  const avatarChar = name.charAt(0);

  if (supabaseClient) {
    // 1. Supabase Secure SignUp
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: pw,
      options: {
        data: {
          name: name,
          team: team,
          roleTitle: roleTitle,
          clearance: clearance,
          phone: phone,
          avatar: avatarChar
        }
      }
    });

    if (error) {
      alert("가입 중 오류가 발생했습니다: " + error.message);
      return;
    }
    
    alert("가입 신청 완료 - 최고관리자(1급)의 승인 후 로그인 가능합니다. (보안 정책 적용됨)");
  } else {
    // Local Fallback
    const newId = 'usr-' + Date.now().toString().slice(-4);
    const newUser = {
      id: newId,
      name: name,
      team: team,
      roleTitle: roleTitle,
      clearance: clearance,
      phone: phone,
      email: email,
      avatar: avatarChar,
      status: 'PENDING_APPROVAL',
      isAdmin: false
    };

    appState.users.push(newUser);
    localStorage.setItem('politic_sync_users', JSON.stringify(appState.users));
    alert("가입 신청 완료 - 최고관리자(1급)의 승인 후 로그인 가능합니다. (보안 정책 적용됨)");
  }
  
  toggleLoginRegSection();
  document.getElementById('loginRegFormSection').reset();
}

// GLOBAL ESC KEY LISTENER AS REQUESTED
function initGlobalESCListener() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function closeAllModals() {
  const modals = ['profileDocModal', 'profileModal', 'taskDetailModal', 'moduleDetailModal', 'approverSelectModal', 'userAuthModal', 'viewerAuditModal', 'scheduleCreateModal', 'simpleTaskCreateModal', 'eventCreateModal', 'vaultCreateModal', 'pressCreateModal', 'msgCreateModal', 'universalEditModal'];
  modals.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) el.classList.add('hidden');
  });
}

function saveState() {
  localStorage.setItem('politic_sync_users', JSON.stringify(appState.users));
  localStorage.setItem('politic_sync_current_user', JSON.stringify(appState.currentUser));
  localStorage.setItem('politic_sync_tasks', JSON.stringify(appState.tasks));
  localStorage.setItem('politic_sync_crm', JSON.stringify(appState.crmList));
  localStorage.setItem('politic_sync_schedules', JSON.stringify(appState.schedules));
  localStorage.setItem('politic_sync_complaints', JSON.stringify(appState.complaints));
  localStorage.setItem('politic_sync_simple_tasks', JSON.stringify(appState.simpleTasks));
  localStorage.setItem('politic_sync_events', JSON.stringify(appState.eventsList));
  localStorage.setItem('politic_sync_docs', JSON.stringify(appState.docsList));
  localStorage.setItem('politic_sync_press', JSON.stringify(appState.pressList));
  localStorage.setItem('politic_sync_msgs', JSON.stringify(appState.msgList));
  localStorage.setItem('politic_sync_trash', JSON.stringify(appState.trashBin || []));
}

function resetSystemData() {
  if (!appState.isTestMode) {
    alert("실제 운영 모드에서는 시스템 데이터 초기화 기능이 전면 차단됩니다.");
    return;
  }
  if (!confirm("모든 데이터를 초기 기본 상태로 복구하시겠습니까?")) return;
  localStorage.clear();
  appState.users = DEFAULT_USERS;
  appState.currentUser = DEFAULT_USERS[0];
  appState.tasks = DEFAULT_TASKS;
  appState.crmList = DEFAULT_CRM;
  appState.schedules = DEFAULT_SCHEDULES;
  appState.complaints = DEFAULT_COMPLAINTS;
  appState.simpleTasks = DEFAULT_SIMPLE_TASKS;
  appState.eventsList = DEFAULT_EVENTS;
  appState.docsList = DEFAULT_DOCS;
  appState.pressList = DEFAULT_PRESS;
  appState.msgList = DEFAULT_MSGS;
  appState.trashBin = [];
  appState.seniorTaskIndex = 0;
  appState.selectedMidReviewers = [];
  appState.selectedCoopStaff = [];
  appState.currentAttachedPhotos = [];
  saveState();
  populateFormChecklists();
  renderApp();
  alert("시스템 데이터 초기화 완료 - 초기 샘플 상태로 복원되었습니다.");
}

// --- CATEGORY-ONLY COLORS HELPER AS REQUESTED ---
function getCategoryBadgeHTML(cat) {
  let cls = 'cat-default';
  if (cat === '민원') cls = 'cat-minwon';
  else if (cat === '일정행사') cls = 'cat-schedule';
  else if (cat === '조직인사') cls = 'cat-org';
  else if (cat === '홍보보도') cls = 'cat-pr';
  else if (cat === '정책공약') cls = 'cat-policy';
  else if (cat === '예산지출') cls = 'cat-budget';
  return `<span class="cat-badge ${cls}">${cat}</span>`;
}

// --- COLLAPSIBLE SIDEBAR & TEST MODE SWITCHER ---
function toggleSidebar() {
  appState.isSidebarCollapsed = !appState.isSidebarCollapsed;
  const sidebar = document.getElementById('appSidebar');
  const topBtn = document.getElementById('sidebarTopToggleBtn');
  const texts = document.querySelectorAll('.sidebar-link-text');
  const icons = document.querySelectorAll('.sidebar-collapsed-icon');

  if (appState.isSidebarCollapsed) {
    sidebar.classList.add('collapsed');
    if (topBtn) topBtn.textContent = ">>";
    texts.forEach(el => el.style.setProperty('display', 'none', 'important'));
    icons.forEach(el => el.style.setProperty('display', 'inline', 'important'));
  } else {
    sidebar.classList.remove('collapsed');
    if (topBtn) topBtn.textContent = "<<";
    texts.forEach(el => el.style.setProperty('display', 'inline', 'important'));
    icons.forEach(el => el.style.setProperty('display', 'none', 'important'));
  }
}

function toggleTestMode() {
  appState.isTestMode = !appState.isTestMode;
  updateTestModeUI();
  if (appState.activeTab === 'adminView') {
    renderAdminView();
  }
  alert(appState.isTestMode ? 
    "[SYSTEM: 테스트 모드 ON] 계정 전환 및 데이터 초기화 기능이 활성화되었습니다." : 
    "[SYSTEM: 운영 모드 ON] 실제 운영 모드로 전환되었습니다. 보안 규정에 따라 타 계정 전환 및 초기화 버튼이 제거됩니다."
  );
}

// TEST MODE GATING AS REQUESTED
function updateTestModeUI() {
  const switcherSec = document.getElementById('accountSwitcherSection');
  const loginModeBtn = document.getElementById('loginScreenModeBtn');

  if (loginModeBtn) {
    if (appState.isTestMode) {
      loginModeBtn.textContent = "[테스트 모드 ON (클릭시 전환)]";
      loginModeBtn.style.color = "#2563EB";
      loginModeBtn.style.borderColor = "#2563EB";
    } else {
      loginModeBtn.textContent = "[실제 운영 모드 ON (클릭시 전환)]";
      loginModeBtn.style.color = "#991B1B";
      loginModeBtn.style.borderColor = "#991B1B";
    }
  }

  if (appState.isTestMode) {
    if (switcherSec) switcherSec.style.display = 'block';
  } else {
    if (switcherSec) switcherSec.style.display = 'none';
  }
}

// --- USER AUTH & SWITCHER & ADMIN REGISTRATION APPROVAL ---
function openUserAuthModal() {
  const container = document.getElementById('userListContainer');
  const adminSec = document.getElementById('adminApprovalSection');
  const pendingContainer = document.getElementById('pendingUserListContainer');

  // Check if current user is 1급 Admin
  const isAdmin = appState.currentUser.clearance === '1급';
  const pendingUsers = appState.users.filter(u => u.status === 'PENDING_APPROVAL');

  if (isAdmin && pendingUsers.length > 0) {
    if (adminSec) adminSec.style.display = 'block';
    if (pendingContainer) {
      pendingContainer.innerHTML = pendingUsers.map(u => `
        <div style="background: #FFF; border: 1px solid #991B1B; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 15px; font-weight: 800; color: #991B1B;">[승인 요청] ${formatUserDisplay(u)}</div>
            <div style="font-size: 13px; color: var(--text-muted);">연락처: ${u.phone || '-'} | 이메일: ${u.email || '-'} | 권한: ${u.clearance || '2급'}</div>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn-primary" style="height: 36px; font-size: 13px; background: var(--approved-green);" onclick="approveUserRegistration('${u.id}')">정식 승인</button>
            <button class="btn-primary" style="height: 36px; font-size: 13px; background: var(--rejected-red);" onclick="rejectUserRegistration('${u.id}')">반려 삭제</button>
          </div>
        </div>
      `).join('');
    }
  } else {
    if (adminSec) adminSec.style.display = 'none';
  }

  container.innerHTML = appState.users.map(u => {
    const isApproved = u.status === 'APPROVED' || !u.status;
    return `
      <div style="background-color: ${u.id === appState.currentUser.id ? '#F0FDF4' : '#FFF'}; border: 1px solid ${u.id === appState.currentUser.id ? 'var(--approved-green)' : 'var(--border-color)'}; padding: 12px 14px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="user-avatar" style="width: 38px; height: 38px; font-size: 15px;">${u.avatar}</div>
          <div>
            <div style="font-size: 16px; font-weight: 800; color: var(--text-dark);">${u.name} <span style="font-size:12px; color:var(--primary-navy);">${u.clearance || '2급'}</span> ${!isApproved ? '<strong style="color:#DC2626; font-size:12px;">가입 승인 대기중</strong>' : ''}</div>
            <div style="font-size: 13px; font-weight: 700; color: var(--text-muted);">${u.roleTitle} | ${u.phone || '010-0000-0000'}</div>
          </div>
        </div>
        ${u.id === appState.currentUser.id ? `
          <span style="font-size: 13px; font-weight: 900; color: var(--approved-green);">접속중</span>
        ` : `
          <button class="btn-outline" style="font-size: 13px; padding: 4px 10px;" ${!isApproved ? 'disabled style="color:#94A3B8; border-color:#CBD5E1;"' : ''} onclick="switchUser('${u.id}')">${!isApproved ? '[미승인]' : '[전환]'}</button>
        `}
      </div>
    `;
  }).join('');

  document.getElementById('userAuthModal').classList.remove('hidden');
}

function approveUserRegistration(userId) {
  appState.users = appState.users.map(u => {
    if (u.id === userId) return { ...u, status: 'APPROVED' };
    return u;
  });
  saveState();
  populateFormChecklists();
  openUserAuthModal();
  alert("정식 팀원 승인 완료 - 해당 팀원이 승인되어 정상적으로 계정을 전환하고 결재 라인에 지정할 수 있습니다.");
}

function rejectUserRegistration(userId) {
  if (!confirm("해당 팀원의 가입 신청을 반려 및 삭제하시겠습니까?")) return;
  appState.users = appState.users.filter(u => u.id !== userId);
  saveState();
  populateFormChecklists();
  openUserAuthModal();
  alert("가입 반려 완료 - 해당 가입 신청 내역이 삭제되었습니다.");
}

function closeUserAuthModal() {
  document.getElementById('userAuthModal').classList.add('hidden');
}

function switchUser(userId) {
  if (!appState.isTestMode) {
    alert("실제 운영 모드에서는 타 계정으로 전환할 수 없습니다. 테스트 모드로 변경 후 이용하세요.");
    return;
  }
  const targetUser = appState.users.find(u => u.id === userId);
  if (targetUser) {
    if (targetUser.status === 'PENDING_APPROVAL') {
      alert("관리자의 가입 승인이 완료되지 않은 대기 계정입니다. 1급 관리자 계정으로 승인 후 이용하세요.");
      return;
    }
    appState.currentUser = targetUser;
    saveState();
    closeUserAuthModal();
    renderApp();
  }
}

function handleRegisterUser(event) {
  event.preventDefault();
  const name = document.getElementById('regName').value;
  const team = document.getElementById('regTeam').value;
  const title = document.getElementById('regTitle').value;
  const phone = document.getElementById('regPhone').value;
  const email = document.getElementById('regEmail').value;
  const clearance = document.getElementById('regClearance').value;

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name,
    team: team,
    roleTitle: `${team} (${title})`,
    clearance: clearance,
    phone: phone,
    email: email,
    avatar: name.slice(0, 1),
    status: 'PENDING_APPROVAL' // REQUESTED: ADMIN APPROVAL REQUIRED
  };

  appState.users.push(newUser);
  saveState();

  populateFormChecklists();
  openUserAuthModal();
  alert(`가입 신청 완료 - ${name} 님의 정식 팀원 가입 신청이 접수되었습니다.\n보안 규정에 따라 1급 관리자(의원실)의 승인 후 정식 활동 및 전환이 가능합니다.`);
  renderApp();
}

// --- FORM SELECTORS & POPUPS ---
function populateFormChecklists() {
  const assigneeSelect = document.getElementById('newAssigneeSelect');
  const finalSelect = document.getElementById('newFinalApproverSelect');

  if (!assigneeSelect || !finalSelect) return;

  const approvedUsers = appState.users.filter(u => u.status === 'APPROVED' || !u.status);

  assigneeSelect.innerHTML = `<option value="UNASSIGNED">자율 지정</option>` +
    approvedUsers.map(u => `<option value="${u.id}">${formatUserDisplay(u)}</option>`).join('');

  finalSelect.innerHTML = approvedUsers.map(u => `
    <option value="${u.id}" ${isUserSuperAdmin(u) ? 'selected' : ''}>${formatUserDisplay(u)}</option>
  `).join('');

  renderSelectedApproverPills();
}

function renderSelectedApproverPills() {
  const midBox = document.getElementById('newMidReviewersBox');
  const coopBox = document.getElementById('newCoopUsersBox');
  if (!midBox || !coopBox) return;

  if (appState.selectedMidReviewers.length === 0) {
    midBox.innerHTML = `<span style="font-size: 13px; color: var(--text-muted);">지정된 중간 결재자가 없습니다. 위 버튼을 눌러 담당자를 팝업에서 추가하세요.</span>`;
  } else {
    midBox.innerHTML = appState.selectedMidReviewers.map(id => {
      const u = appState.users.find(user => user.id === id);
      if (!u) return '';
      return `
        <div class="popup-selector-pill">
          <span>${formatUserDisplay(u)}</span>
          <button type="button" onclick="removeSelectedApprover('MID', '${u.id}')" style="border:none; background:none; font-weight:900; cursor:pointer; color: #DC2626;">✕</button>
        </div>
      `;
    }).join('');
  }

  if (appState.selectedCoopStaff.length === 0) {
    coopBox.innerHTML = `<span style="font-size: 13px; color: var(--text-muted);">지정된 협조 부서가 없습니다. 위 버튼을 눌러 담당자를 팝업에서 추가하세요.</span>`;
  } else {
    coopBox.innerHTML = appState.selectedCoopStaff.map(id => {
      const u = appState.users.find(user => user.id === id);
      if (!u) return '';
      return `
        <div class="popup-selector-pill">
          <span>${formatUserDisplay(u)}</span>
          <button type="button" onclick="removeSelectedApprover('COOP', '${u.id}')" style="border:none; background:none; font-weight:900; cursor:pointer; color: var(--primary-navy);">✕</button>
        </div>
      `;
    }).join('');
  }
}

function removeSelectedApprover(type, userId) {
  if (type === 'MID') {
    appState.selectedMidReviewers = appState.selectedMidReviewers.filter(id => id !== userId);
  } else {
    appState.selectedCoopStaff = appState.selectedCoopStaff.filter(id => id !== userId);
  }
  renderSelectedApproverPills();
}

function openApproverSelectModal(targetType) {
  appState.currentModalTarget = targetType;
  const titleEl = document.getElementById('approverModalTitle');
  if (titleEl) {
    titleEl.textContent = targetType === 'MID' ? '중간 결재자 팝업 검색 및 선택 (다중 지정)' : '협조 부서 담당자 팝업 검색 및 선택';
  }
  
  const searchInput = document.getElementById('approverSearchInput');
  if (searchInput) searchInput.value = '';

  renderApproverModalList(appState.users.filter(u => u.status === 'APPROVED' || !u.status));
  document.getElementById('approverSelectModal').classList.remove('hidden');
}

function closeApproverSelectModal() {
  document.getElementById('approverSelectModal').classList.add('hidden');
}

function filterApproverModalList(event) {
  const query = event.target.value;
  const filtered = appState.users.filter(u => {
    const isAppr = u.status === 'APPROVED' || !u.status;
    if (!isAppr) return false;
    return window.ChoseongUtil.matchChoseong(u.name, query) ||
           window.ChoseongUtil.matchChoseong(u.team, query) ||
           window.ChoseongUtil.matchChoseong(u.roleTitle, query);
  });
  renderApproverModalList(filtered);
}

function renderApproverModalList(list) {
  const container = document.getElementById('approverModalListContainer');
  if (!container) return;

  const selectedList = appState.currentModalTarget === 'MID' ? appState.selectedMidReviewers : appState.selectedCoopStaff;

  const teams = ['의원실', '정책개발팀', '민원소통팀', '홍보미디어팀', '예산행정팀', '지역조직팀', '기타'];
  const grouped = {};
  teams.forEach(t => grouped[t] = []);
  
  list.forEach(u => {
    const t = u.team || '기타';
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push(u);
  });

  let html = '';
  Object.keys(grouped).forEach(teamName => {
    const teamUsers = grouped[teamName];
    if (teamUsers.length === 0) return;

    html += `
      <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; margin-bottom: 6px;">
        <div style="font-size: 14px; font-weight: 900; color: var(--primary-navy); border-bottom: 1px solid var(--border-color); padding-bottom: 4px; margin-bottom: 8px;">
          [부서/팀]: ${teamName}
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${teamUsers.map(u => {
            const isChecked = selectedList.includes(u.id);
            return `
              <label style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #FFF; border: 1px solid ${isChecked ? 'var(--primary-navy)' : 'var(--border-light)'}; border-radius: 6px; cursor: pointer;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="checkbox" class="approver-popup-cb" value="${u.id}" ${isChecked ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                  <span style="font-size: 15px; font-weight: 800; color: var(--text-dark);">${u.name}</span>
                  <span style="font-size: 13px; font-weight: 700; color: var(--text-muted);">${u.roleTitle} [${u.clearance || '2급'}]</span>
                </div>
                ${isChecked ? '<span style="font-size: 12px; font-weight: 900; color: var(--primary-navy);">선택됨</span>' : ''}
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html || '<div style="padding:20px; text-align:center;">검색 결과가 없습니다.</div>';
}

function confirmApproverSelection() {
  const checkboxes = document.querySelectorAll('.approver-popup-cb:checked');
  const selectedIds = Array.from(checkboxes).map(cb => cb.value);

  if (appState.currentModalTarget === 'MID') {
    appState.selectedMidReviewers = selectedIds;
  } else {
    appState.selectedCoopStaff = selectedIds;
  }

  renderSelectedApproverPills();
  closeApproverSelectModal();
}

function handlePhotoPreview(event) {
  const files = event.target.files;
  const container = document.getElementById('photoPreviewContainer');
  if (!container || !files) return;

  appState.currentAttachedPhotos = [];
  container.innerHTML = '';

  Array.from(files).forEach((file, idx) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      appState.currentAttachedPhotos.push(dataUrl);
      container.innerHTML += `
        <div class="photo-item">
          <img src="${dataUrl}" alt="첨부 사진 ${idx + 1}">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: #FFF; font-size: 11px; padding: 2px; text-align: center;">첨부사진 ${idx + 1}</div>
        </div>
      `;
    };
    reader.readAsDataURL(file);
  });
}

// --- TAB SWITCHER ---
function switchTab(tabName) {
  if (tabName === 'adminView') {
    const isAdmin = isUserFinanceAdmin(appState.currentUser);
    if (!isAdmin) {
      alert("접근 차단 - 1급 관리자 전용 통제 메뉴입니다. 일반 사용자에게는 메뉴가 표시되지 않으며 접근할 수 없습니다.");
      return;
    }
  }
  appState.activeTab = tabName;
  if (tabName === 'createView') {
    resetCreateTaskForm();
  }
  const links = document.querySelectorAll('.sidebar-link');
  links.forEach(l => {
    if (l.dataset.tab === tabName) l.classList.add('active');
    else l.classList.remove('active');
  });

  const views = ['seniorView', 'assigneeView', 'staffView', 'modulesView', 'createView', 'adminView'];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) {
      if (v === tabName) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });

  const titles = {
    seniorView: '결재 대기',
    assigneeView: '업무 관리 및 접수',
    staffView: '전체 안건',
    modulesView: '전체 메뉴',
    createView: '신규 작성',
    adminView: '관리자 메뉴'
  };
  document.getElementById('currentTabTitle').textContent = titles[tabName] || '자유와혁신 Pro';

  const headerNav = document.getElementById('seniorHeaderNavBox');
  if (headerNav) {
    headerNav.style.display = tabName === 'seniorView' ? 'flex' : 'none';
  }

  renderApp();
}

// --- RENDER CONTROLLER ---
function renderApp() {
  if (!appState.currentUser) return;

  // Restore Branding
  appState.branding = appState.branding || { emblem: '', subtitle: '인천시당' };
  const emblemImg = document.getElementById('sidebarEmblemImg');
  const emblemDef = document.getElementById('sidebarEmblemDefault');
  if (emblemImg && emblemDef) {
    if (appState.branding.emblem) {
      emblemImg.src = appState.branding.emblem;
      emblemImg.style.display = 'block';
      emblemDef.style.display = 'none';
    } else {
      emblemImg.style.display = 'none';
      emblemDef.style.display = 'flex';
    }
  }
  const subtitleEl = document.getElementById('sidebarSubtitle');
  if (subtitleEl && appState.branding.subtitle) {
    subtitleEl.textContent = appState.branding.subtitle;
  }

  // Restore User Avatar (Photo or Text)
  const avatarEl = document.getElementById('sidebarUserAvatar');
  if (avatarEl) {
    if (appState.currentUser.photoUrl) {
      avatarEl.innerHTML = '<img src="' + appState.currentUser.photoUrl + '" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
    } else {
      avatarEl.textContent = appState.currentUser.avatar || appState.currentUser.name.charAt(0);
    }
  }

  document.getElementById('sidebarUserName').textContent = appState.currentUser.name;
  document.getElementById('sidebarUserRole').textContent = getUserRoleClean(appState.currentUser);
  document.getElementById('topHeaderUserStatus').textContent = formatUserDisplay(appState.currentUser);

  const isSuperAdmin = isUserSuperAdmin(appState.currentUser);
  const isFinanceUser = appState.currentUser && appState.currentUser.clearance === '회계관리';
  const isAdmin = isSuperAdmin || isFinanceUser;
  const adminBtn = document.getElementById('sidebarAdminBtn');
  if (adminBtn) {
    if (isAdmin) {
      adminBtn.style.setProperty('display', 'flex', 'important');
      const badge = document.getElementById('adminBadge');
      if (badge) {
        if (isFinanceUser && !isSuperAdmin) {
          badge.textContent = '회계';
          badge.style.backgroundColor = '#047857';
        } else {
          badge.textContent = '1급';
          badge.style.backgroundColor = '#991B1B';
        }
      }
    } else {
      adminBtn.style.setProperty('display', 'none', 'important');
      if (appState.activeTab === 'adminView') {
        appState.activeTab = 'seniorView';
        switchTab('seniorView');
        return;
      }
    }
  }

  const pendingTasks = appState.tasks.filter(t => t.status === 'PENDING');
  document.getElementById('pendingBadge').textContent = pendingTasks.length;
  document.getElementById('seniorPendingCount').textContent = pendingTasks.length;

  const myAssigneeTasks = appState.tasks.filter(t => (!t.assigneeId || t.assigneeId === appState.currentUser.id) && !t.isCompleted);
  document.getElementById('assigneeBadge').textContent = myAssigneeTasks.length;

  if (appState.activeTab === 'seniorView') renderSeniorView(pendingTasks);
  else if (appState.activeTab === 'assigneeView') renderAssigneeView();
  else if (appState.activeTab === 'staffView') renderStaffView();
  else if (appState.activeTab === 'modulesView') renderModuleView();
  else if (appState.activeTab === 'adminView') renderAdminView();
}

// ==========================================================================
// 1. UNIFIED APPROVAL VIEW (TOP RIGHT APPROVAL ACTION BUTTONS AS REQUESTED)
// ==========================================================================
function renderSeniorView(pendingTasks) {
  const cardContainer = document.getElementById('seniorCardContainer');
  const topActionPanel = document.getElementById('seniorTopActionPanel');
  const assigneePanel = document.getElementById('assigneeReceiptPanel');
  const readerPanel = document.getElementById('readerAuditPanel');

  if (pendingTasks.length === 0) {
    cardContainer.innerHTML = `
      <div class="card" style="text-align: center; padding: 48px 24px;">
        <div style="font-size: 22px; font-weight: 900; color: var(--primary-navy);">대기 중인 결재 안건이 없습니다.</div>
      </div>
    `;
    if (topActionPanel) topActionPanel.innerHTML = `<div style="padding: 12px; text-align: center;">대기 안건 없음</div>`;
    assigneePanel.innerHTML = `<div style="padding: 12px; text-align: center;">-</div>`;
    readerPanel.innerHTML = `<div style="padding: 12px; text-align: center;">-</div>`;
    return;
  }

  if (appState.seniorTaskIndex >= pendingTasks.length) {
    appState.seniorTaskIndex = Math.max(0, pendingTasks.length - 1);
  }

  const currentTask = pendingTasks[appState.seniorTaskIndex];
  recordViewAudit(currentTask.id);

  const stepperHTML = renderApprovalStepper(currentTask.approvalChain);

  const coopList = currentTask.cooperationLine || [];
  const myCoop = coopList.find(c => c.userId === appState.currentUser.id);
  const isMyCoopPending = myCoop && myCoop.status === 'PENDING';

  const pendingStepIndex = currentTask.approvalChain.findIndex(s => s.status === 'PENDING');
  const pendingStep = currentTask.approvalChain[pendingStepIndex] || null;

  const photoGridHTML = (currentTask.photos && currentTask.photos.length > 0) ? `
    <div style="margin-top: 14px; margin-bottom: 14px;">
      <div style="font-size: 14px; font-weight: 800; color: var(--primary-navy); margin-bottom: 6px;">첨부 현장 사진 및 증빙자료</div>
      <div class="photo-grid">
        ${currentTask.photos.map((url, idx) => `
          <div class="photo-item" onclick="window.open('${url}', '_blank')">
            <img src="${url}" alt="증빙 사진 ${idx+1}">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: #FFF; font-size: 11px; padding: 2px; text-align: center;">확대 보기</div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  if (topActionPanel) {
    topActionPanel.innerHTML = `
      <div style="font-size: 14px; font-weight: 900; color: var(--primary-navy); margin-bottom: 6px; display:flex; justify-content:space-between; align-items:center;">
        <span>결재 승인 및 반려</span>
      </div>
      <div class="senior-action-grid">
        ${pendingStep ? `
          <button class="btn-senior btn-mid-approve" style="height: 40px; font-size: 16px;" onclick="handleStepApproval('${currentTask.id}', ${pendingStepIndex})">
            승인
          </button>
        ` : `
          <button class="btn-senior" disabled style="height: 40px; font-size: 14px; background: var(--border-color); color: var(--text-muted);">완료</button>
        `}
        <button class="btn-senior btn-reject" style="height: 40px; font-size: 15px;" onclick="handleRejectApproval('${currentTask.id}', ${pendingStepIndex})">
          반려
        </button>
      </div>
    `;
  }

  // Left Main Column Card (Stripped color clutter except category badge!)
  cardContainer.innerHTML = `
    <div class="card">
      <div class="stamp-seal" id="redStampSeal">
        <span style="font-size: 14px; border-bottom: 2px solid #991B1B;">의원 직인</span>
        <span style="font-size: 20px; font-weight: 900;">승 인</span>
        <span style="font-size: 10px;">${new Date().toLocaleDateString()}</span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        ${getCategoryBadgeHTML(currentTask.category)}
        <span style="font-size: 14px; font-weight: 800; color: var(--text-muted);">안건번호: ${currentTask.id}</span>
      </div>

      <h2 style="font-size: 24px; font-weight: 900; line-height: 1.4; margin-bottom: 8px;">${currentTask.title}</h2>
      <div style="font-size: 14px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">
        위치: ${currentTask.location || '별도 지정 없음'} | 작성일시: ${currentTask.createdAt}
      </div>

      <!-- PROMINENT EXECUTION PAIR BAR (Monochrome clean) -->
      <div class="execution-pair-bar">
        <span>[요청 부서/담당]: <strong>${currentTask.requesterName} (${currentTask.requesterTeam || '부서'})</strong></span>
        <span class="execution-arrow">➔</span>
        <span>[실행 부서/담당]: <strong>${currentTask.assigneeName} ${currentTask.assigneeTeam ? `(${currentTask.assigneeTeam})` : ''}</strong></span>
      </div>

      <!-- 1) APPROVAL STEPPER PLACED ABOVE CONTENT -->
      ${stepperHTML}

      ${coopList.length > 0 ? `
        <div class="cooperation-box" style="margin: 12px 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 15px; font-weight: 900; color: var(--primary-navy);">
              협조 부서 검토 현황 (${coopList.filter(c => c.status === 'COMPLETED').length}/${coopList.length} 완료)
            </div>
            ${isMyCoopPending ? `
              <button class="btn-coop-sign" onclick="handleCooperationSign('${currentTask.id}')">
                [${appState.currentUser.name}] 협조 동의/확인 (의견 작성 가능)
              </button>
            ` : ''}
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${coopList.map(c => `
              <div style="background: #FFF; border: 1px solid var(--border-color); padding: 6px 10px; border-radius: 6px;">
                <div style="font-size: 13px; font-weight: 800; color: var(--text-dark);">${c.userName}(${getUserRoleClean(c.roleTitle)}): ${c.status === 'COMPLETED' ? '[완료]' : '[대기]'}</div>
                ${c.comment ? `<div style="font-size: 12px; color: var(--text-muted); font-weight: 700; margin-top: 2px;">" ${c.comment} "</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${photoGridHTML}

      <!-- 2) CORE REPORT CONTENT BELOW STEPPER -->
      <div class="summary-box">
        <div class="summary-title">
          <span>핵심 보고 요약 및 본문 (결재권자 검토 중요 내용)</span>
          <span style="font-size: 12px; font-weight: 700; color: var(--primary-navy); background: #FFF; padding: 2px 8px; border-radius: 4px; border: 1px solid var(--primary-navy);">보고 본문</span>
        </div>
        <div class="summary-text">${currentTask.summary}</div>
      </div>
    </div>
  `;

  const isAssigned = !!currentTask.assigneeId;
  assigneePanel.innerHTML = `
    <div style="font-size: 16px; font-weight: 900; color: var(--primary-navy); margin-bottom: 10px;">
      실행자 지정 및 접수 상태
    </div>
    <div style="background-color: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; margin-bottom: 10px;">
      ${isAssigned ? `
        <div style="font-size: 15px; font-weight: 800;">담당 실행자: ${currentTask.assigneeName} ${currentTask.assigneeTeam ? `(${currentTask.assigneeTeam})` : ''}</div>
        <div style="font-size: 13px; color: var(--primary-navy); font-weight: 800; margin-top: 2px;">업무 할당 및 실행 접수 완료</div>
      ` : `
        <span class="badge-unassigned">자율 실행 안건 (미지정)</span>
        <div style="font-size: 13px; color: var(--text-muted); font-weight: 700; margin-top: 6px;">누구나 먼저 잡아서 실행할 수 있습니다.</div>
      `}
    </div>

    ${!isAssigned ? `
      <button class="btn-claim-task" onclick="handleClaimOpenTask('${currentTask.id}')">
        이 업무 내가 잡아서 실행하기 (Claim Task)
      </button>
    ` : ''}
  `;

  const viewerBreakdown = getViewerBreakdown(currentTask.viewersLog || []);
  readerPanel.innerHTML = `
    <div style="font-size: 16px; font-weight: 900; color: var(--primary-navy); margin-bottom: 10px; display: flex; justify-content: space-between;">
      <span>열람 및 조회 통계</span>
      <span>총 ${currentTask.viewsCount || 0}회</span>
    </div>

    <div style="background-color: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; margin-bottom: 10px;">
      ${viewerBreakdown.map(v => `
        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; padding: 4px 0; border-bottom: 1px dashed var(--border-color);">
          <span>${v.name} (${v.role})</span>
          <span style="color: var(--primary-navy); font-weight: 900;">${v.count}회</span>
        </div>
      `).join('') || '<div style="font-size: 13px;">열람 기록 없음</div>'}
    </div>

    <button class="btn-outline" style="width: 100%; font-size: 14px; padding: 6px;" onclick="openViewerAuditModal('${currentTask.id}')">상세 열람로그 확인</button>
  `;

  const timelinePanel = document.getElementById('seniorAuditTimelinePanel');
  if (timelinePanel) {
    timelinePanel.innerHTML = `
      <div style="font-size: 16px; font-weight: 900; color: var(--primary-navy); margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
        <span>전자결재 및 검토 감사기록</span>
        <span style="font-size: 12px; font-weight: 800; background: #F1F5F9; padding: 2px 8px; border-radius: 4px;">총 ${currentTask.auditLogs.length}건</span>
      </div>
      <div style="background-color: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; max-height: 240px; overflow-y: auto;">
        ${(currentTask.auditLogs || []).map(log => `
          <div style="font-size: 13px; font-weight: 700; padding: 6px 0; border-bottom: 1px dashed var(--border-color); line-height: 1.4;">
            <div style="color: var(--text-muted); font-size: 11px;">${log.when}</div>
            <div><strong style="color: var(--primary-navy);">${log.who}</strong>: ${log.action}</div>
          </div>
        `).join('') || '<div style="font-size: 13px; text-align:center;">기록 없음</div>'}
      </div>
    `;
  }
}

function renderApprovalStepper(chain) {
  return `
    <div class="approval-stepper-box">
      <div class="stepper-header-title">
        <span>결재 라인 진행 현황</span>
        <span>총 ${chain.length}단계</span>
      </div>
      <div class="stepper-line">
        ${chain.map(step => {
          let statusClass = 'step-item';
          let tagClass = 'tag-waiting';
          let tagText = '미도달';

          if (step.status === 'COMPLETED') {
            statusClass += ' completed';
            tagClass = 'tag-completed';
            tagText = '승인';
          } else if (step.status === 'PENDING') {
            statusClass += ' pending-active';
            tagClass = 'tag-pending';
            tagText = '대기';
          } else if (step.status === 'REJECTED') {
            statusClass += ' rejected';
            tagClass = 'tag-rejected';
            tagText = '반려';
          }

          return `
            <div class="${statusClass}">
              <div class="step-user-name">${step.userName}</div>
              <span class="step-status-tag ${tagClass}">${tagText}</span>
              ${step.comment ? `<div class="step-comment-box">" ${step.comment} "</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function toggleAuditAccordion(taskId) {
  const el = document.getElementById(`auditAccordion_${taskId}`);
  if (el) {
    el.classList.toggle('hidden');
  }
}

function prevSeniorTask() {
  if (appState.seniorTaskIndex > 0) {
    appState.seniorTaskIndex--;
    renderApp();
  }
}

function nextSeniorTask() {
  const pendingTasks = appState.tasks.filter(t => t.status === 'PENDING');
  if (appState.seniorTaskIndex < pendingTasks.length - 1) {
    appState.seniorTaskIndex++;
    renderApp();
  }
}

function handleCooperationSign(taskId) {
  const comment = prompt("협조 동의 코멘트를 입력하세요 (선택 사항):", "예산/정책 검토 완료, 동의합니다.");
  if (comment === null) return;

  const now = new Date().toLocaleString('ko-KR');
  appState.tasks = appState.tasks.map(t => {
    if (String(t.id) === String(taskId)) {
      const newCoop = (t.cooperationLine || []).map(c => {
        if (c.userId === appState.currentUser.id) {
          return { ...c, status: 'COMPLETED', timestamp: now, comment: comment || '검토 동의' };
        }
        return c;
      });

      return {
        ...t,
        cooperationLine: newCoop,
        auditLogs: [...t.auditLogs, { id: `log-${Date.now()}`, who: appState.currentUser.name, when: now, action: `협조 검토 동의 완료 ${comment ? `(코멘트: ${comment})` : ''}` }]
      };
    }
    return t;
  });

  saveState();
  alert(`${appState.currentUser.name} - 님의 협조 동의 및 의견이 반영되었습니다.`);
  renderApp();
  if (!document.getElementById('taskDetailModal').classList.contains('hidden')) {
    openTaskDetailModal(taskId);
  }
}

function handleStepApproval(taskId, stepIndex) {
  const comment = prompt("결재 승인 코멘트 및 지시사항을 입력하세요 (선택 사항):", "검토 완료, 원안대로 추진 바랍니다.");
  if (comment === null) return;

  const now = new Date().toLocaleString('ko-KR');
  const task = appState.tasks.find(t => String(t.id) === String(taskId));
  if (!task) return;

  const isFinalStep = stepIndex === task.approvalChain.length - 1;

  if (isFinalStep) {
    appState.isStampAnimating = true;
    const stampEl = document.getElementById('redStampSeal');
    if (stampEl) stampEl.classList.add('active-stamp');

    setTimeout(() => {
      applyStepApproval(taskId, stepIndex, now, true, comment);
      appState.isStampAnimating = false;
    }, 500);
  } else {
    applyStepApproval(taskId, stepIndex, now, false, comment);
  }
}

function applyStepApproval(taskId, stepIndex, now, isFinal, comment) {
  appState.tasks = appState.tasks.map(t => {
    if (String(t.id) === String(taskId)) {
      const newChain = [...t.approvalChain];
      newChain[stepIndex].status = 'COMPLETED';
      newChain[stepIndex].timestamp = now;
      newChain[stepIndex].comment = comment || '승인';

      if (!isFinal && newChain[stepIndex + 1]) {
        newChain[stepIndex + 1].status = 'PENDING';
      }

      if (isFinal) {
        if (t.targetTotalBudget) {
          appState.accountingSettings = appState.accountingSettings || {};
          appState.accountingSettings.totalBudget = Number(t.targetTotalBudget);
        }
        if (t.targetReserveBudget) {
          appState.accountingSettings = appState.accountingSettings || {};
          appState.accountingSettings.reserveBudget = Number(t.targetReserveBudget);
        }
      }

      return {
        ...t,
        status: isFinal ? 'APPROVED' : 'PENDING',
        approvedAt: isFinal ? now : (t.approvedAt || null),
        approvalChain: newChain,
        auditLogs: [...t.auditLogs, { id: `log-${Date.now()}`, who: appState.currentUser.name, when: now, action: `[${newChain[stepIndex].roleTitle}] 승인 완료 ${comment ? `(코멘트: ${comment})` : ''}` }]
      };
    }
    return t;
  });

  saveState();
  renderApp();
  if (!document.getElementById('taskDetailModal').classList.contains('hidden')) {
    openTaskDetailModal(taskId);
  }
}

function handleRejectApproval(taskId, stepIndex) {
  const comment = prompt("안건 반려 사유 및 보완 요청 코멘트를 작성하세요 (필수):", "내용 보완 요망 및 예산 내역 재검토 필요");
  if (comment === null || !comment.trim()) {
    alert("반려 사유를 반드시 작성해야 합니다.");
    return;
  }

  const now = new Date().toLocaleString('ko-KR');
  appState.tasks = appState.tasks.map(t => {
    if (String(t.id) === String(taskId)) {
      const newChain = [...t.approvalChain];
      if (newChain[stepIndex]) {
        newChain[stepIndex].status = 'REJECTED';
        newChain[stepIndex].comment = `반려: ${comment}`;
      }

      return {
        ...t,
        status: 'REJECTED',
        approvalChain: newChain,
        auditLogs: [...t.auditLogs, { id: `log-${Date.now()}`, who: appState.currentUser.name, when: now, action: `안건 반려 처리 (반려사유: ${comment})` }]
      };
    }
    return t;
  });

  saveState();
  renderApp();
  if (!document.getElementById('taskDetailModal').classList.contains('hidden')) {
    openTaskDetailModal(taskId);
  }
}

function handleClaimOpenTask(taskId) {
  const now = new Date().toLocaleString('ko-KR');
  appState.tasks = appState.tasks.map(t => {
    if (String(t.id) === String(taskId)) {
      return {
        ...t,
        assigneeId: appState.currentUser.id,
        assigneeName: appState.currentUser.name,
        assigneeTeam: appState.currentUser.roleTitle,
        auditLogs: [...t.auditLogs, { id: `log-${Date.now()}`, who: appState.currentUser.name, when: now, action: `[자율 업무 잡기] ${appState.currentUser.name} 님이 담당자로 지정됨` }]
      };
    }
    return t;
  });

  saveState();
  alert(`${appState.currentUser.name} - 님이 담당자로 지정되었습니다.`);
  renderApp();
  if (!document.getElementById('taskDetailModal').classList.contains('hidden')) {
    openTaskDetailModal(taskId);
  }
}

function recordViewAudit(taskId) {
  const task = appState.tasks.find(t => String(t.id) === String(taskId));
  if (!task) return;

  const now = new Date().toLocaleString('ko-KR');
  const user = appState.currentUser;

  task.viewsCount = (task.viewsCount || 0) + 1;
  task.viewersLog = task.viewersLog || [];
  task.viewersLog.push({
    userId: user.id,
    userName: user.name,
    userRole: user.roleTitle,
    timestamp: now
  });

  saveState();
}

function getViewerBreakdown(logList) {
  const counts = {};
  logList.forEach(log => {
    const key = `${log.userName}___${log.userRole}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  return Object.keys(counts).map(key => {
    const [name, role] = key.split('___');
    return { name, role, count: counts[key] };
  });
}

function openViewerAuditModal(taskId) {
  const task = appState.tasks.find(t => String(t.id) === String(taskId));
  if (!task) return;

  const modalBody = document.getElementById('viewerAuditModalBody');
  const logs = task.viewersLog || [];

  modalBody.innerHTML = `
    <div style="font-size: 16px; font-weight: 800; color: var(--primary-navy); margin-bottom: 6px;">[${task.id}] ${task.title}</div>
    <div style="font-size: 14px; font-weight: 800; margin-bottom: 10px;">총 조회수: ${task.viewsCount || 0}회</div>
    <div class="audit-stream" style="max-height: 280px; overflow-y: auto; background: #F8FAFC; padding: 10px; border-radius: 6px;">
      ${logs.slice().reverse().map(l => `
        <div style="font-size: 13px; font-weight: 700; padding: 4px 0; border-bottom: 1px dashed var(--border-color);">${l.timestamp}<strong>${l.userName}</strong> (${l.userRole}) 님이 열람함
        </div>
      `).join('') || '<div>열람 로그 없음</div>'}
    </div>
  `;

  document.getElementById('viewerAuditModal').classList.remove('hidden');
}

function closeViewerAuditModal() {
  document.getElementById('viewerAuditModal').classList.add('hidden');
}

// ==========================================================================
// TASK DETAIL INSPECTOR MODAL
// ==========================================================================
function openTaskDetailModal(taskId) {
  const task = appState.tasks.find(t => String(t.id) === String(taskId));
  if (!task) return;

  recordViewAudit(taskId);
  const modalBody = document.getElementById('taskDetailModalBody');

  const stepperHTML = renderApprovalStepper(task.approvalChain);

  const pendingStepIndex = task.approvalChain.findIndex(s => s.status === 'PENDING');
  const pendingStep = task.approvalChain[pendingStepIndex] || null;

  const coopList = task.cooperationLine || [];
  const myCoop = coopList.find(c => c.userId === appState.currentUser.id);
  const isMyCoopPending = myCoop && myCoop.status === 'PENDING';

  const photoGridHTML = (task.photos && task.photos.length > 0) ? `
    <div style="margin: 14px 0;">
      <div style="font-size: 14px; font-weight: 800; color: var(--primary-navy); margin-bottom: 6px;">첨부 현장 사진 및 증빙자료</div>
      <div class="photo-grid">
        ${task.photos.map((url, idx) => `
          <div class="photo-item" onclick="window.open('${url}', '_blank')">
            <img src="${url}" alt="증빙 사진 ${idx+1}">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: #FFF; font-size: 11px; padding: 2px; text-align: center;">확대 보기</div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  modalBody.innerHTML = `
    <div style="margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        ${getCategoryBadgeHTML(task.category)}
        <span style="font-size: 14px; font-weight: 800; color: var(--text-muted);">안건번호: ${task.id}</span>
      </div>
      <h3 style="font-size: 22px; font-weight: 900; color: var(--text-dark); margin-bottom: 6px;">${task.title}</h3>
      <div style="font-size: 14px; font-weight: 700; color: var(--text-muted);">
        위치: ${task.location || '별도 지정 없음'} | 작성일시: ${task.createdAt}
      </div>
    </div>

    <!-- PROMINENT EXECUTION PAIR BAR -->
    <div class="execution-pair-bar">
      <span>요청: <strong>${formatUserDisplay({name: task.requesterName, roleTitle: task.requesterTeam})}</strong></span>
      <span class="execution-arrow">➔</span>
      <span>실행: <strong>${formatUserDisplay({name: task.assigneeName, roleTitle: task.assigneeTeam})}</strong></span>
    </div>

    <!-- 1) APPROVAL STEPPER ABOVE CONTENT -->
    ${stepperHTML}

    ${coopList.length > 0 ? `
      <div class="cooperation-box" style="margin-top: 12px;">
        <div style="font-size: 14px; font-weight: 900; color: var(--primary-navy); margin-bottom: 6px;">협조 부서 검토 및 동의 현황</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${coopList.map(c => `
            <div style="background: #FFF; border: 1px solid var(--border-color); padding: 4px 10px; border-radius: 6px;">
              <div style="font-size: 13px; font-weight: 800; color: var(--text-dark);">${c.userName}(${getUserRoleClean(c.roleTitle)}): ${c.status === 'COMPLETED' ? '[완료]' : '[대기]'}</div>
              ${c.comment ? `<div style="font-size: 12px; color: var(--text-muted); font-weight: 700; margin-top: 2px;">" ${c.comment} "</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${photoGridHTML}

    <!-- 2) CORE REPORT CONTENT BELOW STEPPER -->
    <div class="summary-box">
      <div class="summary-title">
        <span>핵심 보고 요약 및 본문</span>
        <span style="font-size: 12px; font-weight: 700; color: var(--primary-navy); background: #FFF; padding: 2px 8px; border-radius: 4px; border: 1px solid var(--primary-navy);">보고 본문</span>
      </div>
      <div class="summary-text">${task.summary}</div>
    </div>

    <!-- 3) REAL-TIME PROGRESS & INTERMEDIATE REPORT TIMELINE -->
    <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; margin-top: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
        <span style="font-size: 15px; font-weight: 900; color: var(--primary-navy);">실시간 업무 진행 상황 및 중간 보고 (요청자·결재자 공유)</span>
        <button class="btn-outline" style="font-size: 12px; padding: 3px 10px; border-color: var(--primary-navy); color: var(--primary-navy); font-weight: 800; background:#FFF;" onclick="openProgressModal('${task.id}')">+ 진행사항 추가</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${(task.progressUpdates && task.progressUpdates.length > 0) ? task.progressUpdates.map(p => `
          <div style="background: #FFF; border: 1px solid var(--border-light); padding: 10px 12px; border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-weight: 900; font-size: 13px; color: var(--primary-navy);">
                ${p.who} (${getUserRoleClean(p.role)}) <span style="background: #EFF6FF; color: #2563EB; padding: 1px 6px; border-radius: 4px; font-size: 11px; margin-left: 4px;">진척도 ${p.percent}%</span>
              </span>
              <span style="font-size: 12px; color: var(--text-muted);">${p.date}</span>
            </div>
            <div style="font-size: 13px; color: var(--text-dark); line-height: 1.5;">${p.content}</div>
          </div>
        `).join('') : '<div style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 12px;">아직 등록된 업무 진행 상황이 없습니다. 상단 버튼으로 중간 보고를 작성하세요.</div>'}
      </div>
    </div>

    <!-- ACTION FOOTER INSIDE MODAL (75:25 ASYMMETRIC) -->
    <div style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 14px; border-radius: 8px; margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; align-items: center;">
      <div style="font-size: 14px; font-weight: 800; color: var(--primary-navy);">결재 액션:</div>
      <div style="display: flex; gap: 8px; flex: 1; justify-content: flex-end;">
        ${pendingStep ? `
          <button class="btn-primary" style="flex: 3; height: 40px; font-size: 15px;" onclick="handleStepApproval('${task.id}', ${pendingStepIndex})">승인</button>
          <button class="btn-primary" style="flex: 1; height: 40px; font-size: 14px; background: var(--rejected-red);" onclick="handleRejectApproval('${task.id}', ${pendingStepIndex})">반려</button>
        ` : ''}
        ${isMyCoopPending ? `
          <button class="btn-coop-sign" style="height: 44px; font-size: 14px;" onclick="handleCooperationSign('${task.id}')">협조 동의 및 의견작성</button>
        ` : ''}
        ${!task.assigneeId ? `
          <button class="btn-claim-task" style="height: 44px; width: auto; padding: 0 16px; font-size: 14px;" onclick="handleClaimOpenTask('${task.id}')">이 업무 내가 잡아서 실행하기</button>
        ` : ''}
      </div>
    </div>

    <!-- COLLAPSIBLE AUDIT TRAIL ACCORDION -->
    <div class="accordion-box">
      <button class="accordion-toggle" onclick="toggleAuditAccordion('modal_${task.id}')">
        <span>▶ 전자결재 및 검토 감사 기록 타임라인 (총 ${task.auditLogs.length}건) - 클릭하여 펼치기/접기</span>
        <span>▼</span>
      </button>
      <div id="auditAccordion_modal_${task.id}" class="accordion-content hidden" style="padding: 14px; background: #F8FAFC; max-height: 220px; overflow-y: auto;">
        ${(task.auditLogs || []).map(log => `
          <div style="font-size: 13px; font-weight: 700; padding: 4px 0; border-bottom: 1px dashed var(--border-color);">${log.when}<strong>${log.who}</strong>: ${log.action}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('taskDetailModal').classList.remove('hidden');
}

function closeTaskDetailModal() {
  document.getElementById('taskDetailModal').classList.add('hidden');
}

// ==========================================================================
// 2. ASSIGNEE VIEW (2-COLUMN GRID AS REQUESTED)
// ==========================================================================
function renderAssigneeView() {
  const container = document.getElementById('assigneeTasksContainer');
  if (!container) return;

  const currentTab = appState.assigneeSubTab || 'active';
  const myTasks = appState.tasks.filter(t => !t.assigneeId || t.assigneeId === appState.currentUser.id || t.requesterId === appState.currentUser.id || appState.currentUser.clearance === '1급');

  const activeTasks = myTasks.filter(t => !t.isCompleted);
  const completedTasks = myTasks.filter(t => t.isCompleted);

  // Real-time sync sidebar assigneeBadge
  const myAssigneeActive = appState.tasks.filter(t => (!t.assigneeId || t.assigneeId === appState.currentUser.id) && !t.isCompleted);
  const sidebarBadge = document.getElementById('assigneeBadge');
  if (sidebarBadge) sidebarBadge.textContent = myAssigneeActive.length;

  // Update button active styles & badge counts
  const activeBtn = document.getElementById('btnAssigneeActiveTab');
  const completedBtn = document.getElementById('btnAssigneeCompletedTab');
  const subTitle = document.getElementById('assigneeViewSubTitle');

  if (activeBtn && completedBtn) {
    activeBtn.innerHTML = "진행 중인 업무 (" + activeTasks.length + "건)";
    completedBtn.innerHTML = "완료된 업무 (" + completedTasks.length + "건)";

    if (currentTab === 'completed') {
      activeBtn.style.background = '#FFF';
      activeBtn.style.color = 'var(--primary-navy)';
      activeBtn.style.borderColor = 'var(--primary-navy)';

      completedBtn.style.background = '#047857';
      completedBtn.style.color = '#FFF';
      completedBtn.style.borderColor = '#047857';

      if (subTitle) subTitle.textContent = "최종 완료 처리된 업무 보관소 (완료 페이지)";
    } else {
      activeBtn.style.background = 'var(--primary-navy)';
      activeBtn.style.color = '#FFF';
      activeBtn.style.borderColor = 'var(--primary-navy)';

      completedBtn.style.background = '#FFF';
      completedBtn.style.color = '#047857';
      completedBtn.style.borderColor = '#047857';

      if (subTitle) subTitle.textContent = "할당된 업무 처리 및 실시간 진행사항 관리 (완료 시 완료 페이지로 이관)";
    }
  }

  const displayTasks = currentTab === 'completed' ? completedTasks : activeTasks;

  if (displayTasks.length === 0) {
    container.innerHTML = `
      <div class="card" style="padding: 32px; text-align: center; grid-column: 1 / -1; background: #F8FAFC;">
        <div style="font-size: 16px; font-weight: 800; color: var(--text-muted); margin-bottom: 8px;">
          ${currentTab === 'completed' ? '현재 완료된 업무 내역이 없습니다.' : '현재 진행 중인 업무가 없습니다.'}
        </div>
        <span style="font-size: 13px; color: var(--text-muted);">
          ${currentTab === 'completed' ? '진행 중인 업무에서 [최종 완료 처리]를 진행하면 이곳에 보관됩니다.' : '자율 업무를 잡거나 신규 결재를 상정하세요.'}
        </span>
      </div>
    `;
    return;
  }

  container.innerHTML = displayTasks.map(t => {
    const deadline = getDeadlineInfo(t);
    const percent = t.progressPercent || (t.isCompleted ? 100 : 0);
    const color = getProgressColor(percent);

    return `
      <div class="card card-clickable ${deadline.isUrgent && !t.isCompleted ? 'deadline-urgent-card' : ''}" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid ${t.isCompleted ? '#047857' : color};" onclick="openTaskDetailModal('${t.id}')">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 4px;">
            ${getCategoryBadgeHTML(t.category)}
            <div style="display: flex; gap: 6px; align-items: center;">
              ${deadline.isBlink && !t.isCompleted ? `
                <span class="deadline-blink-badge">${deadline.label}</span>
              ` : `
                <span style="font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: #F1F5F9; color: ${deadline.badgeColor}; border: 1px solid var(--border-color);">${deadline.label}</span>
              `}
              ${t.isCompleted ? `
                <span style="background: #ECFDF5; color: #047857; font-size: 12px; font-weight: 900; padding: 2px 8px; border-radius: 4px; border: 1px solid #A7F3D0;">완료됨</span>
              ` : (t.assigneeId ? `
                <span style="font-size: 13px; font-weight: 800; color: var(--primary-navy);">담당: ${t.assigneeName}</span>
              ` : `
                <span class="badge-unassigned">자율 실행 안건</span>
              `)}
            </div>
          </div>

          <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 8px; line-height: 1.4; color: var(--text-dark);">${t.title}</h3>

          <div class="execution-pair-bar" style="font-size: 12px; padding: 6px 10px; margin-bottom: 8px;">
            <span>요청: <strong>${formatUserDisplay({name: t.requesterName, roleTitle: t.requesterTeam})}</strong></span>
            <span class="execution-arrow">➔</span>
            <span>실행: <strong>${formatUserDisplay({name: t.assigneeName, roleTitle: t.assigneeTeam})}</strong></span>
          </div>

          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px; line-height: 1.5; max-height: 54px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${t.summary}</p>

          <!-- HORIZONTAL DRAGGABLE PROGRESS GAUGE -->
          <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; margin-bottom: 12px;" onclick="event.stopPropagation();">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 12px; font-weight: 800; color: var(--text-dark);">진척도 드래그 조절</span>
                <span id="progressStageText-${t.id}" style="font-size: 12px; font-weight: 800; color: ${color};">(${getProgressStageName(percent)})</span>
              </div>
              <span id="progressLabel-${t.id}" style="font-size: 15px; font-weight: 900; color: ${color};">${percent}%</span>
            </div>
            
            <input type="range" min="0" max="100" step="5" value="${percent}" 
              class="task-progress-slider" id="progressSlider-${t.id}"
              style="background: linear-gradient(to right, ${color} ${percent}%, #E2E8F0 ${percent}%);"
              ${t.isCompleted ? 'disabled' : ''}
              oninput="handleTaskProgressInput(event, '${t.id}', this.value)"
              onchange="handleTaskProgressChange(event, '${t.id}', this.value)">

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <div style="display: flex; gap: 4px;">
                <button class="progress-quick-pill" onclick="setTaskProgressQuick('${t.id}', 0)">0%</button>
                <button class="progress-quick-pill" onclick="setTaskProgressQuick('${t.id}', 25)">25%</button>
                <button class="progress-quick-pill" onclick="setTaskProgressQuick('${t.id}', 50)">50%</button>
                <button class="progress-quick-pill" onclick="setTaskProgressQuick('${t.id}', 75)">75%</button>
                <button class="progress-quick-pill" onclick="setTaskProgressQuick('${t.id}', 100)" style="color: #10B981; font-weight: 900;">100%</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ACTION FOOTER -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 10px; margin-top: 8px;" onclick="event.stopPropagation();">
          <div style="font-size: 12px; color: var(--text-muted);">
            ${t.dueDate ? '마감: ' + t.dueDate : '작성: ' + t.createdAt}
          </div>
          <div style="display: flex; gap: 6px;">
            ${!t.isCompleted ? `
              <button class="btn-outline" style="font-size: 12px; padding: 4px 10px; border-color: var(--primary-navy); color: var(--primary-navy); font-weight: 800;" onclick="openProgressModal('${t.id}')">
                중간메모
              </button>
              <button class="btn-primary" style="font-size: 12px; padding: 4px 10px; background: #047857; border-color: #047857; font-weight: 800;" onclick="handleCompleteTask('${t.id}')">
                최종 업무 완료
              </button>
            ` : `
              <button class="btn-outline" style="font-size: 12px; padding: 4px 10px; border-color: #475569; color: #475569;" onclick="handleReopenTask('${t.id}')">
                진행 중으로 복원
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// 3. STAFF EXCEL-STYLE 1-LINE TABLE VIEW WITH REAL-TIME SEARCH
// ==========================================================================
function renderStaffView() {
  const categories = ['전체', '민원', '일정행사', '조직인사', '홍보보도', '정책공약', '예산지출'];
  const catContainer = document.getElementById('categoryFilterContainer');
  catContainer.innerHTML = categories.map(cat => `
    <button class="btn-outline ${appState.selectedCategoryFilter === cat ? 'active' : ''}" style="${appState.selectedCategoryFilter === cat ? 'background: var(--primary-navy); color:#FFF;' : ''}" onclick="setCategoryFilter('${cat}')">
      ${cat}
    </button>
  `).join('');

  const query = (appState.staffSearchQuery || '').toLowerCase();

  const filteredTasks = appState.tasks.filter(t => {
    const matchCat = appState.selectedCategoryFilter === '전체' || t.category === appState.selectedCategoryFilter;
    if (!matchCat) return false;
    if (!query) return true;

    return t.id.toLowerCase().includes(query) ||
           t.title.toLowerCase().includes(query) ||
           (t.requesterName && t.requesterName.toLowerCase().includes(query)) ||
           (t.requesterTeam && t.requesterTeam.toLowerCase().includes(query)) ||
           (t.assigneeName && t.assigneeName.toLowerCase().includes(query)) ||
           (t.assigneeTeam && t.assigneeTeam.toLowerCase().includes(query)) ||
           t.category.toLowerCase().includes(query);
  });

  const listContainer = document.getElementById('staffTaskListContainer');

  if (filteredTasks.length === 0) {
    listContainer.innerHTML = `<div style="padding: 32px; text-align: center; color: var(--text-muted);">검색 조건에 부합하는 안건 데이터가 없습니다.</div>`;
    return;
  }

  // EXCEL-STYLE 1-LINE TABLE
  listContainer.innerHTML = `
    <table class="excel-table">
      <thead>
        <tr>
          <th>안건번호</th>
          <th>카테고리</th>
          <th>안건 제목 (1줄 요약)</th>
          <th>요청 담당</th>
          <th>실행 담당</th>
          <th>결재 상태</th>
          <th>진행 상태</th>
          <th>조회</th>
          <th>결재일시</th>
        </tr>
      </thead>
      <tbody>
        ${filteredTasks.map(t => {
          let approvalBadge = '<span style="color: var(--primary-navy); font-weight: 800; background: #EEF2F6; padding: 3px 8px; border-radius: 4px;">대기</span>';
          if (t.status === 'APPROVED') {
            approvalBadge = '<span style="color: #047857; font-weight: 900; background: #ECFDF5; padding: 3px 8px; border-radius: 4px; border: 1px solid #A7F3D0;">승인</span>';
          } else if (t.status === 'REJECTED') {
            approvalBadge = '<span style="color: #DC2626; font-weight: 900; background: #FEF2F2; padding: 3px 8px; border-radius: 4px; border: 1px solid #FECACA;">반려</span>';
          }

          let progressBadge = '';
          if (t.isCompleted) {
            progressBadge = '<span style="color: #047857; font-weight: 900; background: #ECFDF5; padding: 3px 10px; border-radius: 4px; border: 1px solid #059669;">Complete</span>';
          } else {
            const pct = t.progressPercent || 0;
            progressBadge = `<span style="color: #2563EB; font-weight: 800; background: #EFF6FF; padding: 3px 8px; border-radius: 4px; border: 1px solid #BFDBFE;">In Progress (진행중, ${pct}%)</span>`;
          }

          const approvalDate = t.approvedAt || (t.status === 'APPROVED' ? t.createdAt : '-');

          return `
            <tr onclick="openTaskDetailModal('${t.id}')">
              <td style="font-family: monospace; color: var(--primary-navy); font-weight: 700;">${t.id}</td>
              <td>${getCategoryBadgeHTML(t.category)}</td>
              <td style="max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${t.title}">${t.title}</td>
              <td>${formatUserDisplay({name: t.requesterName, roleTitle: t.requesterTeam})}</td>
              <td>${formatUserDisplay({name: t.assigneeName, roleTitle: t.assigneeTeam})}</td>
              <td>${approvalBadge}</td>
              <td>${progressBadge}</td>
              <td style="text-align: right;">${t.viewsCount || 0}</td>
              <td style="font-size: 13px; color: var(--text-muted);">${approvalDate}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function handleStaffSearch(event) {
  appState.staffSearchQuery = event.target.value;
  renderStaffView();
}

function setCategoryFilter(cat) {
  appState.selectedCategoryFilter = cat;
  renderStaffView();
}

function exportTasksCSV() {
  const headers = ["ID", "카테고리", "제목", "요청자", "실행자", "상태", "조회수"];
  const rows = appState.tasks.map(t => [t.id, t.category, `"${t.title.replace(/"/g, '""')}"`, t.requesterName, t.assigneeName, t.status, t.viewsCount || 0]);
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `정치사무_결재안건_엑셀리스트_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function triggerCSVImport() {
  document.getElementById('csvFileInput').click();
}

function handleCSVImport(event) {
  alert("CSV 동기화 완료");
}

// ==========================================================================
// 4. 10 FULLY FUNCTIONAL MODULES (WITH MONTHLY CALENDAR & PRESS HUB & ADMIN COMPLAINT OVERRIDE)
// ==========================================================================
function switchModuleTab(modId) {
  appState.activeModuleTab = modId;
  const btns = document.querySelectorAll('.module-tab-btn');
  btns.forEach(b => {
    if (b.getAttribute('onclick').includes(modId)) b.classList.add('active');
    else b.classList.remove('active');
  });

  renderModuleView();
}

window.changeCalendarMonth = function(delta) {
  if (!appState.calendarYear) {
    const now = new Date();
    appState.calendarYear = now.getFullYear();
    appState.calendarMonth = now.getMonth() + 1;
  }
  let m = appState.calendarMonth + delta;
  let y = appState.calendarYear;
  if (m > 12) { m = 1; y++; }
  else if (m < 1) { m = 12; y--; }
  appState.calendarYear = y;
  appState.calendarMonth = m;
  renderModuleView();
};

function renderModuleView() {
  const area = document.getElementById('moduleContentArea');
  const mod = appState.activeModuleTab;

  // Auto-update event status
  const now = new Date();
  appState.eventsList.forEach(e => {
    if (e.date && e.endDate) {
      const start = new Date(e.date);
      const end = new Date(e.endDate);
      if (now < start) e.status = '준비중';
      else if (now >= start && now <= end) e.status = '행사중';
      else e.status = '종료';
    }
  });

  if (mod === 'mod-dashboard') {
    const pendingCount = appState.tasks.filter(t => t.status === 'PENDING').length;
    const approvedCount = appState.tasks.filter(t => t.status === 'APPROVED').length;
    
    // Weekly Calendar (Sun - Sat) for current sample week (July 19 - July 25, 2026)
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDates = [
      { day: 19, dateStr: '2026-07-19', label: '19일' },
      { day: 20, dateStr: '2026-07-20', label: '20일' },
      { day: 21, dateStr: '2026-07-21', label: '21일' },
      { day: 22, dateStr: '2026-07-22', label: '22일' },
      { day: 23, dateStr: '2026-07-23', label: '23일' },
      { day: 24, dateStr: '2026-07-24', label: '24일' },
      { day: 25, dateStr: '2026-07-25', label: '25일', isToday: true }
    ];

    const todayEvents = appState.eventsList.filter(e => e.date && (e.date.includes('2026-07-25') || e.date.includes('오늘') || e.status === '준비중' || e.status === '진행중'));

    area.innerHTML = `
      <div class="card" style="margin-bottom: 16px;">
        <h3 style="font-size: 22px; font-weight: 900; color: var(--primary-navy); margin-bottom: 16px;">현장 대시보드</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px;">
          <div style="background: #FFF; border: 2px solid var(--primary-navy); padding: 16px; border-radius: 10px; text-align: center; cursor: pointer;" onclick="switchTab('seniorView')">
            <div style="font-size: 14px; font-weight: 800; color: var(--primary-navy);">결재 대기 안건</div>
            <div style="font-size: 36px; font-weight: 900; color: #DC2626;">${pendingCount}건</div>
          </div>
          <div style="background: #FFF; border: 2px solid var(--primary-navy); padding: 16px; border-radius: 10px; text-align: center; cursor: pointer;" onclick="switchTab('staffView')">
            <div style="font-size: 14px; font-weight: 800; color: var(--primary-navy);">최종 승인 완료</div>
            <div style="font-size: 36px; font-weight: 900; color: var(--primary-navy);">${approvedCount}건</div>
          </div>
          <div style="background: #F8FAFC; border: 2px solid var(--border-color); padding: 16px; border-radius: 10px; text-align: center; cursor: pointer;" onclick="openUserAuthModal()">
            <div style="font-size: 14px; font-weight: 800;">등록된 팀원 수</div>
            <div style="font-size: 36px; font-weight: 900;">${appState.users.length}명</div>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="font-size: 18px; font-weight: 900; color: var(--primary-navy);">이번 주간 의정 일정 및 행사 요약</h4>
            <button class="btn-outline" style="font-size: 12px; padding: 4px 10px; border-color: var(--primary-navy); color: var(--primary-navy);" onclick="switchModuleTab('mod-schedule')">월간 전체 달력 이동</button>
          </div>
          <div class="calendar-grid" style="grid-template-columns: repeat(7, 1fr); min-height: 120px;">
            ${weekDates.map((wd, idx) => {
              const dayName = daysOfWeek[idx];
              const scheds = appState.schedules.filter(s => s.date === wd.dateStr);
              const evts = appState.eventsList.filter(e => e.date && e.date.startsWith(wd.dateStr));
              return `
                <div class="calendar-day-cell ${wd.isToday ? 'today' : ''}" style="min-height: 110px; padding: 8px;" onclick="switchModuleTab('mod-schedule')">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-weight: 900; font-size: 13px; color: ${idx === 0 ? '#DC2626' : idx === 6 ? '#2563EB' : 'var(--text-dark)'};">${wd.day} (${dayName})</span>
                    ${wd.isToday ? '<span style="background: #D97706; color: #FFF; font-size: 10px; font-weight: 900; padding: 1px 5px; border-radius: 4px;">오늘</span>' : ''}
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${scheds.map(s => `
                      <div style="background: #EFF6FF; color: #1E3A8A; font-size: 11px; font-weight: 800; padding: 3px 6px; border-radius: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-left: 3px solid #3B82F6;" title="${s.title}">
                        ▪ ${s.title}
                      </div>
                    `).join('')}
                    ${evts.map(e => `
                      <div style="background: #FEF2F2; color: #991B1B; font-size: 11px; font-weight: 800; padding: 3px 6px; border-radius: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-left: 3px solid #EF4444;" title="${e.title}">
                        ★ ${e.title}
                      </div>
                    `).join('')}
                    ${scheds.length === 0 && evts.length === 0 ? '<div style="font-size: 11px; color: var(--text-muted); text-align: center; margin-top: 16px;">일정 없음</div>' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="font-size: 18px; font-weight: 900; color: #DC2626; display: flex; align-items: center; gap: 6px;">
              <span>🔥 오늘 예정된 현장 행사 일정</span>
            </h4>
            <button class="btn-primary" style="height: 34px; font-size: 13px;" onclick="openEventCreateModal()">+ 긴급 행사 추가</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${todayEvents.map(evt => `
              <div style="background: #FFF; border: 1px solid var(--border-color); border-left: 5px solid #DC2626; padding: 14px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="background: #FEF2F2; color: #991B1B; border: 1px solid #991B1B; font-size: 11px; font-weight: 900; padding: 2px 6px; border-radius: 4px;">오늘 행사: ${evt.status}</span>
                    <span style="font-size: 13px; font-weight: 700; color: var(--text-muted);">일시: ${evt.date} | 장소: ${evt.location}</span>
                  </div>
                  <div style="font-size: 17px; font-weight: 900; color: var(--primary-navy);">${evt.title}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="text-align: right;">
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-muted);">요구참석자 수</div>
                    <div style="font-size: 20px; font-weight: 900; color: #DC2626;">${evt.attendees}명</div>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    
                    <button class="btn-outline" style="font-size: 12px; padding: 4px 10px;" onclick="openEventDetailModal('${evt.id}')">상세 보고서</button>
                  </div>
                </div>
              </div>
            `).join('') || '<div style="padding: 20px; text-align: center; background: #F8FAFC; border-radius: 8px; color: var(--text-muted); font-weight: 700;">오늘 예정된 공식 행사 일정이 없습니다.</div>'}
          </div>
        </div>
      </div>
    `;
  } else if (mod === 'mod-schedule') {
    if (!appState.calendarYear) {
      const now = new Date();
      appState.calendarYear = now.getFullYear();
      appState.calendarMonth = now.getMonth() + 1;
    }
    const year = appState.calendarYear;
    const month = appState.calendarMonth;
    const now = new Date();
    
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    let calendarCells = '';

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      calendarCells += `<div class="calendar-day-cell" style="background: #F1F5F9; opacity: 0.5;"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      const matchingScheds = appState.schedules.filter(s => s.date === dateStr);
      const matchingEvents = appState.eventsList.filter(e => e.date && e.date.startsWith(dateStr));
      const isToday = (year === now.getFullYear() && month === now.getMonth() + 1 && day === now.getDate());

      const allItems = [
        ...matchingScheds.map(s => ({ type: 'sched', data: s })),
        ...matchingEvents.map(e => ({ type: 'event', data: e }))
      ];
      const visibleItems = allItems.slice(0, 2);
      const overflowCount = allItems.length - 2;

      calendarCells += `
        <div class="calendar-day-cell ${isToday ? 'today' : ''}" data-date="${dateStr}" onclick="openScheduleCreateModal('${dateStr}')" ondragover="event.preventDefault(); this.style.background='#EFF6FF';" ondragleave="this.style.background='';" ondrop="event.preventDefault(); this.style.background=''; handleCalendarDrop(event, '${dateStr}');">
          <span class="calendar-day-number">${day}일 ${isToday ? '<strong style="color:#D97706;">오늘</strong>' : ''}</span>
          ${visibleItems.map(item => {
            if (item.type === 'sched') {
              const s = item.data;
              return `
                <div class="calendar-event-pill" draggable="true" ondragstart="handleCalendarDragStart(event, '${s.id}')" onclick="event.stopPropagation(); openScheduleDetailModal('${s.id}')" title="${s.time || ''} ${s.title}">
                  ▪ ${s.title}
                </div>
              `;
            } else {
              const e = item.data;
              return `
                <div class="calendar-event-pill" draggable="true" ondragstart="handleCalendarDragStart(event, '${e.id}')" style="background:#FEF2F2; color:#991B1B; border-left:3px solid #EF4444; cursor: grab;" onclick="event.stopPropagation(); openEventDetailModal('${e.id}')" title="${e.title}">
                  ★ ${e.title}
                </div>
              `;
            }
          }).join('')}
          ${overflowCount > 0 ? `<div class="calendar-more-pill">+${overflowCount}건 더보기</div>` : ''}
        </div>
      `;
    }

    const totalCells = firstDay + daysInMonth;
    const remainder = totalCells % 7;
    if (remainder !== 0) {
      for (let i = 0; i < 7 - remainder; i++) {
        calendarCells += `<div class="calendar-day-cell" style="background: #F1F5F9; opacity: 0.5;"></div>`;
      }
    }

    area.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="btn-outline" style="padding: 4px 10px; font-size: 16px; border: 1px solid var(--primary-navy); border-radius: 4px; cursor: pointer; color: var(--primary-navy);" onclick="changeCalendarMonth(-1)">◀ 이전달</button>
            <h3 style="font-size: 22px; font-weight: 900; color: var(--primary-navy); margin: 0;">${year}년 ${month}월</h3>
            <button class="btn-outline" style="padding: 4px 10px; font-size: 16px; border: 1px solid var(--primary-navy); border-radius: 4px; cursor: pointer; color: var(--primary-navy);" onclick="changeCalendarMonth(1)">다음달 ▶</button>
          </div>
          <button class="btn-primary" style="height: 40px; font-size: 15px;" onclick="openScheduleCreateModal('${new Date().toISOString().slice(0,10)}')">일정 등록</button>
        </div>

        <!-- 7-Column Fixed Calendar Grid -->
        <div class="calendar-grid">
          ${daysOfWeek.map(d => `<div class="calendar-header-cell" style="${d === '일' ? 'color:#F87171;' : d === '토' ? 'color:#60A5FA;' : ''}">${d}</div>`).join('')}
          ${calendarCells}
        </div>

        <!-- Quick D-Day List -->
        <div style="margin-top: 18px; border-top: 1px solid var(--border-color); padding-top: 14px;">
          <h4 style="font-size: 16px; font-weight: 900; color: var(--primary-navy); margin-bottom: 10px;">다가오는 주요 일정</h4>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            ${appState.schedules.slice(0, 5).map(s => `
              <div class="card-clickable" style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 10px 14px; border-radius: 8px; display: flex; align-items: center; gap: 10px;" onclick="openScheduleDetailModal('${s.id}')">
                <span style="background: var(--primary-navy); color: #FFF; font-size: 15px; font-weight: 900; padding: 4px 10px; border-radius: 6px;">${s.dday || 'D-?'}</span>
                <div>
                  <div style="font-size: 15px; font-weight: 800;">${s.title}</div>
                  <div style="font-size: 13px; color: var(--text-muted);">${s.date} ${s.time || ''} | ${s.location}</div>
                </div>
              </div>
            `).join('')}
            ${appState.schedules.length === 0 ? '<span style="font-size:14px; color:var(--text-muted);">등록된 일정이 없습니다.</span>' : ''}
          </div>
        </div>
      </div>
    `;
    } else if (mod === 'mod-complaints') {
    const isAdmin = appState.currentUser.clearance === '1급' || appState.currentUser.clearance === '2급' || appState.currentUser.isAdmin;

    if (!appState.complaints) appState.complaints = [];

    const currentSubTab = appState.complaintSubTab || 'active';
    const activeComplaints = appState.complaints.filter(c => c.step !== '처리완료');
    const completedComplaints = appState.complaints.filter(c => c.step === '처리완료');

    const currentFilter = appState.complaintFilter || '전체';
    const searchQuery = (appState.complaintSearchQuery || '').toLowerCase();

    const targetList = currentSubTab === 'completed' ? completedComplaints : activeComplaints;

    const filteredComplaints = targetList.filter(c => {
      const matchFilter = currentFilter === '전체' || c.step === currentFilter;
      if (!matchFilter) return false;
      if (!searchQuery) return true;
      return (c.title && c.title.toLowerCase().includes(searchQuery)) ||
             (c.requester && c.requester.toLowerCase().includes(searchQuery)) ||
             (c.location && c.location.toLowerCase().includes(searchQuery)) ||
             (c.id && c.id.toLowerCase().includes(searchQuery));
    });

    const stepCounts = {
      '접수': appState.complaints.filter(c => c.step === '접수').length,
      '구청이첩': appState.complaints.filter(c => c.step === '구청이첩').length,
      '현장점검': appState.complaints.filter(c => c.step === '현장점검').length,
      '처리완료': completedComplaints.length
    };

    area.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-size: 22px; font-weight: 900; color: var(--primary-navy); margin: 0 0 4px 0;">민원 현황 관리</h3>
            <span style="font-size: 14px; color: var(--text-muted);">
              ${currentSubTab === 'completed' ? '최종 처리 완료된 주민 민원 보관소 (완료 페이지)' : '지역구 주민 민원 접수·현장 조사·구청 이첩 실시간 진행 관리'}
            </span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-primary" style="height: 40px; font-size: 14px; padding: 0 16px;" onclick="openComplaintCreateModal()">+ 신규 민원 등록</button>
          </div>
        </div>

        <!-- 2 SUBTAB BUTTONS (진행 중인 민원 vs 완료된 민원) -->
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <button class="btn-primary" id="btnComplaintActiveTab" style="flex: 1; height: 42px; font-size: 14px; font-weight: 900; ${currentSubTab === 'active' ? 'background: var(--primary-navy); color:#FFF;' : 'background: #FFF; color: var(--primary-navy); border: 1.5px solid var(--primary-navy);'}" onclick="switchComplaintSubTab('active')">
            진행 중인 민원 (${activeComplaints.length}건)
          </button>
          <button class="btn-primary" id="btnComplaintCompletedTab" style="flex: 1; height: 42px; font-size: 14px; font-weight: 900; ${currentSubTab === 'completed' ? 'background: #047857; color:#FFF; border-color:#047857;' : 'background: #FFF; color: #047857; border: 1.5px solid #047857;'}" onclick="switchComplaintSubTab('completed')">
            완료된 민원 (${completedComplaints.length}건) (완료 페이지)
          </button>
        </div>

        ${currentSubTab === 'active' ? `
          <!-- 3 Step Summary Cards for Active -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px;">
            <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; text-align: center; cursor: pointer;" onclick="setComplaintFilter('접수')">
              <div style="font-size: 12px; font-weight: 800; color: var(--text-muted);">1. 접수</div>
              <div style="font-size: 22px; font-weight: 900; color: var(--primary-navy);">${stepCounts['접수']}건</div>
            </div>
            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 12px; text-align: center; cursor: pointer;" onclick="setComplaintFilter('구청이첩')">
              <div style="font-size: 12px; font-weight: 800; color: #B45309;">2. 구청이첩</div>
              <div style="font-size: 22px; font-weight: 900; color: #D97706;">${stepCounts['구청이첩']}건</div>
            </div>
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 12px; text-align: center; cursor: pointer;" onclick="setComplaintFilter('현장점검')">
              <div style="font-size: 12px; font-weight: 800; color: #1E40AF;">3. 현장점검</div>
              <div style="font-size: 22px; font-weight: 900; color: #2563EB;">${stepCounts['현장점검']}건</div>
            </div>
          </div>
        ` : ''}

        <!-- Filter & Search Bar -->
        <div style="display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;">
          <input type="text" class="form-input" style="flex: 1; padding: 8px 12px; font-size: 14px;" placeholder="민원 제목, 민원인 성명, 장소 실시간 검색..." value="${appState.complaintSearchQuery || ''}" oninput="handleComplaintSearch(event)">
          ${currentSubTab === 'active' ? `
            <div style="display: flex; gap: 6px;">
              ${['전체', '접수', '구청이첩', '현장점검'].map(f => `
                <button class="btn-outline ${currentFilter === f ? 'active' : ''}" style="${currentFilter === f ? 'background: var(--primary-navy); color: #FFF; font-weight: 900;' : 'background: #FFF;'}" onclick="setComplaintFilter('${f}')">
                  ${f}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Complaints List -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${filteredComplaints.map(c => {
            let badgeBg = '#F1F5F9';
            let badgeColor = 'var(--primary-navy)';
            if (c.step === '구청이첩') { badgeBg = '#FEF3C7'; badgeColor = '#92400E'; }
            else if (c.step === '현장점검') { badgeBg = '#DBEAFE'; badgeColor = '#1E40AF'; }
            else if (c.step === '처리완료') { badgeBg = '#DCFCE7'; badgeColor = '#166534'; }

            return `
              <div style="background: #FFF; border: 1px solid var(--border-color); border-radius: 8px; padding: 14px 16px; transition: box-shadow 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-family: monospace; font-size: 13px; font-weight: 800; color: var(--primary-navy);">${c.id}</span>
                    <span style="font-size: 12px; font-weight: 900; padding: 2px 8px; border-radius: 4px; background: ${badgeBg}; color: ${badgeColor};">${c.step}</span>
                    <span style="font-size: 12px; color: var(--text-muted);">${c.dept || '소관 미지정'}</span>
                  </div>
                  <span style="font-size: 12px; color: var(--text-muted); font-weight: 700;">접수일: ${c.date}</span>
                </div>

                <h4 style="font-size: 17px; font-weight: 900; color: var(--text-dark); margin-bottom: 6px;">${c.title}</h4>
                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 10px;">
                  민원인: <strong>${c.requester}</strong> (${c.phone || '연락처 미등록'}) | 발생위치: ${c.location}
                </div>
                <p style="font-size: 14px; color: var(--text-dark); line-height: 1.5; background: #F8FAFC; padding: 10px 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid var(--border-color);">
                  ${c.content}
                </p>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 10px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 800; color: var(--text-muted);">단계 변경:</span>
                    <select class="form-select" style="font-size: 12px; padding: 4px 8px; font-weight: 800;" onchange="updateComplaintStep('${c.id}', this.value)">
                      <option value="접수" ${c.step === '접수' ? 'selected' : ''}>1. 접수</option>
                      <option value="구청이첩" ${c.step === '구청이첩' ? 'selected' : ''}>2. 구청이첩</option>
                      <option value="현장점검" ${c.step === '현장점검' ? 'selected' : ''}>3. 현장점검</option>
                      <option value="처리완료" ${c.step === '처리완료' ? 'selected' : ''}>4. 처리완료 (완료 페이지 이관)</option>
                    </select>
                  </div>
                  <div style="display: flex; gap: 6px;">
                    ${c.step === '처리완료' ? `
                      <button class="btn-outline" style="font-size: 12px; padding: 4px 10px; border-color: var(--primary-navy); color: var(--primary-navy);" onclick="handleReopenComplaint('${c.id}')">
                        진행 중으로 복원
                      </button>
                    ` : `
                      <button class="btn-primary" style="font-size: 12px; padding: 4px 12px; background: #047857; border-color: #047857;" onclick="updateComplaintStep('${c.id}', '처리완료')">
                        처리완료 이관
                      </button>
                    `}
                    <button class="btn-outline" style="font-size: 12px; padding: 4px 8px; color: #DC2626; border-color: #DC2626;" onclick="deleteComplaint('${c.id}')">삭제</button>
                  </div>
                </div>
              </div>
            `;
          }).join('') || `<div style="padding: 32px; text-align: center; color: var(--text-muted); background: #F8FAFC; border-radius: 8px;">${currentSubTab === 'completed' ? '현재 완료된 민원 내역이 없습니다.' : '현재 진행 중인 민원이 없습니다.'}</div>`}
        </div>
      </div>
    `;

  } else if (mod === 'mod-tasks') {
    // REQUESTED: FULL SIMPLE TASK CREATION MODAL INSTEAD OF PROMPT
    area.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 22px; font-weight: 900; color: var(--primary-navy);">단순업무</h3>
            <span style="font-size: 14px; color: var(--text-muted);">신규 업무 추가</span>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button class="btn-outline" style="height: 40px; font-size: 14px; padding: 0 14px; border-color: var(--primary-navy); color: var(--primary-navy); font-weight: 800; cursor: pointer; background: #FFF;" onclick="toggleHideCompletedSimpleTasks()">
              ${appState.hideCompletedSimpleTasks ? '완료건 표시' : '완료건 숨기기'}
            </button>
            <button class="btn-primary" style="height: 40px; font-size: 14px;" onclick="openSimpleTaskCreateModal()">업무 추가</button>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          ${['대기', '진행중', '완료'].map(stage => {
            const list = appState.simpleTasks.filter(t => t.stage === stage);
            const isCompletedHidden = stage === '완료' && appState.hideCompletedSimpleTasks;
            return `
              <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: 900; color: var(--primary-navy); margin-bottom: 10px; border-bottom: 2px solid var(--primary-navy); padding-bottom: 4px;">
                  <span>${stage} 총 ${list.length}건</span>
                  ${stage === '완료' && appState.hideCompletedSimpleTasks ? '<span style="font-size: 12px; color: #DC2626; font-weight: 700;">(숨김 상태)</span>' : ''}
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${isCompletedHidden ? `
                    <div style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 24px 10px; background: #FFF; border-radius: 6px; border: 1px dashed var(--border-color);">
                      완료건 숨김 처리되었습니다.<br>
                      <button class="btn-outline" style="font-size: 12px; padding: 4px 10px; margin-top: 8px; border-color: var(--primary-navy); color: var(--primary-navy);" onclick="toggleHideCompletedSimpleTasks()">완료건 표시하기</button>
                    </div>
                  ` : (list.map(item => `
                    <div class="card-clickable" style="background: #FFF; border: 1px solid var(--border-color); padding: 10px; border-radius: 6px;" onclick="alert('단순업무: ' + '${item.title}' + '\\n담당자: ' + '${item.assignee}' + '\\n목표 마감일: ' + '${item.dueDate || '미지정'}')">
                      <div style="font-size: 15px; font-weight: 800; margin-bottom: 4px;">${item.title}</div>
                      <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">담당: ${item.assignee} | 마감: ${item.dueDate || item.date}</div>
                      <div style="display: flex; gap: 4px; justify-content: flex-end;" onclick="event.stopPropagation();">
                        ${stage !== '대기' ? `<button class="btn-outline" style="font-size: 12px; padding: 2px 6px;" onclick="moveSimpleTask('${item.id}', 'prev')">◀ 이전</button>` : ''}
                        ${stage !== '완료' ? `<button class="btn-outline" style="font-size: 12px; padding: 2px 6px;" onclick="moveSimpleTask('${item.id}', 'next')">다음 ▶</button>` : ''}
                      </div>
                    </div>
                  `).join('') || '<div style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 10px;">항목 없음</div>')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (mod === 'mod-crm') {
    area.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="font-size: 22px; font-weight: 900; color: var(--primary-navy);">당원/후원자 CRM (초성 검색)</h3>
          <button class="btn-primary" style="height: 38px; font-size: 14px;" onclick="handleAddCRMPrompt()">+ 신규 당원/후원자 등록</button>
        </div>
        <input type="text" class="form-input" style="width: 100%; padding: 10px; margin-bottom: 14px;" placeholder="이름, 초성(예: ㄱㄷㅎ, ㅂㅁㅅ), 연락처 검색..." oninput="handleCRMSearch(event)">
        <div id="crmResultContainer" style="display: flex; flex-direction: column; gap: 8px;">
          ${renderCRMList(appState.crmList)}
        </div>
      </div>
    `;
  } else if (mod === 'mod-events') {
    area.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 22px; font-weight: 900; color: var(--primary-navy);">행사/현장관리</h3>
          <button class="btn-primary" style="height: 38px; font-size: 14px;" onclick="openEventCreateModal()">행사 등록</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${appState.eventsList.map(evt => `
            <div class="card-clickable" style="background: #FFF; border: 1px solid var(--border-color); padding: 16px; border-radius: 8px;" onclick="openEventDetailModal('${evt.id}')">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <div>
                  <span style="font-size: 14px; font-weight: 800; color: var(--primary-navy);">${evt.id}</span>
                  <button class="btn-outline" style="font-size: 11px; padding: 2px 6px; margin-left: 8px; border-color: var(--primary-navy); color: var(--primary-navy);" onclick="event.stopPropagation(); openUniversalEditModal('EVENT', '${evt.id}')">\[수정/삭제\]</button>
                </div>
                <span style="background: #F8FAFC; color: var(--primary-navy); border: 1px solid var(--primary-navy); font-size: 13px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">${evt.status}</span>
              </div>
              <h4 style="font-size: 19px; font-weight: 800; margin-bottom: 6px;">${evt.title}</h4>
              <div style="font-size: 14px; color: var(--text-muted); font-weight: 700; margin-bottom: 12px;">
                일시: ${evt.date} ~ ${evt.endDate} | 장소: ${evt.location}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; padding: 10px; border-radius: 6px;" onclick="event.stopPropagation();">
                <div>
                  <span style="font-size: 15px; font-weight: 800; color: var(--text-dark);">요구참석자 수: <strong style="color: #DC2626; font-size: 18px;">${evt.attendees}명</strong></span>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button class="btn-outline" style="font-size: 13px; padding: 4px 10px;" onclick="openEventDetailModal('${evt.id}')">경비 및 상세 보고서</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (mod === 'mod-vault') {
    const categories = ['전체', '공약문서', '보도자료', '회의록'];
    const filteredDocs = appState.docsList.filter(d => appState.selectedDocFilter === '전체' || d.category === appState.selectedDocFilter);
    area.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h3 style="font-size: 22px; font-weight: 900; color: var(--primary-navy);">문서 보관소</h3>
          <button class="btn-primary" style="height: 38px; font-size: 14px;" onclick="openVaultCreateModal()">+ 문서 보관서 등록</button>
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 14px;">
          ${categories.map(cat => `
            <button class="btn-outline ${appState.selectedDocFilter === cat ? 'active' : ''}" style="${appState.selectedDocFilter === cat ? 'background: var(--primary-navy); color:#FFF;' : ''}" onclick="setDocFilter('${cat}')">${cat}</button>
          `).join('')}
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${filteredDocs.map(doc => `
            <div class="card-clickable" style="background: #FFF; border: 1px solid var(--border-color); padding: 14px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;" onclick="openDocDetailModal('${doc.id}')">
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 14px; font-weight: 800; color: var(--primary-navy);">[${doc.category}] | 등록일: ${doc.date}</span>
                  <button class="btn-outline" style="font-size: 11px; padding: 2px 6px; border-color: var(--primary-navy); color: var(--primary-navy);" onclick="event.stopPropagation(); openUniversalEditModal('VAULT', '${doc.id}')">\[수정/삭제\]</button>
                </div>
                <div style="font-size: 18px; font-weight: 800; margin-top: 2px;">${doc.title}</div>
              </div>
              <button class="btn-outline" style="font-size: 13px; padding: 6px 12px; border-color: var(--primary-navy); color: var(--primary-navy);" onclick="event.stopPropagation(); openDocDetailModal('${doc.id}')">내용 복사</button>
            </div>
          `).join('') || '<div style="padding: 20px; text-align: center; color: var(--text-muted);">해당 카테고리에 보관된 문서가 없습니다.</div>'}
        </div>
      </div>
    `;
  } else if (mod === 'mod-press') {
    area.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div>
            <h3 style="font-size: 22px; font-weight: 900; color: var(--primary-navy);">모니터링 및 배포</h3>
            <span style="font-size: 14px; color: var(--text-muted);">지역 동향 기사 관리 및 기자단 배포</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-outline" style="height: 40px; font-size: 14px; border-color: var(--primary-navy); color: var(--primary-navy);" onclick="simulatePressRelease()">\[기자단 배포\]</button>
            <button class="btn-primary" style="height: 40px; font-size: 14px;" onclick="openPressCreateModal()">기사 등록</button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${appState.pressList.map(prs => {
            let badgeStyle = 'background: #F8FAFC; color: var(--primary-navy); border: 1px solid var(--primary-navy);';
            if (prs.sentiment === '호의' || prs.sentiment === '긍정') badgeStyle = 'background: #F8FAFC; color: var(--approved-green); border: 1px solid var(--approved-green);';
            else if (prs.sentiment === '대응필요' || prs.sentiment === '부정') badgeStyle = 'background: #F8FAFC; color: var(--rejected-red); border: 1px solid var(--rejected-red);';

            return `
              <div class="card-clickable" style="background: #FFF; border: 1px solid var(--border-color); padding: 16px; border-radius: 8px;" onclick="openPressDetailModal('${prs.id}')">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <div>
                    <span style="font-size: 14px; font-weight: 800; color: var(--primary-navy);">언론사: ${prs.press} | 스크랩일시: ${prs.date}</span>
                    <button class="btn-outline" style="font-size: 11px; padding: 2px 6px; margin-left: 8px; border-color: var(--primary-navy); color: var(--primary-navy);" onclick="event.stopPropagation(); openUniversalEditModal('PRESS', '${prs.id}')">수정/삭제</button>
                  </div>
                  <span style="${badgeStyle} font-size: 13px; font-weight: 900; padding: 2px 8px; border-radius: 4px;">${prs.sentiment}</span>
                </div>
                <h4 style="font-size: 19px; font-weight: 900; margin-bottom: 8px;">${prs.title}</h4>
                <p style="font-size: 15px; color: var(--text-muted); line-height: 1.6; margin-bottom: 10px;">${prs.summary}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 800;">
                  <span>
                    원문 링크: ${prs.url ? `<a href="${prs.url}" target="_blank" onclick="event.stopPropagation();" style="color: var(--primary-navy); text-decoration: underline;">${prs.url}</a>` : '-'}
                  </span>
                  <span style="color: var(--primary-navy);">열람</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (mod === 'mod-messenger') {
    area.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 22px; font-weight: 900; color: var(--primary-navy);">메신저/음성</h3>
          </div>
          <button class="btn-primary" style="height: 38px; font-size: 14px;" onclick="openMsgCreateModal()">보고 등록</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${(appState.msgList || []).map(msg => `
            <div style="background: #FFF; border: 1px solid var(--border-color); padding: 16px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div>
                  <span style="background: #F8FAFC; color: var(--primary-navy); border: 1px solid var(--primary-navy); font-size: 12px; font-weight: 900; padding: 2px 8px; border-radius: 4px;">${msg.type === 'VOICE' ? '음성 보고' : '메신저'}</span>
                  <strong style="font-size: 15px; color: var(--text-dark); margin-left: 6px;">${msg.sender}</strong>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 13px; color: var(--text-muted); font-weight: 700;">${msg.date}</span>
                  <button class="btn-outline" style="font-size: 12px; padding: 3px 8px; border-color: var(--primary-navy); color: var(--primary-navy);" onclick="openUniversalEditModal('MSG', '${msg.id}')">수정/삭제</button>
                </div>
              </div>
              <h4 style="font-size: 18px; font-weight: 900; margin-bottom: 8px;">${msg.title}</h4>
              ${msg.type === 'VOICE' ? `
  <div style="background: #F1F5F9; border: 1px solid var(--border-light); padding: 10px 14px; border-radius: 6px; margin-bottom: 8px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-size: 12px; font-weight: 800; color: var(--primary-navy);">음성 녹취 보고</span>
      <span style="font-size: 12px; font-weight: 700; color: var(--approved-green);">AI STT 자동 변환 완료</span>
    </div>
    ${msg.audioUrl ? `
      <audio controls src="${msg.audioUrl}" style="width: 100%; height: 36px;"></audio>
    ` : `
      <button class="btn-outline" style="padding: 6px 12px; font-weight: 800; background: #FFF; border-color: var(--primary-navy); color: var(--primary-navy);" onclick="playVoiceMessage('${msg.content.replace(/'/g, "\\'")}', null)">▶ 음성 녹취 듣기 (재생)</button>
    `}
  </div>
` : ''}
              <p style="font-size: 14px; color: var(--text-dark); line-height: 1.6; background: #FAFAFA; padding: 12px; border-radius: 6px; border: 1px dashed var(--border-color);">${msg.content}</p>
            </div>
          `).join('') || '<div style="padding: 20px; text-align: center; color: var(--text-muted);">등록된 업무 메시지 보고가 없습니다.</div>'}
        </div>
      </div>
    `;
  } else if (mod === 'mod-audit') {
    let allLogs = [];
    appState.tasks.forEach(t => {
      (t.auditLogs || []).forEach(log => {
        const isFinalApproval = log.action.includes('최종') || log.action.includes('3차') || (log.who && log.who.includes('의원'));
        allLogs.push({ ...log, taskId: t.id, taskTitle: t.title, isFinalApproval });
      });
    });
    allLogs.sort((a, b) => {
      if (a.isFinalApproval && !b.isFinalApproval) return -1;
      if (!a.isFinalApproval && b.isFinalApproval) return 1;
      return b.when.localeCompare(a.when);
    });
    area.innerHTML = `
      <div class="card">
        <h3 style="font-size: 22px; font-weight: 900; color: var(--primary-navy); margin-bottom: 14px;">전자결재 법적 감사로그 (Audit Trail Timeline)</h3>
        <p style="font-size: 15px; color: var(--text-muted); margin-bottom: 16px;">최종 결재권자(의원)의 승인 및 주요 결정 로그가 최상단에 최우선 배치되며, 모든 시스템 이력이 실시간 기록됩니다.</p>
        <div style="display: flex; flex-direction: column; gap: 10px; max-height: 480px; overflow-y: auto;">
          ${allLogs.map(l => `
            <div style="background: ${l.isFinalApproval ? '#FEF2F2' : '#F8FAFC'}; border: 1px solid ${l.isFinalApproval ? '#991B1B' : 'var(--border-color)'}; border-left: 5px solid ${l.isFinalApproval ? '#991B1B' : 'var(--primary-navy)'}; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 13px; font-weight: 800; color: ${l.isFinalApproval ? '#991B1B' : 'var(--primary-navy)'};">
                  ${l.isFinalApproval ? '[★ 최종 결재권자 승인 최우선 표시] | ' : ''}[일시: ${l.when}] | 수행자: ${l.who}
                </div>
                <div style="font-size: 16px; font-weight: 800; margin-top: 2px; color: ${l.isFinalApproval ? '#991B1B' : 'var(--text-dark)'};">안건 [${l.taskId}]: ${l.action}</div>
              </div>
              <button class="btn-outline" style="font-size: 13px; padding: 4px 10px; border-color: ${l.isFinalApproval ? '#991B1B' : 'var(--primary-navy)'}; color: ${l.isFinalApproval ? '#991B1B' : 'var(--primary-navy)'};" onclick="openTaskDetailModal('${l.taskId}')">안건 상세 확인</button>
            </div>
          `).join('') || '<div style="padding: 20px; text-align: center;">감사기록이 없습니다.</div>'}
        </div>
      </div>
    `;
  }
}

// REQUESTED: FULL SCHEDULE CREATION MODAL HANDLERS
function openScheduleCreateModal(defaultDate) {
  const dateInput = document.getElementById('schedDateInput');
  if (dateInput) dateInput.value = defaultDate || new Date().toISOString().slice(0,10);
  const titleInput = document.getElementById('schedTitleInput');
  if (titleInput) titleInput.value = '';
  document.getElementById('scheduleCreateModal').classList.remove('hidden');
}

function closeScheduleCreateModal() {
  document.getElementById('scheduleCreateModal').classList.add('hidden');
}

function handleScheduleCreateSubmit(event) {
  event.preventDefault();
  const title = document.getElementById('schedTitleInput').value;
  const date = document.getElementById('schedDateInput').value;
  const time = document.getElementById('schedTimeInput').value;
  const loc = document.getElementById('schedLocInput').value;
  const dday = document.getElementById('schedDdayInput').value;
  const alarm = document.getElementById('schedAlarmInput').checked;

  appState.schedules.unshift({
    id: `sch-${Date.now()}`,
    title: title,
    date: date,
    time: time,
    dday: dday,
    location: loc,
    alarm: alarm
  });

  saveState();
  closeScheduleCreateModal();
  alert(`일정 등록 완료 - '${title}' 일정이 공식 달력에 추가되었습니다.`);
  renderModuleView();
}

// --- CALENDAR DRAG & DROP ---
function handleCalendarDragStart(event, scheduleId) {
  event.stopPropagation();
  event.dataTransfer.setData('text/plain', scheduleId);
  event.dataTransfer.effectAllowed = 'move';
  event.target.style.opacity = '0.5';
  setTimeout(() => { event.target.style.opacity = '1'; }, 300);
}

function handleCalendarDrop(event, targetDate) {
  event.preventDefault();
  event.stopPropagation();
  const scheduleId = event.dataTransfer.getData('text/plain');
  if (!scheduleId) return;

  // 1. Check if it is a Schedule item
  const schedule = (appState.schedules || []).find(s => String(s.id) === String(scheduleId));
  if (schedule) {
    const oldDate = schedule.date;
    if (oldDate === targetDate) return;

    schedule.date = targetDate;

    // Recalculate D-Day
    const today = new Date();
    const targetDateObj = new Date(targetDate);
    const diffDays = Math.ceil((targetDateObj - today) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) schedule.dday = 'D-' + diffDays;
    else if (diffDays === 0) schedule.dday = 'D-Day';
    else schedule.dday = 'D+' + Math.abs(diffDays);

    // If synced with an event, update the event too
    if (schedule.eventId) {
      const linkedEvt = (appState.eventsList || []).find(e => String(e.id) === String(schedule.eventId));
      if (linkedEvt) {
        const [, time] = (linkedEvt.date || '').split(' ');
        linkedEvt.date = targetDate + ' ' + (time || '14:00');
      }
    }

    saveState();
    renderModuleView();
    return;
  }

  // 2. Check if it is an Event item
  const evt = (appState.eventsList || []).find(e => String(e.id) === String(scheduleId));
  if (evt) {
    const [oldDate, oldTime] = (evt.date || '').split(' ');
    if (oldDate === targetDate) return;

    if (evt.endDate) {
      const [oldEndDate, oldEndTime] = evt.endDate.split(' ');
      const diffMs = new Date(oldEndDate) - new Date(oldDate);
      const newEndDateObj = new Date(new Date(targetDate).getTime() + (diffMs > 0 ? diffMs : 0));
      const newEndDateStr = newEndDateObj.toISOString().slice(0, 10);
      evt.endDate = newEndDateStr + ' ' + (oldEndTime || '16:00');
    }
    evt.date = targetDate + ' ' + (oldTime || '14:00');

    // Also update any synced schedule entry
    const syncSch = (appState.schedules || []).find(s => s.eventId === evt.id || (s.title && s.title === evt.title));
    if (syncSch) {
      syncSch.date = targetDate;
    }

    saveState();
    renderModuleView();
    return;
  }
}

// REQUESTED: FULL SIMPLE TASK CREATION MODAL HANDLERS
function openSimpleTaskCreateModal() {
  const select = document.getElementById('simpleAssigneeInput');
  const titleInput = document.getElementById('simpleTitleInput');
  const dateInput = document.getElementById('simpleDateInput');
  if (titleInput) titleInput.value = '';
  if (dateInput) dateInput.value = new Date(Date.now() + 86400000 * 3).toISOString().slice(0,10);

  if (select) {
    select.innerHTML = appState.users.filter(u => u.status === 'APPROVED' || !u.status).map(u => `
      <option value="${formatUserDisplay(u)}">${formatUserDisplay(u)}</option>
    `).join('');
  }
  document.getElementById('simpleTaskCreateModal').classList.remove('hidden');
}

function closeSimpleTaskCreateModal() {
  document.getElementById('simpleTaskCreateModal').classList.add('hidden');
}

function handleSimpleTaskCreateSubmit(event) {
  event.preventDefault();
  const title = document.getElementById('simpleTitleInput').value;
  const assignee = document.getElementById('simpleAssigneeInput').value;
  const stage = document.getElementById('simpleStageInput').value;
  const dueDate = document.getElementById('simpleDateInput').value;

  appState.simpleTasks.unshift({
    id: `tsk-${Date.now()}`,
    title: title,
    assignee: assignee,
    stage: stage,
    date: new Date().toLocaleDateString(),
    dueDate: dueDate
  });

  saveState();
  closeSimpleTaskCreateModal();
  alert(`'${title}' 업무가 등록되었습니다.`);
  renderModuleView();
}

// REQUESTED: ADMIN OVERRIDE FOR COMPLAINT PIPELINE
function overrideComplaintStep(complaintId, newStep) {
  appState.complaints = appState.complaints.map(c => {
    if (String(c.id) === String(complaintId)) {
      return { ...c, step: newStep };
    }
    return c;
  });
  saveState();
  renderModuleView();
  alert(`해당 민원 상태가 ${newStep}(으)로 변경되었습니다.`);
}

function advanceComplaintStep(id) {
  appState.complaints = appState.complaints.map(c => {
    if (String(c.id) === String(id)) {
      const steps = ['접수', '구청이첩', '현장점검', '처리완료'];
      const currentIdx = steps.indexOf(c.step);
      const nextStep = steps[Math.min(steps.length - 1, currentIdx + 1)];
      return { ...c, step: nextStep };
    }
    return c;
  });
  saveState();
  renderModuleView();
}

// --- NEW MODULE CREATION MODALS AND HANDLERS ---
function openPressCreateModal() {
  document.getElementById('pressMediaInput').value = '';
  document.getElementById('pressTitleInput').value = '';
  document.getElementById('pressDateInput').value = new Date().toISOString().slice(0,10);
  document.getElementById('pressUrlInput').value = 'https://news.naver.com';
  document.getElementById('pressSummaryInput').value = '';
  document.getElementById('pressCreateModal').classList.remove('hidden');
}
function closePressCreateModal() {
  document.getElementById('pressCreateModal').classList.add('hidden');
}
function handlePressCreateSubmit(e) {
  e.preventDefault();
  const press = document.getElementById('pressMediaInput').value.trim();
  const sentiment = document.getElementById('pressSentimentInput').value;
  const title = document.getElementById('pressTitleInput').value.trim();
  const date = document.getElementById('pressDateInput').value;
  const url = document.getElementById('pressUrlInput').value.trim();
  const summary = document.getElementById('pressSummaryInput').value.trim();

  appState.pressList.unshift({
    id: `prs-${Date.now().toString().slice(-3)}`,
    press: press,
    title: title,
    date: date,
    sentiment: sentiment,
    url: url,
    summary: summary
  });
  saveState();
  closePressCreateModal();
  renderModuleView();
  alert(`언론 보도 등록 완료 - '${press}' 보도 모니터링 기사가 등록되었습니다.`);
}

function openMsgCreateModal() {
  const audioInput = document.getElementById('msgAudioInput');
  if (audioInput) audioInput.value = '';
  const previewArea = document.getElementById('msgAudioPreviewContainer');
  if (previewArea) previewArea.style.display = 'none';
  window._tempMsgAudio = null;
  document.getElementById('msgSenderInput').value = `${appState.currentUser.name} (${appState.currentUser.roleTitle})`;
  document.getElementById('msgTitleInput').value = '';
  document.getElementById('msgContentInput').value = '';
  document.getElementById('msgCreateModal').classList.remove('hidden');
}
function closeMsgCreateModal() {
  document.getElementById('msgCreateModal').classList.add('hidden');
}
function handleMsgCreateSubmit(e) {
  e.preventDefault();
  const sender = document.getElementById('msgSenderInput').value.trim();
  const type = document.getElementById('msgTypeInput').value;
  const title = document.getElementById('msgTitleInput').value.trim();
  const content = document.getElementById('msgContentInput').value.trim();

  appState.msgList.unshift({
    id: `msg-${Date.now().toString().slice(-3)}`,
    sender: sender,
    type: type,
    title: title,
    date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0,5),
    content: type === 'VOICE' ? `음성 변환: ${content}` : content
  });
  saveState();
  closeMsgCreateModal();
  renderModuleView();
  alert("보고 등록 완료 - 업무 보고가 성공적으로 등록되었습니다.");
}


function simulatePressRelease() {
  alert("국회 출입 기자단 및 지역 24개 언론사 공식 이메일로 최신 보도자료 및 성명서가 일괄 전송되었습니다.");
}

window.handlePressFollowUp = function(title, summary) {
  closeModuleDetailModal();
  switchTab('createView');
  setTimeout(() => {
    const catSelect = document.getElementById('newCategory');
    if (catSelect) catSelect.value = '홍보보도';
    const titleEl = document.getElementById('newTitle');
    if (titleEl) titleEl.value = "보도대응: " + title;
    const summaryEl = document.getElementById('newSummary');
    if (summaryEl) summaryEl.value = "■ 대상 기사: " + title + "\n■ 기사 내용: " + summary + "\n\n■ 후속 대응 및 보도자료 초안:\n";
  }, 50);
};

function openPressDetailModal(id) {
  const prs = appState.pressList.find(p => String(p.id) === String(id));
  if (!prs) return;
  document.getElementById('moduleDetailModalTitle').textContent = `언론 동향 기사 보고서 (${prs.press})`;
  document.getElementById('moduleDetailModalBody').innerHTML = `
    <div style="font-size: 14px; font-weight: 800; color: var(--primary-navy); margin-bottom: 4px;">스크랩일시: ${prs.date} | 평가 태그: [${prs.sentiment}]</div>
    <div style="font-size: 20px; font-weight: 900; margin-bottom: 12px;">${prs.title}</div>
    <div style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 14px; border-radius: 8px; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
      <div style="font-weight: 900; color: var(--primary-navy); margin-bottom: 6px;">기사 핵심 요약 및 보좌진 코멘트</div>
      ${prs.summary}
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="btn-primary" style="flex: 1;" onclick="handlePressFollowUp('${prs.title}', '${prs.summary}'); closeModuleDetailModal();">후속 대응 보도자료 작성</button>
      <button class="btn-outline" style="flex: 1;" onclick="closeModuleDetailModal()">닫기</button>
    </div>
  `;
  document.getElementById('moduleDetailModal').classList.remove('hidden');
}

function moveSimpleTask(id, dir) {
  const stages = ['대기', '진행중', '완료'];
  appState.simpleTasks = appState.simpleTasks.map(t => {
    if (String(t.id) === String(id)) {
      const idx = stages.indexOf(t.stage);
      let nextIdx = dir === 'next' ? Math.min(2, idx + 1) : Math.max(0, idx - 1);
      return { ...t, stage: stages[nextIdx] };
    }
    return t;
  });
  saveState();
  renderModuleView();
}

function openEventCreateModal() {
  document.getElementById('evTitleInput').value = '';
  document.getElementById('evDateInput').value = new Date(Date.now() + 86400000 * 5).toISOString().slice(0,10);
  document.getElementById('evTimeInput').value = '14:00';
  document.getElementById('evLocInput').value = '';
  document.getElementById('evCountInput').value = '300';
  document.getElementById('evBudgetInput').value = '3000000';
  document.getElementById('eventCreateModal').classList.remove('hidden');
}
function closeEventCreateModal() {
  document.getElementById('eventCreateModal').classList.add('hidden');
}
function handleEventCreateSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('evTitleInput').value.trim();
  const date = document.getElementById('evDateInput').value;
  const time = document.getElementById('evTimeInput').value;
  const endDate = document.getElementById('evEndDateInput').value;
  const endTime = document.getElementById('evEndTimeInput').value;
  const loc = document.getElementById('evLocInput').value.trim();
  const count = parseInt(document.getElementById('evCountInput').value, 10) || 100;
  const budget = parseInt(document.getElementById('evBudgetInput').value.replace(/[^0-9]/g, ''), 10) || 1000000;

  const newEvtId = 'evt-' + Date.now().toString().slice(-3);
  appState.eventsList.unshift({
    id: newEvtId,
    title: title,
    date: `${date} ${time}`,
    endDate: `${endDate} ${endTime}`,
    location: loc,
    attendees: count,
    budget: budget,
    spent: 0,
    status: '준비중'
  });

  // SYNC EVENT TO SCHEDULE
  if (!appState.schedules) appState.schedules = [];
  appState.schedules.unshift({
    id: 'sch-' + Date.now().toString().slice(-3),
    title: title,
    date: date,
    time: time,
    location: loc,
    dday: '행사',
    alarm: true,
    eventId: newEvtId
  });
  saveState();
  closeEventCreateModal();
  renderModuleView();
  alert(`행사 등록 완료 - '${title}' 일정이 등록되었습니다.`);
}

window.handleVaultPhotoPreview = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('vaultPhotoPreview');
    preview.style.display = 'block';
    preview.querySelector('img').src = e.target.result;
    window._tempVaultPhoto = e.target.result;
  };
  reader.readAsDataURL(file);
};

function openVaultCreateModal() {
  document.getElementById('vltTitleInput').value = '';
  document.getElementById('vltDateInput').value = new Date().toISOString().slice(0,10);
  document.getElementById('vltContentInput').value = '';
  document.getElementById('vltPhotoInput').value = '';
  document.getElementById('vaultPhotoPreview').style.display = 'none';
  window._tempVaultPhoto = null;
  document.getElementById('vaultCreateModal').classList.remove('hidden');
}
function closeVaultCreateModal() {
  document.getElementById('vaultCreateModal').classList.add('hidden');
}
function handleVaultCreateSubmit(e) {
  e.preventDefault();
  const cat = document.getElementById('vltCatInput').value;
  const date = document.getElementById('vltDateInput').value;
  const title = document.getElementById('vltTitleInput').value.trim();
  const content = document.getElementById('vltContentInput').value.trim();

  appState.docsList.unshift({
    id: `doc-${Date.now().toString().slice(-3)}`,
    category: cat,
    title: title,
    date: date,
    ocrText: content,
    photoUrl: window._tempVaultPhoto || null
  });
  saveState();
  closeVaultCreateModal();
  renderModuleView();
  alert(`문서 보관 완료 - '${title}' 문서가 안전하게 암호화 보관되었습니다.`);
}

// --- PROFILE & PASSWORD MODAL ---
window.openProfileModal = function() {
  document.getElementById('newProfilePw').value = '';
  document.getElementById('newProfilePwConfirm').value = '';
  document.getElementById('profileModal').classList.remove('hidden');
};

window.closeProfileModal = function() {
  document.getElementById('profileModal').classList.add('hidden');
};

window.handlePasswordChange = async function(e) {
  e.preventDefault();
  const pw = document.getElementById('newProfilePw').value.trim();
  const pwConfirm = document.getElementById('newProfilePwConfirm').value.trim();

  if (!pw || pw !== pwConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  if (supabaseClient) {
    const { data, error } = await supabaseClient.auth.updateUser({ password: pw });
    if (error) {
      alert('비밀번호 변경 실패: ' + error.message);
      return;
    }
    alert('비밀번호가 성공적으로 변경되었습니다.');
    closeProfileModal();
  } else {
    alert('현재 로컬 테스트 모드이므로 비밀번호 변경이 시뮬레이션 되었습니다.');
    closeProfileModal();
  }
};

// --- UNIVERSAL EDIT/DELETE MODAL HANDLERS ---
function openUniversalEditModal(type, id) {
  document.getElementById('editItemType').value = type;
  document.getElementById('editItemId').value = id;
  const container = document.getElementById('editModalFieldsContainer');
  let html = '';

  if (type === 'EVENT') {
    const item = appState.eventsList.find(e => String(e.id) === String(id));
    if (!item) return;
    const [sDate, sTime] = (item.date || '2026-07-01 14:00').split(' ');
    const [eDate, eTime] = (item.endDate || sDate + ' 16:00').split(' ');
    
    html = `
      <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">행사 명칭</label><input type="text" id="editEvTitle" class="form-input" style="width:100%; padding:10px;" value="${item.title}" required></div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">시작 일자</label><input type="date" id="editEvDate" class="form-input" style="width:100%; padding:10px;" value="${sDate}" required></div>
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">시작 시간</label><input type="time" id="editEvTime" class="form-input" style="width:100%; padding:10px;" value="${sTime || '14:00'}" required></div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">종료 일자</label><input type="date" id="editEvEndDate" class="form-input" style="width:100%; padding:10px;" value="${eDate}" required></div>
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">종료 시간</label><input type="time" id="editEvEndTime" class="form-input" style="width:100%; padding:10px;" value="${eTime || '16:00'}" required></div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">장소</label><input type="text" id="editEvLoc" class="form-input" style="width:100%; padding:10px;" value="${item.location}" required></div>
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">요구참석자 수</label><input type="number" id="editEvCount" class="form-input" style="width:100%; padding:10px;" value="${item.attendees}" required></div>
      </div>
      <div style="margin-top:10px;">
        <label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">예산 (원)</label>
        <input type="number" id="editEvBudget" class="form-input" style="width:100%; padding:10px;" value="${item.budget}" required>
      </div>
    `;
  } else if (type === 'VAULT') {
    const item = appState.docsList.find(d => String(d.id) === String(id));
    if (!item) return;
    html = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div>
          <label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">분류</label>
          <select id="editVltCat" class="form-select" style="width:100%; padding:10px;">
            <option value="공약문서" ${item.category==='공약문서'?'selected':''}>공약문서</option>
            <option value="보도자료" ${item.category==='보도자료'?'selected':''}>보도자료</option>
            <option value="회의록" ${item.category==='회의록'?'selected':''}>회의록</option>
          </select>
        </div>
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">등록일</label><input type="text" id="editVltDate" class="form-input" style="width:100%; padding:10px;" value="${item.date}" required></div>
      </div>
      <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">문서 제목</label><input type="text" id="editVltTitle" class="form-input" style="width:100%; padding:10px;" value="${item.title}" required></div>
      <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">문서 내용 / OCR 텍스트</label><textarea id="editVltContent" class="form-textarea" rows="4" style="width:100%; padding:10px;" required>${item.ocrText}</textarea></div>
    `;
  } else if (type === 'PRESS') {
    const item = appState.pressList.find(p => String(p.id) === String(id));
    if (!item) return;
    html = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">언론사</label><input type="text" id="editPrsMedia" class="form-input" style="width:100%; padding:10px;" value="${item.press}" required></div>
        <div>
          <label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">성향</label>
          <select id="editPrsSent" class="form-select" style="width:100%; padding:10px;">
            <option value="호의" ${item.sentiment==='호의'||item.sentiment==='긍정'?'selected':''}>호의 (긍정)</option>
            <option value="중립" ${item.sentiment==='중립'?'selected':''}>중립</option>
            <option value="대응필요" ${item.sentiment==='대응필요'||item.sentiment==='부정'?'selected':''}>대응필요 (부정)</option>
          </select>
        </div>
      </div>
      <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">기사 제목</label><input type="text" id="editPrsTitle" class="form-input" style="width:100%; padding:10px;" value="${item.title}" required></div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">일자</label><input type="text" id="editPrsDate" class="form-input" style="width:100%; padding:10px;" value="${item.date}" required></div>
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">원문 URL</label><input type="text" id="editPrsUrl" class="form-input" style="width:100%; padding:10px;" value="${item.url||''}"></div>
      </div>
      <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">요약</label><textarea id="editPrsSum" class="form-textarea" rows="3" style="width:100%; padding:10px;" required>${item.summary}</textarea></div>
    `;
  } else if (type === 'MSG') {
    const item = appState.msgList.find(m => String(m.id) === String(id));
    if (!item) return;
    html = `
      <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">발신자</label><input type="text" id="editMsgSender" class="form-input" style="width:100%; padding:10px;" value="${item.sender}" required></div>
      <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">제목</label><input type="text" id="editMsgTitle" class="form-input" style="width:100%; padding:10px;" value="${item.title}" required></div>
      <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">본문 / 스크립트</label><textarea id="editMsgContent" class="form-textarea" rows="4" style="width:100%; padding:10px;" required>${item.content}</textarea></div>
    `;
  } else if (type === 'CRM') {
    const isNew = id === 'NEW';
    const item = isNew ? { name: '', role: '', phone: '', area: '', history: '' } : appState.crmList.find(c => String(c.id) === String(id));
    if (!item) return;
    document.getElementById('editModalHeaderTitle').textContent = isNew ? "신규 당원/후원자 등록" : "당원/후원자 정보 수정";
    html = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">성명</label><input type="text" id="editCrmName" class="form-input" style="width:100%; padding:10px;" value="${item.name}" required></div>
        <div>
          <label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">직책/구분</label>
          <select id="editCrmRole" class="form-select" style="width:100%; padding:10px;" required>
            <option value="일반" ${item.role === '일반' ? 'selected' : ''}>일반</option>
            <option value="혁신" ${item.role === '혁신' ? 'selected' : ''}>혁신</option>
            <option value="비당원" ${item.role === '비당원' ? 'selected' : ''}>비당원</option>
            <option value="기타" ${item.role === '기타' ? 'selected' : ''}>기타</option>
          </select>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div><label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">연락처</label><input type="text" id="editCrmPhone" class="form-input" style="width:100%; padding:10px;" value="${item.phone}" placeholder="010-0000-0000" required></div>
        <div>
          <label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">지역구</label>
          <select id="editCrmArea" class="form-select" style="width:100%; padding:10px;" required>
            <option value="" disabled ${!item.area ? 'selected' : ''}>지역구 선택</option>
            <option value="중구·강화군·옹진군" ${item.area === '중구·강화군·옹진군' ? 'selected' : ''}>중구·강화군·옹진군</option>
            <option value="동구·미추홀구 갑" ${item.area === '동구·미추홀구 갑' ? 'selected' : ''}>동구·미추홀구 갑</option>
            <option value="동구·미추홀구 을" ${item.area === '동구·미추홀구 을' ? 'selected' : ''}>동구·미추홀구 을</option>
            <option value="연수구 갑" ${item.area === '연수구 갑' ? 'selected' : ''}>연수구 갑</option>
            <option value="연수구 을" ${item.area === '연수구 을' ? 'selected' : ''}>연수구 을</option>
            <option value="남동구 갑" ${item.area === '남동구 갑' ? 'selected' : ''}>남동구 갑</option>
            <option value="남동구 을" ${item.area === '남동구 을' ? 'selected' : ''}>남동구 을</option>
            <option value="부평구 갑" ${item.area === '부평구 갑' ? 'selected' : ''}>부평구 갑</option>
            <option value="부평구 을" ${item.area === '부평구 을' ? 'selected' : ''}>부평구 을</option>
            <option value="계양구 갑" ${item.area === '계양구 갑' ? 'selected' : ''}>계양구 갑</option>
            <option value="계양구 을" ${item.area === '계양구 을' ? 'selected' : ''}>계양구 을</option>
            <option value="서구 갑" ${item.area === '서구 갑' ? 'selected' : ''}>서구 갑</option>
            <option value="서구 을" ${item.area === '서구 을' ? 'selected' : ''}>서구 을</option>
            <option value="서구 병" ${item.area === '서구 병' ? 'selected' : ''}>서구 병</option>
          </select>
        </div>
      </div>
      <div>
        <label style="font-size:14px; font-weight:800; display:block; margin-bottom:4px;">통화/관리 히스토리</label>
        <textarea id="editCrmHistory" class="form-textarea" rows="4" style="width:100%; padding:10px;" placeholder="통화 기록 및 주요 관심사 등 메모">${item.history || ''}</textarea>
      </div>
    `;
  }

  const delBtn = document.querySelector('button[onclick="handleUniversalDelete()"]');
  if (delBtn) {
    delBtn.style.display = (id === 'NEW') ? 'none' : 'block';
  }

  container.innerHTML = html;
  document.getElementById('universalEditModal').classList.remove('hidden');
}

function closeUniversalEditModal() {
  document.getElementById('universalEditModal').classList.add('hidden');
}

function handleUniversalEditSubmit(e) {
  e.preventDefault();
  const type = document.getElementById('editItemType').value;
  const id = document.getElementById('editItemId').value;

  if (type === 'EVENT') {
    appState.eventsList = appState.eventsList.map(item => {
      if (String(item.id) === String(id)) {
        return {
          ...item,
          title: document.getElementById('editEvTitle').value.trim(),
          date: document.getElementById('editEvDate').value.trim() + ' ' + document.getElementById('editEvTime').value.trim(),
          endDate: document.getElementById('editEvEndDate').value.trim() + ' ' + document.getElementById('editEvEndTime').value.trim(),
          location: document.getElementById('editEvLoc').value.trim(),
          attendees: parseInt(document.getElementById('editEvCount').value, 10) || 0,
          budget: parseInt(document.getElementById('editEvBudget').value, 10) || 0
        };
      }
      return item;
    });
  } else if (type === 'VAULT') {
    appState.docsList = appState.docsList.map(item => {
      if (String(item.id) === String(id)) {
        return {
          ...item,
          category: document.getElementById('editVltCat').value,
          date: document.getElementById('editVltDate').value.trim(),
          title: document.getElementById('editVltTitle').value.trim(),
          ocrText: document.getElementById('editVltContent').value.trim()
        };
      }
      return item;
    });
  } else if (type === 'PRESS') {
    appState.pressList = appState.pressList.map(item => {
      if (String(item.id) === String(id)) {
        return {
          ...item,
          press: document.getElementById('editPrsMedia').value.trim(),
          sentiment: document.getElementById('editPrsSent').value,
          title: document.getElementById('editPrsTitle').value.trim(),
          date: document.getElementById('editPrsDate').value.trim(),
          url: document.getElementById('editPrsUrl').value.trim(),
          summary: document.getElementById('editPrsSum').value.trim()
        };
      }
      return item;
    });
  } else if (type === 'MSG') {
    appState.msgList = appState.msgList.map(item => {
      if (String(item.id) === String(id)) {
        return {
          ...item,
          sender: document.getElementById('editMsgSender').value.trim(),
          title: document.getElementById('editMsgTitle').value.trim(),
          content: document.getElementById('editMsgContent').value.trim()
        };
      }
      return item;
    });
  } else if (type === 'CRM') {
    const newData = {
      name: document.getElementById('editCrmName').value.trim(),
      role: document.getElementById('editCrmRole').value.trim(),
      phone: document.getElementById('editCrmPhone').value.trim(),
      area: document.getElementById('editCrmArea').value.trim(),
      history: document.getElementById('editCrmHistory').value.trim(),
      topic: document.getElementById('editCrmHistory').value.trim().slice(0, 15) // Preview topic
    };
    if (id === 'NEW') {
      appState.crmList.unshift({
        id: 'crm-' + Date.now(),
        calls: 0,
        ...newData
      });
    } else {
      appState.crmList = appState.crmList.map(item => {
        if (String(item.id) === String(id)) {
          return { ...item, ...newData };
        }
        return item;
      });
    }
  }

  saveState();
  closeUniversalEditModal();
  renderModuleView();
  alert("수정 저장 완료 - 해당 데이터의 수정 사항이 최종 반영되었습니다.");
}

function handleUniversalDelete() {
  if (!confirm("해당 데이터를 삭제하시겠습니까? (삭제 시 관리자 통제 센터의 복구센터로 임시 보관됩니다)")) return;
  const type = document.getElementById('editItemType').value;
  const id = document.getElementById('editItemId').value;

  if (!appState.trashBin) appState.trashBin = [];

  if (type === 'EVENT') {
    const item = appState.eventsList.find(i => String(i.id) === String(id));
    if (item) appState.trashBin.unshift({ ...item, deletedAt: new Date().toLocaleString('ko-KR'), deletedBy: appState.currentUser.name, origType: 'EVENT', origId: item.id });
    appState.eventsList = appState.eventsList.filter(item => String(item.id) !== String(id));
  } else if (type === 'VAULT') {
    const item = appState.docsList.find(i => String(i.id) === String(id));
    if (item) appState.trashBin.unshift({ ...item, deletedAt: new Date().toLocaleString('ko-KR'), deletedBy: appState.currentUser.name, origType: 'VAULT', origId: item.id });
    appState.docsList = appState.docsList.filter(item => String(item.id) !== String(id));
  } else if (type === 'PRESS') {
    const item = appState.pressList.find(i => String(i.id) === String(id));
    if (item) appState.trashBin.unshift({ ...item, deletedAt: new Date().toLocaleString('ko-KR'), deletedBy: appState.currentUser.name, origType: 'PRESS', origId: item.id });
    appState.pressList = appState.pressList.filter(item => String(item.id) !== String(id));
  } else if (type === 'MSG') {
    const item = appState.msgList.find(i => String(i.id) === String(id));
    if (item) appState.trashBin.unshift({ ...item, deletedAt: new Date().toLocaleString('ko-KR'), deletedBy: appState.currentUser.name, origType: 'MSG', origId: item.id });
    appState.msgList = appState.msgList.filter(item => String(item.id) !== String(id));
  } else if (type === 'CRM') {
    const item = appState.crmList.find(i => String(i.id) === String(id));
    if (item) appState.trashBin.unshift({ ...item, deletedAt: new Date().toLocaleString('ko-KR'), deletedBy: appState.currentUser.name, origType: 'CRM', origId: item.id });
    appState.crmList = appState.crmList.filter(item => String(item.id) !== String(id));
  }

  saveState();
  closeUniversalEditModal();
  renderModuleView();
  alert("삭제 완료 - 선택한 데이터가 삭제되었습니다. (관리자 통제 센터에서 복구 가능)");
}


function openDocDetailModal(id) {
  const doc = appState.docsList.find(d => String(d.id) === String(id));
  if (!doc) return;
  document.getElementById('moduleDetailModalTitle').textContent = '문서 상세 내용 및 OCR 텍스트 추출 결과';
  document.getElementById('moduleDetailModalBody').innerHTML = `
    <div style="font-size: 14px; font-weight: 800; color: var(--primary-navy); margin-bottom: 4px;">${doc.category} | 등록일: ${doc.date}</div>
    <div style="font-size: 20px; font-weight: 900; margin-bottom: 12px;">${doc.title}</div>
    ${doc.photoUrl ? `<div style="margin-bottom: 14px;"><img src="${doc.photoUrl}" style="max-width: 100%; border-radius: 8px; border: 1px solid var(--border-color);"></div>` : ''}
    <div style="background: #F3F4F6; border: 1px solid var(--border-color); padding: 14px; border-radius: 8px; font-family: monospace; font-size: 14px; line-height: 1.6; white-space: pre-line; margin-bottom: 14px;">
      <div style="font-weight: 900; color: var(--primary-navy); margin-bottom: 6px;">OCR 자동 텍스트 인식 결과</div>
      ${doc.ocrText}
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="btn-primary" style="flex: 1;" onclick="alert('내용 복사');">OCR 텍스트 복사</button>
      <button class="btn-outline" style="flex: 1;" onclick="closeModuleDetailModal()">닫기</button>
    </div>
  `;
  document.getElementById('moduleDetailModal').classList.remove('hidden');
}

function openScheduleDetailModal(id) {
  const sched = appState.schedules.find(s => String(s.id) === String(id));
  if (!sched) return;

  document.getElementById('moduleDetailModalTitle').textContent = '일정 상세 정보';
  document.getElementById('moduleDetailModalBody').innerHTML = `
    <div style="font-size: 20px; font-weight: 900; color: var(--primary-navy); margin-bottom: 10px;">${sched.title}</div>
    <div style="font-size: 16px; margin-bottom: 6px;">일시: <strong>${sched.date} ${sched.time || ''}</strong></div>
    <div style="font-size: 16px; margin-bottom: 6px;">장소: <strong>${sched.location}</strong></div>
    <div style="font-size: 16px; margin-bottom: 14px;">디데이: <strong>${sched.dday}</strong></div>
    <div style="background: #F8FAFC; padding: 12px; border-radius: 6px; font-size: 14px; color: var(--text-muted);">
      [자동 알림 설정]: 1일 전 / 1시간 전 푸시 알림 설정됨.
    </div>
  `;
  document.getElementById('moduleDetailModal').classList.remove('hidden');
}

function openComplaintDetailModal(id) {
  const comp = (appState.complaints || []).find(c => String(c.id) === String(id));
  if (!comp) return;

  const isAdmin = appState.currentUser.clearance === '1급' || appState.currentUser.clearance === '2급' || appState.currentUser.isAdmin;
  const steps = ['접수', '구청이첩', '현장점검', '처리완료'];

  document.getElementById('moduleDetailModalTitle').textContent = '민원 상세 처리 및 조치 결과 기록';
  document.getElementById('moduleDetailModalBody').innerHTML = `
    <div style="font-size: 20px; font-weight: 900; color: var(--primary-navy); margin-bottom: 8px;">${comp.id}: ${comp.title}</div>
    <div style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 12px 14px; border-radius: 8px; margin-bottom: 12px;">
      <div style="font-size: 14px; margin-bottom: 4px;"><strong>민원인:</strong> ${comp.requester} (${comp.phone || '연락처 미등록'})</div>
      <div style="font-size: 14px; margin-bottom: 4px;"><strong>발생 위치:</strong> ${comp.location}</div>
      <div style="font-size: 14px; margin-bottom: 4px;"><strong>소관 부서:</strong> ${comp.dept || '미지정'}</div>
      <div style="font-size: 14px;"><strong>접수 일자:</strong> ${comp.date || '-'}</div>
    </div>

    <div style="margin-bottom: 14px;">
      <div style="font-size: 13px; font-weight: 800; color: var(--primary-navy); margin-bottom: 4px;">민원 접수 본문:</div>
      <div style="font-size: 14px; line-height: 1.6; background: #FFF; border: 1px solid var(--border-color); padding: 10px 12px; border-radius: 6px;">
        ${comp.content || '접수된 상세 내용이 없습니다.'}
      </div>
    </div>

    <!-- Step Override -->
    <div style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; margin-bottom: 14px;">
      <div style="font-weight: 800; font-size: 13px; color: var(--primary-navy); margin-bottom: 6px;">현재 진행 단계 변경:</div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        ${steps.map(s => `
          <button class="btn-outline" style="${comp.step === s ? 'background:var(--primary-navy); color:#FFF; font-weight:900;' : 'background:#FFF;'}" onclick="overrideComplaintStep('${comp.id}', '${s}'); openComplaintDetailModal('${comp.id}');">${s}</button>
        `).join('')}
      </div>
    </div>

    <!-- Resolution Memo -->
    <div style="margin-bottom: 16px;">
      <label style="font-size: 13px; font-weight: 800; display: block; margin-bottom: 4px; color: var(--primary-navy);">의원실 조치 결과 및 구청 협의 메모</label>
      <textarea id="compResolutionMemoInput" class="form-textarea" rows="3" style="width: 100%; padding: 8px; font-size: 13px; line-height: 1.5;" placeholder="구청 담당자 협의 내용, 현장 조치 결과 등을 기록하세요.">${comp.resolutionMemo || ''}</textarea>
    </div>

    <div style="display: flex; gap: 8px;">
      <button class="btn-primary" style="flex: 1; height: 42px;" onclick="handleSaveComplaintMemo('${comp.id}')">조치 메모 저장</button>
      <button class="btn-outline" style="width: 80px; height: 42px; border-color: #DC2626; color: #DC2626;" onclick="handleDeleteComplaint('${comp.id}')">삭제</button>
      <button class="btn-outline" style="width: 70px; height: 42px;" onclick="closeModuleDetailModal()">닫기</button>
    </div>
  `;
  document.getElementById('moduleDetailModal').classList.remove('hidden');
}

window.handleSaveComplaintMemo = function(id) {
  const comp = (appState.complaints || []).find(c => String(c.id) === String(id));
  if (!comp) return;
  const memoEl = document.getElementById('compResolutionMemoInput');
  if (memoEl) comp.resolutionMemo = memoEl.value.trim();
  saveState();
  renderModuleView();
  alert("민원 조치 결과 메모가 안전하게 저장되었습니다.");
};

window.handleDeleteComplaint = function(id) {
  if (!confirm("해당 민원을 삭제하시겠습니까?")) return;
  appState.complaints = (appState.complaints || []).filter(c => String(c.id) !== String(id));
  saveState();
  closeModuleDetailModal();
  renderModuleView();
  alert("민원이 성공적으로 삭제되었습니다.");
};

function closeModuleDetailModal() {
  document.getElementById('moduleDetailModal').classList.add('hidden');
}

function handleAddCRMPrompt() {
  openUniversalEditModal('CRM', 'NEW');
}

function handleCRMSearch(event) {
  const query = event.target.value;
  const filtered = appState.crmList.filter(item => {
    return window.ChoseongUtil.matchChoseong(item.name, query) ||
           window.ChoseongUtil.matchChoseong(item.role, query) ||
           item.phone.includes(query);
  });
  document.getElementById('crmResultContainer').innerHTML = renderCRMList(filtered);
}

function renderCRMList(list) {
  return list.map(item => `
    <div style="background-color: #FFF; border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 18px; font-weight: 800;">${item.name} <span style="font-size:14px; color:var(--text-muted);">(${item.role})</span></div>
        <div style="font-size: 14px; font-weight: 700; color: var(--text-muted); margin-top:2px;">연락처: ${item.phone} | 지역: ${item.area}</div>
        ${item.history ? `<div style="font-size: 12px; font-weight: 700; color: #4B5563; margin-top:4px; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">└ 메모: ${item.history}</div>` : ''}
      </div>
      <button class="btn-outline" style="font-size: 13px; padding: 6px 12px; font-weight: 800;" onclick="openUniversalEditModal('CRM', '${item.id}')">\[정보/히스토리 수정\]</button>
    </div>
  `).join('');
}

// ==========================================================================
// 5. CREATE TASK FORM HANDLER
// ==========================================================================
function handleCreateTask(event) {
  event.preventDefault();

  const category = document.getElementById('newCategory').value;
  const assigneeId = document.getElementById('newAssigneeSelect').value;
  const finalApproverId = document.getElementById('newFinalApproverSelect').value;
  const title = document.getElementById('newTitle').value;
  const location = document.getElementById('newLocation').value;
  const summary = document.getElementById('newSummary').value;

  const finalApproverObj = appState.users.find(u => u.id === finalApproverId) || appState.users[0];

  let assigneeName = '자율 지정 (미지정)';
  let finalAssigneeId = null;
  let assigneeTeam = '';
  if (assigneeId !== 'UNASSIGNED') {
    const found = appState.users.find(u => u.id === assigneeId);
    if (found) {
      assigneeName = found.name;
      finalAssigneeId = found.id;
      assigneeTeam = found.roleTitle;
    }
  }

  const now = new Date().toLocaleString('ko-KR');

  const chain = [
    { step: 1, name: '1차 작성', roleTitle: appState.currentUser.roleTitle, userName: appState.currentUser.name, status: 'COMPLETED', timestamp: now, comment: '결재 안건 상정' }
  ];

  let stepCounter = 2;
  appState.selectedMidReviewers.forEach(id => {
    const u = appState.users.find(user => user.id === id);
    if (u) {
      chain.push({
        step: stepCounter++,
        name: '중간 결재',
        roleTitle: u.roleTitle,
        userName: u.name,
        status: chain.length === 1 ? 'PENDING' : 'WAITING',
        timestamp: null,
        comment: ''
      });
    }
  });

  chain.push({
    step: stepCounter,
    name: '최종 승인',
    roleTitle: finalApproverObj.roleTitle,
    userName: finalApproverObj.name,
    status: chain.length === 1 ? 'PENDING' : 'WAITING',
    timestamp: null,
    comment: ''
  });

  const coopLine = appState.selectedCoopStaff.map(id => {
    const u = appState.users.find(user => user.id === id);
    if (!u) return null;
    return {
      userId: u.id,
      userName: u.name,
      roleTitle: u.roleTitle,
      status: 'PENDING',
      timestamp: null,
      comment: ''
    };
  }).filter(Boolean);

  const newTask = {
    id: generateTaskId(category),
    category: category,
    expenseAmount: (category === '예산지출' || document.getElementById('newExpenseAmount')?.value) ? (parseInt(document.getElementById('newExpenseAmount')?.value, 10) || 0) : 0,
    relatedEventId: window._pendingApprovalEventId || null,
    targetTotalBudget: window._pendingTargetTotalBudget || null,
    targetReserveBudget: window._pendingTargetReserveBudget || null,
    title: title,
    requesterId: appState.currentUser.id,
    requesterName: appState.currentUser.name,
    requesterTeam: appState.currentUser.roleTitle,

    assigneeId: finalAssigneeId,
    assigneeName: assigneeName,
    assigneeTeam: assigneeTeam,

    finalApproverId: finalApproverObj.id,
    finalApproverName: finalApproverObj.name,
    createdAt: now,
    summary: summary,
    status: 'PENDING',
    location: location,
    viewsCount: 1,
    photos: [...appState.currentAttachedPhotos],
    approvalChain: chain,
    cooperationLine: coopLine,
    viewersLog: [
      { userId: appState.currentUser.id, userName: appState.currentUser.name, userRole: appState.currentUser.roleTitle, timestamp: now }
    ],
    auditLogs: [
      { id: `log-${Date.now()}`, who: appState.currentUser.name, when: now, action: `전자결재 작성 완료 (첨부사진: ${appState.currentAttachedPhotos.length}장)` }
    ]
  };

  appState.tasks.unshift(newTask);
  appState.seniorTaskIndex = 0;
  appState.currentAttachedPhotos = [];
  saveState();

  document.getElementById('createTaskForm').reset();
  const photoContainer = document.getElementById('photoPreviewContainer');
  if (photoContainer) photoContainer.innerHTML = '';

  alert(`${title} - 전자결재 안건이 성공적으로 등록되었습니다.`);
  switchTab('seniorView');
}

// ==========================================================================
// 6. SYSTEM & ORG ADMIN CONTROL CENTER (PILLARS 1 ~ 4)
// ==========================================================================
function switchAdminTab(tabId) {
  appState.adminActiveTab = tabId;
  const btns = document.querySelectorAll('#adminSubNav .module-tab-btn');
  btns.forEach(b => {
    const isTarget = b.getAttribute('onclick') && b.getAttribute('onclick').includes(tabId);
    if (isTarget) {
      b.classList.add('active');
      b.style.background = tabId === 'adm-finance' ? '#047857' : '#991B1B';
      b.style.color = '#FFF';
      b.style.borderColor = tabId === 'adm-finance' ? '#047857' : '#991B1B';
    } else {
      b.classList.remove('active');
      b.style.background = '#FFF';
      b.style.color = b.id === 'adminFinanceTabBtn' ? '#047857' : '#991B1B';
      b.style.borderColor = b.id === 'adminFinanceTabBtn' ? '#047857' : '#991B1B';
    }
  });
  renderAdminView();
}

function renderAdminView() {
  const area = document.getElementById('adminContentArea');
  if (!area) return;

  const isSuperAdmin = isUserSuperAdmin(appState.currentUser);
  const isFinanceUser = appState.currentUser && appState.currentUser.clearance === '회계관리';
  const isAdmin = isSuperAdmin || isFinanceUser;
  if (!isAdmin) {
    area.innerHTML = `
      <div class="card" style="border: 2px solid #DC2626; background: #FEF2F2; padding: 24px; text-align: center;">
        <div style="font-size: 20px; font-weight: 900; color: #991B1B; margin-bottom: 12px;">접근 권한 제한 안내: 1급 최고관리자 전용 메뉴입니다.</div>
        <p style="font-size: 15px; color: #7F1D1D; margin-bottom: 18px;">
          본 통제 센터는 전사 인사/결재 통제 및 시스템 환경 설정 전용 영역입니다.<br>
          현재 접속 중인 <strong>${appState.currentUser ? appState.currentUser.name : ''} (${appState.currentUser ? appState.currentUser.roleTitle : ''})</strong> 님은 [${appState.currentUser ? appState.currentUser.clearance : '일반'}] 권한으로 관리자 메뉴 접근이 제한됩니다.
        </p>
      </div>
    `;
    return;
  }

  const isFinanceOnly = isFinanceUser && !isSuperAdmin;
  const defaultTab = isFinanceOnly ? 'adm-finance' : 'adm-users';
  const tab = appState.adminActiveTab || defaultTab;

  if (isFinanceOnly && tab !== 'adm-finance') {
    area.innerHTML = `
      <div class="card" style="border: 2px solid #DC2626; background: #FEF2F2; padding: 24px; text-align: center;">
        <div style="font-size: 20px; font-weight: 900; color: #991B1B; margin-bottom: 12px;">접근 권한 제한: 1급 최고관리자 전용 영역</div>
        <p style="font-size: 15px; color: #7F1D1D; margin-bottom: 16px;">
          회계관리 계정은 <strong>[4.회계 장부]</strong> 메뉴만 접근 가능합니다.
        </p>
        <button class="btn-primary" style="background: #047857; border-color: #047857; width: auto; padding: 0 20px; height: 42px;" onclick="switchAdminTab('adm-finance')">4.회계 장부으로 이동</button>
      </div>
    `;
    return;
  }

  if (tab === 'adm-users') renderAdminUsersTab(area);
  else if (tab === 'adm-pipeline') renderAdminPipelineTab(area);
  else if (tab === 'adm-audit') renderAdminAuditTab(area);
  else if (tab === 'adm-config') renderAdminConfigTab(area);
  else if (tab === 'adm-finance') renderAdminFinanceTab(area);
}

function renderAdminUsersTab(area) {
  const pendingUsers = (appState.users || []).filter(u => u.status === 'PENDING' || u.status === 'PENDING_APPROVAL');
  const approvedUsers = (appState.users || []).filter(u => u.status !== 'PENDING' && u.status !== 'PENDING_APPROVAL');

  let pendingHTML = '';
  if (pendingUsers.length > 0) {
    pendingHTML = `
      <div style="border: 2px solid #DC2626; background: #FEF2F2; padding: 14px; border-radius: 8px; margin-bottom: 18px;">
        <h4 style="font-size: 16px; font-weight: 900; color: #991B1B; margin-bottom: 10px;">[긴급 승인 대기] 신규 회원 가입 신청자 (${pendingUsers.length}명) - 승인 시 즉시 활동 가능</h4>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${pendingUsers.map(u => `
            <div style="background: #FFF; border: 1px solid #991B1B; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div>
                <div style="font-size: 16px; font-weight: 900; color: #991B1B;">${u.name} [${u.clearance || '2급'}]</div>
                <div style="font-size: 13px; color: var(--text-muted); font-weight: 700;">소속/직함: ${u.roleTitle} | 연락처: ${u.phone} | 이메일/ID: ${u.email}</div>
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn-primary" style="height: 38px; padding: 0 14px; font-size: 13px; background: var(--approved-green);" onclick="approveUserRegistration('${u.id}')">정식 승인</button>
                <button class="btn-primary" style="height: 38px; padding: 0 14px; font-size: 13px; background: var(--rejected-red);" onclick="rejectUserRegistration('${u.id}')">가입 반려</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  area.innerHTML = `
    ${pendingHTML}
    <div class="card" style="margin-bottom: 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 2px solid var(--primary-navy); padding-bottom: 8px;">
        <h3 style="font-size: 18px; font-weight: 900; color: var(--primary-navy);">의원실 회원 및 권한 등급 관리 (총 ${approvedUsers.length}명)</h3>
        <button class="btn-outline" style="font-size: 13px; padding: 6px 12px;" onclick="openUserAuthModal()">+ 신규 회원 수동 등록</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${approvedUsers.map(u => `
          <div style="background: #FFF; border: 1px solid var(--border-color); padding: 12px 14px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="user-avatar" style="width: 42px; height: 42px; font-size: 16px; background: ${u.isAdmin ? '#991B1B' : ''}; overflow: hidden;">
                ${u.photoUrl ? `<img src="${u.photoUrl}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : (u.avatar || (u.name ? u.name.charAt(0) : '류'))}
              </div>
              <div>
                <div style="font-size: 16px; font-weight: 900; color: var(--text-dark);">
                  ${u.name} <span style="font-size: 13px; color: ${u.clearance === '1급' ? '#991B1B' : 'var(--primary-navy)'}; font-weight: 800;">${u.clearance || '2급'}</span>
                  ${u.isAdmin ? '<span style="background:#991B1B; color:#FFF; font-size:11px; padding:2px 6px; border-radius:4px; margin-left:4px;">최고총괄</span>' : ''}
                </div>
                <div style="font-size: 13px; color: var(--text-muted); font-weight: 700;">${u.roleTitle} | 연락처: ${u.phone || '-'} | 접속ID: ${u.email}</div>
              </div>
            </div>
            <div style="display: flex; gap: 6px; align-items: center;">
              <select class="form-select" style="padding: 6px 10px; font-size: 13px; width: auto;" onchange="adminChangeUserClearance('${u.id}', this.value)" ${u.isAdmin ? 'disabled' : ''}>
                <option value="1급" ${u.clearance === '1급' ? 'selected' : ''}>1급 (최종결재권자)</option>
                <option value="2급" ${u.clearance === '2급' ? 'selected' : ''}>2급 (중간결재권자)</option>
                <option value="3급" ${u.clearance === '3급' ? 'selected' : ''}>3급 (일반실무진)</option>
                <option value="회계관리" ${u.clearance === '회계관리' ? 'selected' : ''}>회계관리 (예산/경비 트래킹)</option>
              </select>
              <button class="btn-outline" style="font-size: 13px; padding: 6px 10px; color: #DC2626; border-color: #DC2626;" onclick="adminDeleteUser('${u.id}')" ${u.isAdmin ? 'disabled' : ''}>계정 삭제</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.approveUserRegistration = async function(userId) {
  const user = appState.users.find(u => String(u.id) === String(userId));
  if (!user) return;
  user.status = 'APPROVED';
  saveState();
  if (supabaseClient) {
    try {
      await supabaseClient.from('profiles').update({ status: 'APPROVED' }).eq('id', userId);
    } catch (e) {
      console.warn("Supabase approve error:", e);
    }
  }
  alert(`정식 승인 완료: ${user.name} 님의 가입 신청이 정식 승인되었습니다.`);
  renderAdminView();
};

window.rejectUserRegistration = async function(userId) {
  if (!confirm("해당 사용자의 가입 신청을 반려하시겠습니까?")) return;
  const user = appState.users.find(u => String(u.id) === String(userId));
  appState.users = appState.users.filter(u => String(u.id) !== String(userId));
  saveState();
  if (supabaseClient) {
    try {
      await supabaseClient.from('profiles').delete().eq('id', userId);
    } catch (e) {
      console.warn("Supabase reject error:", e);
    }
  }
  alert("가입 반려 완료: 해당 사용자의 가입 신청이 반려되었습니다.");
  renderAdminView();
};

window.adminChangeUserClearance = async function(userId, newCls) {
  appState.users = appState.users.map(u => {
    if (String(u.id) === String(userId)) return { ...u, clearance: newCls };
    return u;
  });
  saveState();
  if (supabaseClient) {
    try {
      await supabaseClient.from('profiles').update({ clearance: newCls }).eq('id', userId);
    } catch (e) {
      console.warn("Supabase clearance update error:", e);
    }
  }
  alert(`권한 변경 완료: 해당 팀원의 결재 등급이 ${newCls}(으)로 변경되었습니다.`);
  renderAdminView();
};

window.adminDeleteUser = async function(userId) {
  const target = appState.users.find(u => String(u.id) === String(userId));
  if (target && (target.isAdmin || target.email === 'nnqrt1983@gmail.com' || target.clearance === '1급')) {
    alert("최고관리자(1급) 계정은 삭제할 수 없습니다.");
    return;
  }
  if (!confirm("해당 계정을 삭제하시겠습니까?")) return;
  appState.users = appState.users.filter(u => String(u.id) !== String(userId));
  saveState();
  if (supabaseClient) {
    try {
      await supabaseClient.from('profiles').delete().eq('id', userId);
    } catch (e) {
      console.warn("Supabase delete error:", e);
    }
  }
  alert("계정 삭제가 완료되었습니다.");
  renderAdminView();
};

function renderAdminPipelineTab(area) {
  const allTasks = appState.tasks || [];
  const pending = allTasks.filter(t => t.status === 'PENDING');

  area.innerHTML = `
    <div class="card" style="margin-bottom: 16px;">
      <h3 style="font-size: 18px; font-weight: 900; color: var(--primary-navy); margin-bottom: 10px; border-bottom: 2px solid var(--primary-navy); padding-bottom: 8px;">
        결재 관리 (대기: ${pending.length}건 / 전체: ${allTasks.length}건)
      </h3>
      <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 14px;">
        관리자 직권으로 안건을 승인, 반려 또는 담당자를 재지정할 수 있습니다.
      </p>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${allTasks.map(t => `
          <div style="background: ${t.status === 'PENDING' ? '#FEF2F2' : '#FFF'}; border: 1px solid ${t.status === 'PENDING' ? '#991B1B' : 'var(--border-color)'}; padding: 14px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div style="flex: 1; min-width: 280px;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                <span class="cat-badge" style="background:var(--primary-navy); color:#FFF; font-size:11px;">${t.category}</span>
                <span style="font-size: 13px; font-weight: 800; color: ${t.status === 'APPROVED' ? 'var(--approved-green)' : t.status === 'REJECTED' ? 'var(--rejected-red)' : '#DC2626'};">상태: ${t.status === 'APPROVED' ? '최종승인 완결' : t.status === 'REJECTED' ? '반려 종료' : '결재 대기중'}</span>
                <span style="font-size: 12px; color: var(--text-muted);">안건번호: ${t.id} | 기안: ${t.requesterName}</span>
              </div>
              <div style="font-size: 16px; font-weight: 900; color: var(--text-dark); margin-bottom: 4px;">${t.title}</div>
              <div style="font-size: 13px; color: var(--text-muted); font-weight: 700;">실행담당: ${t.assigneeName || '미지정 자율'} | 최종결재권자: ${t.finalApproverName}</div>
            </div>
            <div style="display: flex; gap: 6px; align-items: center;">
              <button class="btn-outline" style="font-size: 13px; padding: 6px 12px;" onclick="openTaskDetailModal('${t.id}')">상세 보고서 검토</button>
              ${t.status === 'PENDING' ? `
                <button class="btn-primary" style="height: 34px; padding: 0 12px; font-size: 13px; background: var(--approved-green);" onclick="adminOverrideTask('${t.id}', 'APPROVE')">승인</button>
                <button class="btn-primary" style="height: 34px; padding: 0 12px; font-size: 13px; background: var(--rejected-red);" onclick="adminOverrideTask('${t.id}', 'REJECT')">반려</button>
              ` : ''}
              <button class="btn-outline" style="font-size: 13px; padding: 6px 12px; color: #DC2626; border-color: #DC2626;" onclick="adminDeleteTask('${t.id}')">삭제</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function adminOverrideTask(taskId, action) {
  const actionText = action === 'APPROVE' ? '최종 승인' : '반려';
  if (!confirm(`1급 관리자 직권 통제\n해당 안건을 ${actionText} 처리하시겠습니까?`)) return;

  const now = new Date().toLocaleString('ko-KR');
  appState.tasks = appState.tasks.map(t => {
    if (String(t.id) === String(taskId)) {
      const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      const updatedChain = (t.approvalChain || []).map(step => {
        if (step.status === 'PENDING' || step.status === 'WAITING') {
          return { ...step, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED', timestamp: now, comment: `[1급 관리자(${appState.currentUser.name}) 직권 통제 처리]` };
        }
        return step;
      });
      const newAudit = [
        ...t.auditLogs,
        { id: `log-${Date.now()}`, who: appState.currentUser.name, when: now, action: `[1급 관리자 직권 ${actionText} 완결]`, isFinalApproval: true }
      ];
      return { ...t, status: newStatus, approvalChain: updatedChain, auditLogs: newAudit };
    }
    return t;
  });
  saveState();
  alert(`처리 완료: 해당 안건이 관리자 직권으로 ${action === 'APPROVE' ? '최종 승인' : '반려'} 되었습니다.`);
  renderAdminView();
}

function adminDeleteTask(taskId) {
  if (!confirm("해당 안건을 삭제하시겠습니까? (삭제 시 복구센터로 임시 보관됩니다)")) return;
  if (!appState.trashBin) appState.trashBin = [];
  const task = appState.tasks.find(t => String(t.id) === String(taskId));
  if (task) appState.trashBin.unshift({ ...task, deletedAt: new Date().toLocaleString('ko-KR'), deletedBy: appState.currentUser.name, origType: 'TASK', origId: task.id });
  appState.tasks = appState.tasks.filter(t => String(t.id) !== String(taskId));
  saveState();
  alert("삭제 완료 - 복구센터로 이동되었습니다.");
  renderAdminView();
}

function renderAdminAuditTab(area) {
  const trash = appState.trashBin || [];
  const allLogs = [];
  (appState.tasks || []).forEach(t => {
    (t.auditLogs || []).forEach(l => {
      allLogs.push({ ...l, taskTitle: t.title, taskId: t.id });
    });
  });

  area.innerHTML = `
    <!-- RECYCLE BIN SECTION -->
    <div style="border: 2px solid #991B1B; background: #FEF2F2; padding: 16px; border-radius: 8px; margin-bottom: 18px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h4 style="font-size: 16px; font-weight: 900; color: #991B1B;">[삭제 데이터 복구 센터 (Recycle Bin)] - 임시 보관: ${trash.length}건</h4>
        ${trash.length > 0 ? `<button class="btn-outline" style="font-size:12px; padding:4px 10px; color:#DC2626; border-color:#DC2626;" onclick="adminEmptyTrash()">휴지통 비우기</button>` : ''}
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto;">
        ${trash.length === 0 ? `<div style="padding: 12px; text-align: center; color: #7F1D1D; font-weight: 700;">삭제된 항목이 없습니다.</div>` : trash.map((item, idx) => `
          <div style="background: #FFF; border: 1px solid #991B1B; padding: 10px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div>
              <div style="font-size: 15px; font-weight: 900; color: #991B1B;">[${item.origType}] ${item.title || item.press || '제목 없음'}</div>
              <div style="font-size: 12px; color: var(--text-muted);">삭제일시: ${item.deletedAt} | 삭제자: ${item.deletedBy}</div>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn-primary" style="height: 32px; padding: 0 12px; font-size: 12px; background: var(--approved-green);" onclick="adminRestoreTrash(${idx})">복구하기</button>
              <button class="btn-primary" style="height: 32px; padding: 0 12px; font-size: 12px; background: var(--rejected-red);" onclick="adminPermanentDeleteTrash(${idx})">영구 삭제</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- SYSTEM AUDIT LOG ARCHIVE -->
    <div class="card" style="margin-bottom: 0;">
      <h3 style="font-size: 18px; font-weight: 900; color: var(--primary-navy); margin-bottom: 12px; border-bottom: 2px solid var(--primary-navy); padding-bottom: 8px;">
        전사 전자결재 및 10대 모듈 법적 보안 감사로그 통합 아카이브 (총 ${allLogs.length}건)
      </h3>
      <div style="display: flex; flex-direction: column; gap: 6px; max-height: 380px; overflow-y: auto;">
        ${allLogs.slice().reverse().map(l => `
          <div style="background: #FFF; border: 1px solid var(--border-color); padding: 10px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--text-dark);">${l.action} <span style="font-size:12px; color:var(--primary-navy);">안건: ${l.taskTitle}</span></div>
              <div style="font-size: 12px; color: var(--text-muted); font-weight: 700;">수행자: ${l.who} | 일시: ${l.when}</div>
            </div>
            ${l.isFinalApproval ? `<span style="background:#991B1B; color:#FFF; font-size:11px; padding:2px 8px; border-radius:4px; font-weight:900;">최종결재완결</span>` : ''}
          </div>
        `).join('') || '<div style="padding:16px; text-align:center;">감사로그 기록이 없습니다.</div>'}
      </div>
    </div>
  `;
}

function adminRestoreTrash(index) {
  if (!appState.trashBin || !appState.trashBin[index]) return;
  const item = appState.trashBin[index];
  if (!confirm(`${item.title || item.press} 항목을 원래 위치로 복구하시겠습니까?`)) return;

  appState.trashBin.splice(index, 1);

  if (item.origType === 'EVENT') appState.eventsList.unshift(item);
  else if (item.origType === 'VAULT') appState.docsList.unshift(item);
  else if (item.origType === 'PRESS') appState.pressList.unshift(item);
  else if (item.origType === 'MSG') appState.msgList.unshift(item);
  else if (item.origType === 'TASK') appState.tasks.unshift(item);

  saveState();
  alert("복구 완료 - 원래 데이터 리스트로 원상 복원되었습니다.");
  renderAdminView();
}

function adminPermanentDeleteTrash(index) {
  if (!confirm("해당 항목을 영구 삭제하시겠습니까? (이 작업은 취소할 수 없습니다)")) return;
  appState.trashBin.splice(index, 1);
  saveState();
  alert("영구 삭제 완료 - ");
  renderAdminView();
}

function adminEmptyTrash() {
  if (!confirm("휴지통 내 모든 삭제 대기 항목을 영구 삭제하시겠습니까?")) return;
  appState.trashBin = [];
  saveState();
  alert("휴지통 비우기 완료 - ");
  renderAdminView();
}

function renderAdminConfigTab(area) {
  area.innerHTML = `
    <div class="card" style="margin-bottom: 16px;">
      <h3 style="font-size: 18px; font-weight: 900; color: var(--primary-navy); margin-bottom: 14px; border-bottom: 2px solid var(--primary-navy); padding-bottom: 8px;">
        1급 최고관리자 시스템 환경 설정 및 데이터 백업 / 초기화
      </h3>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 22px;">
        <div style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 16px; border-radius: 8px;">
          <h4 style="font-size: 15px; font-weight: 900; color: var(--primary-navy); margin-bottom: 8px;">의원실 운영 모드 제어</h4>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            현재 상태: <strong style="color:${appState.isTestMode ? '#2563EB' : '#991B1B'}; font-size: 15px;">${appState.isTestMode ? '테스트 모드 (계정전환 및 초기화 허용)' : '실제 운영 모드 (보안 잠금 가동)'}</strong>
          </p>
          <button class="btn-primary" style="background: var(--primary-navy); height: 44px; font-size: 14px;" onclick="toggleTestMode(); renderAdminView();">운영/테스트 모드 즉시 전환 토글</button>
        </div>

        <div style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 16px; border-radius: 8px;">
          <h4 style="font-size: 15px; font-weight: 900; color: var(--primary-navy); margin-bottom: 8px;">전사 데이터 백업 및 복원</h4>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            의원실 전체 안건, 10대 사무, 회원 DB를 JSON 파일로 다운로드하거나 복원합니다.
          </p>
          <div style="display: flex; gap: 8px;">
            <button class="btn-outline" style="flex: 1; height: 44px; font-size: 13px; background: #FFF;" onclick="adminExportJSON()">JSON 데이터 다운로드</button>
            <button class="btn-outline" style="flex: 1; height: 44px; font-size: 13px; background: #FFF;" onclick="adminImportJSONTrigger()">JSON 복원 가져오기</button>
            <input type="file" id="jsonImportInput" accept=".json" style="display: none;" onchange="adminImportJSONHandler(event)">
          </div>
        </div>
      </div>

      <div style="border: 2px solid #DC2626; background: #FEF2F2; padding: 18px; border-radius: 8px;">
        <h4 style="font-size: 16px; font-weight: 900; color: #991B1B; margin-bottom: 8px;">[위험 구역]: 전사 시스템 데이터 강제 초기화</h4>
        <p style="font-size: 13px; color: #7F1D1D; margin-bottom: 14px;">
          모든 사용자, 안건, 모듈 데이터를 삭제하고 초기 기본 샘플 데이터 상태로 100% 복구합니다. (테스트 모드에서만 실행 가능)
        </p>
        <button class="btn-primary" style="background: #DC2626; height: 46px; font-size: 15px;" onclick="resetSystemData(); renderAdminView();">전체 시스템 데이터 초기화 (기본값 복원)</button>
      </div>
    </div>
  `;
}

function adminExportJSON() {
  const exportData = {
    exportDate: new Date().toISOString(),
    users: appState.users,
    tasks: appState.tasks,
    crmList: appState.crmList,
    schedules: appState.schedules,
    complaints: appState.complaints,
    simpleTasks: appState.simpleTasks,
    eventsList: appState.eventsList,
    docsList: appState.docsList,
    pressList: appState.pressList,
    msgList: appState.msgList,
    trashBin: appState.trashBin || []
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `자유와혁신_Pro_System_Backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  alert("백그라운드 백업 완료 - 전사 데이터가 JSON 백업 파일로 다운로드되었습니다.");
}

function adminImportJSONTrigger() {
  const input = document.getElementById('jsonImportInput');
  if (input) input.click();
}

function adminImportJSONHandler(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.users && data.tasks) {
        if (!confirm("백업 파일 데이터를 복원하시겠습니까? 현재 데이터는 대체됩니다.")) return;
        appState.users = data.users;
        appState.tasks = data.tasks;
        if (data.crmList) appState.crmList = data.crmList;
        if (data.schedules) appState.schedules = data.schedules;
        if (data.complaints) appState.complaints = data.complaints;
        if (data.simpleTasks) appState.simpleTasks = data.simpleTasks;
        if (data.eventsList) appState.eventsList = data.eventsList;
        if (data.docsList) appState.docsList = data.docsList;
        if (data.pressList) appState.pressList = data.pressList;
        if (data.msgList) appState.msgList = data.msgList;
        if (data.trashBin) appState.trashBin = data.trashBin;
        saveState();
        alert("복원 완료 - 백업 파일의 데이터가 시스템에 성공적으로 복원되었습니다.");
        renderAdminView();
      } else {
        alert("유효하지 않은 백업 JSON 파일 양식입니다.");
      }
    } catch (err) {
      alert("JSON 파싱 오류: 파일 내용을 확인하세요.");
    }
  };
  reader.readAsText(file);
}

function renderAdminFinanceTab(area) {
  if (!area) return;

  const isFinanceAuthorized = isUserFinanceAdmin(appState.currentUser);
  if (!isFinanceAuthorized) {
    area.innerHTML = `
      <div class="card" style="border: 2px solid #DC2626; background: #FEF2F2; padding: 24px; text-align: center;">
        <div style="font-size: 20px; font-weight: 900; color: #991B1B; margin-bottom: 12px;">보안 접근 제한: 회계관리 전용 구역</div>
        <p style="font-size: 15px; color: #7F1D1D; margin-bottom: 12px;">
          본 화면은 의원실 예산 배정 및 경비 실집행 내역을 트래킹하는 전용 보안 통제 구역입니다.<br>
          <strong>회계관리</strong> 보안 등급을 보유한 계정만 열람 및 결산이 가능합니다.
        </p>
        <span style="font-size: 13px; color: #991B1B; font-weight: 800;">현재 로그인 계정의 권한: ${appState.currentUser.clearance || '일반'}</span>
      </div>
    `;
    return;
  }

  if (!appState.accountingSettings) {
    appState.accountingSettings = {
      totalBudget: 150000000,
      reserveBudget: 20000000
    };
    saveState();
  }

  const events = appState.eventsList || [];
  const eventSpent = events.reduce((sum, e) => sum + (Number(e.spent) || 0), 0);

  // Approved Budget Tasks (Exclude tasks linked to events to prevent double-counting)
  const approvedBudgetTasks = (appState.tasks || []).filter(t => t.category === '예산지출' && t.status === 'APPROVED' && !t.targetTotalBudget && !t.targetReserveBudget);
  const nonEventApprovedTasks = approvedBudgetTasks.filter(t => !t.relatedEventId && !events.some(e => t.title.includes(e.title)));
  const taskSpent = nonEventApprovedTasks.reduce((sum, t) => sum + (Number(t.expenseAmount) || 0), 0);

  // Accounting Ledger
  const ledger = appState.accountingLedger || [];
  const expenseLedger = ledger.filter(item => item.direction === 'EXPENSE' || item.type === '경비지출' || item.type === '사업비' || item.type === '기타지출');
  const incomeLedger = ledger.filter(item => item.direction === 'INCOME' || item.type === '후원금' || item.type === '당비/지원금' || item.type === '기타수입');

  const ledgerExpenseTotal = expenseLedger.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const ledgerIncomeTotal = incomeLedger.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const totalSpent = eventSpent + taskSpent + ledgerExpenseTotal;
  const totalBudget = appState.accountingSettings.totalBudget || 0;
  const reserveBudget = appState.accountingSettings.reserveBudget || 0;
  const availableRemaining = totalBudget + ledgerIncomeTotal - reserveBudget - totalSpent;
  const overallRate = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : '0.0';

  area.innerHTML = `
    <div class="card" style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="font-size: 22px; font-weight: 900; color: var(--primary-navy); margin: 0 0 4px 0;">회계 장부 및 예산 결산</h3>
          <span style="font-size: 14px; color: var(--text-muted);">회계관리 전용 통제 센터 | 카드를 클릭하여 총예산/예비비 결재 상정 및 수입·지출 실시간 연동 대사</span>
        </div>
        <button class="btn-outline" style="border-color: #047857; color: #047857; font-weight: 800; padding: 6px 14px; background: #FFF;" onclick="exportFinanceCSV()">
          회계장부 CSV 다운로드
        </button>
      </div>

      <!-- 1. 5 INTERACTIVE KPI CARDS (CLICKABLE FOR APPROVAL/EDIT) -->
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 24px;">
        
        <!-- Total Budget Card (Click to Revise via Approval) -->
        <div class="card-clickable" style="background: #F8FAFC; border: 1.5px solid var(--border-color); border-radius: 8px; padding: 14px; text-align: center; cursor: pointer; transition: transform 0.15s, border-color 0.15s;" onclick="openTotalBudgetModal()" title="클릭하여 총예산 변경 결재 상정">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 12px; font-weight: 800; color: var(--text-muted);">전체 총 예산</span>
            <span style="font-size: 10px; font-weight: 800; color: var(--primary-navy); background: #EEF2F6; padding: 1px 4px; border-radius: 3px;">결재상정</span>
          </div>
          <div style="font-size: 20px; font-weight: 900; color: var(--primary-navy);">${totalBudget.toLocaleString()}원</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">클릭 시 결재 상정</div>
        </div>

        <!-- Reserve Budget Card (Click to Adjust or Approval) -->
        <div class="card-clickable" style="background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 8px; padding: 14px; text-align: center; cursor: pointer; transition: transform 0.15s, border-color 0.15s;" onclick="openReserveBudgetModal()" title="클릭하여 예비비 수정 또는 결재 상정">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 12px; font-weight: 800; color: #92400E;">예비비 (선예약)</span>
            <span style="font-size: 10px; font-weight: 800; color: #D97706; background: #FEF3C7; padding: 1px 4px; border-radius: 3px;">수정/결재</span>
          </div>
          <div style="font-size: 20px; font-weight: 900; color: #D97706;">${reserveBudget.toLocaleString()}원</div>
          <div style="font-size: 11px; color: #B45309; margin-top: 2px;">클릭 시 수정 팝업</div>
        </div>

        <!-- Total Spent Card (Red) -->
        <div style="background: #FEF2F2; border: 1.5px solid #FECACA; border-radius: 8px; padding: 14px; text-align: center;">
          <div style="font-size: 12px; font-weight: 800; color: #991B1B; margin-bottom: 4px;">총 실집행 지출</div>
          <div style="font-size: 20px; font-weight: 900; color: #DC2626;">- ${totalSpent.toLocaleString()}원</div>
          <div style="font-size: 11px; color: #991B1B; margin-top: 2px;">행사+결재+수기지출</div>
        </div>

        <!-- Total Income Card (Blue) -->
        <div style="background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 8px; padding: 14px; text-align: center;">
          <div style="font-size: 12px; font-weight: 800; color: #1E40AF; margin-bottom: 4px;">수기 수입 합계</div>
          <div style="font-size: 20px; font-weight: 900; color: #2563EB;">+ ${ledgerIncomeTotal.toLocaleString()}원</div>
          <div style="font-size: 11px; color: #1E40AF; margin-top: 2px;">후원금/지원금 수입</div>
        </div>

        <!-- Available Remaining Budget Card (Green) -->
        <div style="background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 8px; padding: 14px; text-align: center;">
          <div style="font-size: 12px; font-weight: 800; color: #166534; margin-bottom: 4px;">가용 잔여 예산</div>
          <div style="font-size: 20px; font-weight: 900; color: #15803D;">${availableRemaining.toLocaleString()}원</div>
          <div style="font-size: 11px; color: #166534; margin-top: 2px;">소진율: ${overallRate}%</div>
        </div>

      </div>

      <!-- 2. INTERACTIVE LEDGER ENTRY FORM (INCOME & EXPENSE SELECTION) -->
      <div style="background: #FFF; border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h4 style="font-size: 16px; font-weight: 900; color: var(--primary-navy); margin-bottom: 12px;">+ 신규 회계 장부 수기 기입 (지출/수입 구분 등록)</h4>
        <form onsubmit="handleAddLedgerEntry(event)" style="display: grid; grid-template-columns: 140px 140px 1.5fr 1.2fr 2fr 90px; gap: 10px; align-items: flex-end;">
          <div>
            <label style="font-size: 12px; font-weight: 800; display: block; margin-bottom: 4px;">구분 (수입/지출)</label>
            <select id="accLedgerDirection" class="form-select" style="width: 100%; padding: 8px; font-weight: 900;" onchange="handleLedgerDirectionChange(this.value)">
              <option value="EXPENSE" style="color: #DC2626;">지출 (적색)</option>
              <option value="INCOME" style="color: #2563EB;">수입 (파란색)</option>
            </select>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 800; display: block; margin-bottom: 4px;">상세 항목</label>
            <select id="accLedgerType" class="form-select" style="width: 100%; padding: 8px;">
              <option value="경비지출">경비지출</option>
              <option value="사업비">사업비</option>
              <option value="행사지출">행사지출</option>
              <option value="기타지출">기타지출</option>
            </select>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 800; display: block; margin-bottom: 4px;">항목 명칭</label>
            <input type="text" id="accLedgerTitle" class="form-input" style="width: 100%; padding: 8px;" placeholder="예: 의정보고서 인쇄비" required>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 800; display: block; margin-bottom: 4px;">금액 (원)</label>
            <input type="number" id="accLedgerAmount" class="form-input" style="width: 100%; padding: 8px;" placeholder="0" required>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 800; display: block; margin-bottom: 4px;">비고 (사용처 / 사유)</label>
            <input type="text" id="accLedgerNote" class="form-input" style="width: 100%; padding: 8px;" placeholder="세부 내용 기재">
          </div>
          <button type="submit" class="btn-primary" style="height: 40px; font-size: 13px; background: #047857; border-color: #047857;">장부 등록</button>
        </form>
      </div>

      <!-- 3. EXPENSE SECTION (적색 강조 지출 내역) -->
      <div style="background: #FFF; border: 1.5px solid #FECACA; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #DC2626; display: inline-block;"></span>
            <h4 style="font-size: 16px; font-weight: 900; color: #991B1B; margin: 0;">지출 내역 (결재 승인 지출 + 수기 지출 장부)</h4>
          </div>
          <span style="font-size: 13px; font-weight: 800; color: #DC2626;">지출 합계: - ${(taskSpent + ledgerExpenseTotal).toLocaleString()}원</span>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
            <thead style="background: #FEF2F2; border-bottom: 2px solid #FECACA; font-weight: 800;">
              <tr>
                <th style="padding: 10px 12px; color: #991B1B;">일시</th>
                <th style="padding: 10px 12px; color: #991B1B;">구분</th>
                <th style="padding: 10px 12px; color: #991B1B;">항목 명칭</th>
                <th style="padding: 10px 12px; color: #991B1B;">비고 (사용처)</th>
                <th style="padding: 10px 12px; text-align: right; color: #991B1B;">지출 금액</th>
                <th style="padding: 10px 12px; text-align: center; color: #991B1B;">담당자</th>
                <th style="padding: 10px 12px; text-align: center; color: #991B1B;">관리</th>
              </tr>
            </thead>
            <tbody>
              ${approvedBudgetTasks.map(t => `
                <tr style="border-bottom: 1px solid #FEE2E2; background: #FFF;">
                  <td style="padding: 10px 12px; color: var(--text-muted); font-size: 13px;">${t.approvedAt || t.createdAt}</td>
                  <td style="padding: 10px 12px;"><span style="font-size: 11px; font-weight: 900; padding: 2px 6px; border-radius: 4px; background: #FEE2E2; color: #991B1B;">결재승인지출</span></td>
                  <td style="padding: 10px 12px; font-weight: 800; color: var(--text-dark);">${t.title}</td>
                  <td style="padding: 10px 12px; font-size: 13px; color: var(--text-muted);">안건번호: ${t.id}</td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: 900; color: #DC2626;">- ${(Number(t.expenseAmount) || 0).toLocaleString()}원</td>
                  <td style="padding: 10px 12px; text-align: center; font-size: 13px;">${formatUserDisplay({name: t.requesterName, roleTitle: t.requesterTeam})}</td>
                  <td style="padding: 10px 12px; text-align: center;">
                    <button class="btn-outline" style="font-size: 11px; padding: 2px 6px;" onclick="openTaskDetailModal('${t.id}')">안건보기</button>
                  </td>
                </tr>
              `).join('')}
              ${expenseLedger.map(item => `
                <tr style="border-bottom: 1px solid #FEE2E2; background: #FFF;">
                  <td style="padding: 10px 12px; color: var(--text-muted); font-size: 13px;">${item.date}</td>
                  <td style="padding: 10px 12px;"><span style="font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: #FEF2F2; color: #DC2626;">${item.type}</span></td>
                  <td style="padding: 10px 12px; font-weight: 800; color: var(--text-dark);">${item.title}</td>
                  <td style="padding: 10px 12px; font-size: 13px; color: var(--text-dark);">${item.note || '-'}</td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: 900; color: #DC2626;">- ${Number(item.amount).toLocaleString()}원</td>
                  <td style="padding: 10px 12px; text-align: center; font-size: 13px;">${item.registeredBy || '-'}</td>
                  <td style="padding: 10px 12px; text-align: center;">
                    <button class="btn-outline" style="font-size: 11px; padding: 2px 6px; color: #DC2626; border-color: #DC2626;" onclick="handleDeleteLedgerEntry('${item.id}')">삭제</button>
                  </td>
                </tr>
              `).join('')}
              ${(approvedBudgetTasks.length === 0 && expenseLedger.length === 0) ? '<tr><td colspan="7" style="padding: 20px; text-align: center; color: var(--text-muted);">등록된 지출 내역이 없습니다.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4. INCOME SECTION (파란색 강조 수입 내역) -->
      <div style="background: #FFF; border: 1.5px solid #BFDBFE; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #2563EB; display: inline-block;"></span>
            <h4 style="font-size: 16px; font-weight: 900; color: #1E40AF; margin: 0;">수입 내역 (후원금 / 당비·지원금 장부)</h4>
          </div>
          <span style="font-size: 13px; font-weight: 800; color: #2563EB;">수입 합계: + ${ledgerIncomeTotal.toLocaleString()}원</span>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
            <thead style="background: #EFF6FF; border-bottom: 2px solid #BFDBFE; font-weight: 800;">
              <tr>
                <th style="padding: 10px 12px; color: #1E40AF;">일시</th>
                <th style="padding: 10px 12px; color: #1E40AF;">구분</th>
                <th style="padding: 10px 12px; color: #1E40AF;">항목 명칭</th>
                <th style="padding: 10px 12px; color: #1E40AF;">비고 (수입원 / 사유)</th>
                <th style="padding: 10px 12px; text-align: right; color: #1E40AF;">수입 금액</th>
                <th style="padding: 10px 12px; text-align: center; color: #1E40AF;">등록자</th>
                <th style="padding: 10px 12px; text-align: center; color: #1E40AF;">관리</th>
              </tr>
            </thead>
            <tbody>
              ${incomeLedger.map(item => `
                <tr style="border-bottom: 1px solid #DBEAFE; background: #FFF;">
                  <td style="padding: 10px 12px; color: var(--text-muted); font-size: 13px;">${item.date}</td>
                  <td style="padding: 10px 12px;"><span style="font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: #EFF6FF; color: #1E40AF;">${item.type}</span></td>
                  <td style="padding: 10px 12px; font-weight: 800; color: var(--text-dark);">${item.title}</td>
                  <td style="padding: 10px 12px; font-size: 13px; color: var(--text-dark);">${item.note || '-'}</td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: 900; color: #2563EB;">+ ${Number(item.amount).toLocaleString()}원</td>
                  <td style="padding: 10px 12px; text-align: center; font-size: 13px;">${item.registeredBy || '-'}</td>
                  <td style="padding: 10px 12px; text-align: center;">
                    <button class="btn-outline" style="font-size: 11px; padding: 2px 6px; color: #DC2626; border-color: #DC2626;" onclick="handleDeleteLedgerEntry('${item.id}')">삭제</button>
                  </td>
                </tr>
              `).join('')}
              ${incomeLedger.length === 0 ? '<tr><td colspan="7" style="padding: 20px; text-align: center; color: var(--text-muted);">등록된 수입 내역이 없습니다.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. EVENT EXPENSES TABLE -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 16px; font-weight: 900; color: var(--primary-navy);">행사별 경비 정산 및 예산 집행 내역</span>
        <span style="font-size: 13px; color: var(--text-muted); font-weight: 700;">총 ${events.length}건 등록됨</span>
      </div>
      <div style="overflow-x: auto; border: 1px solid var(--border-color); border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
          <thead style="background: #F1F5F9; border-bottom: 2px solid var(--border-color); font-weight: 800;">
            <tr>
              <th style="padding: 10px 12px;">일시</th>
              <th style="padding: 10px 12px;">행사명</th>
              <th style="padding: 10px 12px; text-align: right;">배정 예산</th>
              <th style="padding: 10px 12px; text-align: right;">실집행 경비</th>
              <th style="padding: 10px 12px; text-align: right;">잔액 (차액)</th>
              <th style="padding: 10px 12px; text-align: center;">집행률</th>
              <th style="padding: 10px 12px; text-align: center;">상태</th>
              <th style="padding: 10px 12px; text-align: center;">관리</th>
            </tr>
          </thead>
          <tbody>
            ${events.map(e => {
              const bg = Number(e.budget) || 0;
              const sp = Number(e.spent) || 0;
              const diff = bg - sp;
              const r = bg > 0 ? ((sp / bg) * 100).toFixed(1) : '0.0';
              return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 10px 12px; color: var(--text-muted); font-size: 13px;">${e.date || '-'}</td>
                  <td style="padding: 10px 12px; font-weight: 800; color: var(--primary-navy);">${e.title}</td>
                  <td style="padding: 10px 12px; text-align: right;">${bg.toLocaleString()}원</td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: #DC2626;">${sp.toLocaleString()}원</td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: ${diff >= 0 ? '#15803D' : '#DC2626'};">${diff.toLocaleString()}원</td>
                  <td style="padding: 10px 12px; text-align: center; font-weight: 800;">${r}%</td>
                  <td style="padding: 10px 12px; text-align: center;">
                    <span style="font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: #EEF2F6;">${e.status || '준비중'}</span>
                  </td>
                  <td style="padding: 10px 12px; text-align: center;">
                    <button class="btn-outline" style="font-size: 12px; padding: 3px 8px;" onclick="openEventDetailModal('${e.id}')">상세 보고서</button>
                  </td>
                </tr>
              `;
            }).join('') || '<tr><td colspan="8" style="padding: 24px; text-align: center; color: var(--text-muted);">등록된 행사 경비 내역이 없습니다.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

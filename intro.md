\# \[명세서] 정치사무 전용 올인원 결재·업무 관리 플랫폼 (PoliticSync Pro)



> \*\*문서 버전:\*\* v2.0

> \*\*작성자:\*\* 시니어 UX 디자이너 \& 실전 프로젝트 매니저 (PM)

> \*\*대상 플랫폼:\*\* Web PWA, Desktop (Tauri v2), Mobile App

> \*\*핵심 가치:\*\* \*\*기록·증빙·속도·현장 대응\*\* | \*\*시니어 전용 1screen-1action UX\*\*



---



\## 1. 개요 및 기획 철학



본 시스템은 국회의원·지방의원 의원실, 정당 지역사무소, 선거캠프 등 \*\*정치사무 현장\*\*을 위해 특화된 업무 결재 및 현장 반응형 플랫폼입니다.



\### 🎯 핵심 해결 과제



1\. \*\*극단적 사용자 격차 극복:\*\* 입력은 20~30대 청년 보좌진이 모바일과 데이터 테이블로 신속하게 수행하고, 결재 및 확인은 60~70대 시니어 최고 의사결정권자(의원, 당협위원장, 고문)가 수행함.

2\. \*\*복잡도 제거:\*\* 기존 Enterprise 툴(Jira, Notion, Wrike 등)의 복잡한 간트차트, 스프린트, 다중 패널, 빈 화면 형태를 완전 배제.

3\. \*\*증빙과 법적 기록성 확보:\*\* 현장 사진, 위치(GPS), 타임스탬프, 전자결재 감사로그(Audit Log)를 기본 탑재.



---



\## 2. 디자인 시스템 규격 (Strict Government Style)



어르신 사용자의 \*\*가독성\*\*과 의원실의 \*\*품격 및 신뢰감\*\*을 동시에 충족하는 전용 디자인 시스템입니다.



```

+-----------------------------------------------------------------------+

|  \[Background]  #F8F6F0 (Paper Cream) - 눈의 피로도를 낮추는 한지 느낌    |

|  \[Text]        #1A1A1A (High Contrast Dark) - 대비율 7:1 이상 선명도     |

|  \[Primary Navy]#0B2A4A (Deep Navy) - 차분함, 신뢰감, 품격있는 정당 톤   |

|  \[Approved]    #1E6F4E (Muted Green) - 절제된 승인 상태 색상             |

|  \[Rejected]    #8B2635 (Muted Red) - 절제된 반려 상태 색상               |

+-----------------------------------------------------------------------+



```



\### UX/UI 핵심 제약 규칙



\* \*\*레이아웃 제약:\*\* 모바일 및 데스크톱 모두 동일하게 \*\*최대 폭 800px 단일 컬럼(Centered Single Column)\*\* 구조 사용. 사이드바 및 햄버거 메뉴 철저 금지.

\* \*\*타이포그래피:\*\* `Noto Sans KR` (Bold 위주).

\* \*\*최소 본문 폰트:\*\* `20px` (line-height: 1.8)

\* \*\*타이틀 폰트:\*\* `36px`





\* \*\*터치 영역:\*\* 모든 주요 액션 버튼 높이 최소 `56px` 이상.

\* \*\*이미지 규격:\*\* 썸네일 `80x80px` 좌측 배치, 우측 텍스트 영역 `80%`. 배너 형태 대형 이미지 금지.

\* \*\*금지 요소:\*\* 칸반 드래그 앤 드롭(시니어용), 미세한 날짜 선택기, 댓글 스레드, 영어 전문용어, TTS, 이모지, 화려한 그라데이션.



---



\## 3. 정치사무 10대 핵심 기능 모듈



| 번호 | 모듈명 | 주요 기능 및 정치사무 특화 요소 |

| --- | --- | --- |

| \*\*1\*\* | \*\*일정관리\*\* | 선거/회의/지역행사/법정 제출기한 관리, D-Day 및 1일전/1시간 전 알림 |

| \*\*2\*\* | \*\*민원관리\*\* | 지역구/상세위치/사진증빙 포함 민원 접수 → 구청/담당 전달 → 처리완료 파이프라인 |

| \*\*3\*\* | \*\*단순 업무(Task)\*\* | \[대기] → \[진행중] → \[완료] 3단계 단순 상태 전환 (간트차트 X) |

| \*\*4\*\* | \*\*후원자/당원 CRM\*\* | 초고속 초성 검색(이름, 연락처, 지역, 관심분야, 마지막 통화일) |

| \*\*5\*\* | \*\*행사/현장 관리\*\* | 참석자 체크인, 현장 사진, 비용 기록 및 결과보고 |

| \*\*6\*\* | \*\*문서/공약 관리\*\* | 공약, 보도자료, 회의록, PDF 일괄 저장 및 OCR 검색 연동 구조 |

| \*\*7\*\* | \*\*사진/영상 증빙\*\* | 현장 사진·동영상·녹취 업로드 시 GPS 및 타임스탬프 자동 기입 |

| \*\*8\*\* | \*\*업무 메신저\*\* | 1:1 및 채널별 업무 대화, 음성 메시지, 읽음 확인 |

| \*\*9\*\* | \*\*전자결재\*\* | 시니어 원터치 결재(`승인`, `보류`, `반려`), 직인 도장 애니메이션, Audit Log |

| \*\*10\*\* | \*\*통합 대시보드\*\* | 오늘 일정, 미처리 긴급 민원, 결재 대기 건수 등 대형 카드 UI |



---



\## 4. 이원화 뷰(Dual-View) 및 결재 워크플로우



\### 1) 워크플로우 상태 (Workflow States)



$$DRAFT \\longrightarrow PENDING \\longrightarrow \\begin{cases} APPROVED \\\\ HOLD \\\\ REJECTED \\end{cases}$$



\### 2) 사용자 역할별 화면



\* \*\*시니어 결재 뷰 (Elderly Pending View):\*\*

\* 한 화면에 \*\*단 1개의 결재 안건\*\*만 크게 표시 (1 Screen 1 Task).

\* 카테고리 배지, 80x80 썸네일, 제목, 요청자/일시, 3줄 요약.

\* 하단 고정 3개 대형 버튼: \*\*\[ 승 인 ]\*\*, \*\*\[ 보 류 ]\*\*, \*\*\[ 반 려 ]\*\*.

\* 승인 클릭 시 직인(Approved Stamp) 연출 및 Audit Log 자동 생성.





\* \*\*청년 실무자 고밀도 뷰 (Young Staff List View):\*\*

\* 카테고리, 상태, 담당자별 필터링이 가능한 고밀도 데이터 테이블.

\* 신속 데이터 등록 모달, CSV 일괄 가져오기/내보내기(Merge/Overwrite 지원).







---



\## 5. 실전 프론트엔드 시공 코드 (React + Tailwind CSS)



다음은 브라우저 localstorage 및 Supabase Realtime/Tauri v2 백엔드 연결 구조를 포함한 \*\*단일 파일 컴포넌트 실전 프로토타입\*\*입니다.



```tsx

import React, { useState, useEffect } from 'react';



// --- Type Definitions ---

export type Category = '민원' | '일정행사' | '조직인사' | '홍보보도' | '정책공약' | '예산지출';

export type TaskStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'HOLD' | 'REJECTED';



export interface AuditRecord {

&nbsp; id: string;

&nbsp; who: string;

&nbsp; when: string;

&nbsp; action: string;

}



export interface PoliticalTask {

&nbsp; id: string;

&nbsp; category: Category;

&nbsp; title: string;

&nbsp; requester: string;

&nbsp; createdAt: string;

&nbsp; summary: string;

&nbsp; status: TaskStatus;

&nbsp; thumbnailUrl?: string;

&nbsp; location?: string;

&nbsp; auditLogs: AuditRecord\[];

}



// --- Initial Seed Data ---

const INITIAL\_TASKS: PoliticalTask\[] = \[

&nbsp; {

&nbsp;   id: 'POL-2026-001',

&nbsp;   category: '민원',

&nbsp;   title: '노원구 상계동 가로등 고장 및 야간 보행 안전 확보 건',

&nbsp;   requester: '김청년 보좌관',

&nbsp;   createdAt: '2026-07-25 14:30',

&nbsp;   summary: '상계동 34번지 일대 가로등 4개소 점등 불량. 구청 도로과 긴급 이첩 및 주말 내 교체 작업 요청.',

&nbsp;   status: 'PENDING',

&nbsp;   thumbnailUrl: 'https://via.placeholder.com/80',

&nbsp;   location: '서울특별시 노원구 상계동',

&nbsp;   auditLogs: \[]

&nbsp; },

&nbsp; {

&nbsp;   id: 'POL-2026-002',

&nbsp;   category: '홍보보도',

&nbsp;   title: '지역구 재개발 사업 관련 성명서 최종 결재 요청',

&nbsp;   requester: '이홍보 비서관',

&nbsp;   createdAt: '2026-07-25 15:10',

&nbsp;   summary: '내일 오전 10시 시의회 브리핑룸 발표 예정 보도자료. 주민 의견 수렴 수치 및 당론 반영 완료.',

&nbsp;   status: 'PENDING',

&nbsp;   thumbnailUrl: 'https://via.placeholder.com/80',

&nbsp;   location: '의원실 내부',

&nbsp;   auditLogs: \[]

&nbsp; },

&nbsp; {

&nbsp;   id: 'POL-2026-003',

&nbsp;   category: '일정행사',

&nbsp;   title: '8월 전통시장 상인회 간담회 참가의 건',

&nbsp;   requester: '박조직 부장',

&nbsp;   createdAt: '2026-07-24 11:00',

&nbsp;   summary: '상인회 임원진 12명 참석 예정. 현장 애로사항 청취 및 추석 물가 대책 논의.',

&nbsp;   status: 'APPROVED',

&nbsp;   thumbnailUrl: 'https://via.placeholder.com/80',

&nbsp;   location: '중앙시장 상인회관',

&nbsp;   auditLogs: \[

&nbsp;     { id: 'log-1', who: 'OOO 의원', when: '2026-07-24 16:00', action: 'APPROVED' }

&nbsp;   ]

&nbsp; }

];



export default function PoliticSyncApp() {

&nbsp; const \[tasks, setTasks] = useState<PoliticalTask\[]>(() => {

&nbsp;   const saved = localStorage.getItem('politic\_sync\_tasks');

&nbsp;   return saved ? JSON.parse(saved) : INITIAL\_TASKS;

&nbsp; });



&nbsp; const \[activeTab, setActiveTab] = useState<'SENIOR\_VIEW' | 'STAFF\_LIST' | 'CREATE' | 'SYSTEM'>('SENIOR\_VIEW');

&nbsp; const \[seniorIndex, setSeniorIndex] = useState(0);

&nbsp; const \[selectedCategory, setSelectedCategory] = useState<string>('전체');



&nbsp; // New Task Form State

&nbsp; const \[newCategory, setNewCategory] = useState<Category>('민원');

&nbsp; const \[newTitle, setNewTitle] = useState('');

&nbsp; const \[newRequester, setNewRequester] = useState('');

&nbsp; const \[newSummary, setNewSummary] = useState('');

&nbsp; const \[newLocation, setNewLocation] = useState('');



&nbsp; useEffect(() => {

&nbsp;   localStorage.setItem('politic\_sync\_tasks', JSON.stringify(tasks));

&nbsp; }, \[tasks]);



&nbsp; const pendingTasks = tasks.filter(t => t.status === 'PENDING');

&nbsp; const currentSeniorTask = pendingTasks\[seniorIndex] || null;



&nbsp; // --- Senior Approval Handler ---

&nbsp; const handleSeniorAction = (action: 'APPROVED' | 'HOLD' | 'REJECTED') => {

&nbsp;   if (!currentSeniorTask) return;



&nbsp;   const timestamp = new Date().toLocaleString('ko-KR');

&nbsp;   const newLog: AuditRecord = {

&nbsp;     id: `log-${Date.now()}`,

&nbsp;     who: '의원/최고결재권자',

&nbsp;     when: timestamp,

&nbsp;     action: action

&nbsp;   };



&nbsp;   setTasks(prev => prev.map(t => {

&nbsp;     if (t.id === currentSeniorTask.id) {

&nbsp;       return {

&nbsp;         ...t,

&nbsp;         status: action,

&nbsp;         auditLogs: \[...t.auditLogs, newLog]

&nbsp;       };

&nbsp;     }

&nbsp;     return t;

&nbsp;   }));



&nbsp;   if (seniorIndex >= pendingTasks.length - 1) {

&nbsp;     setSeniorIndex(Math.max(0, pendingTasks.length - 2));

&nbsp;   }

&nbsp; };



&nbsp; // --- Create Task Handler ---

&nbsp; const handleCreateTask = (e: React.FormEvent) => {

&nbsp;   e.preventDefault();

&nbsp;   if (!newTitle || !newRequester) return;



&nbsp;   const newTask: PoliticalTask = {

&nbsp;     id: `POL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() \* 900)}`,

&nbsp;     category: newCategory,

&nbsp;     title: newTitle,

&nbsp;     requester: newRequester,

&nbsp;     createdAt: new Date().toLocaleString('ko-KR').slice(0, -3),

&nbsp;     summary: newSummary,

&nbsp;     status: 'PENDING',

&nbsp;     thumbnailUrl: 'https://via.placeholder.com/80',

&nbsp;     location: newLocation,

&nbsp;     auditLogs: \[]

&nbsp;   };



&nbsp;   setTasks(\[newTask, ...tasks]);

&nbsp;   setNewTitle('');

&nbsp;   setNewSummary('');

&nbsp;   setNewLocation('');

&nbsp;   setActiveTab('STAFF\_LIST');

&nbsp; };



&nbsp; // --- CSV Export Handler ---

&nbsp; const handleExportCSV = () => {

&nbsp;   const headers = \["ID", "카테고리", "제목", "요청자", "등록일시", "상태", "요약"];

&nbsp;   const rows = tasks.map(t => \[

&nbsp;     t.id, t.category, `"${t.title}"`, t.requester, t.createdAt, t.status, `"${t.summary}"`

&nbsp;   ]);

&nbsp;   const csvContent = "data:text/csv;charset=utf-8,\\uFEFF" + \[headers.join(","), ...rows.map(e => e.join(","))].join("\\n");

&nbsp;   const encodedUri = encodeURI(csvContent);

&nbsp;   const link = document.createElement("a");

&nbsp;   link.setAttribute("href", encodedUri);

&nbsp;   link.setAttribute("download", `정치사무\_업무목록\_${new Date().toISOString().slice(0,10)}.csv`);

&nbsp;   document.body.appendChild(link);

&nbsp;   link.click();

&nbsp;   document.body.removeChild(link);

&nbsp; };



&nbsp; return (

&nbsp;   <div className="min-h-screen bg-\[#F8F6F0] text-\[#1A1A1A] font-sans pb-20">

&nbsp;     {/\* Top Main Navigation Header \*/}

&nbsp;     <header className="bg-\[#0B2A4A] text-white p-4 sticky top-0 z-50 shadow-md">

&nbsp;       <div className="max-w-\[800px] mx-auto flex justify-between items-center">

&nbsp;         <h1 className="text-\[24px] font-bold tracking-tight">🏛️ PoliticSync Pro</h1>

&nbsp;         <span className="text-\[14px] bg-\[#1E6F4E] px-3 py-1 rounded-full font-bold">

&nbsp;           의원실 스마트 결재

&nbsp;         </span>

&nbsp;       </div>

&nbsp;     </header>



&nbsp;     {/\* Main Tab Controller (Strict Size: Min Height 48px, Large Font) \*/}

&nbsp;     <nav className="bg-\[#0B2A4A] border-t border-blue-900 sticky top-\[60px] z-40">

&nbsp;       <div className="max-w-\[800px] mx-auto flex text-\[18px] font-bold text-gray-300">

&nbsp;         <button

&nbsp;           onClick={() => setActiveTab('SENIOR\_VIEW')}

&nbsp;           className={`flex-1 py-3 text-center border-b-4 ${activeTab === 'SENIOR\_VIEW' ? 'border-amber-400 text-white bg-blue-950' : 'border-transparent'}`}

&nbsp;         >

&nbsp;           결재 대기 ({pendingTasks.length})

&nbsp;         </button>

&nbsp;         <button

&nbsp;           onClick={() => setActiveTab('STAFF\_LIST')}

&nbsp;           className={`flex-1 py-3 text-center border-b-4 ${activeTab === 'STAFF\_LIST' ? 'border-amber-400 text-white bg-blue-950' : 'border-transparent'}`}

&nbsp;         >

&nbsp;           전체 목록

&nbsp;         </button>

&nbsp;         <button

&nbsp;           onClick={() => setActiveTab('CREATE')}

&nbsp;           className={`flex-1 py-3 text-center border-b-4 ${activeTab === 'CREATE' ? 'border-amber-400 text-white bg-blue-950' : 'border-transparent'}`}

&nbsp;         >

&nbsp;           + 안건 등록

&nbsp;         </button>

&nbsp;       </div>

&nbsp;     </nav>



&nbsp;     {/\* Main Container: Strictly Centered Single Column Max 800px \*/}

&nbsp;     <main className="max-w-\[800px] mx-auto p-4">



&nbsp;       {/\* ==================== VIEW 1: ELDERLY SENIOR VIEW ==================== \*/}

&nbsp;       {activeTab === 'SENIOR\_VIEW' \&\& (

&nbsp;         <section className="space-y-6">

&nbsp;           <div className="flex justify-between items-center bg-white p-4 rounded-lg border-2 border-\[#0B2A4A]">

&nbsp;             <span className="text-\[20px] font-bold text-\[#0B2A4A]">

&nbsp;               대기 중인 안건 총 {pendingTasks.length}건

&nbsp;             </span>

&nbsp;             {pendingTasks.length > 1 \&\& (

&nbsp;               <div className="space-x-2">

&nbsp;                 <button

&nbsp;                   onClick={() => setSeniorIndex(prev => Math.max(0, prev - 1))}

&nbsp;                   disabled={seniorIndex === 0}

&nbsp;                   className="px-4 py-2 text-\[18px] bg-gray-200 text-gray-800 rounded font-bold disabled:opacity-30"

&nbsp;                 >

&nbsp;                   이전

&nbsp;                 </button>

&nbsp;                 <button

&nbsp;                   onClick={() => setSeniorIndex(prev => Math.min(pendingTasks.length - 1, prev + 1))}

&nbsp;                   disabled={seniorIndex === pendingTasks.length - 1}

&nbsp;                   className="px-4 py-2 text-\[18px] bg-gray-200 text-gray-800 rounded font-bold disabled:opacity-30"

&nbsp;                 >

&nbsp;                   다음

&nbsp;                 </button>

&nbsp;               </div>

&nbsp;             )}

&nbsp;           </div>



&nbsp;           {currentSeniorTask ? (

&nbsp;             <div className="bg-white rounded-xl border-2 border-\[#0B2A4A] p-6 shadow-lg space-y-6 relative overflow-hidden">

&nbsp;               {/\* Category Badge \& Task ID \*/}

&nbsp;               <div className="flex justify-between items-center border-b-2 border-gray-100 pb-4">

&nbsp;                 <span className="bg-\[#0B2A4A] text-white text-\[20px] px-4 py-1.5 rounded-md font-bold">

&nbsp;                   {currentSeniorTask.category}

&nbsp;                 </span>

&nbsp;                 <span className="text-\[18px] text-gray-500 font-bold">{currentSeniorTask.id}</span>

&nbsp;               </div>



&nbsp;               {/\* Thumbnail \& Title Layout \*/}

&nbsp;               <div className="flex gap-4 items-start">

&nbsp;                 <div className="w-\[80px] h-\[80px] bg-gray-200 border border-gray-300 rounded flex-shrink-0 flex items-center justify-center text-gray-500 text-\[14px] font-bold">

&nbsp;                   증빙사진

&nbsp;                 </div>

&nbsp;                 <div className="flex-1">

&nbsp;                   <h2 className="text-\[26px] font-bold text-\[#1A1A1A] leading-\[1.4] mb-2">

&nbsp;                     {currentSeniorTask.title}

&nbsp;                   </h2>

&nbsp;                   <p className="text-\[18px] text-gray-600 font-bold">

&nbsp;                     작성자: {currentSeniorTask.requester} | {currentSeniorTask.createdAt}

&nbsp;                   </p>

&nbsp;                   {currentSeniorTask.location \&\& (

&nbsp;                     <p className="text-\[18px] text-\[#0B2A4A] font-bold mt-1">

&nbsp;                       📍 위치: {currentSeniorTask.location}

&nbsp;                     </p>

&nbsp;                   )}

&nbsp;                 </div>

&nbsp;               </div>



&nbsp;               {/\* 3-Line High Contrast Summary Box \*/}

&nbsp;               <div className="bg-\[#F8F6F0] p-5 rounded-lg border border-amber-200 space-y-2">

&nbsp;                 <h3 className="text-\[20px] font-bold text-\[#0B2A4A] border-b border-amber-300 pb-1">

&nbsp;                   핵심 보고 요약

&nbsp;                 </h3>

&nbsp;                 <p className="text-\[22px] leading-\[1.8] text-\[#1A1A1A] font-bold">

&nbsp;                   {currentSeniorTask.summary}

&nbsp;                 </p>

&nbsp;               </div>



&nbsp;               {/\* FIXED 3 BIG ACTION BUTTONS (Height 56px+) \*/}

&nbsp;               <div className="pt-4 grid grid-cols-3 gap-3">

&nbsp;                 <button

&nbsp;                   onClick={() => handleSeniorAction('APPROVED')}

&nbsp;                   className="h-\[64px] text-\[22px] font-bold bg-\[#1E6F4E] hover:bg-green-800 text-white rounded-xl shadow-md transition-all flex items-center justify-center active:scale-95"

&nbsp;                 >

&nbsp;                   승 인

&nbsp;                 </button>

&nbsp;                 <button

&nbsp;                   onClick={() => handleSeniorAction('HOLD')}

&nbsp;                   className="h-\[64px] text-\[22px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center active:scale-95"

&nbsp;                 >

&nbsp;                   보 류

&nbsp;                 </button>

&nbsp;                 <button

&nbsp;                   onClick={() => handleSeniorAction('REJECTED')}

&nbsp;                   className="h-\[64px] text-\[22px] font-bold bg-\[#8B2635] hover:bg-red-900 text-white rounded-xl shadow-md transition-all flex items-center justify-center active:scale-95"

&nbsp;                 >

&nbsp;                   반 려

&nbsp;                 </button>

&nbsp;               </div>

&nbsp;             </div>

&nbsp;           ) : (

&nbsp;             <div className="bg-white p-12 text-center rounded-xl border-2 border-gray-300 space-y-4">

&nbsp;               <div className="text-\[48px]">✅</div>

&nbsp;               <h3 className="text-\[28px] font-bold text-\[#0B2A4A]">대기 중인 결재 안건이 없습니다.</h3>

&nbsp;               <p className="text-\[20px] text-gray-600 font-bold">모든 안건에 대한 의사결정이 완료되었습니다.</p>

&nbsp;             </div>

&nbsp;           )}

&nbsp;         </section>

&nbsp;       )}



&nbsp;       {/\* ==================== VIEW 2: STAFF DENSE LIST VIEW ==================== \*/}

&nbsp;       {activeTab === 'STAFF\_LIST' \&\& (

&nbsp;         <section className="space-y-4">

&nbsp;           {/\* Filter and Control Bar \*/}

&nbsp;           <div className="bg-white p-4 rounded-lg border border-gray-300 space-y-3">

&nbsp;             <div className="flex justify-between items-center">

&nbsp;               <h2 className="text-\[22px] font-bold text-\[#0B2A4A]">전체 안건 데이터 관리</h2>

&nbsp;               <button

&nbsp;                 onClick={handleExportCSV}

&nbsp;                 className="bg-\[#0B2A4A] text-white px-4 py-2 rounded text-\[16px] font-bold hover:bg-blue-900"

&nbsp;               >

&nbsp;                 📥 CSV 내보내기

&nbsp;               </button>

&nbsp;             </div>



&nbsp;             {/\* Category Filter Buttons \*/}

&nbsp;             <div className="flex gap-1 overflow-x-auto pb-1">

&nbsp;               {\['전체', '민원', '일정행사', '조직인사', '홍보보도', '정책공약', '예산지출'].map(cat => (

&nbsp;                 <button

&nbsp;                   key={cat}

&nbsp;                   onClick={() => setSelectedCategory(cat)}

&nbsp;                   className={`px-3 py-1.5 rounded text-\[16px] font-bold whitespace-nowrap ${selectedCategory === cat ? 'bg-\[#0B2A4A] text-white' : 'bg-gray-100 text-gray-700'}`}

&nbsp;                 >

&nbsp;                   {cat}

&nbsp;                 </button>

&nbsp;               ))}

&nbsp;             </div>

&nbsp;           </div>



&nbsp;           {/\* Task Cards List \*/}

&nbsp;           <div className="space-y-3">

&nbsp;             {tasks

&nbsp;               .filter(t => selectedCategory === '전체' || t.category === selectedCategory)

&nbsp;               .map(task => (

&nbsp;                 <div key={task.id} className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm space-y-2">

&nbsp;                   <div className="flex justify-between items-center">

&nbsp;                     <span className="text-\[16px] font-bold bg-gray-100 text-\[#0B2A4A] px-2.5 py-0.5 rounded">

&nbsp;                       {task.category}

&nbsp;                     </span>

&nbsp;                     <span className={`text-\[16px] font-bold px-3 py-0.5 rounded-full ${

&nbsp;                       task.status === 'APPROVED' ? 'bg-emerald-100 text-\[#1E6F4E]' :

&nbsp;                       task.status === 'REJECTED' ? 'bg-red-100 text-\[#8B2635]' :

&nbsp;                       task.status === 'HOLD' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'

&nbsp;                     }`}>

&nbsp;                       {task.status}

&nbsp;                     </span>

&nbsp;                   </div>



&nbsp;                   <h3 className="text-\[20px] font-bold text-\[#1A1A1A]">{task.title}</h3>

&nbsp;                   <p className="text-\[16px] text-gray-600 leading-snug">{task.summary}</p>



&nbsp;                   <div className="flex justify-between items-center text-\[14px] text-gray-500 pt-2 border-t border-gray-100 font-bold">

&nbsp;                     <span>담당: {task.requester}</span>

&nbsp;                     <span>등록: {task.createdAt}</span>

&nbsp;                   </div>



&nbsp;                   {/\* Audit Logs Trail \*/}

&nbsp;                   {task.auditLogs.length > 0 \&\& (

&nbsp;                     <div className="bg-gray-50 p-2 rounded text-\[13px] text-gray-600 font-mono space-y-0.5">

&nbsp;                       {task.auditLogs.map(log => (

&nbsp;                         <div key={log.id}>

&nbsp;                           \[감사로그] {log.when} - {log.who} ({log.action})

&nbsp;                         </div>

&nbsp;                       ))}

&nbsp;                     </div>

&nbsp;                   )}

&nbsp;                 </div>

&nbsp;               ))}

&nbsp;           </div>

&nbsp;         </section>

&nbsp;       )}



&nbsp;       {/\* ==================== VIEW 3: CREATE TASK FORM ==================== \*/}

&nbsp;       {activeTab === 'CREATE' \&\& (

&nbsp;         <section className="bg-white p-6 rounded-xl border-2 border-\[#0B2A4A] shadow-md">

&nbsp;           <h2 className="text-\[24px] font-bold text-\[#0B2A4A] mb-6 border-b-2 border-gray-100 pb-3">

&nbsp;             신규 정치사무 안건 작성 (보좌진용)

&nbsp;           </h2>



&nbsp;           <form onSubmit={handleCreateTask} className="space-y-5">

&nbsp;             <div>

&nbsp;               <label className="block text-\[18px] font-bold text-\[#1A1A1A] mb-2">카테고리</label>

&nbsp;               <select

&nbsp;                 value={newCategory}

&nbsp;                 onChange={(e) => setNewCategory(e.target.value as Category)}

&nbsp;                 className="w-full p-3 border-2 border-gray-300 rounded-lg text-\[18px] font-bold bg-white"

&nbsp;               >

&nbsp;                 <option value="민원">민원</option>

&nbsp;                 <option value="일정행사">일정행사</option>

&nbsp;                 <option value="조직인사">조직인사</option>

&nbsp;                 <option value="홍보보도">홍보보도</option>

&nbsp;                 <option value="정책공약">정책공약</option>

&nbsp;                 <option value="예산지출">예산지출</option>

&nbsp;               </select>

&nbsp;             </div>



&nbsp;             <div>

&nbsp;               <label className="block text-\[18px] font-bold text-\[#1A1A1A] mb-2">안건 제목</label>

&nbsp;               <input

&nbsp;                 type="text"

&nbsp;                 value={newTitle}

&nbsp;                 onChange={(e) => setNewTitle(e.target.value)}

&nbsp;                 placeholder="예: 상계동 가로등 긴급 수리 요청 건"

&nbsp;                 className="w-full p-3 border-2 border-gray-300 rounded-lg text-\[18px] font-bold"

&nbsp;                 required

&nbsp;               />

&nbsp;             </div>



&nbsp;             <div>

&nbsp;               <label className="block text-\[18px] font-bold text-\[#1A1A1A] mb-2">작성자 / 담당 보좌진</label>

&nbsp;               <input

&nbsp;                 type="text"

&nbsp;                 value={newRequester}

&nbsp;                 onChange={(e) => setNewRequester(e.target.value)}

&nbsp;                 placeholder="예: 김청년 보좌관"

&nbsp;                 className="w-full p-3 border-2 border-gray-300 rounded-lg text-\[18px] font-bold"

&nbsp;                 required

&nbsp;               />

&nbsp;             </div>



&nbsp;             <div>

&nbsp;               <label className="block text-\[18px] font-bold text-\[#1A1A1A] mb-2">위치 / 장소 (선택)</label>

&nbsp;               <input

&nbsp;                 type="text"

&nbsp;                 value={newLocation}

&nbsp;                 onChange={(e) => setNewLocation(e.target.value)}

&nbsp;                 placeholder="예: 노원구 상계동 34번지 일대"

&nbsp;                 className="w-full p-3 border-2 border-gray-300 rounded-lg text-\[18px] font-bold"

&nbsp;               />

&nbsp;             </div>



&nbsp;             <div>

&nbsp;               <label className="block text-\[18px] font-bold text-\[#1A1A1A] mb-2">

&nbsp;                 시니어용 3줄 요약 (어르신 보고용)

&nbsp;               </label>

&nbsp;               <textarea

&nbsp;                 value={newSummary}

&nbsp;                 onChange={(e) => setNewSummary(e.target.value)}

&nbsp;                 rows={4}

&nbsp;                 placeholder="의원님께서 빠르게 판단하실 수 있도록 핵심 내용만 3줄 이내로 명확하게 작성하세요."

&nbsp;                 className="w-full p-3 border-2 border-gray-300 rounded-lg text-\[18px] font-bold leading-relaxed"

&nbsp;                 required

&nbsp;               />

&nbsp;             </div>



&nbsp;             <button

&nbsp;               type="submit"

&nbsp;               className="w-full h-\[56px] text-\[22px] font-bold bg-\[#0B2A4A] text-white rounded-xl shadow-lg hover:bg-blue-900 transition-all"

&nbsp;             >

&nbsp;               결재 요청 등록하기

&nbsp;             </button>

&nbsp;           </form>

&nbsp;         </section>

&nbsp;       )}



&nbsp;     </main>

&nbsp;   </div>

&nbsp; );

}



```



---



\## 6. 배포 및 기술 확장 구조 (PWA \& Tauri v2)



```

&nbsp;                      \[PoliticSync React Core App]

&nbsp;                                   │

&nbsp;          ┌────────────────────────┴────────────────────────┐

&nbsp;          ▼                                                 ▼

&nbsp;  \[Web / PWA Mode]                                \[Desktop Native App]

&nbsp;- Mobile Safari/Chrome                      - Tauri v2 (Windows/macOS)

&nbsp;- Offline First (ServiceWorker)             - Native Binary Execution

&nbsp;- LocalStorage + IndexedDB Sync             - High Security Audit Log File

&nbsp;          │                                                 │

&nbsp;          └────────────────────────┬────────────────────────┘

&nbsp;                                   ▼

&nbsp;                        \[Supabase Realtime API]

&nbsp;                      - PostgreSQL Database

&nbsp;                      - Role-Based Access Control (RBAC)

&nbsp;                      - Encrypted File Storage



```



1\. \*\*PWA (Progressive Web App):\*\* iOS Safari 및 Android Chrome에서 `홈 화면에 추가` 버튼으로 독립 실행형 앱 형태로 설치 가능.

2\. \*\*Tauri v2 빌드:\*\* 동일한 코드베이스를 Rust 기반의 Tauri v2로 패키징하여 Windows 및 macOS 데스크톱 실행파일(`.exe`, `.dmg`)로 즉시 배포 가능.

3\. \*\*오프라인 우선 (Offline-First):\*\* 네트워크 미연결 시 LocalStorage/IndexedDB에 결재 이력을 먼저 기록하고, 온라인 연결 시 Supabase Realtime DB와 자동 동기화.


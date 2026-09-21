-- ==============================================================================
-- PoliticSync Pro Enterprise - Supabase Database Schema & Security Policies (RLS)
-- ==============================================================================
-- [사용 방법]
-- 1. https://supabase.com 접속 후 새 프로젝트 생성
-- 2. 좌측 메뉴에서 'SQL Editor' 클릭 -> 'New query'
-- 3. 이 파일의 전체 내용을 복사해서 붙여넣고 'Run' 클릭
-- ==============================================================================

-- 1. profiles 테이블 생성 (Supabase의 auth.users 와 연동되는 공개 프로필 정보)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  name text NOT NULL,
  team text,
  role_title text,
  clearance text,
  phone text,
  email text,
  avatar text,
  is_admin boolean DEFAULT false,
  status text DEFAULT 'PENDING',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) 활성화 - 가장 중요한 보안 기능!
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS 보안 정책 설정
-- 정책 A: 누구나 프로필을 읽을 수 있음 (결재선 등을 보여주기 위해 필요)
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

-- 정책 B: 사용자는 '자신의' 프로필 정보만 수정할 수 있음
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 정책 C: 오직 관리자(is_admin=true)만 프로필 상태를 승인(APPROVED)할 수 있음
CREATE POLICY "Admins can update all profiles."
  ON public.profiles FOR UPDATE
  USING ( (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true );

-- 정책 D: 관리자(is_admin=true)는 프로필을 삭제(DELETE)할 수 있음
CREATE POLICY "Admins can delete profiles."
  ON public.profiles FOR DELETE
  USING ( (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true );

-- 4. 회원가입 트리거 설정
-- 사용자가 Supabase Auth(회원가입)를 통해 가입하면, profiles 테이블에 자동으로 PENDING 상태로 레코드가 생성됩니다.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, team, role_title, clearance, phone, avatar, status)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'name', 
    new.email, 
    new.raw_user_meta_data->>'team',
    new.raw_user_meta_data->>'roleTitle',
    new.raw_user_meta_data->>'clearance',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'avatar',
    'PENDING'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 5. 테스트용 최고관리자 계정 등록 방법
-- 회원가입 UI에서 admin@assembly.go.kr (또는 원하는 이메일)로 가입 후,
-- SQL Editor에서 아래 명령어를 실행하여 수동으로 권한을 부여하세요:
-- UPDATE public.profiles SET is_admin = true, status = 'APPROVED' WHERE email = 'admin@assembly.go.kr';
-- ==============================================================================

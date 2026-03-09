#!/bin/bash
# ============================================================
# DB Auction 원클릭 설치 스크립트
# 중학생도 할 수 있도록 설계됨
# ============================================================

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

clear
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    🏠 DB Auction 자동 설치 스크립트        ║${NC}"
echo -e "${BLUE}║    디지털뱅크(주) | dbauction.ai.kr        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}이 스크립트가 자동으로 처리하는 작업:${NC}"
echo "  ✅ .env 환경변수 파일 생성"
echo "  ✅ npm 패키지 설치"
echo "  ✅ 데이터베이스 스키마 동기화"
echo "  ✅ 샘플 데이터 추가"
echo "  ✅ GitHub 리포지토리 업로드"
echo "  ✅ Vercel 환경변수 목록 출력"
echo ""
echo -e "${CYAN}사용자가 해야 할 것: 3가지 정보 입력 + Vercel 버튼 1번 클릭${NC}"
echo ""
read -p "▶ 시작하려면 Enter를 누르세요..."
echo ""

# ──────────────────────────────────
# STEP 1: 프로젝트 폴더 확인
# ──────────────────────────────────
echo -e "${BOLD}[1/7] 프로젝트 폴더 확인...${NC}"
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ 오류: 이 스크립트는 프로젝트 폴더 안에서 실행해야 합니다.${NC}"
  echo -e "${YELLOW}실행 방법: cd ~/Downloads/dbauction && bash install.sh${NC}"
  exit 1
fi
echo -e "${GREEN}✓ 프로젝트 폴더 확인됨${NC}"
echo ""

# ──────────────────────────────────
# STEP 2: Supabase DATABASE_URL 입력
# ──────────────────────────────────
echo -e "${BOLD}[2/7] Supabase 데이터베이스 연결${NC}"
echo ""
echo -e "${YELLOW}📋 지금 해야 할 것:${NC}"
echo "  1. 브라우저에서 https://supabase.com/dashboard 열기"
echo "  2. 프로젝트 클릭 (ai-auction-db)"
echo "  3. 왼쪽 메뉴 하단 'Settings' 클릭"
echo "  4. 'Database' 클릭"
echo "  5. 'Connection string' 탭에서 'URI' 복사"
echo ""
echo -e "${CYAN}형식: postgresql://postgres.xxxx:비밀번호@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres${NC}"
echo ""
read -p "DATABASE_URL 붙여넣기: " DATABASE_URL
echo ""

if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ DATABASE_URL이 비어있습니다. 다시 실행해주세요.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ DATABASE_URL 입력됨${NC}"
echo ""

# ──────────────────────────────────
# STEP 3: .env 파일 자동 생성
# ──────────────────────────────────
echo -e "${BOLD}[3/7] 환경변수 파일 자동 생성...${NC}"
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

cat > .env << ENVEOF
DATABASE_URL="$DATABASE_URL"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
KAKAO_CLIENT_ID=""
KAKAO_CLIENT_SECRET=""
OPENAI_API_KEY=""
ENVEOF

# Vercel용 환경변수 파일 생성
cat > .env.vercel << VERCELEOF
DATABASE_URL=$DATABASE_URL
NEXTAUTH_URL=https://dbauction.ai.kr
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
GOOGLE_CLIENT_ID=나중에추가
GOOGLE_CLIENT_SECRET=나중에추가
KAKAO_CLIENT_ID=나중에추가
OPENAI_API_KEY=나중에추가
VERCELEOF

echo -e "${GREEN}✓ .env 파일 생성 완료${NC}"
echo -e "${GREEN}✓ .env.vercel 파일 생성 완료 (Vercel 설정 시 사용)${NC}"
echo ""

# ──────────────────────────────────
# STEP 4: npm 패키지 설치
# ──────────────────────────────────
echo -e "${BOLD}[4/7] npm 패키지 설치 중... (3-5분 소요)${NC}"
npm install --quiet 2>&1 | tail -5
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ npm install 실패. Node.js 버전 확인: node -v (18 이상 필요)${NC}"
  exit 1
fi
echo -e "${GREEN}✓ 패키지 설치 완료${NC}"
echo ""

# ──────────────────────────────────
# STEP 5: 데이터베이스 스키마 동기화
# ──────────────────────────────────
echo -e "${BOLD}[5/7] 데이터베이스 스키마 동기화...${NC}"
npx prisma generate > /dev/null 2>&1
npx prisma db push 2>&1 | tail -5

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ 데이터베이스 스키마 동기화 완료${NC}"
  echo -e "${CYAN}  (Supabase에 테이블들이 자동으로 생성되었습니다)${NC}"
else
  echo -e "${RED}❌ 데이터베이스 연결 실패. DATABASE_URL을 확인하세요.${NC}"
  echo -e "${YELLOW}  비밀번호에 특수문자(@, #, $ 등)가 있으면 URL 인코딩 필요${NC}"
  exit 1
fi
echo ""

# 샘플 데이터 추가
echo -e "${CYAN}  샘플 경매 데이터 추가 중...${NC}"
node prisma/seed.js > /dev/null 2>&1 && echo -e "${GREEN}  ✓ 샘플 데이터 5건 추가됨${NC}" || echo -e "${YELLOW}  ⚠ 샘플 데이터 추가 건너뜀 (이미 존재하거나 오류)${NC}"
echo ""

# ──────────────────────────────────
# STEP 6: GitHub 업로드
# ──────────────────────────────────
echo -e "${BOLD}[6/7] GitHub 업로드${NC}"
echo ""
echo -e "${YELLOW}📋 지금 해야 할 것 (GitHub에서):${NC}"
echo "  1. https://github.com/new 열기"
echo "  2. Repository name: ai-auction-platform"
echo "  3. Public 선택"
echo "  4. 'Create repository' 클릭"
echo "  5. Personal Access Token 없으면: https://github.com/settings/tokens"
echo "     → Generate new token (classic) → repo 체크 → 90 days → 생성 → 복사"
echo ""
read -p "GitHub 사용자명 입력 (예: jkb1011): " GITHUB_USER
read -p "GitHub Personal Access Token 입력 (ghp_로 시작): " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_USER" ] || [ -z "$GITHUB_TOKEN" ]; then
  echo -e "${YELLOW}⚠ GitHub 정보를 입력하지 않아 GitHub 업로드를 건너뜁니다.${NC}"
  echo -e "${YELLOW}  나중에 수동으로 업로드하려면 아래 명령어를 사용하세요:${NC}"
  echo "  git init && git add . && git commit -m 'Initial commit'"
  echo "  git remote add origin https://github.com/사용자명/ai-auction-platform.git"
  echo "  git push -u origin main"
  SKIP_GITHUB=true
else
  # Git 설정
  git config user.name "$GITHUB_USER" 2>/dev/null
  git config user.email "$GITHUB_USER@users.noreply.github.com" 2>/dev/null

  # .git 초기화 (없는 경우)
  if [ ! -d ".git" ]; then
    git init > /dev/null 2>&1
    echo -e "${GREEN}  ✓ Git 초기화${NC}"
  fi

  git add . > /dev/null 2>&1
  git commit -m "feat: DB Auction AI 경매 플랫폼 초기 배포" > /dev/null 2>&1
  git branch -M main > /dev/null 2>&1

  REPO_URL="https://$GITHUB_USER:$GITHUB_TOKEN@github.com/$GITHUB_USER/ai-auction-platform.git"
  git remote remove origin > /dev/null 2>&1
  git remote add origin "$REPO_URL" > /dev/null 2>&1

  echo -e "${CYAN}  GitHub에 업로드 중...${NC}"
  git push -u origin main 2>&1

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ GitHub 업로드 완료!${NC}"
    echo -e "${GREEN}  📦 https://github.com/$GITHUB_USER/ai-auction-platform${NC}"
    REPO_UPLOADED=true
  else
    echo -e "${RED}❌ GitHub 업로드 실패${NC}"
    echo -e "${YELLOW}  Token의 'repo' 권한을 확인하고 다시 시도하세요${NC}"
  fi
fi
echo ""

# ──────────────────────────────────
# STEP 7: 완료 및 Vercel 안내
# ──────────────────────────────────
echo -e "${BOLD}[7/7] 완료 및 Vercel 배포 안내${NC}"
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ 자동 설치 완료!                         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}🖥️  로컬 테스트:${NC}"
echo "  npm run dev"
echo "  → 브라우저에서 http://localhost:3000 열기"
echo ""
echo -e "${YELLOW}🌐 Vercel 배포 (마지막 단계 - 2분):${NC}"
echo ""
echo "  1. https://vercel.com/dashboard 접속"
echo "  2. 'Add New' → 'Project' 클릭"
if [ "$REPO_UPLOADED" = true ]; then
  echo "  3. 'ai-auction-platform' 리포지토리 → 'Import' 클릭"
else
  echo "  3. GitHub 리포지토리를 먼저 업로드한 후 Import 클릭"
fi
echo "  4. 환경변수 추가 (아래 복사해서 붙여넣기):"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "Vercel 환경변수 (.env.vercel 파일에도 저장됨):"
echo ""
cat .env.vercel
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  5. 'Deploy' 버튼 클릭 → 3-5분 대기 → 배포 완료!"
echo ""
echo -e "${YELLOW}🔗 도메인 연결:${NC}"
echo "  Vercel → Settings → Domains → dbauction.ai.kr 추가"
echo "  DNS: CNAME @ → cname.vercel-dns.com"
echo ""
echo -e "${GREEN}📞 문의: 010-4000-4383 | jkb1011@hanmail.net${NC}"
echo ""
echo -e "${BLUE}배포 성공을 기원합니다! 🚀${NC}"

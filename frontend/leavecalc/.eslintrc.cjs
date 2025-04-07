// .eslintrc.cjs

module.exports = {
  // 이 설정 파일을 프로젝트 루트로 지정 (다른 설정 무시하고 이걸 기준으로 적용)
  root: true,

  // 코드가 실행되는 환경 설정 (브라우저, 최신 JS 문법 허용)
  env: {
    browser: true,
    es2020: true,
  },

  // ESLint 규칙 세트 확장
  extends: [
    'eslint:recommended', // 기본 JS 오류 방지 룰
    'plugin:@typescript-eslint/recommended', // TypeScript용 추천 룰
    'plugin:react-hooks/recommended', // React Hook 관련 규칙 (useEffect 등)
    'plugin:import/recommended', // import 문법 검사 (순서, 존재 여부 등)
    'prettier', // Prettier와 충돌나는 규칙 비활성화
  ],

  // 린트 대상에서 제외할 파일/폴더
  ignorePatterns: [
    'dist', // 빌드 결과물
    '.eslintrc.cjs', // 자기 자신 무시 (선택)
  ],

  // TypeScript 문법 파싱을 위해 설정
  parser: '@typescript-eslint/parser',

  // ESLint에서 사용할 플러그인
  plugins: [
    'react-refresh', // React Fast Refresh(HMR) 관련 규칙
  ],

  // 커스텀 규칙
  rules: {
    // Fast Refresh 시 문제가 될 수 있는 export 제한
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // import 순서 정리 (가독성 + 유지보수 편의)
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['parent', 'sibling'], 'index'], // 그룹 순서 정의
        pathGroups: [
          {
            pattern: 'react*', // React 관련 import는 제일 위에
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@/pages/*', // 내부 경로에 대한 커스텀 그룹
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@/components/*',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@/hooks/*',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: 'src/**', // 일반 src 내부 경로
            group: 'internal',
          },
        ],
        alphabetize: {
          order: 'asc', // 알파벳 순으로 정렬
          caseInsensitive: true, // 대소문자 구분 없이 정렬
        },
        'newlines-between': 'always', // 그룹 간에 한 줄 띄우기
      },
    ],
  },

  // import 경로 해석을 위한 설정 (TypeScript alias 지원)
  settings: {
    'import/resolver': {
      typescript: {}, // tsconfig.json 기반 경로 인식
      node: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'], // 인식할 확장자
      },
    },
  },
};

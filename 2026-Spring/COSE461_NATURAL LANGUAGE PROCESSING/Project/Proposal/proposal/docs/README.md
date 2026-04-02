# Proposal Slide Markdown Format

이 폴더에 `.md` 파일을 넣으면 앱이 첫 번째 파일(이름순)을 읽어 슬라이드 내용을 채웁니다.

## 규칙

- 메타데이터는 파일 맨 위에 `key: value` 형식으로 작성
- 슬라이드 섹션은 `## Hero`, `## About`, `## Portfolio`, `## Testimonial`, `## Contact`
- 리스트 값은 `- item` 형태로 작성

## 예시 키

- meta
  - `deck_title`
  - `presenter`
  - `affiliation`
  - `date`
- `## Hero`
  - `topic`, `subtitle`, `highlight`, `keywords`
- `## About`
  - `problem`, `gap`, `objectives`
- `## Portfolio`
  - `method_overview`, `modules`, `datasets`, `images`
- `## Testimonial`
  - `hypothesis`, `contributions`, `metrics`
- `## Contact`
  - `timeline`, `references`, `contact_email`

기본 샘플은 `sample-proposal.md`를 참고하세요.

## 특정 문서 선택

기본은 파일명 정렬 기준 첫 번째 `.md`를 읽습니다.  
원하는 파일을 지정하려면 URL 쿼리를 사용하세요.

- 예시: `http://localhost:3000?doc=sample-proposal.md`
- 보안상 허용 문자: 영문/숫자/`.`, `_`, `-`

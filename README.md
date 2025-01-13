# KEEV_Admin

공연에 대한 기록을 남기고, 같은 공연을 본 사람들과 소통을 할 수 있는 커뮤니티 서비스 "KEEV"에 데이터를 추가할 수 있도록 만든 관리자 웹사이트 입니다.

![](사진)

## Feature

### Create

- **공연 종류 추가** : 콘서트, 페스티벌 등 공연의 유형을 추가합니다.
- **공연이 열리는 나라 추가** : 공연이 개최되는 나라를 추가합니다.
- **공연 장르 추가** : 팝, 락 등 공연의 장르를 추가합니다.
- **공연 장소 추가** : 공연이 열리는 장소의 이름, 주소, 나라 등을 추가합니다.
- **공연하는 아티스트 추가** : 공연을 하는 아티스트의 이름, 국적, 프로필 사진 등을 추가합니다.
- **공연 추가** : 위의 추가된 내용을 바탕으로 공연을 추가합니다.

### Read

- **공연 리스트 확인** : 등록한 공연들을 볼 수 있습니다.
- **공연 검색** : 등록된 공연 중 원하는 공연을 검색할 수 있습니다.

### Update

- **공연 수정** : 등록된 공연을 수정할 수 있습니다.

### Delete

- **공연 삭제** : 등록된 공연을 삭제할 수 있습니다.

<br>

## Stack

### Language & Framework

<div>
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white">
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<div>

### Main Library

<div>
<img src="https://img.shields.io/badge/react router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white">
<img src="https://img.shields.io/badge/react query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white">
<div>

### Networking & Deploy

<div>
<img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
<img src="https://img.shields.io/badge/amazon ec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
<div>

## Project Structure

```
...
├── public/
│   ├── favicon.ico # 아이콘 파일
│   └── index.html # HTML 템플릿 파일
│
├── src/
│   ├── App.css # 메인 에플리케이션 css 파일
│   ├── App.tsx # 메인 에플리케이션 파일
│   ├── apis/ # 서버와의 통신 api
│   ├── assets/ # 이미지
│   ├── components/ # 재사용이 가능한 공통 컴포넌트
│   ├── hooks/ # 커스텀 훅
│   ├── index.css # 전역 css 파일
│   ├── index.tsx # 엔트리 포인트 파일
│   ├── layout/ # 에플리케이션 레이 아웃
│   ├── pages/ # 각 도메인별 컴포넌트
│   ├── routers/ # 라우터
│   ├── styles/ # css
│   └── types/ # 공통 타입
│
├── package.json # 프로젝트 종속성 및 스크립트 정의
├── tsconfig.json
├── yarn.lock
...
```

## 개발 환경 설정

```sh
npm install
yarn
```

## 실행

```sh
npm run start
```

## 빌드

```sh
npm run build
```

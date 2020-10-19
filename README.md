# Custom Calendar

## Props

---

1. ### styles

   | style명          | 설명                       |
   | ---------------- | -------------------------- |
   | wrapperContainer | 최상위 컨테이너(View)      |
   | monthContainer   | 월별 컨테이터(View)        |
   | headerContainer  | 헤더(년/월) 컨테이너(View) |
   | headerText       | 헤더(년/월) 텍스트(Text)   |
   | weekContainer    | 요일 컨테이너              |
   | weekView         | 요일 텍스트 컨테이너       |
   | weekText         | 요일 텍스트                |
   | weekSunday       | 일요일 텍스트              |
   | dayContainer     | 날짜 영역 컨테이너(View)   |
   | dateSunday       | 일요일 텍스트              |
   | dateSaturday     | 토요일 텍스트              |
   | dateView         | 날짜 텍스트 컨테이너       |
   | dateText         | 날짜 텍스트                |
   | dateSelected     | 날짜 선택시                |
   | dateSelectedText | 날짜 선택시 텍스트         |
   | dateDisabled     | 날짜 비활성화시 텍스트     |
   | dateToday        | 오늘 날짜 텍스트           |

---

2. ### EventDatas
   날짜 텍스트 히단의 이벤트 react element
   {
   date : 이벤트 날짜,
   children : rendering react element
   }

---

3. ### onSelectDate: (date: number) => void
   날짜 선택시 press event

---

3. ### onChangeMonth: (month: number) => void
   달 변경시 event

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
   | dayContainer     | 날짜 영역 컨테이너(View)   |
   | weekContainer    | 요일 컨테이너              |
   | weekView         | 요일 텍스트 컨테이너       |
   | weekText         | 요일 텍스트                |
   | dateSunday       | 일요일 텍스트              |
   | dateSaturday     | 토요일 텍스트              |
   | dateView         | 날짜 텍스트 컨테이너       |
   | dateText         | 날짜 텍스트                |
   | dateSelected     | 날짜 선택시 텍스트         |
   | dateDisabled     | 날짜 비활성화시 텍스트     |
   | dateToday        | 오늘 날짜 텍스트           |

---

2. ### renderIndividualHeader
   날짜 텍스트 상단의 부가적인 react element

---

3. ### renderIndividualFooter
   날짜 텍스트 상단의 부가적인 react element

---

4. ### onSelectDate: (date: number) => void
   날짜 선택시 press event

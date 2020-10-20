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

2. ### date

   선택된 날짜 (datepicker 여부에 따라 삭제 할수도 있음..)

---

3. ### EventDatas

   날짜 텍스트 히단의 이벤트 react element

   ```java
   EventDatas : {

         date   // 이벤트 날짜 : Date,
         children : // 이벤트가 있을 경우, rendering할 react element

   }[]
   ```

---

4.  ### childrenDatas

    날짜 이외의 rendering 할 react element

    ```java
    childrenDatas : {

          date   // 해당 날짜 : Date,
          children : // 해당 날짜의 경우, rendering할 react element

    }[]
    ```

---

5. ### renderSelected : ReactNode

   선택된 날짜에 render 할 ReactNode

   ```java
   renderSelected :<ReactElement> = <View></View>
   ```

---

6. ### onSelectDate

   특정 날짜 onPress시

   ```java
   onSelectDate :  (date: number) => void
   ```

---

7. ### onChangedDate

   날짜 변경시 event

   ```java
   onChangeMonth : (date: Date) => void
   ```

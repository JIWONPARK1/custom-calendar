import React, { PropsWithChildren, ReactElement, ReactNode } from "react";
import { FlatList, View } from "react-native";
import Dates from "./Dates";

interface Props {
  styles: any;
  defaultStyles: any;

  displayDate: Date;
  selectedDate: Date;

  selectedComponent: ReactNode;

  EventDatas?: { date: Date; children: ReactNode }[];
  childrenDatas?: { date: Date; children: ReactNode }[];

  onSelectedDate: (date: Date) => void;
}

export default function Calendar({
  styles,
  defaultStyles,
  displayDate,
  selectedDate,
  EventDatas,
  childrenDatas,
  selectedComponent,
  onSelectedDate,
}: PropsWithChildren<Props>) {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const lastDate = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const lastWeekday = new Date(year, month, lastDate).getDay();
  const calendarDates = [];

  //  이전달 날짜 가져오기

  for (let idx = 0; idx < firstWeekday; idx++) {
    const date = new Date(year, month, 0);
    date.setDate(date.getDate() - idx);
    calendarDates.unshift({ date, isDisabled: true });
  }

  // 현재달 날짜 가져오기

  for (let idx = 0; idx < lastDate; idx++) {
    calendarDates.push({
      date: new Date(year, month, idx + 1),
    });
  }

  // 다음달 날짜 가져오기

  for (let idx = 1; idx <= 6 - lastWeekday; idx++) {
    calendarDates.push({
      date: new Date(year, month + 1, idx),
      isDisabled: true,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        numColumns={7}
        data={calendarDates}
        keyExtractor={(item, id): string => id.toString()}
        style={styles && styles.dayContainer}
        renderItem={({ item }) => (
          <Dates
            styles={styles}
            displayDate={item.date}
            EventDatas={EventDatas}
            selectedDate={selectedDate}
            isDisabled={item.isDisabled || false}
            defaultStyles={defaultStyles}
            childrenDatas={childrenDatas}
            onSelectedDate={onSelectedDate}
            selectedComponent={selectedComponent}
          />
        )}
      />
    </View>
  );
}

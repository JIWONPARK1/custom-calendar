import React, { PropsWithChildren, ReactElement, ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  styles: any;
  defaultStyles: any;

  displayDate: Date;
  selectedDate: Date;

  isDisabled: boolean;
  onSelectedDate: (date: Date) => void;
  EventDatas?: { date: Date; children: ReactNode }[];
  childrenDatas?: { date: Date; children: ReactNode }[];
  selectedComponent: ReactNode;
}

export default function Dates({
  displayDate,
  selectedDate,
  isDisabled,
  styles,
  defaultStyles,
  EventDatas,
  childrenDatas,
  selectedComponent,
  onSelectedDate,
}: PropsWithChildren<Props>) {
  const currentYear = displayDate.getFullYear();
  const currentMonth = displayDate.getMonth();
  const currentDate = displayDate.getDate();

  const today: Date = new Date();

  const isSelected =
    selectedDate.getFullYear() === currentYear &&
    selectedDate.getMonth() === currentMonth &&
    selectedDate.getDate() === currentDate &&
    !isDisabled;

  const isToday =
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth &&
    today.getDate() === currentDate;

  const isSunday = displayDate.getDay() === 0;

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={isDisabled}
      style={[
        defaultStyles.dateView,
        styles && styles.dateView,
        isSelected && [
          defaultStyles.selectedDate,
          styles && styles.dateSelected,
        ],
      ]}
      onPress={() => onSelectedDate(displayDate)}
    >
      <Text
        style={[
          defaultStyles.dateText,
          styles.dateText,
          isToday && [defaultStyles.dateToday, styles.dateToday],
          isSunday && styles.dateSunday,
          isSelected && [styles && styles.dateSelectedText],
          isDisabled && [defaultStyles.dateDisabled, styles.dateDisabled],
        ]}
      >
        {displayDate.getDate()}
      </Text>

      {/* childrenDatas 있을 경우 ReactElement  렌더링*/}
      {childrenDatas &&
        childrenDatas.map(({ date, children }) => {
          if (date.getDate() == currentDate) {
            return children;
          }
        })}

      {/* EventDatas가 있을 경우 ReactElement 렌더링 */}
      {EventDatas &&
        EventDatas.map(({ date, children }) => {
          if (
            date.getFullYear() == currentYear &&
            date.getMonth() === currentMonth &&
            date.getDate() == currentDate
          ) {
            return children;
          }
        })}

      {/* selected됬을때 ReactElement  렌더링*/}

      {isSelected && selectedComponent}
    </TouchableOpacity>
  );
}

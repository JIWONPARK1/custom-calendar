import React, { ReactNode, PropsWithChildren, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from "react-native";

const defaultStyles = StyleSheet.create({
  wrapperContainer: {
    width: "100%",
  },
  monthContainer: {
    flexDirection: "row",
  },
  headerContainer: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
  weekView: {
    justifyContent: "center",
    alignItems: "center",
  },
  dateView: {
    width: 47,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    color: "#222",
  },
  dateDisabled: {
    opacity: 0.3,
  },
  selectedDate: {
    borderWidth: 1,
    borderColor: "#b59073",
  },
  selectedDateText: {
    color: "#b59073",
  },
  dateToday: {
    fontWeight: "bold",
  },
});

interface CalendarProps {
  //style
  styles?: any;
  date?: Date;

  //children
  renderSelected: ReactNode;
  EventDatas?: { date: Date; children: ReactNode }[];
  childrenDatas?: { date: Date; children: ReactNode }[];

  //event
  onSelectDate?: (date: number) => void;
  onChangedDate?: (date: Date) => void;
}

export default function Calendar({
  date = new Date(),
  styles,
  EventDatas,
  childrenDatas,
  onSelectDate,
  onChangedDate,
  renderSelected,
}: PropsWithChildren<CalendarProps>) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [layoutWidth, serLayoutWidth] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<Date>(date);
  const scrollRef = useRef<ScrollView>(null);
  const prevMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() - 1,
    currentMonth.getDate()
  );
  const nextMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    currentMonth.getDate()
  );

  const displayYear = currentMonth.getFullYear();
  const displayMonth = currentMonth.toLocaleString("default", {
    month: "long",
  });

  {
    /* scrollView 가운데 정렬 함수 */
  }

  const scrollToMiddle = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: Math.floor(layoutWidth),
        animated: false,
      });
    }
  };

  {
    /* 스와이프시 함수 */
  }

  const handleSwipe = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xValue = Math.floor(e.nativeEvent.contentOffset.x);
    const maxLayoutFloor = Math.floor(layoutWidth) * 2;

    if (!layoutWidth || layoutWidth === 1) return;

    if (xValue === 0) {
      if (scrollRef && scrollRef.current) {
        scrollToMiddle();
        setCurrentMonth(prevMonth);
      }
    } else if (xValue === maxLayoutFloor) {
      if (scrollRef && scrollRef.current) {
        scrollToMiddle();
        setCurrentMonth(nextMonth);
      }
    }
  };

  {
    /* 날짜 선택시 함수 */
  }

  const handleSelectedDate = ({ date }: any) => {
    setSelectedDate(date);
    onSelectDate && onSelectDate(date);
  };

  {
    /* 요일 가져오는 함수 */
  }

  const renderCalendarWeekdays = () => {
    const weekdays = [];
    for (let idx = 0; idx < 7; idx++) {
      const month = new Date(2020, 5, idx);
      weekdays.push(month.toLocaleString("default", { weekday: "short" }));
    }
    return (
      <FlatList
        scrollEnabled={false}
        data={weekdays}
        numColumns={7}
        keyExtractor={(item, id): string => id.toString()}
        style={styles && styles.weekContainer}
        renderItem={({ item, index }: any) => {
          return (
            <View style={[defaultStyles.weekView, styles && styles.weekView]}>
              <Text
                style={[
                  styles && styles.weekText,
                  index === 0 && styles.sundayText,
                ]}
              >
                {item}
              </Text>
            </View>
          );
        }}
      />
    );
  };

  {
    /* 3개 캘린더 렌더링 함수(이전달/현재달/다음달) */
  }
  const renderCalendars = () => {
    {
      /**한달 캘린더 rendering */
    }
    const renderCalendar = (displayDate: Date) => {
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
        <View>
          <FlatList
            numColumns={7}
            data={calendarDates}
            keyExtractor={(item, id): string => id.toString()}
            style={styles && styles.dayContainer}
            renderItem={renderDate}
          />
        </View>
      );
    };

    {
      /* 개별 날짜 렌더링 함수 */
    }

    const renderDate = ({ item }: any) => {
      const currentYear = item.date.getFullYear();
      const currentMonth = item.date.getMonth();
      const currentDate = item.date.getDate();

      const today = new Date();

      const isSelected =
        selectedDate.getFullYear() === currentYear &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getDate() === currentDate &&
        !item.isDisabled;

      const isToday =
        today.getFullYear() === currentYear &&
        today.getMonth() === currentMonth &&
        today.getDate() === currentDate;

      const isSunday = item.date.getDay() === 0;

      return (
        <TouchableOpacity
          activeOpacity={1}
          disabled={item.isDisabled}
          style={[
            defaultStyles.dateView,
            styles && styles.dateView,
            isSelected && [
              defaultStyles.selectedDate,
              styles && styles.dateSelected,
            ],
          ]}
          onPress={() => handleSelectedDate(item)}
        >
          <Text
            style={[
              defaultStyles.dateText,
              styles.dateText,
              item.isDisabled && defaultStyles.dateDisabled,
              isToday && [defaultStyles.dateToday, styles.dateToday],
              isSunday && styles.dateSunday,
            ]}
          >
            {item.date.getDate()}
          </Text>

          {/* childrenDatas 있을 경우 ReactElement  렌더링*/}
          {childrenDatas &&
            childrenDatas.map(({ date, children }) => {
              if (
                date.getFullYear() == currentYear &&
                date.getMonth() === currentMonth &&
                date.getDate() == currentDate
              ) {
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

          {isSelected && renderSelected && renderSelected}
        </TouchableOpacity>
      );
    };

    // 3개 캘린더 rendering(이전달/현재달/다음달)
    return (
      <View
        style={[defaultStyles.monthContainer, styles && styles.monthContainer]}
      >
        {renderCalendar(prevMonth)}
        {renderCalendar(currentMonth)}
        {renderCalendar(nextMonth)}
      </View>
    );
  };

  scrollToMiddle();

  return (
    <SafeAreaView
      style={[
        defaultStyles.wrapperContainer,
        styles && styles.wrapperContainer,
      ]}
      onLayout={(e): any => {
        serLayoutWidth(e.nativeEvent.layout.width);
        scrollToMiddle();
      }}
    >
      <View
        style={[
          defaultStyles.headerContainer,
          styles && styles.headerContainer,
        ]}
      >
        <Text style={[defaultStyles.headerText, styles && styles.headerText]}>
          {displayYear} {displayMonth}
        </Text>
      </View>
      {renderCalendarWeekdays()}
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleSwipe}
      >
        {renderCalendars()}
      </ScrollView>
    </SafeAreaView>
  );
}

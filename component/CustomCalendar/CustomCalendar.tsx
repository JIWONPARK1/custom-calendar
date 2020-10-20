import React, {
  ReactNode,
  PropsWithChildren,
  useState,
  useRef,
  ReactElement,
} from "react";
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
import Calendar from "./Calendar";

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

interface Props {
  //style
  styles?: any;
  date?: Date;

  //children
  selectedComponent: ReactElement;
  EventDatas?: { date: Date; children: ReactNode }[];
  childrenDatas?: { date: Date; children: ReactNode }[];

  //event
  onSelectDate?: (date: Date) => void;
  onChangedDate?: (date: Date) => void;
}

export default function CustomCalendar({
  date = new Date(),
  styles,
  EventDatas,
  childrenDatas,
  onSelectDate,
  onChangedDate,
  selectedComponent,
}: PropsWithChildren<Props>) {
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
        setCurrentMonth(prevMonth);
        scrollToMiddle();
      }
    } else if (xValue === maxLayoutFloor) {
      if (scrollRef && scrollRef.current) {
        setCurrentMonth(nextMonth);
        scrollToMiddle();
      }
    }
  };

  {
    /* 날짜 선택시 함수 */
  }

  const handleSelectedDate = (date: Date) => {
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
    return (
      <View
        style={[defaultStyles.monthContainer, styles && styles.monthContainer]}
      >
        <Calendar
          styles={styles}
          defaultStyles={defaultStyles}
          displayDate={prevMonth}
          selectedDate={selectedDate}
          EventDatas={EventDatas}
          childrenDatas={childrenDatas}
          selectedComponent={selectedComponent}
          onSelectedDate={handleSelectedDate}
        />
        <Calendar
          styles={styles}
          defaultStyles={defaultStyles}
          displayDate={currentMonth}
          selectedDate={selectedDate}
          EventDatas={EventDatas}
          childrenDatas={childrenDatas}
          selectedComponent={selectedComponent}
          onSelectedDate={handleSelectedDate}
        />
        <Calendar
          styles={styles}
          defaultStyles={defaultStyles}
          displayDate={nextMonth}
          selectedDate={selectedDate}
          EventDatas={EventDatas}
          childrenDatas={childrenDatas}
          selectedComponent={selectedComponent}
          onSelectedDate={handleSelectedDate}
        />
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

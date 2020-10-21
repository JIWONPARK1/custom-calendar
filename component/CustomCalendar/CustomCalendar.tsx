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
import Calendar from "./Calendar";
import Day from "./Day";
import MonthPicker from "react-native-month-year-picker";

const defaultStyles = StyleSheet.create({
  wrapperContainer: {
    width: "100%",
  },
  monthContainer: {
    flexDirection: "row",
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
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
  monthPickerText: {
    marginLeft: 10,
    marginTop: 5,
  },
});

interface Props {
  //style
  styles?: any;
  date?: Date;

  //monthpicker
  hasMonthPicker?: boolean;
  monthPickerIcon?: ReactNode;

  //children
  selectedComponent: ReactNode;
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
  hasMonthPicker,
  monthPickerIcon,
  selectedComponent,
}: PropsWithChildren<Props>) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [layoutWidth, serLayoutWidth] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<Date>(date);
  const [isShowPicker, setIsShowPicker] = useState<boolean>(false);
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
  const months = [prevMonth, currentMonth, nextMonth];

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
      setCurrentMonth(prevMonth);
      scrollToMiddle();
      onChangedDate && onChangedDate(prevMonth);
    }
    if (xValue === maxLayoutFloor) {
      setCurrentMonth(nextMonth);
      scrollToMiddle();
      onChangedDate && onChangedDate(nextMonth);
    }
  };

  {
    /* 날짜 선택시 함수 */
  }

  const handleSelectedDate = (date: Date) => {
    setSelectedDate(date);
    onSelectDate && onSelectDate(date);
  };

  const onDateChange = (action: any, date: Date) => {
    setIsShowPicker(false);
    if (action !== "dismissedAction") {
      setCurrentMonth(date);
      scrollToMiddle();
      onChangedDate && onChangedDate(date);
    }
  };

  {
    /* 3개 캘린더 렌더링 함수(이전달/현재달/다음달) */
  }

  scrollToMiddle();

  return (
    <SafeAreaView
      style={[
        defaultStyles.wrapperContainer,
        styles && styles.wrapperContainer,
      ]}
      onLayout={(e): any => {
        serLayoutWidth(e.nativeEvent.layout.width);
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
        {hasMonthPicker && (
          <TouchableOpacity
            onPress={() => {
              setIsShowPicker(true);
            }}
          >
            {monthPickerIcon ? (
              monthPickerIcon
            ) : (
              <Text style={defaultStyles.monthPickerText}>∨</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      <Day styles={styles} defaultStyles={defaultStyles} />
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        scrollEventThrottle={1}
        onMomentumScrollEnd={handleSwipe}
      >
        <View
          style={[
            defaultStyles.monthContainer,
            styles && styles.monthContainer,
          ]}
        >
          <FlatList
            data={months}
            horizontal
            keyExtractor={(item, id): string => id.toString()}
            renderItem={({ item }) => (
              <Calendar
                styles={styles}
                defaultStyles={defaultStyles}
                displayDate={item}
                selectedDate={selectedDate}
                EventDatas={EventDatas}
                childrenDatas={childrenDatas}
                selectedComponent={selectedComponent}
                onSelectedDate={handleSelectedDate}
              />
            )}
          />
        </View>
      </ScrollView>
      {isShowPicker && (
        <MonthPicker
          value={currentMonth}
          minimumDate={new Date(1900)}
          maximumDate={new Date(2100, 5)}
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
}

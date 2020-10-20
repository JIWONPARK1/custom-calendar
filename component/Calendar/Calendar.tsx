import React, { Component, ReactNode } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
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

interface CalendarState {
  selectedDate: Date;
  layoutWidth: number;

  currentMonth: Date;

  date: Date;
}

interface CalendarProps {
  //style
  styles?: any;

  //children

  EventDatas?: { date: number; children: ReactNode }[];
  childrenDatas?: { date: number; children: ReactNode }[];

  //event
  selectedDate?: Date;
  onSelectDate?: (date: number) => void;
  onChangeMonth?: (date: Date) => void;
}

export default class Calendar extends Component<CalendarProps, CalendarState> {
  scrollRef: any;

  constructor(props: any) {
    super(props);
    this.state = {
      date: new Date(),
      selectedDate: new Date(),
      layoutWidth: 0,
      currentMonth: new Date(),
    };
    this.scrollRef = React.createRef();
  }

  componentDidMount = () => {
    const { selectedDate } = this.props;
    if (selectedDate) {
      this.setState({
        selectedDate,
      });
    }
  };

  private handleSelectedDate = ({ date }: any) => {
    const { onSelectDate } = this.props;
    this.setState(
      {
        selectedDate: date,
      },
      () => {
        onSelectDate && onSelectDate(date);
      }
    );
  };

  private handleSwipe = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutWidth, currentMonth } = this.state;
    const { onChangeMonth } = this.props;

    if (!layoutWidth || layoutWidth === 1) return;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = currentMonth.getDate();

    const valueX = Math.floor(e.nativeEvent.contentOffset.x);
    const maxLayoutWidth = Math.floor(layoutWidth) * 2;

    const prevMonth = new Date(year, month - 1, date);
    const nextMonth = new Date(year, month + 1, date);

    if (valueX === 0) {
      this.setState(
        {
          currentMonth: prevMonth,
        },
        () => {
          this.scrollToMiddle();
          onChangeMonth && onChangeMonth(prevMonth);
        }
      );
    } else if (valueX === maxLayoutWidth) {
      this.setState(
        {
          currentMonth: nextMonth,
        },
        () => {
          this.scrollToMiddle();
          onChangeMonth && onChangeMonth(nextMonth);
        }
      );
    }
  };

  private scrollToMiddle = () => {
    const { layoutWidth } = this.state;
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollTo({
        duration: 500,
        x: Math.floor(layoutWidth),
        animated: false,
      });
    }
  };

  private renderCalendarWeekdays = () => {
    const { styles } = this.props;

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

  private renderCalendar = (displayDate: Date) => {
    const { styles } = this.props;
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    const lastDate = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();
    const lastWeekday = new Date(year, month, lastDate).getDay();
    const calendarDates = [];

    //get Prev month dates

    for (let idx = 0; idx < firstWeekday; idx++) {
      const date = new Date(year, month, 0);
      date.setDate(date.getDate() - idx);
      calendarDates.unshift({ date, isDisabled: true });
    }

    // get current month dates

    for (let idx = 0; idx < lastDate; idx++) {
      calendarDates.push({
        date: new Date(year, month, idx + 1),
      });
    }

    //get next month dates

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
          renderItem={this.renderDate}
        />
      </View>
    );
  };

  private renderDate = ({ item }: any) => {
    const { selectedDate } = this.state;
    const { styles, childrenDatas, EventDatas } = this.props;

    const year = item.date.getFullYear();
    const month = item.date.getMonth();
    const date = item.date.getDate();

    const today = new Date();

    const isSelected =
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === date &&
      !item.isDisabled;

    const isToday =
      today.getFullYear() === year &&
      today.getDate() === date &&
      today.getMonth() === month;

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
        onPress={() => this.handleSelectedDate(item)}
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
        {childrenDatas &&
          childrenDatas.map(({ date, children }) => {
            if (date == item.date.getDate()) {
              return children;
            }
          })}
        {EventDatas &&
          !item.isDisabled &&
          EventDatas.map(({ date, children }) => {
            if (date == item.date.getDate()) {
              return children;
            }
          })}
        {isSelected && (
          <View
            style={{
              width: "100%",
              height: "100%",
              borderWidth: 1,
              borderColor: "#c59f82",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          ></View>
        )}
      </TouchableOpacity>
    );
  };

  private renderCalendars = () => {
    const { date, currentMonth } = this.state;
    const { styles } = this.props;

    const prevMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      date.getDate()
    );
    const nextMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );

    return (
      <View
        style={[defaultStyles.monthContainer, styles && styles.monthContainer]}
      >
        {this.renderCalendar(prevMonth)}
        {this.renderCalendar(currentMonth)}
        {this.renderCalendar(nextMonth)}
      </View>
    );
  };

  render() {
    const { layoutWidth, currentMonth } = this.state;
    const { styles } = this.props;

    const displayYear = currentMonth.getFullYear();
    const displayMonth = currentMonth.toLocaleString("default", {
      month: "long",
    });

    return (
      <SafeAreaView
        style={[
          defaultStyles.wrapperContainer,
          styles && styles.wrapperContainer,
        ]}
        onLayout={(e): any => {
          this.setState(
            {
              layoutWidth: e.nativeEvent.layout.width,
            },
            () => {
              this.scrollToMiddle();
            }
          );
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
        {this.renderCalendarWeekdays()}
        <ScrollView
          horizontal
          pagingEnabled
          ref={this.scrollRef}
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          contentOffset={{ x: layoutWidth, y: 0 }}
          onMomentumScrollEnd={this.handleSwipe}
        >
          {this.renderCalendars()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

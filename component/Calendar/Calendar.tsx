import React, { Component, ReactElement, ReactNode } from "react";
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
  Image,
  Dimensions,
} from "react-native";

interface CalendarState {
  SelectedDate: Date;
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
  onSelectDate?: (date: number) => void;
  onChangeMonth?: (date: Date) => void;
}

export default class Calendar extends Component<CalendarProps, CalendarState> {
  scrollRef: any;

  styles = StyleSheet.create({
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
    defaultWeekView: {
      justifyContent: "center",
      alignItems: "center",
    },
    defaultDateView: {
      width: 47,
      height: 47,
      justifyContent: "center",
      alignItems: "center",
    },
    defaultDateText: {
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

  constructor(props: any) {
    super(props);
    this.state = {
      date: new Date(),
      SelectedDate: new Date(),
      layoutWidth: 0,
      currentMonth: new Date(),
    };
    this.scrollRef = React.createRef();
  }

  componentDidMount = () => {};

  private handleSelectedDate = ({ date }: any) => {
    const { onSelectDate } = this.props;
    this.setState(
      {
        SelectedDate: date,
      },
      () => {
        onSelectDate && onSelectDate(date);
      }
    );
  };

  private handleSwipe = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutWidth, currentMonth } = this.state;
    const { onChangeMonth } = this.props;

    const valueX = Math.floor(e.nativeEvent.contentOffset.x);
    const maxLayoutWidth = Math.floor(layoutWidth) * 2;

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

    if (!layoutWidth || layoutWidth === 1) return;
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
            <View
              style={[this.styles.defaultWeekView, styles && styles.weekView]}
            >
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

  private renderCalendar = (month: Date) => {
    const { styles } = this.props;
    const currentYear = month.getFullYear();
    const currentMonth = month.getMonth();

    const calendarDates = [];

    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstWeekday = new Date(currentYear, currentMonth, 1).getDay();
    const lastWeekday = new Date(currentYear, currentMonth, lastDate).getDay();

    //get Prev month dates

    const prevDates = [];

    for (let idx = 0; idx < firstWeekday; idx++) {
      const date = new Date(currentYear, currentMonth - 1, 0);
      date.setDate(date.getDate() - idx);
      calendarDates.unshift({ date, isDisabled: true });
    }

    // get current month dates

    for (let idx = 0; idx < lastDate; idx++) {
      calendarDates.push({
        date: new Date(currentYear, currentMonth, idx + 1),
      });
    }

    //get next month dates

    for (let idx = 1; idx <= 6 - lastWeekday; idx++) {
      calendarDates.push({
        date: new Date(currentYear, currentMonth + 1, idx),
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
    const { SelectedDate } = this.state;
    const { styles, childrenDatas, EventDatas } = this.props;

    const isSelected =
      SelectedDate.getDate() === item.date.getDate() &&
      SelectedDate.getMonth() === item.date.getMonth() &&
      !item.isDisabled;

    const isToday =
      new Date().getDate() === item.date.getDate() &&
      new Date().getMonth() - 1 === item.date.getMonth();
    const isSunday = item.date.getDay() === 0;

    return (
      <TouchableOpacity
        activeOpacity={1}
        disabled={item.isDisabled}
        style={[
          this.styles.defaultDateView,
          styles && styles.dateView,
          isSelected && [
            this.styles.selectedDate,
            styles && styles.dateSelected,
          ],
        ]}
        onPress={() => this.handleSelectedDate(item)}
      >
        <Text
          style={[
            this.styles.defaultDateText,
            styles.dateText,
            item.isDisabled && this.styles.dateDisabled,
            isSelected &&
              this.styles.selectedDateText &&
              styles &&
              styles.dateSelected,
            ,
            isToday && [this.styles.dateToday, styles.dateToday],
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
        style={[this.styles.monthContainer, styles && styles.monthContainer]}
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
          this.styles.wrapperContainer,
          styles && styles.wrapperContainer,
        ]}
        onLayout={(e): any => {
          this.setState({
            layoutWidth: e.nativeEvent.layout.width,
          });
          this.scrollToMiddle();
        }}
      >
        <View
          style={[
            this.styles.headerContainer,
            styles && styles.headerContainer,
          ]}
        >
          <Text style={[this.styles.headerText, styles && styles.headerText]}>
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

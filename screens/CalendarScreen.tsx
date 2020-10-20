import React, { Component, ReactElement, ReactNode } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Calendar from "../component/Calendar/Calendar";
import { datas } from "./datas";

export default class CalendarScreen extends Component {
  render() {
    const styles = StyleSheet.create({
      wrapperContainer: {
        width: Dimensions.get("screen").width,
      },
      headerContainer: {
        paddingHorizontal: 15,
        paddingVertical: 17,
        alignItems: "flex-start",
      },
      headerText: {
        fontSize: 18,
        letterSpacing: -0.36,
        lineHeight: 27,
      },
      weekContainer: {
        paddingVertical: 10,
        borderBottomColor: "#f2f2f2",
        borderBottomWidth: 1,
      },
      weekView: {
        width: Dimensions.get("screen").width / 7,
      },
      weekText: {
        fontSize: 14,
        color: "#222",
        letterSpacing: -0.28,
      },
      weekSunday: {
        color: "#888888",
      },
      dateSunday: {
        color: "#888888",
      },
      dateView: {
        height: 84,
        justifyContent: "flex-start",
        borderColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        width: Dimensions.get("screen").width / 7,
      },
      dateText: {
        borderBottomColor: "#EEE",
        lineHeight: 24,
      },
      dateSelected: {
        borderColor: "#FFF",
      },
      dateToday: {
        backgroundColor: "#c59f82",
        color: "#fff",
        borderRadius: 50,
        width: 24,
        height: 24,
        textAlign: "center",
        lineHeight: 24,
        fontWeight: "normal",
      },
      hasDate: {
        backgroundColor: "#f7f7f7",
        height: 24,
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      },
      selectedView: {
        width: "100%",
        height: "103%",
        borderWidth: 1,
        borderColor: "#c59f82",
        position: "absolute",
        top: 0,
        marginTop: -2,
        left: 0,
      },
    });

    const hasStyles: {
      date: Date;
      children: ReactNode;
    }[] = [];
    const hasDates: { date: Date; children: ReactNode }[] = [];

    datas.map(({ styleList, date, dateFlag, id }: any) => {
      if (styleList) {
        hasStyles.push({
          date: new Date(date),
          children: (
            <Image
              key={id}
              style={{ width: 44, height: 50, marginTop: 3 }}
              source={{ uri: styleList[0].style.attach.filename }}
            />
          ),
        });
      }
      if (dateFlag) {
        hasDates.push({
          date: new Date(date),
          children: <View key={id} style={styles.hasDate} />,
        });
      }
    });
    return (
      <Calendar
        styles={styles}
        date={new Date()}
        childrenDatas={hasStyles}
        EventDatas={hasDates}
        renderSelected={<View style={styles.selectedView}></View>}
      />
    );
  }
}

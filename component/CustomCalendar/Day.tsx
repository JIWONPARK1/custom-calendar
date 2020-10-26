import React, { PropsWithChildren } from "react";
import { FlatList, Text, View } from "react-native";

interface Props {
  styles: any;
  defaultStyles: any;
}

export default function Day({
  styles,
  defaultStyles,
}: PropsWithChildren<Props>) {
  const weekdays: string[] = [];
  for (let idx = 0; idx < 7; idx++) {
    const month: Date = new Date(2020, 5, idx);
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
                index === 0 && styles.weekSunday,
              ]}
            >
              {item}
            </Text>
          </View>
        );
      }}
    />
  );
}

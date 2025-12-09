import dayjs from "dayjs";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface DateTimePickerProps {
  visible: boolean;
  value: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  title?: string;
}

export function DateTimePicker({
  visible,
  value,
  onConfirm,
  onCancel,
  title = "Selectează data și ora",
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState(value);
  const [mode, setMode] = useState<"date" | "time">("date");

  const currentYear = dayjs().year();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 2 + i);
  const months = [
    "Ianuarie",
    "Februarie",
    "Martie",
    "Aprilie",
    "Mai",
    "Iunie",
    "Iulie",
    "August",
    "Septembrie",
    "Octombrie",
    "Noiembrie",
    "Decembrie",
  ];
  const days = Array.from(
    { length: dayjs(selectedDate).daysInMonth() },
    (_, i) => i + 1
  );
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const selectedDay = dayjs(selectedDate).date();
  const selectedMonth = dayjs(selectedDate).month();
  const selectedYear = dayjs(selectedDate).year();
  const selectedHour = dayjs(selectedDate).hour();
  const selectedMinute = dayjs(selectedDate).minute();

  const handleConfirm = () => {
    if (mode === "date") {
      setMode("time");
    } else {
      onConfirm(selectedDate);
      setMode("date");
    }
  };

  const handleCancel = () => {
    setSelectedDate(value);
    setMode("date");
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 justify-end bg-black/50" onPress={handleCancel}>
        <Pressable className="bg-background rounded-t-3xl pb-8">
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-border">
            <Pressable onPress={handleCancel}>
              <Text className="text-primary text-base">Anulează</Text>
            </Pressable>
            <Text className="text-text-primary font-semibold">{title}</Text>
            <Pressable onPress={handleConfirm}>
              <Text className="text-primary text-base font-semibold">
                {mode === "date" ? "Continuă" : "Confirmă"}
              </Text>
            </Pressable>
          </View>

          <View className="px-4 py-6">
            {mode === "date" ? (
              <View className="flex-row gap-2">
                {/* Day Picker */}
                <View className="flex-1">
                  <Text className="text-xs text-text-muted mb-2 text-center">Zi</Text>
                  <ScrollView className="h-40 border border-border rounded-xl">
                    {days.map((day) => (
                      <Pressable
                        key={day}
                        onPress={() =>
                          setSelectedDate(dayjs(selectedDate).date(day).toDate())
                        }
                        className={`py-3 ${
                          day === selectedDay ? "bg-primary" : ""
                        }`}
                      >
                        <Text
                          className={`text-center ${
                            day === selectedDay
                              ? "text-white font-semibold"
                              : "text-text-primary"
                          }`}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                {/* Month Picker */}
                <View className="flex-1">
                  <Text className="text-xs text-text-muted mb-2 text-center">Lună</Text>
                  <ScrollView className="h-40 border border-border rounded-xl">
                    {months.map((month, index) => (
                      <Pressable
                        key={month}
                        onPress={() =>
                          setSelectedDate(dayjs(selectedDate).month(index).toDate())
                        }
                        className={`py-3 ${
                          index === selectedMonth ? "bg-primary" : ""
                        }`}
                      >
                        <Text
                          className={`text-center text-xs ${
                            index === selectedMonth
                              ? "text-white font-semibold"
                              : "text-text-primary"
                          }`}
                        >
                          {month}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                {/* Year Picker */}
                <View className="flex-1">
                  <Text className="text-xs text-text-muted mb-2 text-center">An</Text>
                  <ScrollView className="h-40 border border-border rounded-xl">
                    {years.map((year) => (
                      <Pressable
                        key={year}
                        onPress={() =>
                          setSelectedDate(dayjs(selectedDate).year(year).toDate())
                        }
                        className={`py-3 ${
                          year === selectedYear ? "bg-primary" : ""
                        }`}
                      >
                        <Text
                          className={`text-center ${
                            year === selectedYear
                              ? "text-white font-semibold"
                              : "text-text-primary"
                          }`}
                        >
                          {year}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>
            ) : (
              <View className="flex-row gap-4">
                {/* Hour Picker */}
                <View className="flex-1">
                  <Text className="text-xs text-text-muted mb-2 text-center">Oră</Text>
                  <ScrollView className="h-40 border border-border rounded-xl">
                    {hours.map((hour) => (
                      <Pressable
                        key={hour}
                        onPress={() =>
                          setSelectedDate(dayjs(selectedDate).hour(hour).toDate())
                        }
                        className={`py-3 ${
                          hour === selectedHour ? "bg-primary" : ""
                        }`}
                      >
                        <Text
                          className={`text-center ${
                            hour === selectedHour
                              ? "text-white font-semibold"
                              : "text-text-primary"
                          }`}
                        >
                          {String(hour).padStart(2, "0")}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                {/* Minute Picker */}
                <View className="flex-1">
                  <Text className="text-xs text-text-muted mb-2 text-center">
                    Minut
                  </Text>
                  <ScrollView className="h-40 border border-border rounded-xl">
                    {minutes.map((minute) => (
                      <Pressable
                        key={minute}
                        onPress={() =>
                          setSelectedDate(dayjs(selectedDate).minute(minute).toDate())
                        }
                        className={`py-3 ${
                          minute === selectedMinute ? "bg-primary" : ""
                        }`}
                      >
                        <Text
                          className={`text-center ${
                            minute === selectedMinute
                              ? "text-white font-semibold"
                              : "text-text-primary"
                          }`}
                        >
                          {String(minute).padStart(2, "0")}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

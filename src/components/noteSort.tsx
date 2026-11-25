import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  sortOrder: "newest" | "oldest";
  setSortOrder: (order: "newest" | "oldest") => void;
};

export default function NoteSort({
  sortOrder,
  setSortOrder,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedText = sortOrder === "newest" ? "Newest" : "Oldest";

  const handleSelect = (order: "newest" | "oldest") => {
    setSortOrder(order);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sort:</Text>

      <View>
        <Pressable
          style={({ pressed }) => [
            styles.sortButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={styles.sortText}>{selectedText}</Text>

          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color="#F5F1E8"
          />
        </Pressable>

        {isOpen && (
          <View style={styles.dropdown}>
            <Pressable
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={() => handleSelect("newest")}
            >
              <Text
                style={[
                  styles.optionText,
                  sortOrder === "newest" && styles.selectedOption,
                ]}
              >
                Newest
              </Text>

              {sortOrder === "newest" && (
                <Ionicons
                  name="checkmark"
                  size={17}
                  color="#D97745"
                />
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={() => handleSelect("oldest")}
            >
              <Text
                style={[
                  styles.optionText,
                  sortOrder === "oldest" && styles.selectedOption,
                ]}
              >
                Oldest
              </Text>

              {sortOrder === "oldest" && (
                <Ionicons
                  name="checkmark"
                  size={17}
                  color="#D97745"
                />
              )}
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  label: {
    color: "#999999",
    fontSize: 13,
    marginRight: 10,
  },
  sortButton: {
    minWidth: 10,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 9,
    paddingVertical: 10,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sortText: {
    color: "#F5F1E8",
    fontSize: 13,
    fontWeight: "600",
  },
  dropdown: {
    position: "absolute",
    top: 47,
    left: 0,
    width: 120,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 9,
    overflow: "hidden",
    zIndex: 10,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    color: "#999999",
    fontSize: 13,
  },
  selectedOption: {
    color: "#F5F1E8",
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  optionPressed: {
    backgroundColor: "#292929",
  },
});
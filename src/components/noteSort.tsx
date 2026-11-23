
import { Text, View, Pressable, StyleSheet } from "react-native";

type Props = {
  sortOrder: "newest" | "oldest";
  setSortOrder: (order: "newest" | "oldest") => void;
};

export default function NoteSort({ sortOrder, setSortOrder }: Props) {
  return (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>Sort by:</Text>

      <Pressable
        style={[
          styles.sortButton,
          sortOrder === "newest" && styles.activeSortButton,
        ]}
        onPress={() => setSortOrder("newest")}
      >
        <Text
          style={[
            styles.sortText,
            sortOrder === "newest" && styles.activeSortText,
          ]}
        >
          Newest
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.sortButton,
          sortOrder === "oldest" && styles.activeSortButton,
        ]}
        onPress={() => setSortOrder("oldest")}
      >
        <Text
          style={[
            styles.sortText,
            sortOrder === "oldest" && styles.activeSortText,
          ]}
        >
          Oldest
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 25,
  },
  sortLabel: {
    color: "#999999",
    fontSize: 13,
  },
  sortButton: {
    borderWidth: 1,
    borderColor: "#303030",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 7,
  },
  activeSortButton: {
    backgroundColor: "#D97745",
    borderColor: "#D97745",
  },
  sortText: {
    color: "#999999",
    fontSize: 12,
    fontWeight: "600",
  },
  activeSortText: {
    color: "#121212",
  },
});

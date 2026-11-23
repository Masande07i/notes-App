import { Text, View, Pressable, StyleSheet } from "react-native";
import { NoteCategory } from "./addNoteModal";

type Props = {
  selectedCategory: NoteCategory;
  onSelect: (category: NoteCategory) => void;
};

export default function CategorySelector({
  selectedCategory,
  onSelect,
}: Props) {
  const categories: NoteCategory[] = ["Work", "Study", "Personal"];

  return (
    <View style={styles.categories}>
      {categories.map((category) => (
        <Pressable
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategory,
          ]}
          onPress={() => onSelect(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText,
            ]}
          >
            {category}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  categories: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 35,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#444444",
    backgroundColor: "#1E1E1E",
  },
  selectedCategory: {
    backgroundColor: "#D97745",
    borderColor: "#D97745",
  },
  categoryText: {
    color: "#999999",
    fontSize: 12,
    fontWeight: "600",
  },
  selectedCategoryText: {
    color: "#121212",
  },
});

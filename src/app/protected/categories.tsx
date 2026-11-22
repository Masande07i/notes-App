
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NoteCategory } from "../../components/addNoteModal";

type Note = {
  id: string;
  title: string;
  notes: string;
  category: NoteCategory;
  dateAdded: string;
  editedAt?: string;
};

export default function Categories() {
  const { category } = useLocalSearchParams<{ category?: string }>();

  const [selectedCategory, setSelectedCategory] =
    useState<NoteCategory>("Work");

  const [notes, setNotes] = useState<Note[]>([]);

  const categories: NoteCategory[] = ["Work", "Study", "Personal"];

  const loadNotes = async () => {
    const savedNotes = await AsyncStorage.getItem("notes");

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (category && categories.includes(category as NoteCategory)) {
      setSelectedCategory(category as NoteCategory);
    }
  }, [category]);

  const filteredNotes = notes.filter(
    (note) =>
      note.category?.trim().toLowerCase() ===
      selectedCategory.toLowerCase()
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>note.</Text>

        <Text style={styles.title}>Categories.</Text>

        <Text style={styles.description}>
          Keep your notes organised.
        </Text>

        <View style={styles.categories}>
          {categories.map((categoryName) => (
            <Pressable
              key={categoryName}
              style={[
                styles.categoryButton,
                selectedCategory === categoryName &&
                  styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(categoryName)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === categoryName &&
                    styles.selectedCategoryText,
                ]}
              >
                {categoryName}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.selectedTitle}>
          {selectedCategory} notes
        </Text>

        {filteredNotes.length === 0 ? (
          <Text style={styles.emptyText}>
            No {selectedCategory.toLowerCase()} notes yet.
          </Text>
        ) : (
          filteredNotes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <Text style={styles.noteTitle}>
                {note.title || "Untitled Note"}
              </Text>

              <Text style={styles.noteText}>{note.notes}</Text>

              <Text style={styles.date}>
                Added {new Date(note.dateAdded).toLocaleDateString()}
              </Text>

              {note.editedAt && (
                <Text style={styles.date}>
                  Edited {new Date(note.editedAt).toLocaleString()}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    padding: 25,
    paddingTop: 55,
    paddingBottom: 40,
  },
  logo: {
    color: "#D97745",
    fontSize: 29,
    fontWeight: "800",
    marginBottom: 35,
  },
  title: {
    color: "#F5F1E8",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 9,
  },
  description: {
    color: "#999999",
    fontSize: 14,
    marginBottom: 30,
  },
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
  selectedTitle: {
    color: "#F5F1E8",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 18,
  },
  emptyText: {
    color: "#999999",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 30,
  },
  noteCard: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
  },
  noteTitle: {
    color: "#F5F1E8",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  noteText: {
    color: "#CCCCCC",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 15,
  },
  date: {
    color: "#777777",
    fontSize: 11,
    marginBottom: 5,
  },
});

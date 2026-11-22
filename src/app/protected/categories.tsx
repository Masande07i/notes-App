
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import AddNoteModal, {
  NoteCategory,
} from "../../components/addNoteModal";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

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

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalVisible(true);
  };

  const handleSaveNote = async (updatedNote: {
    title: string;
    notes: string;
    category: NoteCategory;
  }) => {
    if (!selectedNote) return;

    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id
        ? {
            ...note,
            title: updatedNote.title,
            notes: updatedNote.notes,
            category: updatedNote.category,
            editedAt: new Date().toISOString(),
          }
        : note
    );

    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
    setSelectedNote(null);
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedNotes = notes.filter(
              (note) => note.id !== id
            );

            await AsyncStorage.setItem(
              "notes",
              JSON.stringify(updatedNotes)
            );

            setNotes(updatedNotes);
          },
        },
      ]
    );
  };

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
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>
                  {note.title || "Untitled Note"}
                </Text>

                <View style={styles.actions}>
                  <Pressable
                    onPress={() => handleEditNote(note)}
                    style={styles.iconButton}
                  >
                    <Ionicons
                      name="create-outline"
                      size={21}
                      color="#D97745"
                    />
                  </Pressable>

                  <Pressable
                    onPress={() => handleDeleteNote(note.id)}
                    style={styles.iconButton}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={21}
                      color="#D97745"
                    />
                  </Pressable>
                </View>
              </View>

              <Text style={styles.noteText}>{note.notes}</Text>

              <Text style={styles.date}>
                Added {new Date(note.dateAdded).toLocaleDateString()}
              </Text>

              {note.editedAt && (
                <Text style={styles.date}>
                  Edited {new Date(note.editedAt).toLocaleDateString()}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <AddNoteModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedNote(null);
        }}
        onSave={handleSaveNote}
        initialNote={
          selectedNote
            ? {
                title: selectedNote.title,
                notes: selectedNote.notes,
                category: selectedNote.category,
              }
            : undefined
        }
      />
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
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  noteTitle: {
    color: "#F5F1E8",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 5,
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

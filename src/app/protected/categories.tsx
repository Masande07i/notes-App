
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddNoteModal, {
  NoteCategory,
} from "../../components/addNoteModal";
import CategorySelector from "../../components/categorySelector";
import NoteSearch from "../../components/noteSearch";
import NoteSort from "../../components/noteSort";
import NoteCard from "../../components/noteCard";
import { getCurrentUser } from "../../services/auth";

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
  const [notesKey, setNotesKey] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const loadNotes = async () => {
    try {
      const user = await getCurrentUser();

      if (!user) {
        setNotes([]);
        setNotesKey(null);
        return;
      }

      const userNotesKey = `notes_${user.email}`;
      setNotesKey(userNotesKey);

      const savedNotes = await AsyncStorage.getItem(userNotesKey);

      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.log("LOAD NOTES ERROR:", error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (
      category &&
      ["Work", "Study", "Personal"].includes(category)
    ) {
      setSelectedCategory(category as NoteCategory);
    }
  }, [category]);

  const handleCreateNote = async (newNote: {
    title: string;
    notes: string;
    category: NoteCategory;
  }) => {
    if (!notesKey) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      notes: newNote.notes,
      category: newNote.category,
      dateAdded: new Date().toISOString(),
    };

    const updatedNotes = [...notes, note];

    await AsyncStorage.setItem(
      notesKey,
      JSON.stringify(updatedNotes)
    );

    setNotes(updatedNotes);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalVisible(true);
  };

  const handleSaveNote = async (updatedNote: {
    title: string;
    notes: string;
    category: NoteCategory;
  }) => {
    if (!selectedNote || !notesKey) return;

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

    await AsyncStorage.setItem(
      notesKey,
      JSON.stringify(updatedNotes)
    );

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
            if (!notesKey) return;

            const updatedNotes = notes.filter(
              (note) => note.id !== id
            );

            await AsyncStorage.setItem(
              notesKey,
              JSON.stringify(updatedNotes)
            );

            setNotes(updatedNotes);
          },
        },
      ]
    );
  };

  const categoryNotes = notes.filter(
    (note) =>
      note.category?.trim().toLowerCase() ===
      selectedCategory.toLowerCase()
  );

  const filteredNotes = categoryNotes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchText.toLowerCase()) ||
        note.notes.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.dateAdded).getTime() -
          new Date(a.dateAdded).getTime()
        );
      }

      return (
        new Date(a.dateAdded).getTime() -
        new Date(b.dateAdded).getTime()
      );
    });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>note.</Text>

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setIsModalVisible(true)}
            disabled={!notesKey}
          >
            <Text style={styles.addButtonText}>+ Create a Note</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Categories.</Text>

        <Text style={styles.description}>
          Keep your notes organised.
        </Text>

        <CategorySelector
          selectedCategory={selectedCategory}
          onSelect={(category) => {
            setSelectedCategory(category);
            setSearchText("");
          }}
        />

        <Text style={styles.selectedTitle}>
          {selectedCategory} notes
        </Text>

        <NoteSearch
          searchText={searchText}
          setSearchText={setSearchText}
        />

        <NoteSort
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <Text style={styles.sectionTitle}>
          {filteredNotes.length}{" "}
          {filteredNotes.length === 1 ? "Note" : "Notes"}
        </Text>

        {filteredNotes.length === 0 ? (
          <Text style={styles.emptyText}>
            {categoryNotes.length === 0
              ? `No ${selectedCategory.toLowerCase()} notes yet.`
              : "No notes found."}
          </Text>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))
        )}
      </ScrollView>

      <AddNoteModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedNote(null);
        }}
        onSave={
          selectedNote ? handleSaveNote : handleCreateNote
        }
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
    </KeyboardAvoidingView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 35,
  },
  logo: {
    color: "#D97745",
    fontSize: 29,
    fontWeight: "800",
  },
  addButton: {
    backgroundColor: "#D97745",
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 9,
  },
  addButtonText: {
    color: "#121212",
    fontSize: 12,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
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
  selectedTitle: {
    color: "#F5F1E8",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#F5F1E8",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 15,
  },
  emptyText: {
    color: "#999999",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 30,
  },
});

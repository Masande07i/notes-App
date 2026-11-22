
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function AllNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const loadNotes = async () => {
    const savedNotes = await AsyncStorage.getItem("notes");

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSaveNote = async (note: {
    title: string;
    notes: string;
    category: NoteCategory;
  }) => {
    let updatedNotes: Note[];

    if (selectedNote) {
      updatedNotes = notes.map((item) =>
        item.id === selectedNote.id
          ? {
              ...item,
              title: note.title,
              notes: note.notes,
              category: note.category,
              editedAt: new Date().toISOString(),
            }
          : item
      );
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: note.title,
        notes: note.notes,
        category: note.category,
        dateAdded: new Date().toISOString(),
      };

      updatedNotes = [...notes, newNote];
    }

    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
    setSelectedNote(null);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalVisible(true);
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
          onPress: () => deleteNote(id),
        },
      ]
    );
  };

  const deleteNote = async (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);

    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    setSelectedNote(null);
    setIsModalVisible(true);
  };

  const filteredNotes = notes
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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>note.</Text>

        <Text style={styles.title}>All notes.</Text>

        <Text style={styles.description}>
          Everything you've saved in one place.
        </Text>

        <Pressable
          style={styles.addButton}
          onPress={handleAddNote}
        >
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </Pressable>

        <TextInput
          style={styles.searchInput}
          placeholder="Search your notes..."
          placeholderTextColor="#777777"
          value={searchText}
          onChangeText={setSearchText}
        />

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

        <Text style={styles.sectionTitle}>
          {filteredNotes.length} {filteredNotes.length === 1 ? "Note" : "Notes"}
        </Text>

        {filteredNotes.length === 0 ? (
          <Text style={styles.emptyText}>
            {notes.length === 0
              ? "You haven't added any notes yet."
              : "No notes found."}
          </Text>
        ) : (
          filteredNotes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>
                  {note.title || "Untitled Note"}
                </Text>

                <Text style={styles.category}>{note.category}</Text>
              </View>

              <Text style={styles.noteText}>{note.notes}</Text>

              <Text style={styles.date}>
                Added {new Date(note.dateAdded).toLocaleDateString()}
              </Text>

              {note.editedAt && (
                <Text style={styles.date}>
                  Edited {new Date(note.editedAt).toLocaleString()}
                </Text>
              )}

              <View style={styles.noteActions}>
                <Pressable
                  style={styles.editButton}
                  onPress={() => handleEditNote(note)}
                >
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDeleteNote(note.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              </View>
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
        initialNote={selectedNote || undefined}
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
    marginBottom: 25,
  },
  addButton: {
    backgroundColor: "#D97745",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 25,
  },
  addButtonText: {
    color: "#121212",
    fontSize: 14,
    fontWeight: "700",
  },
  searchInput: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 10,
    padding: 14,
    color: "#F5F1E8",
    fontSize: 14,
    marginBottom: 18,
  },
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
  noteCard: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 12,
    padding: 18,
    marginBottom: 13,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  noteTitle: {
    color: "#F5F1E8",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
  },
  category: {
    color: "#D97745",
    fontSize: 11,
    fontWeight: "700",
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
  noteActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 15,
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#D97745",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 7,
  },
  editText: {
    color: "#D97745",
    fontSize: 12,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#35201C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 7,
  },
  deleteText: {
    color: "#E07865",
    fontSize: 12,
    fontWeight: "700",
  },
});

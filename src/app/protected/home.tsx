
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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../../services/auth";
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

export default function Home() {
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchText, setSearchText] = useState("");

  const loadNotes = async () => {
    const savedNotes = await AsyncStorage.getItem("notes");

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/");
  };

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
          onPress: () => {
            deleteNote(id);
          },
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

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.notes.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>note.</Text>

        <Text style={styles.title}>Your notes.</Text>

        <Text style={styles.description}>
          Your personal space for everything worth remembering.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleAddNote}
        >
          <Text style={styles.buttonText}>+ Add Note</Text>
        </Pressable>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>
            {notes.length === 0 ? "No notes yet." : "Your saved notes"}
          </Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search your notes..."
            placeholderTextColor="#777777"
            value={searchText}
            onChangeText={setSearchText}
          />

          {filteredNotes.length === 0 ? (
            <Text style={styles.emptyText}>
              {notes.length === 0
                ? "Add your first note to get started."
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
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>

      <AddNoteModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
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
    padding: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    color: "#D97745",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 30,
  },
  title: {
    color: "#F5F1E8",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 10,
  },
  description: {
    color: "#999999",
    fontSize: 14,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#D97745",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#121212",
    fontSize: 15,
    fontWeight: "700",
  },
  notesSection: {
    marginTop: 35,
  },
  sectionTitle: {
    color: "#F5F1E8",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
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
  emptyText: {
    color: "#999999",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
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
    alignItems: "flex-start",
    marginBottom: 12,
  },
  noteTitle: {
    color: "#F5F1E8",
    fontSize: 17,
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
  logoutButton: {
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#999999",
    fontSize: 14,
    fontWeight: "600",
  },
});

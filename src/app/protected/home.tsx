import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
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
    const savedNotes = await AsyncStorage.getItem("notes");

    const currentNotes: Note[] = savedNotes
      ? JSON.parse(savedNotes)
      : [];

    const newNote: Note = {
      id: Date.now().toString(),
      title: note.title,
      notes: note.notes,
      category: note.category,
      dateAdded: new Date().toISOString(),
    };

    const updatedNotes = [...currentNotes, newNote];

    await AsyncStorage.setItem(
      "notes",
      JSON.stringify(updatedNotes)
    );

    setNotes(updatedNotes);
  };

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
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.buttonText}>+ Add Note</Text>
        </Pressable>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>
            {notes.length === 0 ? "No notes yet." : "Your saved notes"}
          </Text>

          {notes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>
                  {note.title || "Untitled Note"}
                </Text>

                <Text style={styles.category}>
                  {note.category}
                </Text>
              </View>

              <Text style={styles.noteText}>
                {note.notes}
              </Text>

              <Text style={styles.date}>
                Added {new Date(note.dateAdded).toLocaleDateString()}
              </Text>
            </View>
          ))}
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
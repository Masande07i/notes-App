
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

  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleSaveNote = async (note: {
    title: string;
    notes: string;
    category: NoteCategory;
  }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: note.title,
      notes: note.notes,
      category: note.category,
      dateAdded: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];

    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const recentNotes = [...notes]
    .sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() -
        new Date(a.dateAdded).getTime()
    )
    .slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>note.</Text>

          <Pressable onPress={() => router.push("/protected/profile")}>
            <Text style={styles.profileText}>Profile</Text>
          </Pressable>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome back.</Text>
          <Text style={styles.description}>
            What would you like to note today?
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Create a Note</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your categories</Text>
          <Text style={styles.sectionDescription}>
            Keep your thoughts organised.
          </Text>

          <View style={styles.categories}>
            {categories.map((category) => (
              <Pressable
                key={category}
                style={({ pressed }) => [
                  styles.categoryCard,
                  pressed && styles.cardPressed,
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/protected/categories",
                    params: { category },
                  })
                }
              >
                <Text style={styles.categoryText}>{category}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.notesHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent notes</Text>
              <Text style={styles.sectionDescription}>
                Your latest thoughts.
              </Text>
            </View>

            <Pressable onPress={() => router.push("/protected/all-notes")}>
              <Text style={styles.viewAllText}>View all</Text>
            </Pressable>
          </View>

          {recentNotes.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No notes yet.</Text>
              <Text style={styles.emptyText}>
                Your recent notes will appear here.
              </Text>
            </View>
          ) : (
            recentNotes.map((note) => (
              <View key={note.id} style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteTitle}>
                    {note.title || "Untitled Note"}
                  </Text>

                  <Text style={styles.categoryLabel}>
                    {note.category}
                  </Text>
                </View>

                <Text style={styles.noteText} numberOfLines={2}>
                  {note.notes}
                </Text>

                <Text style={styles.date}>
                  {new Date(note.dateAdded).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </View>
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
    padding: 25,
    paddingTop: 55,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 45,
  },
  logo: {
    color: "#D97745",
    fontSize: 29,
    fontWeight: "800",
  },
  profileText: {
    color: "#F5F1E8",
    fontSize: 14,
    fontWeight: "600",
  },
  welcomeSection: {
    marginBottom: 25,
  },
  title: {
    color: "#F5F1E8",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 9,
  },
  description: {
    color: "#999999",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#D97745",
    paddingVertical: 17,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#121212",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  section: {
    marginTop: 40,
  },
  sectionTitle: {
    color: "#F5F1E8",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 7,
  },
  sectionDescription: {
    color: "#999999",
    fontSize: 13,
    marginBottom: 18,
  },
  categories: {
    flexDirection: "row",
    gap: 10,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: "center",
  },
  cardPressed: {
    borderColor: "#D97745",
    opacity: 0.8,
  },
  categoryText: {
    color: "#D97745",
    fontSize: 13,
    fontWeight: "700",
  },
  notesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    color: "#D97745",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 22,
    borderWidth: 1,
    borderColor: "#303030",
    alignItems: "center",
  },
  emptyTitle: {
    color: "#F5F1E8",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 7,
  },
  emptyText: {
    color: "#999999",
    fontSize: 13,
  },
  noteCard: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  noteTitle: {
    color: "#F5F1E8",
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
  },
  categoryLabel: {
    color: "#D97745",
    fontSize: 11,
    fontWeight: "700",
  },
  noteText: {
    color: "#CCCCCC",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  date: {
    color: "#777777",
    fontSize: 11,
  },
});

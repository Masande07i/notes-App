
import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddNoteModal, {
  NoteCategory,
} from "../../components/addNoteModal";
import { getCurrentUser } from "../../services/auth";

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

  const categories: NoteCategory[] = ["Work", "Study", "Personal"];

  const handleSaveNote = async (note: {
    title: string;
    notes: string;
    category: NoteCategory;
  }) => {
    try {
      const user = await getCurrentUser();

      if (!user) {
        Alert.alert("Error", "Please log in to create a note.");
        return;
      }

      const notesKey = `notes_${user.email}`;

      const savedNotes = await AsyncStorage.getItem(notesKey);

      const existingNotes: Note[] = savedNotes
        ? JSON.parse(savedNotes)
        : [];

      const newNote: Note = {
        id: Date.now().toString(),
        title: note.title,
        notes: note.notes,
        category: note.category,
        dateAdded: new Date().toISOString(),
      };

      const updatedNotes = [...existingNotes, newNote];

      await AsyncStorage.setItem(
        notesKey,
        JSON.stringify(updatedNotes)
      );
    } catch (error) {
      console.log("SAVE NOTE ERROR:", error);
      Alert.alert("Error", "Could not save your note.");
    }
  };

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
                onPress={() => {
                  if (category === "Work") {
                    router.push("/protected/work");
                  } else if (category === "Study") {
                    router.push("/protected/study");
                  } else {
                    router.push("/protected/personal");
                  }
                }}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </Pressable>
            ))}
          </View>
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
});

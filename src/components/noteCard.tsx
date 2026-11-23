
import { Text, View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NoteCategory } from "./addNoteModal";

type Note = {
  id: string;
  title: string;
  notes: string;
  category: NoteCategory;
  dateAdded: string;
  editedAt?: string;
};

type Props = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
};

export default function NoteCard({ note, onEdit, onDelete }: Props) {
  return (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>
          {note.title || "Untitled Note"}
        </Text>

        <View style={styles.actions}>
          <Pressable
            onPress={() => onEdit(note)}
            style={styles.iconButton}
          >
            <Ionicons name="create-outline" size={21} color="#D97745" />
          </Pressable>

          <Pressable
            onPress={() => onDelete(note.id)}
            style={styles.iconButton}
          >
            <Ionicons name="trash-outline" size={21} color="#D97745" />
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
  );
}

const styles = StyleSheet.create({
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

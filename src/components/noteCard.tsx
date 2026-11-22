
import { Text, View, StyleSheet, Pressable } from "react-native";
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

type NoteCardProps = {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
};

export default function NoteCard({
  note,
  onEdit,
  onDelete,
}: NoteCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {note.title || "Untitled Note"}
        </Text>

        <Text style={styles.category}>{note.category}</Text>
      </View>

      <Text style={styles.noteText}>{note.notes}</Text>

      <View style={styles.footer}>
        <View>
          <Text style={styles.date}>
            Added: {new Date(note.dateAdded).toLocaleDateString()}
          </Text>

          {note.editedAt && (
            <Text style={styles.date}>
              Edited: {new Date(note.editedAt).toLocaleDateString()}
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable onPress={onEdit} style={styles.iconButton}>
            <Ionicons name="create-outline" size={21} color="#D97745" />
          </Pressable>

          <Pressable onPress={onDelete} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={21} color="#D97745" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "#F5F1E8",
    fontSize: 15,
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
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: "#777777",
    fontSize: 11,
    marginBottom: 3,
  },
  actions: {
    flexDirection: "row",
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
});

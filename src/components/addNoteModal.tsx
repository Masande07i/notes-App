import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type NoteCategory = "Work" | "Study" | "Personal";

type NoteFormData = {
  title: string;
  notes: string;
  category: NoteCategory;
};

type AddNoteModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (note: NoteFormData) => void | Promise<void>;
  initialNote?: NoteFormData;
};

const categories: NoteCategory[] = ["Work", "Study", "Personal"];

export default function AddNoteModal({
  visible,
  onClose,
  onSave,
  initialNote,
}: AddNoteModalProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<NoteCategory>("Personal");

  useEffect(() => {
    if (visible) {
      setTitle(initialNote?.title || "");
      setNotes(initialNote?.notes || "");
      setCategory(initialNote?.category || "Personal");
    }
  }, [visible, initialNote]);

  const handleSave = async () => {
    if (!notes.trim()) {
      Alert.alert("Error", "Please enter your note.");
      return;
    }

    try {
      await onSave({
        title: title.trim(),
        notes: notes.trim(),
        category,
      });

      setTitle("");
      setNotes("");
      setCategory("Personal");
      onClose();
    } catch (error) {
      console.log("SAVE NOTE ERROR:", error);
      Alert.alert("Error", "Could not save your note.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalBackground}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {initialNote ? "Edit Note" : "New Note"}
              </Text>

              <Pressable onPress={onClose}>
  <Ionicons
    name="close"
    size={24}
    color="#999999"
  />
</Pressable>
            </View>

            <Text style={styles.label}>Title (Optional)</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter note title"
              placeholderTextColor="#666666"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Your Note</Text>

            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Write something..."
              placeholderTextColor="#666666"
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />

            <Text style={styles.label}>Category</Text>

            <View style={styles.categoryContainer}>
              {categories.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.categoryButton,
                    category === item && styles.selectedCategory,
                  ]}
                  onPress={() => setCategory(item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === item && styles.selectedCategoryText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.dateText}>
              Date added will be saved automatically.
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveText}>
                  {initialNote ? "Update Note" : "Save Note"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    padding: 22,
    borderWidth: 1,
    borderColor: "#303030",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: {
    color: "#F5F1E8",
    fontSize: 22,
    fontWeight: "800",
  },
  closeButton: {
    color: "#999999",
    fontSize: 20,
  },
  label: {
    color: "#F5F1E8",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 9,
  },
  input: {
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 10,
    padding: 14,
    color: "#F5F1E8",
    fontSize: 14,
    marginBottom: 20,
  },
  noteInput: {
    height: 110,
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 15,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#444444",
    backgroundColor: "#121212",
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
  dateText: {
    color: "#999999",
    fontSize: 11,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 5,
  },
  cancelButton: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#444444",
  },
  cancelText: {
    color: "#F5F1E8",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#D97745",
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 9,
  },
  saveText: {
    color: "#121212",
    fontWeight: "700",
  },
});
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from "react-native";

type AddNoteModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AddNoteModal({
  visible,
  onClose,
}: AddNoteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Note</Text>

            <Pressable onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Title (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter note title"
            placeholderTextColor="#666666"
          />

          <Text style={styles.label}>Your Note</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Write something..."
            placeholderTextColor="#666666"
            multiline
            textAlignVertical="top"
          />

          <View style={styles.modalButtons}>
            <Pressable
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable style={styles.saveButton}>
              <Text style={styles.saveText}>Save Note</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
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
    height: 130,
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

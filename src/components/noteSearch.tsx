
import { TextInput, StyleSheet } from "react-native";

type Props = {
  searchText: string;
  setSearchText: (text: string) => void;
};

export default function NoteSearch({ searchText, setSearchText }: Props) {
  return (
    <TextInput
      style={styles.searchInput}
      placeholder="Search your notes..."
      placeholderTextColor="#777777"
      value={searchText}
      onChangeText={setSearchText}
    />
  );
}

const styles = StyleSheet.create({
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
});

import { StyleSheet } from "react-native";

const BUTTON_HEIGHT = 56;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 12,
    marginVertical: 8,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  searchText: {
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  bottomArea: {
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  fixedButton: {
    height: 46,
    backgroundColor: "#2EC4D6",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
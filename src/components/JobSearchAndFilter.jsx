// src/components/JobSearchAndFilter.js (Updated Icon Color Logic)
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Searchbar, Button, Divider, Text, Portal } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import SelectModal from "./SelectModal";
import { fetchFilterOptions } from "../helpers/fetchFilterOptions";

const SORT_OPTIONS = [
  { label: "Date (Newest)", value: "created_at_desc" },
  { label: "Date (Oldest)", value: "created_at_asc" },
  { label: "Budget (Highest)", value: "budget_desc" },
  { label: "Budget (Lowest)", value: "budget_asc" },
];

// Helper component for active status display
const ActiveFilterBadge = ({ text, isActive }) => (
  <View style={styles.filterTextWrapper}>
    {/* {isActive && (
      <Icon
        name="check-circle"
        size={14}
        color={COLORS.primary} // Icon remains primary color when active
        style={styles.checkIcon}
      />
    )} */}
    {/* The text color is now controlled solely by styles.filterText (default dark) */}
    <Text style={styles.filterText}>{text}</Text>
  </View>
);

export default function JobSearchAndFilter({
  onFilterChange,
  currentFilters,
  type,
}) {
  const [searchQuery, setSearchQuery] = useState(currentFilters?.search || "");
  const [options, setOptions] = useState({ categories: [], locations: [] });

  // Modal states
  const [showSortModal, setShowSortModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Fetch dynamic options (categories/locations) on mount
  useEffect(() => {
    const loadOptions = async () => {
      const result = await fetchFilterOptions();
      setOptions(result);
    };
    loadOptions();
  }, []);
  // Debounce search input (to prevent excessive calls while typing)
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({ ...currentFilters, search: searchQuery });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleFilterUpdate = (key, value) => {
    onFilterChange({ ...currentFilters, [key]: value });
  };

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === currentFilters.sort)?.label ||
    "Date (Newest)";

  // Determine if sort filter is applied (not using the default newest date sort)
  const isSortActive =
    currentFilters.sort && currentFilters.sort !== SORT_OPTIONS[0].value;

  return (
    <View style={styles.container}>
      {/* 1. Search Bar */}
      <Searchbar
        placeholder="Search by Title or Category..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={COLORS.textDark}
        inputStyle={{ minHeight: 40, color: COLORS.textDark }}
      />
      {/* 2. Filter & Sort Buttons */}
      <View style={styles.filterBar}>
        {/* Sort Dropdown Button */}
        <TouchableOpacity
          onPress={() => setShowSortModal(true)}
          style={styles.filterButton}
        >
          <Icon
            name="sort"
            size={16}
            // Highlight icon if sort is active
            color={isSortActive ? COLORS.primary : COLORS.textDark}
            style={styles.iconStyle}
          />
          <Text style={styles.filterText}>Sort</Text>
          {/* {<View style={styles.filterActiveDot} />} */}
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {/* Filter Button: Location */}
        <TouchableOpacity
          onPress={() => setShowLocationModal(true)}
          style={styles.filterButton}
        >
          <Icon
            name="map-marker-outline"
            size={18}
            color={!!currentFilters.location ? COLORS.primary : COLORS.textDark}
            style={styles.iconStyle}
          />
          <ActiveFilterBadge
            text="Location"
            isActive={!!currentFilters.location}
          />
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {/* Filter Button: Category */}
        <TouchableOpacity
          onPress={() => setShowCategoryModal(true)}
          style={styles.filterButton}
        >
          <Icon
            name="shape-outline"
            size={18}
            color={!!currentFilters.category ? COLORS.primary : COLORS.textDark}
            style={styles.iconStyle}
          />
          <ActiveFilterBadge
            text="Category"
            isActive={!!currentFilters.category}
          />
        </TouchableOpacity>
      </View>

      {/* --- Modals for Filtering --- */}
      <Portal>
        {/* Sort Modal */}
        <SelectModal
          visible={showSortModal}
          onDismiss={() => setShowSortModal(false)}
          onSelect={(value) => handleFilterUpdate("sort", value)}
          title="Sort Jobs"
          selectedItem={currentFilters.sort}
          items={SORT_OPTIONS.map((o) => o.value)} // Pass values
          labels={SORT_OPTIONS.map((o) => o.label)} // Pass labels for display
        />

        {/* Location Modal (Filter) */}
        <SelectModal
          visible={showLocationModal}
          onDismiss={() => setShowLocationModal(false)}
          onSelect={(value) => handleFilterUpdate("location", value)}
          title="Filter by Location"
          selectedItem={currentFilters.location}
          items={[null, ...options.locations]} // Include 'null' option for "Clear Filter"
        />

        {/* Category Modal (Filter) */}
        <SelectModal
          visible={showCategoryModal}
          onDismiss={() => setShowCategoryModal(false)}
          onSelect={(value) => handleFilterUpdate("category", value)}
          title="Filter by Category"
          selectedItem={currentFilters.category}
          items={[null, ...options.categories]} // Include 'null' option for "Clear Filter"
        />
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingTop: 10,
    // Keep this clean
    borderBottomWidth: 0,
  },

  // 🌟 Updated Search Bar (Flat style)
  searchBar: {
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 999, // Pill shape
    borderColor: "#000000",
    borderWidth: 1, // Solid black border
    backgroundColor: "#FFFFFF",
    height: 46,
    elevation: 0, // Remove shadow
    shadowOpacity: 0, // Remove shadow
  },

  // 🌟 Updated Filter Bar (The black border you requested)
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",

    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderRadius: 12, // Match your cards

    // THE CHANGE:
    borderWidth: 1, // Solid black border
    borderColor: "#000000",

    elevation: 0, // Remove shadow for clean look
    shadowOpacity: 0, // Remove shadow for clean look
  },

  // Elegant filter buttons
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 10,
  },

  iconStyle: {
    marginRight: 8,
  },

  filterText: {
    fontSize: 13.5,
    color: "#000000", // Solid black text
    fontWeight: "700", // Bolder for better visibility
    textAlign: "center",
    flexShrink: 1,
  },

  // Divider: Solid black to match the theme
  divider: {
    width: 1.5, // Slightly thicker
    height: 24,
    backgroundColor: "#000000",
  },
});

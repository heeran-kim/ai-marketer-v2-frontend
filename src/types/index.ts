// app/types/index.ts

// Represents an action item in a dropdown menu
export interface DropboxItem {
  label: string; // Display name (ex: "edit", "delete")
  onClick: () => void | Promise<void>; // Function triggered when selected
}

// Represents a user in the system
export interface User {
  name: string; // Name of the user
  email: string; // ex: "user@example.com"
  role: string; // ex: "admin", "business owner"
  businessId: string; // ID of the business the user is associated with
}

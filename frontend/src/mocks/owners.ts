/**
 * Phase 2.1: Mock Asset Owner Data
 * 
 * Development/demo data only. No backend connected.
 */
import { AssetOwner, AssetOwnerListItem } from "@/types/domain";

export const mockAssetOwners: AssetOwner[] = [
  {
    id: "owner-001",
    name: "Alice Chen",
    email: "alice.chen@example.com",
    department: "IT Operations",
    role: "IT Manager",
    phone: "+1-555-0101",
    avatarUrl: "/images/avatar-alice.jpg",
    isActive: true,
    createdAt: "2022-01-15T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "owner-002",
    name: "Bob Martinez",
    email: "bob.martinez@example.com",
    department: "Engineering",
    role: "Senior Developer",
    phone: "+1-555-0102",
    avatarUrl: "/images/avatar-bob.jpg",
    isActive: true,
    createdAt: "2022-03-20T00:00:00Z",
    updatedAt: "2024-11-28T00:00:00Z",
  },
  {
    id: "owner-003",
    name: "Carol Nguyen",
    email: "carol.nguyen@example.com",
    department: "IT Infrastructure",
    role: "Network Engineer",
    phone: "+1-555-0103",
    avatarUrl: "/images/avatar-carol.jpg",
    isActive: true,
    createdAt: "2022-06-10T00:00:00Z",
    updatedAt: "2024-10-15T00:00:00Z",
  },
  {
    id: "owner-004",
    name: "David Kim",
    email: "david.kim@example.com",
    department: "Data Services",
    role: "Storage Admin",
    phone: "+1-555-0104",
    avatarUrl: "/images/avatar-david.jpg",
    isActive: true,
    createdAt: "2022-09-05T00:00:00Z",
    updatedAt: "2024-12-10T00:00:00Z",
  },
  {
    id: "owner-005",
    name: "Eva Patel",
    email: "eva.patel@example.com",
    department: "Sales",
    role: "Sales Representative",
    phone: "+1-555-0105",
    avatarUrl: "/images/avatar-eva.jpg",
    isActive: false,
    createdAt: "2023-02-14T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z",
  },
];

export function getOwnerById(id: string): AssetOwner | undefined {
  return mockAssetOwners.find((o) => o.id === id);
}

export function getOwnerListItems(): AssetOwnerListItem[] {
  return mockAssetOwners.map(({ id, name, email, department, isActive }) => ({
    id,
    name,
    email,
    department,
    isActive,
  }));
}
"use client"

import type React from "react"

import { useState } from "react"
import { deleteUser, searchUsers, addUser } from "@/app/actions/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserPlus, Trash2, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface User {
  id: string
  email: string
  name: string
  company: string
  phoneNumber: string
  country: string
  isAdmin: boolean
  lastLogin: Date | null
  createdAt: Date
}

interface UserManagementProps {
  initialUsers: User[]
}

export function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [addUserError, setAddUserError] = useState<string | null>(null)
  const [deleteUserError, setDeleteUserError] = useState<string | null>(null)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchUsers(searchQuery)
      setUsers(results)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  // Reset search
  const resetSearch = async () => {
    setSearchQuery("")
    setUsers(initialUsers)
  }

  // Handle delete user
  const handleDeleteUser = async (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      const result = await deleteUser(userToDelete.id)
      if (result.success) {
        setUsers(users.filter((u) => u.id !== userToDelete.id))
        setIsDeleteDialogOpen(false)
        setUserToDelete(null)
      } else {
        setDeleteUserError("Failed to delete user. Please try again.")
      }
    } catch (error) {
      console.error("Delete error:", error)
      setDeleteUserError("An unexpected error occurred. Please try again.")
    }
  }

  // Handle add user
  const handleAddUser = async (formData: FormData) => {
    setAddUserError(null)
    setIsAddingUser(true)

    try {
      const result = await addUser(formData)
      if (result.success) {
        // Refresh the user list
        const updatedUsers = await searchUsers("")
        setUsers(updatedUsers)
        setIsAddUserDialogOpen(false)
      } else {
        setAddUserError(result.message || "Failed to add user. Please try again.")
      }
    } catch (error) {
      console.error("Add user error:", error)
      setAddUserError("An unexpected error occurred. Please try again.")
    } finally {
      setIsAddingUser(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-blue-950">User Management</h2>

        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>

            <form action={handleAddUser} className="space-y-4 py-4">
              {addUserError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                  <span>{addUserError}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" name="password" type="password" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="isAdmin" name="isAdmin" value="true" />
                <Label htmlFor="isAdmin">Admin User</Label>
              </div>

              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isAddingUser} className="bg-blue-600 hover:bg-blue-700">
                  {isAddingUser ? "Adding..." : "Add User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by email, name or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" disabled={isSearching} className="bg-blue-600 hover:bg-blue-700">
            {isSearching ? "Searching..." : "Search"}
          </Button>
          {searchQuery && (
            <Button type="button" variant="outline" onClick={resetSearch}>
              Reset
            </Button>
          )}
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.name || "-"}</TableCell>
                    <TableCell>{user.company || "-"}</TableCell>
                    <TableCell>
                      {user.lastLogin ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true }) : "Never"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.isAdmin ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={user.isAdmin && users.filter((u) => u.isAdmin).length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {deleteUserError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                <span>{deleteUserError}</span>
              </div>
            )}

            <p className="text-gray-700">
              Are you sure you want to delete the user <span className="font-semibold">{userToDelete?.email}</span>?
              This action cannot be undone.
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


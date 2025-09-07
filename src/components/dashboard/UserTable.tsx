import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Edit, Trash2, ArrowUpDown } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
}

interface UserTableProps {
  users: User[];
  searchTerm: string;
  roleFilter: string;
}

type SortField = 'name' | 'email' | 'role';
type SortDirection = 'asc' | 'desc';

const UserTable = ({ users, searchTerm, roleFilter }: UserTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || 
      (roleFilter === 'admin' && user.role === 'System Admin') ||
      (roleFilter === 'user' && user.role === 'Normal User') ||
      (roleFilter === 'owner' && user.role === 'Store Owner');

    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'System Admin':
        return 'default';
      case 'Store Owner':
        return 'secondary';
      case 'Normal User':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('name')}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('email')}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Address</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('role')}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Role
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No users found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            sortedUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="max-w-xs truncate" title={user.address}>
                  {user.address}
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {sortedUsers.length > 0 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {sortedUsers.length} of {users.length} users
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
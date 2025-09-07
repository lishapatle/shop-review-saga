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
import { Eye, Edit, Trash2, ArrowUpDown, Star } from 'lucide-react';

interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  rating: number;
}

interface StoreTableProps {
  stores: Store[];
  searchTerm: string;
}

type SortField = 'name' | 'email' | 'rating';
type SortDirection = 'asc' | 'desc';

const StoreTable = ({ stores, searchTerm }: StoreTableProps) => {
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

  const filteredStores = stores.filter(store => {
    return (
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedStores = [...filteredStores].sort((a, b) => {
    let aValue, bValue;
    
    if (sortField === 'rating') {
      aValue = a.rating;
      bValue = b.rating;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-success';
    if (rating >= 4.0) return 'text-accent';
    if (rating >= 3.0) return 'text-warning';
    return 'text-destructive';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-accent fill-current' : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className={`ml-2 font-medium ${getRatingColor(rating)}`}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
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
                Store Name
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
                onClick={() => handleSort('rating')}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Rating
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No stores found matching your search
              </TableCell>
            </TableRow>
          ) : (
            sortedStores.map((store) => (
              <TableRow key={store.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell>{store.email}</TableCell>
                <TableCell className="max-w-xs truncate" title={store.address}>
                  {store.address}
                </TableCell>
                <TableCell>
                  {renderStars(store.rating)}
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
      
      {sortedStores.length > 0 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {sortedStores.length} of {stores.length} stores
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreTable;
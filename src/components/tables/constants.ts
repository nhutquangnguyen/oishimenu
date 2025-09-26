import { 
  CheckCircle, 
  Users,
  Clock,
  XCircle
} from 'lucide-react';

export const statusConfig = {
  available: { label: 'Available', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  occupied: { label: 'Occupied', color: 'bg-red-100 text-red-800', icon: Users },
  reserved: { label: 'Reserved', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  cleaning: { label: 'Cleaning', color: 'bg-blue-100 text-blue-800', icon: XCircle },
};


import { BookingHistory } from "@/types/bookingHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Car, Clock } from "lucide-react";

interface BookingHistoryTableProps {
  bookingHistory: BookingHistory[];
  loading: boolean;
  showVehicleInfo?: boolean;
}

const BookingHistoryTable = ({ bookingHistory, loading, showVehicleInfo = false }: BookingHistoryTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDuration = (bookedAt: string, returnedAt?: string) => {
    const start = new Date(bookedAt);
    const end = returnedAt ? new Date(returnedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    }
    return `${diffHours}h`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Booking History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">Loading booking history...</div>
        </CardContent>
      </Card>
    );
  }

  if (bookingHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Booking History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">No booking history found.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Booking History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {showVehicleInfo && <TableHead>Vehicle</TableHead>}
              <TableHead>User</TableHead>
              <TableHead>Booked At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Mileage</TableHead>
              {!showVehicleInfo && <TableHead>Comments</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingHistory.map((booking) => (
              <TableRow key={booking.id}>
                {showVehicleInfo && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="font-medium">{booking.vehicle?.registration_number}</div>
                        <div className="text-sm text-slate-500">
                          {booking.vehicle?.make} {booking.vehicle?.model}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-medium">{booking.profile?.full_name}</div>
                      <div className="text-sm text-slate-500">{booking.profile?.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatDate(booking.booked_at)}</TableCell>
                <TableCell>
                  {booking.returned_at ? (
                    <Badge className="bg-green-100 text-green-800">Returned</Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-500" />
                    {getDuration(booking.booked_at, booking.returned_at)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {booking.initial_mileage && (
                      <div>Start: {booking.initial_mileage.toLocaleString()} km</div>
                    )}
                    {booking.return_mileage && (
                      <div>End: {booking.return_mileage.toLocaleString()} km</div>
                    )}
                  </div>
                </TableCell>
                {!showVehicleInfo && (
                  <TableCell>
                    <div className="text-sm text-slate-600 max-w-xs truncate">
                      {booking.comments || '-'}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BookingHistoryTable;

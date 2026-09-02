'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  CheckCircle,
  Building,
  Phone,
  Mail,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  Info
} from 'lucide-react';

interface CollectionLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string | null;
  operatingHours: string | null;
  collectionPartner: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
  };
}

interface Appointment {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string | null;
  collectionLocation: {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string | null;
  };
  collectionPartner: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
  };
}

const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
];

export default function AppointmentsPage() {
  const params = useParams();
  const router = useRouter();

  const [step, setStep] = useState<'location' | 'datetime' | 'confirm'>('location');
  const [locations, setLocations] = useState<CollectionLocation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caseNumber, setCaseNumber] = useState('');

  // Form state
  const [selectedLocation, setSelectedLocation] = useState<CollectionLocation | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Please log in to access appointments');
        setIsLoading(false);
        return;
      }

      // Fetch case info
      const caseResponse = await fetch(`/api/cases/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const caseResult = await caseResponse.json();
      if (caseResult.success) {
        setCaseNumber(caseResult.data.caseNumber);
      }

      // Fetch locations
      const locationsResponse = await fetch('/api/appointments/locations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const locationsResult = await locationsResponse.json();
      if (locationsResult.success) {
        setLocations(locationsResult.data.locations);
      }

      // Fetch existing appointments
      const appointmentsResponse = await fetch(`/api/cases/${params.id}/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const appointmentsResult = await appointmentsResponse.json();
      if (appointmentsResult.success) {
        setAppointments(appointmentsResult.data);
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: CollectionLocation) => {
    setSelectedLocation(location);
    setStep('datetime');
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async () => {
    if (!selectedLocation || !selectedDate || !selectedTime) {
      setError('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Please log in to schedule appointments');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`/api/cases/${params.id}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          collectionLocationId: selectedLocation.id,
          appointmentDate: selectedDate.toISOString(),
          appointmentTime: selectedTime,
          notes: notes || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect back to case detail
        router.push(`/dashboard/cases/${params.id}`);
      } else {
        setError(result.error || 'Failed to schedule appointment');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Appointment creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      REQUESTED: { label: 'Requested', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      CONFIRMED: { label: 'Confirmed', color: 'bg-green-100 text-green-700 border-green-200' },
      RESCHEDULED: { label: 'Rescheduled', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      COMPLETED: { label: 'Completed', color: 'bg-teal-100 text-teal-700 border-teal-200' },
      CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' },
      NO_SHOW: { label: 'No Show', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    };
    return configs[status] || configs.REQUESTED;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading appointment system...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <Container>
          {/* Back Button */}
          <div className="mb-6">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="outline" size="sm" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Case
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <CalendarIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-navy-900">
                  Schedule Collection Appointment
                </h1>
                {caseNumber && (
                  <p className="text-gray-600 mt-1">
                    Case: <span className="font-mono font-semibold text-navy-900">{caseNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mt-6">
              <div className={`flex items-center gap-2 ${step === 'location' ? 'text-teal-600' : step === 'datetime' || step === 'confirm' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step === 'location' 
                    ? 'bg-teal-500 text-white' 
                    : step === 'datetime' || step === 'confirm'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step === 'datetime' || step === 'confirm' ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <span className="font-medium">Location</span>
              </div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className={`flex items-center gap-2 ${step === 'datetime' ? 'text-teal-600' : step === 'confirm' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step === 'datetime' 
                    ? 'bg-teal-500 text-white' 
                    : step === 'confirm'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step === 'confirm' ? <CheckCircle className="w-5 h-5" /> : '2'}
                </div>
                <span className="font-medium">Date & Time</span>
              </div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className={`flex items-center gap-2 ${step === 'confirm' ? 'text-teal-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step === 'confirm' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span className="font-medium">Confirm</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Existing Appointments */}
          {appointments.length > 0 && (
            <Card className="mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-navy-900">Your Appointments</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {appointments.map(appointment => {
                    const statusConfig = getStatusConfig(appointment.status);
                    return (
                      <div key={appointment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-navy-900">{appointment.collectionLocation.name}</h3>
                              <Badge className={statusConfig.color}>
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {appointment.appointmentTime}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {appointment.collectionLocation.address}, {appointment.collectionLocation.city}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* Step 1: Location Selection */}
          {step === 'location' && (
            <div className="space-y-6">
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-navy-900">Select Collection Location</h2>
                  <p className="text-sm text-gray-600 mt-1">Choose where you'd like to have your sample collected</p>
                </div>
                <div className="p-6">
                  {locations.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {locations.map(location => (
                        <button
                          key={location.id}
                          onClick={() => handleLocationSelect(location)}
                          className="group text-left bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-teal-500 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 group-hover:scale-110 transition-all">
                              <Building className="w-6 h-6 text-teal-600 group-hover:text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-teal-600 transition-colors">
                                {location.name}
                              </h3>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                  <span>{location.address}, {location.city}, {location.country}</span>
                                </div>
                                {location.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{location.phone}</span>
                                  </div>
                                )}
                                {location.operatingHours && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{location.operatingHours}</span>
                                  </div>
                                )}
                              </div>
                              <div className="mt-3 text-xs text-gray-500">
                                Operated by {location.collectionPartner.name}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-navy-900 mb-2">No Locations Available</h3>
                      <p className="text-gray-600">
                        Please contact support to arrange a collection appointment
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 'datetime' && selectedLocation && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <Card>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-navy-900">Select Date</h2>
                    <p className="text-sm text-gray-600 mt-1">Choose a convenient date for your appointment</p>
                  </div>
                  <div className="p-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                      </button>
                      <h3 className="text-xl font-bold text-navy-900">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                      </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                          {day}
                        </div>
                      ))}
                      {getDaysInMonth(currentMonth).map((date, index) => {
                        if (!date) {
                          return <div key={`empty-${index}`} />;
                        }

                        const disabled = isDateDisabled(date);
                        const selected = isDateSelected(date);

                        return (
                          <button
                            key={date.toISOString()}
                            onClick={() => !disabled && handleDateSelect(date)}
                            disabled={disabled}
                            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                              selected
                                ? 'bg-teal-500 text-white shadow-lg scale-110'
                                : disabled
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'hover:bg-teal-50 hover:text-teal-600 text-gray-700'
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                {/* Time Slots */}
                {selectedDate && (
                  <Card className="mt-6">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-navy-900">Select Time</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {TIME_SLOTS.map(time => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
                              selectedTime === time
                                ? 'border-teal-500 bg-teal-50 text-teal-700'
                                : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50 text-gray-700'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Selected Location Summary */}
              <div>
                <Card className="sticky top-6">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-navy-900">Selected Location</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-navy-900 mb-2">{selectedLocation.name}</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{selectedLocation.address}, {selectedLocation.city}</span>
                          </div>
                          {selectedLocation.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{selectedLocation.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setStep('location');
                          setSelectedDate(null);
                          setSelectedTime('');
                        }}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Change Location
                      </button>
                    </div>
                  </div>

                  {selectedDate && selectedTime && (
                    <>
                      <div className="px-6 pb-6">
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-teal-900 mb-2">Your Appointment</h4>
                          <div className="space-y-2 text-sm text-teal-700">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {selectedTime}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 border-t border-gray-200">
                        <Button
                          onClick={() => setStep('confirm')}
                          variant="primary"
                          size="lg"
                          className="w-full"
                        >
                          Continue to Confirm
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirm' && selectedLocation && selectedDate && selectedTime && (
            <div className="max-w-3xl mx-auto">
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-navy-900">Confirm Appointment</h2>
                  <p className="text-sm text-gray-600 mt-1">Please review your appointment details</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Appointment Summary */}
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-navy-900">Your Appointment</h3>
                        <p className="text-sm text-gray-700">Sample collection scheduled</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-teal-200">
                        <div className="text-sm text-gray-600 mb-1">Date & Time</div>
                        <div className="font-semibold text-navy-900">
                          {selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-teal-600 font-medium">{selectedTime}</div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-teal-200">
                        <div className="text-sm text-gray-600 mb-1">Location</div>
                        <div className="font-semibold text-navy-900 mb-2">{selectedLocation.name}</div>
                        <div className="text-sm text-gray-700">
                          {selectedLocation.address}<br />
                          {selectedLocation.city}, {selectedLocation.country}
                        </div>
                        {selectedLocation.phone && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {selectedLocation.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      placeholder="Any special instructions or requirements..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Info Banner */}
                  <div className="bg-white border border-blue-300 rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-navy-900 mb-1">
                          What to bring
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Valid government-issued photo ID</li>
                          <li>• Any required documentation for your case</li>
                          <li>• Arrive 10 minutes early</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep('datetime')}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Go Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Confirm Appointment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

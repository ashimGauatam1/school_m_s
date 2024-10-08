"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BadgeDollarSignIcon, CalendarCheckIcon, CalendarDaysIcon, FilePenIcon, HomeIcon, Loader2, MapPinnedIcon, MessageSquareTextIcon, PhoneCallIcon, UserIcon, UsersIcon } from "lucide-react";
import axios from "axios";
import { DayPicker } from 'react-day-picker';
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  address: string;
  email: string;
  phone: string;
  checkin: Date | undefined;
  checkout: Date | undefined;
  requests: string;
  numberofguests: string;
}

const Page = () => {
  const router = useRouter();
  
  const url = new URL(window.location.href);
  const roomtype = url.searchParams.get('roomtype') || "";
  const price = url.searchParams.get('price') || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    phone: "",
    checkin: undefined,
    checkout: undefined,
    requests: "",
    email: "",
    numberofguests: "1",
  });

  useEffect(() => {
    router.refresh();
  }, [roomtype, price]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date: Date | undefined, type: 'checkin' | 'checkout') => {
    setFormData(prev => ({ ...prev, [type]: date }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/book-room', {
        roomtype,
        amount: price,
        ...formData,
      });
        console.log(response)
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Booking is submitted. You will receive an email shortly after payment is made.",
          variant: "success",
        });
        // router.replace(`/booking?price=${price}`);
      } else {
        toast({
          title: "Fail",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Booking is unsuccessful",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card className="max-w-5xl mx-auto p-6 sm:p-8 md:p-10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center font-serif">Book Your Stay</CardTitle>
          <CardDescription className="text-center mb-10">Fill out the form to reserve your room.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <div className="flex items-center gap-4">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                  <Input required maxLength={15} id="name" className="w-50" placeholder="e.g., Ashim Gautam" value={formData.name} onChange={handleChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <div className="flex items-start gap-2">
                  <MapPinnedIcon className="h-5 w-5 text-muted-foreground" />
                  <Textarea required id="address" className="w-50" rows={3} placeholder="123 Main St, Anytown USA" value={formData.address} onChange={handleChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="flex items-start gap-2">
                  <MessageSquareTextIcon className="h-5 w-5 text-muted-foreground" />
                  <Input required id="email" className="w-50" type="email" placeholder="ashim@gmail.com" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <div className="flex items-center gap-4">
                  <PhoneCallIcon className="h-5 w-5 text-muted-foreground" />
                  <Input required id="phone" maxLength={10} className="w-50" type="tel" placeholder="9864452384" value={formData.phone} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="grid gap-2">
                  <Label htmlFor="checkin" className="text-sm font-medium">Check-in</Label>
                  <div className="flex items-center gap-4">
                    <CalendarDaysIcon className="h-5 w-5 text-muted-foreground" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-col items-start w-full h-auto">
                          <span className="font-semibold uppercase text-[0.65rem]">Check-in</span>
                          <span className="font-normal">{formData.checkin ? formData.checkin.toLocaleDateString() : 'Select Date'}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-w-[276px]">
                        <DayPicker
                          required
                          selected={formData.checkin}
                          onDayClick={(date) => handleDateChange(date, 'checkin')}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout" className="text-sm font-medium">Check-out</Label>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-col items-start w-full h-auto">
                          <span className="font-semibold uppercase text-[0.65rem]">Check-out</span>
                          <span className="font-normal">{formData.checkout ? formData.checkout.toLocaleDateString() : 'Select Date'}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-w-[276px]">
                        <DayPicker
                          required
                          selected={formData.checkout}
                          onDayClick={(date) => handleDateChange(date, 'checkout')}
                        />
                      </PopoverContent>
                    </Popover>
                    <CalendarDaysIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="requests" className="text-sm font-medium">Special Requests</Label>
                <div className="flex items-start gap-2">
                  <Textarea id="requests" rows={3} placeholder="Early check-in, extra towels, etc." onChange={handleChange} />
                  <FilePenIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="grid gap-2">
                  <Label htmlFor="numberofguests" className="text-sm font-medium">Guests</Label>
                  <div className="flex items-center gap-4">
                    <UsersIcon className="h-5 w-5 text-muted-foreground" />
                    <Select required value={formData.numberofguests} onValueChange={(value) => setFormData(prev => ({ ...prev, numberofguests: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">For more guests please fill another form</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roomtype" className="text-sm font-medium">Room Type</Label>
                  <div className="flex items-center gap-4">
                    <HomeIcon className="h-5 w-5 text-muted-foreground" />
                    <Input required value={roomtype} className="text-black" disabled />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount" className="text-sm font-medium">Total Amount</Label>
                <div className="flex items-center gap-4">
                  <BadgeDollarSignIcon className="h-5 w-5 text-muted-foreground" />
                  <Input required id="amount" type="number" value={price} className="text-black" disabled />
                </div>
              </div>
            </div>
            <CardFooter>
              {isSubmitting ? (
                <div className="flex justify-end">
                  <Button type="submit">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Booking ...
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <Button type="submit">
                    <CalendarCheckIcon className="mr-2 h-5 w-5" />
                    Book Now
                  </Button>
                </div>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;

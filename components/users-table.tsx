'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Calendar, MapPin, Eye, Plus, Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import datesData from '@/data/dates.json';

interface DateEntry {
  id: string;
  date: string; 
  title: string;
  location: string;
  description: string;
  imageUrl: string;
}

export function UsersTable() {
  const dates = datesData.dates as DateEntry[];
  const [selectedDate, setSelectedDate] = useState<DateEntry | null>(null);
  const [showInvitation, setShowInvitation] = useState(false);
  const [invitationStep, setInvitationStep] = useState<'ask' | 'response' | 'no-modal' | 'success'>('ask');
  const [alternateDate, setAlternateDate] = useState('');
  const [noAttempts, setNoAttempts] = useState(0);
  const [noMessage, setNoMessage] = useState('');

  const handleNoResponse = () => {
    const messages = [
      "Oops! That button doesn't work! 😅",
      "Nice try! But 'no' is not an option here! 💕",
      "The 'no' button is broken! 😊",
      "Error 404: 'No' not found! 💝",
      "System malfunction! Only 'Yes' works properly! 😉"
    ];
    
    setNoMessage(messages[noAttempts % messages.length]);
    setInvitationStep('no-modal');
    setNoAttempts(prev => prev + 1);
  };

  const handleYesResponse = () => {
    handleResponse('yes');
  };

  const handleResponse = async (response: 'yes' | 'alternate') => {
    try {
      // Send email with response including full details
      const emailData = {
        response,
        alternateDate: response === 'alternate' ? alternateDate : null,
        timestamp: new Date().toISOString(),
        venue: {
          name: 'Vista Cafe - Angono',
          address: 'H525+GPX Subdivision, Villa Angelina, Harmony Homes, Lot 3 Block 7, The Peak, Taytay, Rizal',
          googleMapsLink: 'https://maps.app.goo.gl/sqyjazZHhZfYGtfYA',
          tiktokLink: 'https://vt.tiktok.com/ZSaogb1VK/'
        },
        programFlow: [
          { time: '2:00 PM', activity: 'Sunduin kita sa dorm mo' },
          { time: '2:30 PM', activity: 'Travel to Angono by Bus' },
          { time: '5:00 PM', activity: 'Arrival at Angono by Bus' },
          { time: '5:00 PM - 5:30 PM', activity: 'Travel from Drop Off to Vista Cafe or Nearby' },
          { time: '5:30 PM', activity: 'Arrival at Vista Cafe' },
          { time: '5:30 PM - 5:45 PM', activity: 'Incidental Time + Find Place at Vista Cafe or Nearby' },
          { time: '5:45 PM - 6:15 PM', activity: 'Wait and watch sunset at Vista Cafe or Nearby' },
          { time: '6:15 PM - 6:30 PM', activity: 'Find place for dinner at Vista Cafe or Nearby' },
          { time: '6:30 PM - 7:30 PM', activity: 'Dinner' },
          { time: '7:30 PM - 8:00 PM', activity: 'Take Pictures Around Vista Cafe or Nearby' },
          { time: '8:00 PM - 10:00 PM', activity: 'Heart to Heart Talk' },
          { time: '10:00 PM', activity: 'Departure at Vista Cafe or Nearby Back to Manila' },
          { time: '12:00 AM or Later', activity: 'Arrival at Manila' }
        ],
        dateDetails: {
          date: 'February 14, 2024',
          occasion: 'Valentine\'s Day'
        }
      };

      // Send email via API
      const emailResponse = await fetch('/api/send-valentine-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email');
      }

      console.log('Email sent successfully with full details to Gladwin:', emailData);
      
      // Show success screen
      setInvitationStep('success');
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    }
  };

  const closeInvitation = () => {
    setShowInvitation(false);
    setInvitationStep('ask');
    setAlternateDate('');
    setNoAttempts(0);
  };

  return (
    <>
      <Card
        id="users"
        className="bg-slate-800 border-slate-700"
      >
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg md:text-xl font-bold text-white">Users Table</h2>
            <Button
              onClick={() => setShowInvitation(true)}
              className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 hover:from-pink-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-pink-500/50 transition-all duration-500 w-full sm:w-auto"
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="font-semibold">Add ✨</span>
            </Button>
          </div>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="text-left py-3 px-2 md:px-4 text-slate-300 font-semibold text-xs md:text-sm">
                      User
                    </th>
                    <th className="text-left py-3 px-2 md:px-4 text-slate-300 font-semibold text-xs md:text-sm">
                      User Address
                    </th>
                    <th className="text-left py-3 px-2 md:px-4 text-slate-300 font-semibold text-xs md:text-sm">
                      User Date Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dates.map((dateEntry) => (
                    <tr
                      key={dateEntry.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="py-3 px-2 md:px-4 text-white font-medium text-xs md:text-sm">{dateEntry.title}</td>
                      <td className="py-3 px-2 md:px-4 text-slate-300 text-xs md:text-sm">
                        <div className="flex items-center gap-1 md:gap-2">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                          <span className="truncate">{dateEntry.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 md:px-4 text-slate-400 text-xs md:text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 md:gap-2">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span className="hidden sm:inline">
                              {new Date(dateEntry.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                            <span className="sm:hidden">
                              {new Date(dateEntry.date).toLocaleDateString('en-US', {
                                year: '2-digit',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedDate(dateEntry)}
                            className="p-1 md:p-1.5 hover:bg-slate-700 rounded-md transition-colors"
                            title="View photo"
                          >
                            <Eye className="w-3 h-3 md:w-4 md:h-4 text-slate-300" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

      {selectedDate && (
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">{selectedDate.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <img
                src={selectedDate.imageUrl}
                alt={selectedDate.title}
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <p className="text-white font-medium">{selectedDate.location}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </label>
                  <p className="text-white font-medium">
                    {new Date(selectedDate.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Valentine's Date Invitation Modal */}
      <Dialog open={showInvitation} onOpenChange={(open) => {
        setShowInvitation(open);
        if (!open) {
          setInvitationStep('ask');
          setAlternateDate('');
          setNoAttempts(0);
        }
      }}>
        <DialogContent className="bg-gradient-to-br from-pink-900 to-rose-900 border-pink-700 max-w-[95vw] sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl text-center text-pink-100 flex items-center justify-center gap-2 flex-wrap">
              <Heart className="w-5 h-5 md:w-6 md:h-6 fill-pink-300 text-pink-300" />
              <span>Valentine's Day Invitation</span>
              <Heart className="w-5 h-5 md:w-6 md:h-6 fill-pink-300 text-pink-300" />
            </DialogTitle>
            <DialogDescription className="text-pink-200 text-center text-sm md:text-base">
              A special question for a special someone
            </DialogDescription>
          </DialogHeader>

          {invitationStep === 'ask' ? (
            <div className="space-y-4 md:space-y-6 py-4 max-h-[60vh] overflow-y-auto px-2">
              <div className="text-center space-y-4">
                <div className="text-5xl md:text-6xl animate-bounce">💝</div>
                <h3 className="text-lg md:text-xl font-semibold text-pink-100">
                  Will you be my Valentine?
                </h3>
                <p className="text-sm md:text-base text-pink-200">
                  Would you like to go out on a date with me on <br />
                  <span className="font-bold text-pink-100">February 14, 2024?</span>
                </p>
              </div>

              {/* Venue Details */}
              <div className="bg-pink-950/50 rounded-lg p-3 md:p-4 border border-pink-700/50">
                <h4 className="text-pink-100 font-semibold mb-3 flex items-center gap-2 text-sm md:text-base">
                  <MapPin className="w-4 h-4" />
                  Venue
                </h4>
                
                {/* Venue Image */}
                <div className="mb-3 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src="/vistacafe.jpeg"
                    alt="Vista Cafe Sunset View"
                    className="w-full h-48 sm:h-56 md:h-72 lg:h-80 object-cover"
                  />
                </div>

                <p className="text-pink-200 font-medium text-sm md:text-base">Vista Cafe - Angono</p>
                <p className="text-pink-300 text-xs md:text-sm mt-1">
                  H525+GPX Subdivision, Villa Angelina, Harmony Homes,<br className="hidden sm:inline" />
                  Lot 3 Block 7, The Peak, Taytay, Rizal
                </p>
                
                <div className="flex flex-col gap-2 mt-3">
                  <a
                    href="https://maps.app.goo.gl/sqyjazZHhZfYGtfYA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 text-xs md:text-sm hover:underline inline-flex items-center gap-1"
                  >
                    📍 View on Google Maps
                  </a>
                  <a
                    href="https://vt.tiktok.com/ZSaogb1VK/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 text-xs md:text-sm hover:underline inline-flex items-center gap-1"
                  >
                    🎵 TikTok Inspiration
                  </a>
                </div>
                
                {/* Embedded Map */}
                <div className="mt-3 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d965.5872847846584!2d121.15873696951836!3d14.551511698715416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c0c9b9b9b9b9%3A0x0!2zMTTCsDMzJzA1LjQiTiAxMjHCsDA5JzMzLjYiRQ!5e0!3m2!1sen!2sph!4v1234567890"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded"
                  />
                </div>
              </div>

              {/* Program Flow */}
              <div className="bg-pink-950/50 rounded-lg p-3 md:p-4 border border-pink-700/50">
                <h4 className="text-pink-100 font-semibold mb-3 flex items-center gap-2 text-sm md:text-base">
                  <Calendar className="w-4 h-4" />
                  Program Flow
                </h4>
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-pink-400 font-mono min-w-[60px] md:min-w-[70px]">2:00 PM</span>
                    <span className="text-pink-200">Sunduin kita sa dorm mo</span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-pink-400 font-mono min-w-[60px] md:min-w-[70px]">2:30 PM</span>
                    <span className="text-pink-200">Travel to Angono by Bus</span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-pink-400 font-mono min-w-[60px] md:min-w-[70px]">5:00 PM</span>
                    <span className="text-pink-200">Arrival at Angono</span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-pink-400 font-mono min-w-[60px] md:min-w-[70px]">5:30 PM</span>
                    <span className="text-pink-200">Arrival at Vista Cafe</span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-pink-400 font-mono min-w-[60px] md:min-w-[70px]">5:45 PM</span>
                    <span className="text-pink-200">Watch sunset 🌅</span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-pink-400 font-mono min-w-[60px] md:min-w-[70px]">6:30 PM</span>
                    <span className="text-pink-200">Dinner together 🍽️</span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-pink-400 font-mono min-w-[60px] md:min-w-[70px]">7:30 PM</span>
                    <span className="text-pink-200">Take pictures 📸</span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-pink-400 font-mono min-w-[60px] md:min-w-[70px]">8:00 PM</span>
                    <span className="text-pink-200">Heart to heart talk 💬</span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-pink-400 font-mono min-w-[60px] md:min-w-[70px]">10:00 PM</span>
                    <span className="text-pink-200">Departure back to Manila</span>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-pink-400 font-mono min-w-[60px] md:min-w-[70px]">12:00 AM</span>
                    <span className="text-pink-200">Arrival at Manila</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleYesResponse}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white text-sm md:text-base"
                >
                  <Heart className="w-4 h-4 mr-2 fill-white" />
                  Yes, I'd love to! 💕
                </Button>
                
                <Button
                  onClick={() => setInvitationStep('response')}
                  className="w-full bg-pink-700 hover:bg-pink-800 text-white text-sm md:text-base"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Yes, but different date
                </Button>

                <Button
                  onClick={handleNoResponse}
                  variant="outline"
                  className="w-full border-pink-600 text-pink-200 hover:bg-pink-800/30 text-sm md:text-base"
                >
                  Maybe next time
                </Button>
              </div>
            </div>
          ) : invitationStep === 'no-modal' ? (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-4">
                <div className="text-6xl">😅</div>
                <h3 className="text-xl font-semibold text-pink-100">
                  {noMessage}
                </h3>
                <p className="text-pink-200">
                  Please try selecting another option!
                </p>
              </div>

              <Button
                onClick={() => setInvitationStep('ask')}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                Okay, let me try again
              </Button>
            </div>
          ) : invitationStep === 'success' ? (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">✅</div>
                <h3 className="text-2xl font-bold text-pink-100">
                  Successfully Sent! 🎉
                </h3>
                <p className="text-pink-200">
                  Your response has been sent to<br />
                  <span className="font-bold text-pink-100 text-lg">Gladwin</span>
                </p>
                <p className="text-pink-300 text-sm">
                  You'll hear back soon! 💕
                </p>
              </div>

              <Button
                onClick={closeInvitation}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Heart className="w-4 h-4 mr-2 fill-white" />
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="text-center">
                <p className="text-pink-200 mb-4">
                  Please suggest an alternate date:
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-pink-200 text-sm mb-2 block">
                    Preferred Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={alternateDate}
                    onChange={(e) => setAlternateDate(e.target.value)}
                    className="bg-pink-950/50 border-pink-700 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleResponse('alternate')}
                    disabled={!alternateDate}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    Send Suggestion
                  </Button>
                  <Button
                    onClick={() => setInvitationStep('ask')}
                    variant="outline"
                    className="border-pink-600 text-pink-200 hover:bg-pink-800/30"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

declare const introJs: any;

export function GuidedTour() {
  const [tourStarted, setTourStarted] = useState(false);

  const startTour = () => {
    if (typeof window !== 'undefined') {
      const intro = introJs();

      intro.setOptions({
        steps: [
          {
            intro:
              'Welcome to the IAM Platform! This is where you can view special dates, manage activities, and explore security features.',
          },
          {
            element: '#users',
            intro:
              'View all date entries in this table. Click the eye icon to see photos and details. Use the Add button at the top right to create new entries.',
            position: 'bottom',
          },
          {
            element: '#audit-logs',
            intro:
              'Track all system activities and changes in the Audit Logs. This helps maintain security and compliance.',
            position: 'bottom',
          },
          {
            element: '#security',
            intro:
              'The CIA Triad represents the three core principles of information security: Confidentiality, Integrity, and Availability.',
            position: 'bottom',
          },
          {
            intro:
              'Use the sidebar to navigate between different sections of the platform. You can collapse it to save space.',
            position: 'right',
          },
        ],
        tooltipClass: 'bg-slate-800 text-white rounded-lg shadow-lg',
        highlightClass: 'highlight',
        skipLabel: 'Skip',
        doneLabel: 'Finish',
      });

      intro.start();
      setTourStarted(true);
    }
  };

  useEffect(() => {
    // Load intro.js CSS dynamically
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href =
        'https://cdnjs.cloudflare.com/ajax/libs/intro.js/7.2.0/introjs.min.css';
      document.head.appendChild(link);

      // Load intro.js script
      const script = document.createElement('script');
      script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/intro.js/7.2.0/intro.min.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={startTour}
      className="hover:bg-slate-700"
      title="Start guided tour"
    >
      <HelpCircle className="w-5 h-5 text-blue-400" />
    </Button>
  );
}

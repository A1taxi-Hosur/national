import { LockKeyhole, AlertCircle, Phone, Mail, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function BlockPage() {
  // Set page title
  useEffect(() => {
    document.title = "WEBSITE BLOCKED - Payment Required";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-lg overflow-hidden border-t-4 border-red-600">
        <div className="bg-red-600 p-8 flex flex-col items-center">
          <div className="bg-white rounded-full p-3 mb-4">
            <LockKeyhole className="text-red-600 h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-white text-center uppercase tracking-wider">Website Blocked</h1>
          <div className="mt-2 bg-white/20 px-4 py-1 rounded-full">
            <p className="text-white text-center font-semibold">BY ZARA CREATIONS</p>
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex items-center justify-center mb-6 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="text-red-600 h-8 w-8 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          </div>
          
          <p className="text-gray-700 mb-6 text-center">
            This website has been temporarily <span className="font-semibold">blocked</span> due to pending payment issues.
            The site will be available once the payment is processed.
          </p>
          
          <div className="bg-gray-100 p-5 rounded-lg mb-6 border-l-4 border-red-500">
            <h3 className="font-semibold text-gray-800 mb-3">To restore access:</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-3">
              <li>Complete outstanding payment to Zara Creations</li>
              <li>Contact the team for immediate assistance</li>
              <li>Provide proof of payment if already completed</li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-800 font-semibold mb-3">Contact Information:</p>
            <div className="flex items-center mb-2">
              <Phone className="h-5 w-5 text-blue-600 mr-2" />
              <a href="tel:+919988776655" className="text-blue-600 hover:text-blue-800 font-medium">
                +91 99887 76655
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-blue-600 mr-2" />
              <a href="mailto:support@zaracreations.com" className="text-blue-600 hover:text-blue-800 font-medium">
                support@zaracreations.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 text-sm text-center text-gray-300">
          <p>© {new Date().getFullYear()} Zara Creations. All rights reserved.</p>
          <p className="text-xs mt-1 text-gray-400">Payment verification system v1.2</p>
        </div>
      </div>
    </div>
  );
}